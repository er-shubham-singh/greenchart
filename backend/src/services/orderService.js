import Order from '../models/Order.js';

export const createOrder = async (data) => {
  if (typeof data.order_id !== 'number') throw { status: 400, message: 'order_id required' };
  return Order.create(data);
};
export const listOrders = async () => Order.find({}).lean();
export const getOrderById = async (id) => Order.findOne({ order_id: id });
export const updateOrder = async (id, payload) => Order.findOneAndUpdate({ order_id: id }, payload, { new: true });
export const deleteOrder = async (id) => Order.findOneAndDelete({ order_id: id });
