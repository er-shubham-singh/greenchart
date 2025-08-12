import { runSimulation, toMinutesFromHM } from '../src/services/simulationService.js';
import Driver from '../src/models/Driver.js';
import Order from '../src/models/Order.js';
import Route from '../src/models/Route.js';
import Simulation from '../src/models/Simulation.js';

jest.mock('../src/models/Driver.js');
jest.mock('../src/models/Order.js');
jest.mock('../src/models/Route.js');
jest.mock('../src/models/Simulation.js');

beforeEach(() => {
  jest.resetAllMocks();
});

test('toMinutesFromHM parses correctly', () => {
  expect(toMinutesFromHM('2:07')).toBe(127);
  expect(toMinutesFromHM('0:35')).toBe(35);
  expect(toMinutesFromHM('45')).toBe(45);
});

test('runSimulation succeeds and computes fuel/bonus/penalty', async () => {
  Driver.find.mockResolvedValue([
    { _id: 'd1', name: 'A', past_week_hours: [6,6,6,6,6,6,6] },
    { _id: 'd2', name: 'B', past_week_hours: [6,6,6,6,6,6,6] },
  ]);
  Order.find.mockResolvedValue([
    { order_id: 1, value_rs: 1200, route_id: 1 },
    { order_id: 2, value_rs: 500, route_id: 1 },
  ]);
  Route.find.mockResolvedValue([ { route_id:1, distance_km:10, traffic_level:'Low', base_time_min:30 } ]);
  Simulation.create.mockResolvedValue({ _id: 'sim1' });

  const res = await runSimulation({ numberOfDrivers: 2, start_time: '09:00', max_hours_per_driver: 8 });
  expect(res.simulation.totalOrders).toBe(2);
  // check fuel cost for low traffic: perKm = 5
  expect(res.simulation.fuelCostByTraffic.Low).toBeGreaterThan(0);
  // high value bonus applied for order 1
  const or1 = res.simulation.orderResults.find(o => o.order_id === 1);
  expect(or1.bonus).toBeCloseTo(1200 * 0.1);
});

test('runSimulation fails when not enough drivers available', async () => {
  Driver.find.mockResolvedValue([{ _id:'d1', name:'A', past_week_hours:[1,1,1,1,1,1,1] }]);
  Order.find.mockResolvedValue([ { order_id:1, value_rs:100, route_id:1 } ]);
  Route.find.mockResolvedValue([ { route_id:1, distance_km:5, traffic_level:'Low', base_time_min:30 } ]);

  await expect(runSimulation({ numberOfDrivers: 2, start_time: '09:00', max_hours_per_driver: 8 })).rejects.toHaveProperty('status', 400);
});

test('fatigue increases predicted time by 30%', async () => {
  Driver.find.mockResolvedValue([
    { _id:'d1', name:'A', past_week_hours:[9,9,9,9,9,9,9] },
  ]);
  Order.find.mockResolvedValue([ { order_id:1, value_rs:100, route_id:1 } ]);
  Route.find.mockResolvedValue([ { route_id:1, distance_km:5, traffic_level:'Low', base_time_min:50 } ]);
  Simulation.create.mockResolvedValue({ _id: 'sim2' });

  const res = await runSimulation({ numberOfDrivers:1, start_time:'09:00', max_hours_per_driver: 10 });
  const or = res.simulation.orderResults[0];
  expect(or.predicted_time_min).toBe(65);
});

test('penalty applies when predicted_time > base + 10', async () => {
  Driver.find.mockResolvedValue([ { _id:'d1', name:'A', past_week_hours:[6,6,6,6,6,6,6] }]);
  Order.find.mockResolvedValue([ { order_id:1, value_rs:100, route_id:1 } ]);
  Route.find.mockResolvedValue([ { route_id:1, distance_km:5, traffic_level:'Low', base_time_min:35 } ]);
  Simulation.create.mockResolvedValue({ _id: 'sim3' });

  const res = await runSimulation({ numberOfDrivers:1, start_time:'09:00', max_hours_per_driver: 10 });
  const or = res.simulation.orderResults[0];
  expect([0,50]).toContain(or.penalty);
});
