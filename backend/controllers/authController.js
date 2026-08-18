import { User } from '../models/User.js';
import { generateTokens, setAuthCookies, clearAuthCookies } from '../utils/tokenUtils.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import jwt from 'jsonwebtoken';
import { config } from '../config/unifiedConfig.js';

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return sendError(res, 'Invalid email or password', [], 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return sendError(res, 'Invalid email or password', [], 401);
  }

  const payload = { id: user._id, role: user.role, email: user.email };
  const { accessToken, refreshToken } = generateTokens(payload);

  setAuthCookies(res, accessToken, refreshToken);

  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar
  };

  return sendSuccess(res, 'Login successful', { user: userData, token: accessToken });
};

export const logout = async (req, res) => {
  clearAuthCookies(res);
  return sendSuccess(res, 'Logged out successfully');
};

export const getMe = async (req, res) => {
  return sendSuccess(res, 'Current user profile', { user: req.user });
};

export const refreshToken = async (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return sendError(res, 'Refresh token missing', [], 401);
  }

  try {
    const decoded = jwt.verify(refreshToken, config.auth.jwtRefreshSecret);
    const user = await User.findById(decoded.id).select('-password').lean();
    if (!user) {
      return sendError(res, 'User not found', [], 401);
    }

    const payload = { id: user._id, role: user.role, email: user.email };
    const tokens = generateTokens(payload);

    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    return sendSuccess(res, 'Token refreshed', { token: tokens.accessToken, user });
  } catch (err) {
    return sendError(res, 'Invalid refresh token', [], 401);
  }
};
