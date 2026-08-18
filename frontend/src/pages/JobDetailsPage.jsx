import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jobApi } from '../api/jobApi';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Skeleton } from '../components/ui/skeleton';
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Sparkles,
  CheckCircle2,
  ArrowLeft,
  Share2,
  Send
} from 'lucide-react';

export const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await jobApi.getJobById(id);
        setJob(res.data.job);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
        <Skeleton className="h-4 w-36 rounded" />
        <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8 shadow-2xs space-y-4">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-24 rounded-lg" />
            <Skeleton className="h-6 w-20 rounded-lg" />
            <Skeleton className="h-6 w-24 rounded-lg" />
          </div>
          <Skeleton className="h-8 w-1/2 rounded-xl" />
          <Skeleton className="h-4 w-1/3 rounded" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-2xs space-y-4">
              <Skeleton className="h-6 w-40 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-5/6 rounded" />
                <Skeleton className="h-4 w-4/5 rounded" />
              </div>
            </div>
            <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-2xs space-y-4">
              <Skeleton className="h-6 w-44 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-full rounded" />
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-2xs space-y-4">
              <Skeleton className="h-5 w-32 rounded" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-full rounded" />
              </div>
              <Skeleton className="h-10 w-full rounded-xl pt-2" />
            </div>
          </div>
        </div>
      </div>
    );
  }


  if (!job) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-gray-900">Job Not Found</h2>
        <p className="text-xs text-gray-500 mt-1">This job opening may have been unlisted or closed.</p>
        <Link
          to="/jobs"
          className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#70C100] hover:bg-[#62aa00] px-4 py-2 text-xs font-black text-black shadow-xs"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Openings
        </Link>
      </div>
    );
  }


  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Back Button */}
      <Link
        to="/jobs"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-[#4e8500] dark:hover:text-[#84e000] transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to Open Positions</span>
      </Link>

      {/* Main Job Header Hero */}
      <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-[#70C100]/15 dark:bg-[#70C100]/15 px-2.5 py-1 text-xs font-bold text-[#4e8500] dark:text-[#84e000] uppercase tracking-wider border border-[#70C100]/30">
                {job.department}
              </span>
              <span className="rounded-lg bg-gray-100 dark:bg-gray-800 px-2.5 py-1 text-xs font-semibold text-gray-700 dark:text-gray-300">
                {job.workplaceType}
              </span>
              <span className="rounded-lg bg-gray-100 dark:bg-gray-800 px-2.5 py-1 text-xs font-semibold text-gray-700 dark:text-gray-300">
                {job.employmentType}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight mt-3">
              {job.title}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 flex flex-wrap items-center gap-2 sm:gap-4">
              <span>{job.location}</span>
              <span>•</span>
              <span>Experience: {job.experienceLevel}</span>
              <span>•</span>
              <span>Compensation: {formatCurrency(job.salaryMin)} - {formatCurrency(job.salaryMax)} / year</span>
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <Link
              to={`/apply/${job._id}`}
              className="inline-flex items-center gap-2 rounded-xl bg-[#70C100] hover:bg-[#62aa00] px-6 py-3.5 text-sm font-black text-black shadow-lg shadow-[#70C100]/25 active:scale-95 transition-all cursor-pointer"
            >
              <Send className="h-4 w-4" />
              Apply For This Role
            </Link>
          </div>
        </div>
      </div>

      {/* Job Description & Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* About the Role */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-2xs space-y-3">
            <h3 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">About The Position</h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-normal whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {/* Key Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-2xs space-y-3">
              <h3 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">Key Responsibilities</h3>
              <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                {job.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-2.5 leading-relaxed">
                    <CheckCircle2 className="h-4 w-4 text-[#559400] dark:text-[#84e000] shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-2xs space-y-3">
              <h3 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">Qualifications & Requirements</h3>
              <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2.5 leading-relaxed">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-2xs space-y-4 text-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Job Overview</h4>

            <div>
              <span className="text-gray-400 dark:text-gray-500 block text-[11px]">Target Department</span>
              <span className="font-bold text-gray-900 dark:text-gray-100">{job.department}</span>
            </div>

            <div>
              <span className="text-gray-400 dark:text-gray-500 block text-[11px]">Location</span>
              <span className="font-bold text-gray-900 dark:text-gray-100">{job.location}</span>
            </div>

            <div>
              <span className="text-gray-400 dark:text-gray-500 block text-[11px]">Salary Range</span>
              <span className="font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(job.salaryMin)} - {formatCurrency(job.salaryMax)} / yr
              </span>
            </div>

            <div>
              <span className="text-gray-400 dark:text-gray-500 block text-[11px]">Open Vacancies</span>
              <span className="font-bold text-gray-900 dark:text-gray-100">{job.vacancies || 1} Open Position(s)</span>
            </div>

            {job.deadline && (
              <div>
                <span className="text-gray-400 dark:text-gray-500 block text-[11px]">Application Deadline</span>
                <span className="font-bold text-gray-900 dark:text-gray-100">{formatDate(job.deadline)}</span>
              </div>
            )}

            <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
              <Link
                to={`/apply/${job._id}`}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#70C100] hover:bg-[#62aa00] py-3 text-xs font-black text-black shadow-md shadow-[#70C100]/25 cursor-pointer transition-colors"
              >
                <Send className="h-3.5 w-3.5" />
                Apply Now
              </Link>
            </div>
          </div>

          {/* Tech Stack Required */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-2xs text-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Core Technologies</h4>
            <div className="flex flex-wrap gap-1.5">
              {job.skills?.map((skill, i) => (
                <span
                  key={i}
                  className="rounded-lg bg-[#70C100]/15 dark:bg-[#70C100]/15 border border-[#70C100]/30 px-2.5 py-1 text-xs font-bold text-[#4e8500] dark:text-[#84e000]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

