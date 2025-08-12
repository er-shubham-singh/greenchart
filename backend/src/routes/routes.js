import express from 'express';
import * as routeController from '../controllers/routeController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);
router.get('/', routeController.listRoutes);
router.post('/', routeController.createRoute);
router.get('/:route_id', routeController.getRoute);
router.put('/:route_id', routeController.updateRoute);
router.delete('/:route_id', routeController.deleteRoute);

export default router;
