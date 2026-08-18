import * as Yup from 'yup';

export const createJobSchema = Yup.object({
  title: Yup.string().required('Job title is required'),
  department: Yup.string().required('Department is required'),
  location: Yup.string().required('Location is required'),
  workplaceType: Yup.string().oneOf(['Remote', 'Hybrid', 'On-site']).default('Remote'),
  employmentType: Yup.string().oneOf(['Full-time', 'Part-time', 'Contract', 'Internship']).default('Full-time'),
  experienceLevel: Yup.string().oneOf(['Entry-level', 'Mid-level', 'Senior', 'Lead', 'Executive']).default('Mid-level'),
  salaryMin: Yup.number().min(0).default(0),
  salaryMax: Yup.number().min(0).default(0),
  currency: Yup.string().default('INR'),
  description: Yup.string().required('Job description is required'),
  responsibilities: Yup.array().of(Yup.string()).default([]),
  requirements: Yup.array().of(Yup.string()).default([]),
  skills: Yup.array().of(Yup.string()).default([]),
  vacancies: Yup.number().min(1).default(1),
  status: Yup.string().oneOf(['active', 'draft', 'closed']).default('active'),
  deadline: Yup.date().nullable()
});

export const updateJobSchema = Yup.object({
  title: Yup.string(),
  department: Yup.string(),
  location: Yup.string(),
  workplaceType: Yup.string().oneOf(['Remote', 'Hybrid', 'On-site']),
  employmentType: Yup.string().oneOf(['Full-time', 'Part-time', 'Contract', 'Internship']),
  experienceLevel: Yup.string().oneOf(['Entry-level', 'Mid-level', 'Senior', 'Lead', 'Executive']),
  salaryMin: Yup.number().min(0),
  salaryMax: Yup.number().min(0),
  currency: Yup.string(),
  description: Yup.string(),
  responsibilities: Yup.array().of(Yup.string()),
  requirements: Yup.array().of(Yup.string()),
  skills: Yup.array().of(Yup.string()),
  vacancies: Yup.number().min(1),
  status: Yup.string().oneOf(['active', 'draft', 'closed']),
  deadline: Yup.date().nullable()
});

export const generateJDSchema = Yup.object({
  roleTitle: Yup.string().required('Role title is required'),
  department: Yup.string().default('Engineering'),
  experienceLevel: Yup.string().default('Mid-level'),
  keySkills: Yup.string().default(''),
  tone: Yup.string().default('Professional & Engaging')
});
