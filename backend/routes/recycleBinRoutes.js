import { Router } from 'express';
import * as recycleBinController from '../controllers/recycleBinController.js';
import { protect, authorize } from '../middleware/auth.js';
import { asyncWrapper } from '../middleware/asyncWrapper.js';

const router = Router();

router.use(protect);

router.get('/', asyncWrapper(recycleBinController.getTrash));
router.post('/:id/restore', authorize('admin', 'recruiter'), asyncWrapper(recycleBinController.restoreApplication));
router.delete('/:id/permanent', authorize('admin'), asyncWrapper(recycleBinController.permanentDelete));
router.delete('/empty/all', authorize('admin'), asyncWrapper(recycleBinController.emptyTrash));

// Job Openings Trash Endpoints
router.post('/jobs/:id/restore', authorize('admin', 'recruiter'), asyncWrapper(recycleBinController.restoreJob));
router.delete('/jobs/:id/permanent', authorize('admin'), asyncWrapper(recycleBinController.permanentDeleteJob));
router.delete('/jobs/empty/all', authorize('admin'), asyncWrapper(recycleBinController.emptyJobsTrash));

router.get('/settings/policy', asyncWrapper(recycleBinController.getRetentionSettings));
router.put('/settings/policy', authorize('admin'), asyncWrapper(recycleBinController.updateRetentionSettings));

export default router;

