import mongoose from 'mongoose';

const SimulationSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  inputs: { type: Object },
  results: { type: Object },
  assignments: { type: Array },
});

export default mongoose.model('Simulation', SimulationSchema);
