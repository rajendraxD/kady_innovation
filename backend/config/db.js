import mongoose from 'mongoose';
import { config } from './unifiedConfig.js';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`[MongoDB] Connected: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error) {
    console.error(`[MongoDB Connection Error] ${error.message}`);
    // Non-fatal fallback for development environments where MongoDB isn't running
    console.warn(`[MongoDB Notice] Operating with memory store or awaiting DB initialization.`);
    return false;
  }
};
