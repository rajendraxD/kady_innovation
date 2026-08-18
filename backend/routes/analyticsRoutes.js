import { Router } from 'express';
import * as analyticsController from '../controllers/analyticsController.js';
import { protect } from '../middleware/auth.js';
import { asyncWrapper } from '../middleware/asyncWrapper.js';

const router = Router();

router.use(protect);

router.get('/dashboard', asyncWrapper(analyticsController.getDashboardStats));

export default router;
