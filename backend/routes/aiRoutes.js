import { Router } from 'express';
import * as aiController from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';
import { asyncWrapper } from '../middleware/asyncWrapper.js';

const router = Router();

router.use(protect);

router.post('/resume-buddy/chat', asyncWrapper(aiController.resumeBuddyChat));
router.post('/candidate-match', asyncWrapper(aiController.candidateMatch));

export default router;
