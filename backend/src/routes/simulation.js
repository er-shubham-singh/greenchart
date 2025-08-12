import express from 'express';
import * as simController from '../controllers/simulationController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.post('/', authenticate, simController.runSimulation);
export default router;
