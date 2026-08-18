import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { jobApi } from '../api/jobApi';
import { applicationApi } from '../api/applicationApi';
import { ResumeAutofillCard } from '../components/ui/ResumeAutofillCard';
import {
  Briefcase,
  User,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Send,
  FileText,
  Copy,
  Check
} from 'lucide-react';

const validationSchema = Yup.object({
  personalInfo: Yup.object({
    fullName: Yup.string().required('Full name is required'),
    email: Yup.string().email('Please enter a valid email').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    city: Yup.string(),
    country: Yup.string(),
    portfolioUrl: Yup.string().url('Must be a valid URL'),
    linkedinUrl: Yup.string().url('Must be a valid URL'),
    githubUrl: Yup.string().url('Must be a valid URL')
  }),
  experience: Yup.object({
    totalYears: Yup.number().min(0, 'Years cannot be negative').required('Total experience is required'),
    currentCompany: Yup.string(),
    currentDesignation: Yup.string(),
    noticePeriodDays: Yup.number().default(30),
    currentCtc: Yup.number().min(0),
    expectedCtc: Yup.number().min(0)
  }),
  education: Yup.object({
    highestDegree: Yup.string(),
    fieldOfStudy: Yup.string(),
    institution: Yup.string(),
    graduationYear: Yup.number(),
    grade: Yup.string()
  }),
  skills: Yup.array().of(Yup.string()),
  resumeUrl: Yup.string().required('Resume link is required'),
  resumeFileName: Yup.string().default('resume.pdf'),
  coverLetter: Yup.string()
});

