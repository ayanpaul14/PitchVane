import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './User.js';

// In-Memory Storage Cache fallback for offline / disconnected DB modes
const userMemoryStore = new Map();

// ─── Dev Seed User ─────────────────────────────────────────────────────────────
// Pre-seeded so you can log in immediately even without MongoDB Atlas.
// Email: ayan@pitchvane.ai   Password: pitchvane2026
async function seedDevUser() {
  const email = 'ayan@pitchvane.ai';
  const alreadySeeded = [...userMemoryStore.values()].some((u) => u.email === email);
  if (alreadySeeded) return;

  const hashedPassword = await bcrypt.hash('pitchvane2026', 10);
  const seedUser = {
    _id: 'usr_seed_ayan',
    name: 'Ayan Paul',
    email,
    password: hashedPassword,
    organization: 'PitchVane Ventures',
    role: 'General Partner',
    googleId: null,
    avatar: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  userMemoryStore.set(seedUser._id, seedUser);
  console.log('🌱 Dev seed user ready → email: ayan@pitchvane.ai  password: pitchvane2026');
}

// Seed immediately when module loads
seedDevUser();

export const UserStore = {
  async findByEmail(email) {
    const normalizedEmail = (email || '').toLowerCase().trim();
    if (mongoose.connection.readyState === 1) {
      try {
        const doc = await User.findOne({ email: normalizedEmail });
        if (doc) return doc.toObject();
      } catch (err) {
        console.warn('[UserStore] MongoDB findByEmail failed, checking memory:', err.message);
      }
    }
    for (const u of userMemoryStore.values()) {
      if (u.email && u.email.toLowerCase() === normalizedEmail) {
        return u;
      }
    }
    return null;
  },

  async findById(id) {
    if (mongoose.connection.readyState === 1 && !id.startsWith('usr_')) {
      try {
        const doc = await User.findById(id).select('-password');
        if (doc) return doc.toObject();
      } catch (err) {
        console.warn('[UserStore] MongoDB findById failed:', err.message);
      }
    }
    const memUser = userMemoryStore.get(id);
    if (memUser) {
      const { password, ...safeUser } = memUser;
      return safeUser;
    }
    return null;
  },

  async createUser(userData) {
    const normalizedEmail = (userData.email || '').toLowerCase().trim();
    if (mongoose.connection.readyState === 1) {
      try {
        const doc = await User.create({
          ...userData,
          email: normalizedEmail,
        });
        const obj = doc.toObject();
        obj._id = doc._id.toString();
        userMemoryStore.set(obj._id, obj);
        return obj;
      } catch (err) {
        console.warn('[UserStore] MongoDB createUser failed, fallback to memory:', err.message);
      }
    }

    const id = 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const newRecord = {
      _id: id,
      name: userData.name,
      email: normalizedEmail,
      password: userData.password || null,
      organization: userData.organization || 'Institutional Syndicate',
      role: userData.role || 'General Partner',
      googleId: userData.googleId || null,
      avatar: userData.avatar || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    userMemoryStore.set(id, newRecord);
    return newRecord;
  },

  async updateUser(id, updateData) {
    let updatedObj = null;
    if (mongoose.connection.readyState === 1 && !id.startsWith('usr_')) {
      try {
        const doc = await User.findByIdAndUpdate(id, updateData, { new: true });
        if (doc) updatedObj = doc.toObject();
      } catch (err) {
        console.warn('[UserStore] MongoDB updateUser failed:', err.message);
      }
    }
    const existing = userMemoryStore.get(id) || { _id: id };
    const merged = {
      ...existing,
      ...updateData,
      updatedAt: new Date(),
    };
    userMemoryStore.set(id, merged);
    return updatedObj || merged;
  },
};
