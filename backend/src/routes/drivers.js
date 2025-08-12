import express from 'express';
import * as driverController from '../controllers/driverController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);
router.get('/', driverController.listDrivers);
router.post('/', driverController.createDriver);
router.get('/:id', driverController.getDriver);
router.put('/:id', driverController.updateDriver);
router.delete('/:id', driverController.deleteDriver);

export default router;
