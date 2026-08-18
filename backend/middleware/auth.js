import jwt from 'jsonwebtoken';
import { config } from '../config/unifiedConfig.js';
import { User } from '../models/User.js';

export const protect = async (req, res, next) => {
  let token = req.cookies?.accessToken;

  if (!token && req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    const error = new Error('Authentication required. No token provided.');
    error.statusCode = 401;
    return next(error);
  }

  try {
    const decoded = jwt.verify(token, config.auth.jwtAccessSecret);
    const user = await User.findById(decoded.id).select('-password').lean();

    if (!user) {
      const error = new Error('User session expired or user no longer exists.');
      error.statusCode = 401;
      return next(error);
    }

    req.user = user;
    next();
  } catch (err) {
    const error = new Error('Invalid or expired authentication token.');
    error.statusCode = 401;
    return next(error);
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      const error = new Error('Forbidden: You do not have permission to perform this action.');
      error.statusCode = 403;
      return next(error);
    }
    next();
  };
};
