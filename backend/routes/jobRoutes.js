import { Router } from 'express';
import * as jobController from '../controllers/jobController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { createJobSchema, updateJobSchema, generateJDSchema } from '../validations/jobValidation.js';
import { asyncWrapper } from '../middleware/asyncWrapper.js';

const router = Router();

// Public routes
router.get('/', asyncWrapper(jobController.getJobs));
router.get('/:id', asyncWrapper(jobController.getJobById));

// Protected admin routes
router.post('/', protect, authorize('admin', 'recruiter'), validate(createJobSchema), asyncWrapper(jobController.createJob));
router.put('/:id', protect, authorize('admin', 'recruiter'), validate(updateJobSchema), asyncWrapper(jobController.updateJob));
router.delete('/:id', protect, authorize('admin'), asyncWrapper(jobController.deleteJob));
router.post('/generate-jd', protect, validate(generateJDSchema), asyncWrapper(jobController.generateJD));

export default router;
