import * as routeService from '../services/routeService.js';

export const createRoute = async (req, res, next) => {
  try {
    const r = await routeService.createRoute(req.body);
    res.status(201).json(r);
  } catch (err) {
    next(err);
  }
};
export const listRoutes = async (req, res, next) => {
  try {
    const rs = await routeService.listRoutes();
    res.json(rs);
  } catch (err) {
    next(err);
  }
};
export const getRoute = async (req, res, next) => {
  try {
    const r = await routeService.getRouteById(Number(req.params.route_id));
    res.json(r);
  } catch (err) {
    next(err);
  }
};
export const updateRoute = async (req, res, next) => {
  try {
    const r = await routeService.updateRoute(Number(req.params.route_id), req.body);
    res.json(r);
  } catch (err) {
    next(err);
  }
};
export const deleteRoute = async (req, res, next) => {
  try {
    await routeService.deleteRoute(Number(req.params.route_id));
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
