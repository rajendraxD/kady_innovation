import { Router } from 'express';
import * as applicationController from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { upload } from '../middleware/upload.js';
import {
  createApplicationSchema,
  updateStageSchema,
  scorecardSchema
} from '../validations/applicationValidation.js';
import { asyncWrapper } from '../middleware/asyncWrapper.js';

const router = Router();

// Public routes
router.post('/', validate(createApplicationSchema), asyncWrapper(applicationController.createApplication));
router.post('/parse-resume', upload.single('resume'), asyncWrapper(applicationController.parseResume));
router.get('/track/:ref', asyncWrapper(applicationController.trackApplication));

// Protected admin routes
router.get('/', protect, asyncWrapper(applicationController.getApplications));
router.get('/:id', protect, asyncWrapper(applicationController.getApplicationById));
router.patch('/:id/stage', protect, validate(updateStageSchema), asyncWrapper(applicationController.updateStage));
router.post('/:id/notes', protect, asyncWrapper(applicationController.addNote));
router.post('/:id/scorecard', protect, validate(scorecardSchema), asyncWrapper(applicationController.submitScorecard));
router.delete('/:id', protect, authorize('admin', 'recruiter'), asyncWrapper(applicationController.moveToRecycleBin));

export default router;
