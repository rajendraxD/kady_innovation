import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { loginSchema } from '../validations/authValidation.js';
import { asyncWrapper } from '../middleware/asyncWrapper.js';

const router = Router();

router.post('/login', validate(loginSchema), asyncWrapper(authController.login));
router.post('/logout', asyncWrapper(authController.logout));
router.get('/me', protect, asyncWrapper(authController.getMe));
router.post('/refresh', asyncWrapper(authController.refreshToken));

export default router;
