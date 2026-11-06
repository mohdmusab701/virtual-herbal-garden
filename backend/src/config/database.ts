
import dns from 'node:dns';
import mongoose from 'mongoose';
import { env } from './env';

// Fix Node.js SRV DNS resolution for MongoDB Atlas
dns.setServers(['8.8.8.8', '1.1.1.1']);

export const connectDB = async () => {
  const conn = await mongoose.connect(env.MONGODB_URI, {
    serverSelectionTimeoutMS: 15000,
  });

  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

export const isDatabaseConnected = () =>
  mongoose.connection.readyState === 1;
