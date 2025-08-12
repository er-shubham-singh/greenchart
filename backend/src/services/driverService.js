import Driver from '../models/Driver.js';

export const createDriver = async (data) => {
  if (!data.name || typeof data.shift_hours !== 'number') throw { status: 400, message: 'Invalid driver data' };
  return Driver.create(data);
};
export const listDrivers = async () => Driver.find({}).lean();
export const getDriver = async (id) => {
  const d = await Driver.findById(id);
  if (!d) throw { status: 404, message: 'Driver not found' };
  return d;
};
export const updateDriver = async (id, payload) => Driver.findByIdAndUpdate(id, payload, { new: true });
export const deleteDriver = async (id) => Driver.findByIdAndDelete(id);
