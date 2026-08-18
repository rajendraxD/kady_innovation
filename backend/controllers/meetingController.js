import { Meeting } from '../models/Meeting.js';
import { Application } from '../models/Application.js';
import { Notification } from '../models/Notification.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

export const getMeetings = async (req, res) => {
  const {
    status,
    date,
    page = 1,
    limit = 50,
    sort = 'scheduledAt'
  } = req.query;
  const query = {};

  if (status && status !== 'All') {
    query.status = status;
  }

  if (date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    query.scheduledAt = { $gte: startOfDay, $lte: endOfDay };
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 50));
  const skip = (pageNum - 1) * limitNum;

  const [total, meetings] = await Promise.all([
    Meeting.countDocuments(query),
    Meeting.find(query)
      .sort(sort === 'scheduledAt' ? { scheduledAt: 1 } : { createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean()
  ]);

  const totalPages = Math.ceil(total / limitNum) || 1;

  return sendSuccess(res, 'Meetings retrieved', {
    meetings,
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


export const scheduleMeeting = async (req, res) => {
  const {
    applicationId,
    candidateName,
    candidateEmail,
    jobTitle,
    round,
    interviewerName,
    interviewerEmail,
    scheduledAt,
    durationMinutes,
    meetingLink,
    notes
  } = req.body;

  const meeting = await Meeting.create({
    applicationId,
    candidateName,
    candidateEmail,
    jobTitle,
    round,
    interviewerName,
    interviewerEmail,
    scheduledAt,
    durationMinutes: durationMinutes || 45,
    meetingLink: meetingLink || 'https://meet.google.com/kady-session',
    notes,
    status: 'scheduled'
  });

  // Optionally update application stage if still in applied/screening
  await Application.findByIdAndUpdate(applicationId, {
    stage: round === 'HR / Final Round' ? 'final_round' : 'interview_1'
  });

  // Notification
  await Notification.create({
    title: 'Interview Scheduled',
    message: `${round} with ${candidateName} scheduled for ${new Date(scheduledAt).toLocaleString()}.`,
    type: 'interview',
    link: '/admin/meetings'
  });

  return sendSuccess(res, 'Interview successfully scheduled', { meeting }, 201);
};

export const updateMeeting = async (req, res) => {
  const meeting = await Meeting.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).lean();

  if (!meeting) {
    return sendError(res, 'Meeting record not found', [], 404);
  }
  return sendSuccess(res, 'Meeting updated', { meeting });
};

export const deleteMeeting = async (req, res) => {
  const meeting = await Meeting.findByIdAndDelete(req.params.id);
  if (!meeting) {
    return sendError(res, 'Meeting not found', [], 404);
  }
  return sendSuccess(res, 'Meeting cancelled and deleted');
};

export const submitFeedback = async (req, res) => {
  const { rating, comments, recommendation } = req.body;
  const meeting = await Meeting.findByIdAndUpdate(
    req.params.id,
    {
      feedback: { rating, comments, recommendation },
      status: 'completed'
    },
    { new: true }
  ).lean();

  if (!meeting) {
    return sendError(res, 'Meeting record not found', [], 404);
  }

  // Also sync with Application scorecard if exists
  if (meeting.applicationId) {
    await Application.findByIdAndUpdate(meeting.applicationId, {
      'scorecard.overall': rating,
      'scorecard.recommendation': recommendation,
      'scorecard.feedbackText': comments
    });
  }

  return sendSuccess(res, 'Interview feedback recorded', { meeting });
};
