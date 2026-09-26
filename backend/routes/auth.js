import express from 'express';
import bcrypt from 'bcryptjs';
import { UserStore } from '../models/UserStore.js';
import { generateToken, authenticateToken } from '../middleware/auth.js';

export function createAuthRouter() {
  const router = express.Router();

  // POST /api/auth/register - Institutional User Registration
  router.post('/register', async (req, res) => {
    try {
      const { name, email, password, organization, role } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required.' });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
      }

      const existing = await UserStore.findByEmail(email);
      if (existing) {
        return res.status(409).json({ error: 'An account with this email already exists. Please sign in.' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await UserStore.createUser({
        name,
        email,
        password: hashedPassword,
        organization: organization || 'Institutional Syndicate',
        role: role || 'General Partner',
      });

      const token = generateToken(user);
      const { password: _, ...safeUser } = user;

      return res.status(201).json({
        message: 'Account successfully registered.',
        token,
        user: safeUser,
      });
    } catch (err) {
      console.error('[Auth] Registration error:', err);
      return res.status(500).json({ error: 'Internal server error during registration.' });
    }
  });

  // POST /api/auth/login - Email & Password Sign In
  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }

      const user = await UserStore.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials. User not found.' });
      }

      if (!user.password) {
        return res.status(400).json({
          error: 'This account was created with Google Sign-In. Please sign in using Google.',
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const token = generateToken(user);
      const { password: _, ...safeUser } = user;

      return res.json({
        message: 'Successfully authenticated.',
        token,
        user: safeUser,
      });
    } catch (err) {
      console.error('[Auth] Login error:', err);
      return res.status(500).json({ error: 'Internal server error during authentication.' });
    }
  });

  // POST /api/auth/google - Google OAuth Verification & Sign In / Sign Up
  router.post('/google', async (req, res) => {
    try {
      const { credential } = req.body;

      if (!credential) {
        return res.status(400).json({ error: 'Google credential token is missing.' });
      }

      // Decode Google JWT payload
      let payload = null;
      try {
        const parts = credential.split('.');
        if (parts.length === 3) {
          const base64Url = parts[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
          payload = JSON.parse(jsonPayload);
        }
      } catch (decodeErr) {
        console.warn('[Auth] Failed to decode Google token:', decodeErr.message);
      }

      if (!payload || !payload.email) {
        return res.status(400).json({ error: 'Invalid Google credential token.' });
      }

      const email = payload.email.toLowerCase().trim();
      let user = await UserStore.findByEmail(email);

      if (!user) {
        // Create new user from Google profile
        user = await UserStore.createUser({
          name: payload.name || payload.given_name || 'Verified Partner',
          email: email,
          googleId: payload.sub,
          avatar: payload.picture || null,
          organization: 'Apex Syndicate',
          role: 'Investment Director',
        });
      } else {
        // Update user's avatar or googleId if missing
        if (!user.googleId || !user.avatar) {
          user = await UserStore.updateUser(user._id || user.id, {
            googleId: payload.sub,
            avatar: payload.picture || user.avatar,
          });
        }
      }

      const token = generateToken(user);
      const { password: _, ...safeUser } = user;

      return res.json({
        message: 'Google authentication successful.',
        token,
        user: safeUser,
      });
    } catch (err) {
      console.error('[Auth] Google auth error:', err);
      return res.status(500).json({ error: 'Internal server error during Google authentication.' });
    }
  });

  // GET /api/auth/me - Fetch currently authenticated user session
  router.get('/me', authenticateToken, (req, res) => {
    return res.json({
      authenticated: true,
      user: req.user,
    });
  });

  return router;
}
