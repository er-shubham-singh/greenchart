import Driver from '../models/Driver.js';
import Order from '../models/Order.js';
import Route from '../models/Route.js';
import Simulation from '../models/Simulation.js';

export function toMinutesFromHM(hm) {
  if (!hm) return null;
  const parts = hm.split(':').map((s) => s.trim());
  if (parts.length === 1) return parseInt(parts[0], 10);
  const hours = parseInt(parts[0], 10) || 0;
  const mins = parseInt(parts[1], 10) || 0;
  return hours * 60 + mins;
}

export const runSimulation = async ({ numberOfDrivers, start_time, max_hours_per_driver }) => {
  if (!numberOfDrivers || numberOfDrivers <= 0) throw { status: 400, message: 'numberOfDrivers must be > 0' };
  if (!max_hours_per_driver || max_hours_per_driver <= 0) throw { status: 400, message: 'max_hours_per_driver must be > 0' };

  const allDrivers = await Driver.find({}).lean();
  const totalDrivers = allDrivers.length;
  if (numberOfDrivers > totalDrivers) throw { status: 400, message: 'Requested numberOfDrivers exceeds available drivers' };

  const orders = await Order.find({}).lean();
  if (orders.length === 0) throw { status: 400, message: 'No orders available to simulate' };

  const routes = await Route.find({}).lean();
  const routeMap = new Map(routes.map((r) => [r.route_id, r]));

  let totalBaseMinutes = 0;
  for (const o of orders) {
    const route = routeMap.get(o.route_id);
    if (!route) throw { status: 400, message: `Route ${o.route_id} for order ${o.order_id} not found` };
    totalBaseMinutes += route.base_time_min;
  }

  const capacityMinutes = numberOfDrivers * max_hours_per_driver * 60;
  if (capacityMinutes < totalBaseMinutes) {
    throw {
      status: 400,
      message: 'Insufficient driver capacity for all orders using base route times. Increase numberOfDrivers or max_hours_per_driver.',
      details: { capacityMinutes, totalBaseMinutes },
    };
  }

  const driversSorted = allDrivers
    .map((d) => ({
      ...d,
      sumPastWeek: Array.isArray(d.past_week_hours) ? d.past_week_hours.reduce((a, b) => a + b, 0) : 0,
      lastDayHours: Array.isArray(d.past_week_hours) && d.past_week_hours.length ? d.past_week_hours[d.past_week_hours.length - 1] : 0,
    }))
    .sort((a, b) => a.sumPastWeek - b.sumPastWeek);

  const selectedDrivers = driversSorted.slice(0, numberOfDrivers).map((d) => ({
    id: d._id,
    name: d.name,
    remaining_minutes: max_hours_per_driver * 60,
    fatigued: d.lastDayHours > 8,
    assignments: [],
  }));

  const ordersWithRoute = orders.map((o) => {
    const route = routeMap.get(o.route_id);
    return {
      ...o,
      base_time_min: route.base_time_min,
      distance_km: route.distance_km,
      traffic_level: route.traffic_level,
    };
  });

  ordersWithRoute.sort((a, b) => b.base_time_min - a.base_time_min);

  const assignments = [];
  for (const order of ordersWithRoute) {
    let chosenDriver = null;
    let chosenAdjustedTime = null;
    const ds = selectedDrivers.sort((x, y) => y.remaining_minutes - x.remaining_minutes);
    for (const drv of ds) {
      const multiplier = drv.fatigued ? 1.3 : 1;
      const adjustedTime = Math.ceil(order.base_time_min * multiplier);
      if (drv.remaining_minutes >= adjustedTime) {
        chosenDriver = drv;
        chosenAdjustedTime = adjustedTime;
        break;
      }
    }
    
if (!chosenDriver) {
  // Assign to the driver with the most remaining time anyway (late delivery)
  const fallbackDriver = ds[0];
  const multiplier = fallbackDriver.fatigued ? 1.3 : 1;
  const adjustedTime = Math.ceil(order.base_time_min * multiplier);

  fallbackDriver.remaining_minutes -= adjustedTime; // may go negative
  const assign = {
    order_id: order.order_id,
    driver_id: fallbackDriver.id,
    driver_name: fallbackDriver.name,
    predicted_time_min: adjustedTime,
    base_time_min: order.base_time_min,
    distance_km: order.distance_km,
    traffic_level: order.traffic_level,
    value_rs: order.value_rs,
    late: true // new flag
  };
  fallbackDriver.assignments.push(assign);
  assignments.push(assign);
} else {
  chosenDriver.remaining_minutes -= chosenAdjustedTime;
  const assign = {
    order_id: order.order_id,
    driver_id: chosenDriver.id,
    driver_name: chosenDriver.name,
    predicted_time_min: chosenAdjustedTime,
    base_time_min: order.base_time_min,
    distance_km: order.distance_km,
    traffic_level: order.traffic_level,
    value_rs: order.value_rs,
    late: false
  };
  chosenDriver.assignments.push(assign);
  assignments.push(assign);
}

  }

  let totalProfit = 0;
  let onTimeCount = 0;
  const fuelCostByTraffic = { High: 0, Medium: 0, Low: 0 };
  const orderResults = [];

  for (const a of assignments) {
    const base = a.base_time_min;
    const pred = a.predicted_time_min;
    const penalty = pred > base + 10 ? 50 : 0;
    const bonus = a.value_rs > 1000 && penalty === 0 ? +(a.value_rs * 0.1).toFixed(2) : 0;
    const perKm = 5 + (a.traffic_level === 'High' ? 2 : 0);
    const fuelCost = +(a.distance_km * perKm).toFixed(2);
    fuelCostByTraffic[a.traffic_level] = (fuelCostByTraffic[a.traffic_level] || 0) + fuelCost;
    const orderProfit = +(a.value_rs + bonus - penalty - fuelCost).toFixed(2);
    totalProfit += orderProfit;
    if (penalty === 0) onTimeCount++;
    orderResults.push({ ...a, penalty, bonus, fuelCost, orderProfit });
  }

  const totalOrders = orderResults.length;
  const efficiency = +((onTimeCount / totalOrders) * 100).toFixed(2);

  const results = {
    totalProfit: +totalProfit.toFixed(2),
    efficiency,
    totalOrders,
    onTimeDeliveries: onTimeCount,
    lateDeliveries: totalOrders - onTimeCount,
    fuelCostByTraffic,
    orderResults,
    drivers: selectedDrivers.map((d) => ({ id: d.id, name: d.name, assignments: d.assignments.length })),
  };

  const sim = await Simulation.create({ inputs: { numberOfDrivers, start_time, max_hours_per_driver }, results, assignments });

  return { simulation: results, simulationId: sim._id };
};
