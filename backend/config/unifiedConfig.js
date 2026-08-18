import dotenv from 'dotenv';
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kady_hiring_portal',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  auth: {
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'kady_ats_enterprise_access_secret_key_2026_x984',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'kady_ats_enterprise_refresh_secret_key_2026_z129',
    accessExpiry: process.env.ACCESS_TOKEN_EXPIRES || '15m',
    refreshExpiry: process.env.REFRESH_TOKEN_EXPIRES || '7d'
  }
};
