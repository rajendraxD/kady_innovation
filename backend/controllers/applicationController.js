import { Application } from '../models/Application.js';
import { Job } from '../models/Job.js';
import { Notification } from '../models/Notification.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { parseResumeText } from '../utils/resumeParser.js';

export const createApplication = async (req, res) => {
  const { jobId, personalInfo, experience, education, skills, resumeUrl, resumeFileName, coverLetter } = req.body;

  const job = await Job.findById(jobId);
  if (!job) {
    return sendError(res, 'Target job opening not found or has been closed.', [], 404);
  }

  // Calculate Match Score based on overlapping skills and experience
  let score = 70;
  if (job.skills && skills && Array.isArray(skills)) {
    const jobSkillsLower = job.skills.map((s) => s.toLowerCase());
    const matchedCount = skills.filter((s) => jobSkillsLower.includes(s.toLowerCase())).length;
    if (job.skills.length > 0) {
      score += Math.round((matchedCount / job.skills.length) * 25);
    }
  }
  if (experience?.totalYears >= 5) score += 5;
  score = Math.min(score, 99);

  const application = await Application.create({
    jobId,
    jobTitle: job.title,
    department: job.department,
    personalInfo,
    experience,
    education,
    skills,
    resumeUrl: resumeUrl || 'https://example.com/resumes/candidate.pdf',
    resumeFileName: resumeFileName || 'Resume.pdf',
    coverLetter,
    stage: 'applied',
    matchScore: score,
    isDeleted: false
  });

  // Increment applicant count on job
  await Job.findByIdAndUpdate(jobId, { $inc: { applicantsCount: 1 } });

  // Create recruiter notification
  await Notification.create({
    title: 'New Candidate Applied',
    message: `${personalInfo.fullName} applied for ${job.title} (${score}% match).`,
    type: 'application',
    link: '/admin/candidates'
  });

  return sendSuccess(
    res,
    'Application submitted successfully! Keep your application reference number for status tracking.',
    {
      applicationNumber: application.applicationNumber,
      candidateName: application.personalInfo.fullName,
      jobTitle: application.jobTitle,
      stage: application.stage
    },
    201
  );
};

export const parseResume = async (req, res) => {
  let text = '';
  let filename = 'Resume.pdf';

  if (req.file) {
    filename = req.file.originalname;
    text = req.file.buffer.toString('utf-8');
  } else if (req.body.resumeText) {
    text = req.body.resumeText;
    filename = req.body.fileName || filename;
  }

  const parsed = parseResumeText(text, filename);
  return sendSuccess(res, 'Resume parsed successfully', { parsed });
};

export const trackApplication = async (req, res) => {
  const { ref } = req.params;

  const application = await Application.findOne({
    $or: [{ applicationNumber: ref.trim() }, { 'personalInfo.email': ref.trim().toLowerCase() }],
    isDeleted: false
  })
    .select('applicationNumber jobTitle department stage personalInfo.fullName createdAt updatedAt')
    .lean();

  if (!application) {
    return sendError(res, 'No application found with the provided reference number or email.', [], 404);
  }

  return sendSuccess(res, 'Application status retrieved', { application });
};

export const getApplications = async (req, res) => {
  const {
    jobId,
    stage,
    search,
    minExperience,
    skills,
    sort = '-createdAt',
    page = 1,
    limit = 25
  } = req.query;

  const query = { isDeleted: false };

  if (jobId && jobId !== 'All') {
    query.jobId = jobId;
  }

  if (stage && stage !== 'All') {
    query.stage = stage;
  }

  if (minExperience) {
    query['experience.totalYears'] = { $gte: parseFloat(minExperience) };
  }

  if (skills) {
    const skillList = skills.split(',').map((s) => s.trim());
    query.skills = { $in: skillList };
  }

  if (search) {
    query.$or = [
      { 'personalInfo.fullName': { $regex: search, $options: 'i' } },
      { 'personalInfo.email': { $regex: search, $options: 'i' } },
      { jobTitle: { $regex: search, $options: 'i' } },
      { applicationNumber: { $regex: search, $options: 'i' } },
      { skills: { $in: [new RegExp(search, 'i')] } }
    ];
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 25));
  const skip = (pageNum - 1) * limitNum;

  const [total, applications] = await Promise.all([
    Application.countDocuments(query),
    Application.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean()
  ]);

  const totalPages = Math.ceil(total / limitNum) || 1;

  return sendSuccess(res, 'Applications retrieved', {
    applications,
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


export const getApplicationById = async (req, res) => {
  const application = await Application.findById(req.params.id).lean();
  if (!application) {
    return sendError(res, 'Candidate application not found', [], 404);
  }
  return sendSuccess(res, 'Candidate profile dossier', { application });
};

export const updateStage = async (req, res) => {
  const { stage } = req.body;
  const application = await Application.findByIdAndUpdate(
    req.params.id,
    { stage },
    { new: true, runValidators: true }
  ).lean();

  if (!application) {
    return sendError(res, 'Candidate application not found', [], 404);
  }

  return sendSuccess(res, `Stage successfully transitioned to ${stage}`, { application });
};

export const addNote = async (req, res) => {
  const { note } = req.body;
  if (!note || !note.trim()) {
    return sendError(res, 'Note content is required', [], 400);
  }

  const application = await Application.findById(req.params.id);
  if (!application) {
    return sendError(res, 'Candidate application not found', [], 404);
  }

  application.hrNotes.unshift({
    note: note.trim(),
    author: req.user?.name || 'Recruiter Admin',
    createdAt: new Date()
  });

  await application.save();
  return sendSuccess(res, 'Note added to candidate profile', { notes: application.hrNotes });
};

export const submitScorecard = async (req, res) => {
  const { technical, communication, problemSolving, cultureFit, recommendation, feedbackText } = req.body;

  const overall = parseFloat(
    ((technical + communication + problemSolving + cultureFit) / 4).toFixed(1)
  );

  const scorecardData = {
    technical,
    communication,
    problemSolving,
    cultureFit,
    overall,
    recommendation,
    feedbackText
  };

  const application = await Application.findByIdAndUpdate(
    req.params.id,
    { scorecard: scorecardData },
    { new: true }
  ).lean();

  if (!application) {
    return sendError(res, 'Candidate application not found', [], 404);
  }

  return sendSuccess(res, 'Interview scorecard saved', { scorecard: application.scorecard });
};

export const moveToRecycleBin = async (req, res) => {
  const application = await Application.findByIdAndUpdate(
    req.params.id,
    {
      isDeleted: true,
      deletedAt: new Date()
    },
    { new: true }
  ).lean();

  if (!application) {
    return sendError(res, 'Candidate application not found', [], 404);
  }

  return sendSuccess(res, 'Application moved to Recycle Bin', { application });
};
