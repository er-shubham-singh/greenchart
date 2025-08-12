import Route from '../models/Route.js';

export const createRoute = async (data) => {
  if (typeof data.route_id !== 'number') throw { status: 400, message: 'route_id required' };
  return Route.create(data);
};
export const listRoutes = async () => Route.find({}).lean();
export const getRouteById = async (id) => Route.findOne({ route_id: id });
export const updateRoute = async (id, payload) => Route.findOneAndUpdate({ route_id: id }, payload, { new: true });
export const deleteRoute = async (id) => Route.findOneAndDelete({ route_id: id });
