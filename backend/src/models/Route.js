import mongoose from 'mongoose';

const RouteSchema = new mongoose.Schema({
  route_id: { type: Number, required: true, unique: true },
  distance_km: { type: Number, required: true },
  traffic_level: { type: String, enum: ['High', 'Medium', 'Low'], required: true },
  base_time_min: { type: Number, required: true },
});

export default mongoose.model('Route', RouteSchema);
