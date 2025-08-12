import * as driverService from '../services/driverService.js';

export const createDriver = async (req, res, next) => {
  try {
    const d = await driverService.createDriver(req.body);
    res.status(201).json(d);
  } catch (err) {
    next(err);
  }
};
export const listDrivers = async (req, res, next) => {
  try {
    const ds = await driverService.listDrivers();
    res.json(ds);
  } catch (err) {
    next(err);
  }
};
export const getDriver = async (req, res, next) => {
  try {
    const d = await driverService.getDriver(req.params.id);
    res.json(d);
  } catch (err) {
    next(err);
  }
};
export const updateDriver = async (req, res, next) => {
  try {
    const d = await driverService.updateDriver(req.params.id, req.body);
    res.json(d);
  } catch (err) {
    next(err);
  }
};
export const deleteDriver = async (req, res, next) => {
  try {
    await driverService.deleteDriver(req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
