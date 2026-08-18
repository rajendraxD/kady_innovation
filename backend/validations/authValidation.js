import * as Yup from 'yup';

export const loginSchema = Yup.object({
  email: Yup.string().email('Please provide a valid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')
});

export const registerSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Please provide a valid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  role: Yup.string().oneOf(['admin', 'recruiter', 'interviewer']).default('admin')
});
