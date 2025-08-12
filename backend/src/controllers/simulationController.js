import * as simulationService from '../services/simulationService.js';

export const runSimulation = async (req, res, next) => {
  try {
    const { numberOfDrivers, start_time, max_hours_per_driver } = req.body;
    const data = await simulationService.runSimulation({ numberOfDrivers, start_time, max_hours_per_driver });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
