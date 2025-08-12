import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  order_id: { type: Number, required: true, unique: true },
  value_rs: { type: Number, required: true },
  route_id: { type: Number, required: true },
  delivery_time_raw: { type: String },
  delivery_time_min: { type: Number },
});

export default mongoose.model('Order', OrderSchema);
