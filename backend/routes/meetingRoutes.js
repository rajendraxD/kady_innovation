import { Router } from 'express';
import * as meetingController from '../controllers/meetingController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { scheduleMeetingSchema, meetingFeedbackSchema } from '../validations/meetingValidation.js';
import { asyncWrapper } from '../middleware/asyncWrapper.js';

const router = Router();

router.use(protect);

router.get('/', asyncWrapper(meetingController.getMeetings));
router.post('/', validate(scheduleMeetingSchema), asyncWrapper(meetingController.scheduleMeeting));
router.put('/:id', asyncWrapper(meetingController.updateMeeting));
router.delete('/:id', asyncWrapper(meetingController.deleteMeeting));
router.post('/:id/feedback', validate(meetingFeedbackSchema), asyncWrapper(meetingController.submitFeedback));

export default router;
