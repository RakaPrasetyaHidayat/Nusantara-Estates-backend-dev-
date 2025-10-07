import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

export const verifyToken = (req) => {
  const auth = req.headers?.authorization || req.headers?.Authorization || '';
  const token = auth && auth.split(' ')[1];
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
};

export const requireAdmin = (req) => {
  const payload = verifyToken(req);
  if (!payload) return { ok: false, status: 401, message: 'Access token required' };
  if (payload.role !== 'admin') return { ok: false, status: 403, message: 'Admin access required' };
  return { ok: true, payload };
};
