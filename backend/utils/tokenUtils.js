import jwt from 'jsonwebtoken';
import { config } from '../config/unifiedConfig.js';

export const generateTokens = (payload) => {
  const accessToken = jwt.sign(payload, config.auth.jwtAccessSecret, {
    expiresIn: config.auth.accessExpiry
  });
  const refreshToken = jwt.sign(payload, config.auth.jwtRefreshSecret, {
    expiresIn: config.auth.refreshExpiry
  });
  return { accessToken, refreshToken };
};

export const setAuthCookies = (res, accessToken, refreshToken) => {
  const isProd = config.env === 'production';
  
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 15 * 60 * 1000 // 15 mins
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

export const clearAuthCookies = (res) => {
  const isProd = config.env === 'production';
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax'
  });
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax'
  });
};