export const ApplyJobPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [skillInput, setSkillInput] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadJob = async () => {
      try {
        const res = await jobApi.getJobById(id);
        setJob(res.data.job);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadJob();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      jobId: id,
      personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        city: 'Bengaluru',
        country: 'India',
        portfolioUrl: '',
        linkedinUrl: '',
        githubUrl: ''
      },
      experience: {
        totalYears: 3,
        currentCompany: '',
        currentDesignation: '',
        noticePeriodDays: 30,
        currentCtc: 1200000,
        expectedCtc: 1800000
      },
      education: {
        highestDegree: "Bachelor's Degree",
        fieldOfStudy: 'Computer Science',
        institution: 'State University',
        graduationYear: 2022,
        grade: '3.6 GPA'
      },
      skills: ['React', 'JavaScript', 'Node.js'],
      resumeUrl: 'https://example.com/resumes/candidate.pdf',
      resumeFileName: 'Candidate_Resume.pdf',
      coverLetter: ''
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        const res = await applicationApi.createApplication({
          ...values,
          jobId: id
        });
        setSubmissionSuccess(res.data);
      } catch (err) {
        setStatus(err.message || 'Submission failed. Please check form inputs.');
      } finally {
        setSubmitting(false);
      }
    }
  });

  const handleAutofill = (parsed, fileName) => {
    if (parsed.fullName) formik.setFieldValue('personalInfo.fullName', parsed.fullName);
    if (parsed.email) formik.setFieldValue('personalInfo.email', parsed.email);
    if (parsed.phone) formik.setFieldValue('personalInfo.phone', parsed.phone);
    if (parsed.experienceYears) formik.setFieldValue('experience.totalYears', parsed.experienceYears);
    if (parsed.currentDesignation) formik.setFieldValue('experience.currentDesignation', parsed.currentDesignation);
    if (parsed.highestDegree) formik.setFieldValue('education.highestDegree', parsed.highestDegree);
    if (parsed.fieldOfStudy) formik.setFieldValue('education.fieldOfStudy', parsed.fieldOfStudy);
    if (parsed.skills && parsed.skills.length > 0) {
      const merged = Array.from(new Set([...formik.values.skills, ...parsed.skills]));
      formik.setFieldValue('skills', merged);
    }
    if (fileName) {
      formik.setFieldValue('resumeFileName', fileName);
      formik.setFieldValue('resumeUrl', `https://example.com/resumes/${encodeURIComponent(fileName)}`);
    }
  };

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (skillInput.trim() && !formik.values.skills.includes(skillInput.trim())) {
        formik.setFieldValue('skills', [...formik.values.skills, skillInput.trim()]);
        setSkillInput('');
      }
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    formik.setFieldValue(
      'skills',
      formik.values.skills.filter((s) => s !== skillToRemove)
    );
  };

  const copyRefCode = () => {
    if (submissionSuccess?.applicationNumber) {
      navigator.clipboard.writeText(submissionSuccess.applicationNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#70C100] border-t-transparent mx-auto mb-4" />
        <p className="text-xs text-gray-500 dark:text-gray-400">Loading application wizard...</p>
      </div>
    );
  }

  if (submissionSuccess) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center space-y-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#70C100]/20 text-[#4e8500] dark:text-[#84e000] mx-auto shadow-md">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#4e8500] dark:text-[#84e000]">Application Submitted</span>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Congratulations, {submissionSuccess.candidateName}!</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Your application for <strong>{submissionSuccess.jobTitle}</strong> has been successfully registered in our recruitment pipeline.
          </p>
        </div>

        <div className="rounded-2xl border border-[#70C100]/30 bg-[#70C100]/10 p-5 space-y-3 text-xs">
          <span className="text-gray-600 dark:text-gray-300 block font-medium">Your Application Tracking Reference:</span>
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg font-black text-gray-950 dark:text-white tracking-wider font-mono">
              {submissionSuccess.applicationNumber}
            </span>
            <button
              type="button"
              onClick={copyRefCode}
              className="rounded-lg bg-white dark:bg-gray-800 p-1.5 text-gray-500 dark:text-gray-300 hover:text-[#4e8500] dark:hover:text-[#84e000] border border-gray-200 dark:border-gray-700 cursor-pointer"
            >
              {copied ? <Check className="h-4 w-4 text-[#70C100]" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            Keep this reference code or your email to track real-time interview status.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to={`/track-status?ref=${encodeURIComponent(submissionSuccess.applicationNumber)}`}
            className="w-full sm:w-auto rounded-xl bg-[#70C100] hover:bg-[#62aa00] px-5 py-2.5 text-xs font-black text-black shadow-md shadow-[#70C100]/25 cursor-pointer"
          >
            Track Status Now
          </Link>
          <Link
            to="/jobs"
            className="w-full sm:w-auto rounded-xl border border-gray-300 dark:border-gray-750 bg-white dark:bg-gray-800 px-5 py-2.5 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
          >
            Browse More Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div>
        <Link
          to={`/jobs/${id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-[#4e8500] dark:hover:text-[#84e000] mb-2 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to {job?.title || 'Job'}</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
          Apply for {job?.title}
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {job?.department} • {job?.location} • {job?.workplaceType}
        </p>
      </div>

      {/* AI Resume Autofill Hero Card */}
      <ResumeAutofillCard onAutofillComplete={handleAutofill} />

      {/* Wizard Steps Indicator */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4 text-xs font-semibold">
        {[
          { num: 1, label: 'Personal Info' },
          { num: 2, label: 'Experience & CTC' },
          { num: 3, label: 'Education' },
          { num: 4, label: 'Skills & Finish' }
        ].map((s) => (
          <button
            key={s.num}
            type="button"
            onClick={() => setStep(s.num)}
            className={`flex items-center gap-2 cursor-pointer transition-colors ${
              step === s.num
                ? 'text-[#4e8500] dark:text-[#84e000] font-black border-b-2 border-[#70C100] pb-1'
                : step > s.num
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
                step === s.num
                  ? 'bg-[#70C100] text-black shadow-2xs'
                  : step > s.num
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
              }`}
            >
              {step > s.num ? <Check className="h-3.5 w-3.5" /> : s.num}
            </span>
            <span className="hidden sm:inline">{s.label}</span>
          </button>
        ))}
      </div>

      {/* Formik Multi-step Form */}
      <form onSubmit={formik.handleSubmit} className="space-y-6 text-xs">

        {formik.status && (
          <div className="rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 p-3 text-rose-700 dark:text-rose-300">
            {formik.status}
          </div>
        )}

        {/* STEP 1: Personal Info */}
        {step === 1 && (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Personal & Contact Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Alexander Wright"
                  {...formik.getFieldProps('personalInfo.fullName')}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#70C100] focus:outline-hidden"
                />
                {formik.touched.personalInfo?.fullName && formik.errors.personalInfo?.fullName && (
                  <p className="text-rose-500 text-[11px] mt-1">{formik.errors.personalInfo.fullName}</p>
                )}
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Email Address *</label>
                <input
                  type="email"
                  placeholder="alex.wright@example.com"
                  {...formik.getFieldProps('personalInfo.email')}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#70C100] focus:outline-hidden"
                />
                {formik.touched.personalInfo?.email && formik.errors.personalInfo?.email && (
                  <p className="text-rose-500 text-[11px] mt-1">{formik.errors.personalInfo.email}</p>
                )}
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Phone Number *</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 234-5678"
                  {...formik.getFieldProps('personalInfo.phone')}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#70C100] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Current City & Country</label>
                <input
                  type="text"
                  placeholder="San Francisco, USA"
                  {...formik.getFieldProps('personalInfo.city')}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#70C100] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">LinkedIn Profile URL</label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  {...formik.getFieldProps('personalInfo.linkedinUrl')}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#70C100] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">GitHub / Portfolio URL</label>
                <input
                  type="url"
                  placeholder="https://github.com/username"
                  {...formik.getFieldProps('personalInfo.githubUrl')}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#70C100] focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#70C100] hover:bg-[#62aa00] px-5 py-2.5 text-xs font-black text-black shadow-md shadow-[#70C100]/20 cursor-pointer transition-colors"
              >
                <span>Continue to Experience</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Professional Experience */}
        {step === 2 && (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Work Experience & Compensation</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Total Years of Experience *</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  {...formik.getFieldProps('experience.totalYears')}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#70C100] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Current Job Title / Designation</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Software Engineer"
                  {...formik.getFieldProps('experience.currentDesignation')}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#70C100] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Current Employer / Company</label>
                <input
                  type="text"
                  placeholder="e.g. Tech Systems Inc"
                  {...formik.getFieldProps('experience.currentCompany')}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#70C100] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Notice Period (Days)</label>
                <select
                  {...formik.getFieldProps('experience.noticePeriodDays')}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-xs focus:border-[#70C100] focus:outline-hidden cursor-pointer"
                >
                  <option value={0}>Immediate Joiner (0 Days)</option>
                  <option value={15}>15 Days</option>
                  <option value={30}>30 Days (1 Month)</option>
                  <option value={60}>60 Days (2 Months)</option>
                  <option value={90}>90 Days (3 Months)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Current Annual CTC (INR / Yr)</label>
                <input
                  type="number"
                  placeholder="e.g. 1200000"
                  {...formik.getFieldProps('experience.currentCtc')}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#70C100] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Expected Annual CTC (INR / Yr)</label>
                <input
                  type="number"
                  placeholder="e.g. 1800000"
                  {...formik.getFieldProps('experience.expectedCtc')}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#70C100] focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#70C100] hover:bg-[#62aa00] px-5 py-2.5 text-xs font-black text-black shadow-md shadow-[#70C100]/20 cursor-pointer transition-colors"
              >
                <span>Continue to Education</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Education */}
        {step === 3 && (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Academic Background</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Highest Degree Earned</label>
                <select
                  {...formik.getFieldProps('education.highestDegree')}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-xs focus:border-[#70C100] focus:outline-hidden cursor-pointer"
                >
                  <option value="Bachelor's Degree">Bachelor's Degree (B.S. / B.Tech / B.E.)</option>
                  <option value="Master's Degree">Master's Degree (M.S. / M.Tech / MBA)</option>
                  <option value="Doctorate / Ph.D">Doctorate / Ph.D</option>
                  <option value="Diploma / Associate">Diploma / Associate Degree</option>
                  <option value="High School">High School</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Field of Study / Major</label>
                <input
                  type="text"
                  placeholder="Computer Science, Software Engineering..."
                  {...formik.getFieldProps('education.fieldOfStudy')}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#70C100] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">University / College Institution</label>
                <input
                  type="text"
                  placeholder="University Name"
                  {...formik.getFieldProps('education.institution')}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#70C100] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Graduation Year</label>
                <input
                  type="number"
                  placeholder="2023"
                  {...formik.getFieldProps('education.graduationYear')}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#70C100] focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#70C100] hover:bg-[#62aa00] px-5 py-2.5 text-xs font-black text-black shadow-md shadow-[#70C100]/20 cursor-pointer transition-colors"
              >
                <span>Continue to Skills & Review</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Skills & Final Submit */}
        {step === 4 && (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-2xs space-y-5">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Key Skills & Final Submission</h3>

            <div>
              <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Key Competencies & Technologies</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a skill and press Enter..."
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                  className="flex-1 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#70C100] focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (skillInput.trim() && !formik.values.skills.includes(skillInput.trim())) {
                      formik.setFieldValue('skills', [...formik.values.skills, skillInput.trim()]);
                      setSkillInput('');
                    }
                  }}
                  className="rounded-xl bg-[#70C100]/15 text-[#4e8500] dark:text-[#84e000] border border-[#70C100]/30 px-4 py-2 text-xs font-bold hover:bg-[#70C100]/25 cursor-pointer"
                >
                  Add
                </button>
              </div>

              {/* Skills Tags */}
              <div className="mt-3 flex flex-wrap gap-2">
                {formik.values.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 rounded-lg bg-[#70C100]/15 dark:bg-[#70C100]/15 border border-[#70C100]/30 px-2.5 py-1 text-xs font-bold text-[#4e8500] dark:text-[#84e000]"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-[#4e8500] dark:text-[#84e000] hover:text-rose-600 font-bold ml-1 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Cover Note / Remarks (Optional)</label>
              <textarea
                rows={3}
                placeholder="Share anything you'd like the hiring manager to know about your background and why you are interested in this role..."
                {...formik.getFieldProps('coverLetter')}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#70C100] focus:outline-hidden"
              />
            </div>

            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-[#559400] dark:text-[#84e000]" />
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-gray-100">{formik.values.resumeFileName}</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">Document attached to this application</p>
                </div>
              </div>
              <span className="rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 text-[10px] font-bold">
                Attached
              </span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="rounded-xl border border-gray-300 dark:border-gray-750 bg-white dark:bg-gray-800 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="inline-flex items-center gap-2 rounded-xl bg-[#70C100] hover:bg-[#62aa00] px-6 py-3 text-xs font-black text-black shadow-lg shadow-[#70C100]/25 disabled:opacity-50 cursor-pointer transition-colors"
              >
                <Send className="h-4 w-4" />
                {formik.isSubmitting ? 'Submitting Application...' : 'Submit Application'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>

  );
};

