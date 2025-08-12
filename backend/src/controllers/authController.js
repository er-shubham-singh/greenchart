import * as authService from '../services/authService.js';

export const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const data = await authService.login(req.body);
    res.json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
};
