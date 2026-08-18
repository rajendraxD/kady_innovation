import { Application } from '../models/Application.js';
import { Job } from '../models/Job.js';
import { Setting } from '../models/Setting.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

export const getTrash = async (req, res) => {
  const setting = await Setting.findOne({ key: 'retention_policy_days' }).lean();
  const defaultRetention = setting ? parseInt(setting.value, 10) : 60;

  const [candidateTrash, jobTrash] = await Promise.all([
    Application.find({ isDeleted: true }).sort({ deletedAt: -1 }).lean(),
    Job.find({ isDeleted: true }).sort({ deletedAt: -1 }).lean()
  ]);

  const now = new Date();

  const enrichItem = (item) => {
    const deletedDate = item.deletedAt ? new Date(item.deletedAt) : new Date(item.updatedAt);
    const retentionLimit = item.retentionDays || defaultRetention;
    const elapsedDays = Math.floor((now - deletedDate) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max(0, retentionLimit - elapsedDays);

    let retentionStatus = 'safe';
    if (daysRemaining <= 0) {
      retentionStatus = 'expired';
    } else if (daysRemaining <= 7) {
      retentionStatus = 'warning';
    }

    return {
      ...item,
      elapsedDays,
      daysRemaining,
      retentionStatus,
      retentionLimit
    };
  };

  const enrichedCandidates = candidateTrash.map(enrichItem);
  const enrichedJobs = jobTrash.map(enrichItem);

  return sendSuccess(res, 'Recycle bin items retrieved', {
    trash: enrichedCandidates,
    candidates: enrichedCandidates,
    jobs: enrichedJobs,
    totalCount: enrichedCandidates.length + enrichedJobs.length,
    defaultRetention
  });
};

export const restoreApplication = async (req, res) => {
  const application = await Application.findByIdAndUpdate(
    req.params.id,
    {
      isDeleted: false,
      deletedAt: null
    },
    { new: true }
  ).lean();

  if (!application) {
    return sendError(res, 'Candidate not found in Recycle Bin', [], 404);
  }

  return sendSuccess(res, 'Candidate application restored to active pool', { application });
};

export const permanentDelete = async (req, res) => {
  const application = await Application.findOneAndDelete({
    _id: req.params.id,
    isDeleted: true
  });

  if (!application) {
    return sendError(res, 'Candidate not found in Recycle Bin', [], 404);
  }

  return sendSuccess(res, 'Candidate profile permanently removed');
};

export const emptyTrash = async (req, res) => {
  const result = await Application.deleteMany({ isDeleted: true });
  return sendSuccess(res, `Candidate recycle bin emptied (${result.deletedCount} records permanently removed)`);
};

export const restoreJob = async (req, res) => {
  const job = await Job.findByIdAndUpdate(
    req.params.id,
    {
      isDeleted: false,
      deletedAt: null
    },
    { new: true }
  ).lean();

  if (!job) {
    return sendError(res, 'Job opening not found in Recycle Bin', [], 404);
  }

  return sendSuccess(res, 'Job requisition restored to active openings', { job });
};

export const permanentDeleteJob = async (req, res) => {
  const job = await Job.findOneAndDelete({
    _id: req.params.id,
    isDeleted: true
  });

  if (!job) {
    return sendError(res, 'Job opening not found in Recycle Bin', [], 404);
  }

  return sendSuccess(res, 'Job requisition permanently removed');
};

export const emptyJobsTrash = async (req, res) => {
  const result = await Job.deleteMany({ isDeleted: true });
  return sendSuccess(res, `Jobs recycle bin emptied (${result.deletedCount} records permanently removed)`);
};


export const getRetentionSettings = async (req, res) => {
  let setting = await Setting.findOne({ key: 'retention_policy_days' }).lean();
  if (!setting) {
    setting = { key: 'retention_policy_days', value: 60 };
  }
  return sendSuccess(res, 'Retention settings', { retentionDays: setting.value });
};

export const updateRetentionSettings = async (req, res) => {
  const { retentionDays } = req.body;
  if (!retentionDays || retentionDays < 7 || retentionDays > 365) {
    return sendError(res, 'Retention period must be between 7 and 365 days', [], 400);
  }

  await Setting.findOneAndUpdate(
    { key: 'retention_policy_days' },
    { value: parseInt(retentionDays, 10) },
    { upsert: true, new: true }
  );

  return sendSuccess(res, `Retention policy updated to ${retentionDays} days`);
};
