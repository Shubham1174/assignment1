import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/User.js';
import { setAuthCookie } from '../middleware/auth.js';

function generateToken(user) {
  const payload = { id: user._id, role: user.role, email: user.email, name: user.name };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
}

export async function register(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, email, password, role } = req.body;
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: 'Email already in use' });
  }
  const user = await User.create({ name, email, password, role });
  const token = generateToken(user);
  setAuthCookie(res, token);
  res.status(201).json({ user, token });
}

export async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const match = await user.comparePassword(password);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });
  const token = generateToken(user);
  setAuthCookie(res, token);
  res.json({ user, token });
}

export async function me(req, res) {
  const user = await User.findById(req.user.id).select('-password');
  res.json({ user });
}

export async function logout(req, res) {
  const isProd = process.env.NODE_ENV === 'production';
  const cookieSecure = String(process.env.COOKIE_SECURE || (isProd ? 'true' : 'false')) === 'true';
  const sameSite = process.env.COOKIE_SAMESITE || (isProd ? 'none' : 'lax');
  const domain = process.env.COOKIE_DOMAIN || undefined;
  res.clearCookie('token', { httpOnly: true, secure: cookieSecure, sameSite, domain, path: '/' });
  res.json({ message: 'Logged out' });
}


