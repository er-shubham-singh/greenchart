import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/auth.js';
import driverRoutes from './routes/drivers.js';
import routeRoutes from './routes/routes.js';
import orderRoutes from './routes/orders.js';
import simulationRoutes from './routes/simulation.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/simulate', simulationRoutes);

app.get('/', (req, res) => res.json({ message: 'GreenCart Logistics API' }));

app.use(errorHandler);

export default app;
