import mongoose from 'mongoose';

const DriverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  shift_hours: { type: Number, required: true },
  past_week_hours: { type: [Number], default: [] },
});

export default mongoose.model('Driver', DriverSchema);
