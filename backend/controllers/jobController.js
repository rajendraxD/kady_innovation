import { Job } from '../models/Job.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

export const getJobs = async (req, res) => {
  const {
    search,
    department,
    workplaceType,
    employmentType,
    experienceLevel,
    status = 'active',
    page = 1,
    limit = 20,
    all = false
  } = req.query;

  const query = { isDeleted: { $ne: true } };

  if (!all && status) {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { department: { $regex: search, $options: 'i' } },
      { skills: { $in: [new RegExp(search, 'i')] } }
    ];
  }

  if (department && department !== 'All') {
    query.department = department;
  }

  if (workplaceType && workplaceType !== 'All') {
    query.workplaceType = workplaceType;
  }

  if (employmentType && employmentType !== 'All') {
    query.employmentType = employmentType;
  }

  if (experienceLevel && experienceLevel !== 'All') {
    query.experienceLevel = experienceLevel;
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  const [total, jobs] = await Promise.all([
    Job.countDocuments(query),
    Job.find(query)
      // _id tiebreaker keeps page order stable when jobs share the same createdAt timestamp.
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean()
  ]);

  const totalPages = Math.ceil(total / limitNum) || 1;

  return sendSuccess(res, 'Jobs retrieved successfully', {
    jobs,
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

export const getJobById = async (req, res) => {
  const job = await Job.findOne({ _id: req.params.id, isDeleted: { $ne: true } }).lean();
  if (!job) {
    return sendError(res, 'Job not found', [], 404);
  }
  return sendSuccess(res, 'Job details', { job });
};

export const createJob = async (req, res) => {
  const job = await Job.create({ ...req.body, isDeleted: false });
  return sendSuccess(res, 'Job opening created successfully', { job }, 201);
};

export const updateJob = async (req, res) => {
  const job = await Job.findOneAndUpdate(
    { _id: req.params.id, isDeleted: { $ne: true } },
    req.body,
    { new: true, runValidators: true }
  ).lean();

  if (!job) {
    return sendError(res, 'Job not found', [], 404);
  }
  return sendSuccess(res, 'Job updated successfully', { job });
};

export const deleteJob = async (req, res) => {
  const job = await Job.findByIdAndUpdate(
    req.params.id,
    {
      isDeleted: true,
      deletedAt: new Date()
    },
    { new: true }
  ).lean();

  if (!job) {
    return sendError(res, 'Job not found', [], 404);
  }
  return sendSuccess(res, 'Job opening moved to Recycle Bin');
};


export const generateJD = async (req, res) => {
  const { roleTitle, department = 'Engineering', experienceLevel = 'Mid-level', keySkills = '' } = req.body;

  const parsedSkills = keySkills
    ? keySkills.split(',').map((s) => s.trim()).filter(Boolean)
    : ['React', 'Node.js', 'TypeScript', 'System Design'];

  const generatedJD = {
    title: roleTitle,
    department,
    experienceLevel,
    workplaceType: 'Remote',
    employmentType: 'Full-time',
    salaryMin: experienceLevel === 'Senior' ? 2200000 : experienceLevel === 'Lead' ? 3200000 : 1200000,
    salaryMax: experienceLevel === 'Senior' ? 3200000 : experienceLevel === 'Lead' ? 4500000 : 1800000,
    currency: 'INR',
    description: `We are looking for a visionary ${experienceLevel} ${roleTitle} to join our high-impact ${department} organization. In this role, you will lead the development of innovative features, elevate technical quality, and deliver delightful experiences to hundreds of thousands of users.`,
    responsibilities: [
      `Architect, develop, and maintain robust, high-performance features in ${roleTitle} domain.`,
      `Collaborate cross-functionally with Product, Engineering, and Design to iterate rapidly.`,
      `Ensure exceptional code quality through thorough unit testing, reviews, and automated CI/CD practices.`,
      `Participate in agile rituals, sprint planning, and architectural reviews.`
    ],
    requirements: [
      `${experienceLevel === 'Lead' ? '7+' : experienceLevel === 'Senior' ? '5+' : '2+'} years of experience in ${roleTitle} or equivalent software engineering capacity.`,
      `Demonstrated mastery with core technologies: ${parsedSkills.join(', ')}.`,
      `Strong grasp of clean code principles, scalable system architecture, and REST/GraphQL APIs.`,
      `Excellent communication and teamwork capabilities in asynchronous, remote-first setups.`
    ],
    skills: parsedSkills,
    vacancies: 1,
    status: 'active'
  };

  return sendSuccess(res, 'AI Job Description generated successfully', { jd: generatedJD });
};
