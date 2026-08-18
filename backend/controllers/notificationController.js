import { Notification } from '../models/Notification.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

export const getNotifications = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  const [total, notifications, unreadCount] = await Promise.all([
    Notification.countDocuments(),
    Notification.find().sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
    Notification.countDocuments({ read: false })
  ]);

  const totalPages = Math.ceil(total / limitNum) || 1;

  return sendSuccess(res, 'Notifications retrieved', {
    notifications,
    unreadCount,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      pages: totalPages,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1
    }
  });
};


export const markAsRead = async (req, res) => {
  if (req.params.id === 'all') {
    await Notification.updateMany({ read: false }, { read: true });
    return sendSuccess(res, 'All notifications marked as read');
  }

  const notification = await Notification.findByIdAndUpdate(
    req.params.id,
    { read: true },
    { new: true }
  ).lean();

  if (!notification) {
    return sendError(res, 'Notification not found', [], 404);
  }

  return sendSuccess(res, 'Notification marked as read', { notification });
};
