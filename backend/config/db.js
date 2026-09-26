import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;

export function getDBStatus() {
  return isConnected;
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('your_atlas_connection_string') || uri.trim() === '') {
    console.warn('⚠️  MONGODB_URI not configured. Running in memory-only mode.');
    return false;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,   // fail fast — don't hang 30s
      socketTimeoutMS: 15000,
      connectTimeoutMS: 8000,
      family: 4,                         // force IPv4, avoids some DNS SRV issues
    });
    isConnected = true;
    console.log(`✅ MongoDB Atlas Connected: ${mongoose.connection.host}`);
    return true;
  } catch (error) {
    isConnected = false;
    const msg = error.message || '';

    // Friendly diagnosis based on error type
    if (msg.includes('ECONNREFUSED') || msg.includes('querySrv')) {
      console.error('❌ MongoDB DNS/Network Error — possible causes:');
      console.error('   1. Atlas cluster is PAUSED → go to atlas.mongodb.com and resume it');
      console.error('   2. Your IP is not whitelisted → Atlas > Network Access > Add IP (0.0.0.0/0 for dev)');
      console.error('   3. Corporate firewall blocking outbound port 27017 / SRV DNS');
    } else if (msg.includes('Authentication failed') || msg.includes('SCRAM')) {
      console.error('❌ MongoDB Auth Error — check username/password in .env MONGODB_URI');
    } else {
      console.error('❌ MongoDB Connection Error:', msg);
    }

    console.warn('⚠️  Continuing in memory-only mode — data will not persist between restarts.');
    return false;
  }
}
