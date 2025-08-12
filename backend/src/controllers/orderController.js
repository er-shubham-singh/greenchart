import * as orderService from '../services/orderService.js';

export const createOrder = async (req, res, next) => {
  try {
    const o = await orderService.createOrder(req.body);
    res.status(201).json(o);
  } catch (err) {
    next(err);
  }
};
export const listOrders = async (req, res, next) => {
  try {
    const os = await orderService.listOrders();
    res.json(os);
  } catch (err) {
    next(err);
  }
};
export const getOrder = async (req, res, next) => {
  try {
    const o = await orderService.getOrderById(Number(req.params.order_id));
    res.json(o);
  } catch (err) {
    next(err);
  }
};
export const updateOrder = async (req, res, next) => {
  try {
    const o = await orderService.updateOrder(Number(req.params.order_id), req.body);
    res.json(o);
  } catch (err) {
    next(err);
  }
};
export const deleteOrder = async (req, res, next) => {
  try {
    await orderService.deleteOrder(Number(req.params.order_id));
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
