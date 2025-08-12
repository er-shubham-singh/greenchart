import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async ({ name, email, password }) => {
  if (!name || !email || !password) throw { status: 400, message: 'Missing name/email/password' };
  const exists = await User.findOne({ email });
  if (exists) throw { status: 400, message: 'User already exists' };
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  const user = await User.create({ name, email, passwordHash });
  return { id: user._id, name: user.name, email: user.email };
};

export const login = async ({ email, password }) => {
  if (!email || !password) throw { status: 400, message: 'Missing email/password' };
  const user = await User.findOne({ email });
  if (!user) throw { status: 401, message: 'Invalid credentials' };
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw { status: 401, message: 'Invalid credentials' };
  const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '8h',
  });
  return { token, user: { id: user._id, name: user.name, email: user.email } };
};
