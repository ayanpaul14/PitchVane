import jwt from 'jsonwebtoken';
import { UserStore } from '../models/UserStore.js';

const JWT_SECRET = process.env.JWT_SECRET || 'pitchvane_enterprise_jwt_secret_key_2026_secure';

export async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No authentication token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await UserStore.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'Invalid or expired session. User not found.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token verification failed.', details: err.message });
  }
}

export function generateToken(user) {
  return jwt.sign(
    {
      id: user._id || user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      organization: user.organization,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}
