import { Router } from 'express';
import * as notificationController from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';
import { asyncWrapper } from '../middleware/asyncWrapper.js';

const router = Router();

router.use(protect);

router.get('/', asyncWrapper(notificationController.getNotifications));
router.patch('/:id/read', asyncWrapper(notificationController.markAsRead));

export default router;
