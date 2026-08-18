import * as Yup from 'yup';

export const createApplicationSchema = Yup.object({
  jobId: Yup.string().required('Job ID is required'),
  personalInfo: Yup.object({
    fullName: Yup.string().required('Full name is required'),
    email: Yup.string().email('Valid email is required').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    city: Yup.string().default(''),
    country: Yup.string().default(''),
    portfolioUrl: Yup.string().url('Must be a valid URL').nullable(),
    linkedinUrl: Yup.string().url('Must be a valid URL').nullable(),
    githubUrl: Yup.string().url('Must be a valid URL').nullable()
  }).required(),
  experience: Yup.object({
    totalYears: Yup.number().min(0).default(0),
    currentCompany: Yup.string().default(''),
    currentDesignation: Yup.string().default(''),
    noticePeriodDays: Yup.number().default(30),
    currentCtc: Yup.number().default(0),
    expectedCtc: Yup.number().default(0)
  }).default({}),
  education: Yup.object({
    highestDegree: Yup.string().default(''),
    fieldOfStudy: Yup.string().default(''),
    institution: Yup.string().default(''),
    graduationYear: Yup.number().default(2024),
    grade: Yup.string().default('')
  }).default({}),
  skills: Yup.array().of(Yup.string()).default([]),
  resumeUrl: Yup.string().required('Resume link or content is required'),
  resumeFileName: Yup.string().default('resume.pdf'),
  coverLetter: Yup.string().default('')
});

export const updateStageSchema = Yup.object({
  stage: Yup.string().oneOf([
    'applied',
    'screening',
    'interview_1',
    'technical_round',
    'final_round',
    'offered',
    'hired',
    'rejected'
  ]).required('Stage is required')
});

export const scorecardSchema = Yup.object({
  technical: Yup.number().min(0).max(5).default(0),
  communication: Yup.number().min(0).max(5).default(0),
  problemSolving: Yup.number().min(0).max(5).default(0),
  cultureFit: Yup.number().min(0).max(5).default(0),
  overall: Yup.number().min(0).max(5).default(0),
  recommendation: Yup.string().oneOf(['', 'Strong Hire', 'Hire', 'Hold', 'Reject']).default(''),
  feedbackText: Yup.string().default('')
});
