import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Driver from '../models/Driver.js';
import Route from '../models/Route.js';
import Order from '../models/Order.js';

dotenv.config();

const dataDir = path.resolve('data');

function detectDelimiter(line) {
  if (line.includes('\t')) return '\t';
  if (line.includes(',')) return ',';
  if (line.includes(';')) return ';';
  return ',';
}

function parseCSVFile(filename) {
  const p = path.join(dataDir, filename);
  if (!fs.existsSync(p)) throw new Error(`${filename} not found in ./data`);
  const content = fs.readFileSync(p, 'utf8').trim();
  const lines = content.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const delim = detectDelimiter(lines[0]);
  const headers = lines[0].split(delim).map((h) => h.trim());
  const rows = lines.slice(1).map((ln) => {
    const parts = ln.split(delim).map((c) => c.trim());
    const obj = {};
    headers.forEach((h, i) => (obj[h] = parts[i] || ''));
    return obj;
  });
  return rows;
}

function hmToMinutes(hm) {
  if (!hm) return null;
  const parts = hm.split(':').map((s) => s.trim());
  if (parts.length === 1) return Number(parts[0] || 0);
  const hours = Number(parts[0] || 0);
  const mins = Number(parts[1] || 0);
  return hours * 60 + mins;
}

const seed = async () => {
  try {
    await connectDB();
    await Driver.deleteMany({});
    await Route.deleteMany({});
    await Order.deleteMany({});

    const driversRaw = parseCSVFile('drivers.csv');
    const routesRaw = parseCSVFile('routes.csv');
    const ordersRaw = parseCSVFile('orders.csv');

    const driverDocs = driversRaw.map((d) => ({
      name: d.name,
      shift_hours: Number(d.shift_hours || 0),
      past_week_hours: (d.past_week_hours || '').split('|').filter(Boolean).map((n) => Number(n)),
    }));

    const routeDocs = routesRaw.map((r) => ({
      route_id: Number(r.route_id),
      distance_km: Number(r.distance_km),
      traffic_level: r.traffic_level,
      base_time_min: Number(r.base_time_min),
    }));

    const orderDocs = ordersRaw.map((o) => ({
      order_id: Number(o.order_id),
      value_rs: Number(o.value_rs),
      route_id: Number(o.route_id),
      delivery_time_raw: o.delivery_time,
      delivery_time_min: hmToMinutes(o.delivery_time),
    }));

    await Driver.insertMany(driverDocs);
    await Route.insertMany(routeDocs);
    await Order.insertMany(orderDocs);

    console.log('Seeding complete');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed', err);
    process.exit(1);
  }
};

if (process.argv[1].includes('seedCsv.js')) {
  seed();
}
