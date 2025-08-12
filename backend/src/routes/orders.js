import express from 'express';
import * as orderController from '../controllers/orderController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);
router.get('/', orderController.listOrders);
router.post('/', orderController.createOrder);
router.get('/:order_id', orderController.getOrder);
router.put('/:order_id', orderController.updateOrder);
router.delete('/:order_id', orderController.deleteOrder);

export default router;
