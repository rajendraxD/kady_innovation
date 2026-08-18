import * as Yup from 'yup';

export const scheduleMeetingSchema = Yup.object({
  applicationId: Yup.string().required('Application ID is required'),
  candidateName: Yup.string().required('Candidate name is required'),
  candidateEmail: Yup.string().email('Valid email is required').required('Candidate email is required'),
  jobTitle: Yup.string().required('Job title is required'),
  round: Yup.string().oneOf([
    'Initial Screening',
    'Technical Round',
    'System Design',
    'Managerial Round',
    'HR / Final Round'
  ]).default('Technical Round'),
  interviewerName: Yup.string().required('Interviewer name is required'),
  interviewerEmail: Yup.string().email('Valid email is required').required('Interviewer email is required'),
  scheduledAt: Yup.date().required('Interview schedule date and time is required'),
  durationMinutes: Yup.number().min(15).max(180).default(45),
  meetingLink: Yup.string().url('Must be a valid URL').default('https://meet.google.com/kady-interview-session'),
  notes: Yup.string().default('')
});

export const meetingFeedbackSchema = Yup.object({
  rating: Yup.number().min(1).max(5).required('Rating is required'),
  comments: Yup.string().required('Comments are required'),
  recommendation: Yup.string().oneOf(['Strong Hire', 'Hire', 'Hold', 'Reject']).required('Recommendation is required')
});
