import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { applicationApi } from '../api/applicationApi';
import { StatusBadge } from '../components/common/StatusBadge';
import { formatDate } from '../utils/formatters';
import { Search, Briefcase, CheckCircle2, Clock, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';

export const ApplicationStatusPage = () => {
  const [searchParams] = useSearchParams();
  const [refInput, setRefInput] = useState(searchParams.get('ref') || '');
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTrack = async (queryRef) => {
    const target = queryRef || refInput;
    if (!target.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await applicationApi.trackApplication(target.trim());
      setApplication(res.data.application);
    } catch (err) {
      setError(err.message || 'No application record found matching this reference code or email.');
      setApplication(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialRef = searchParams.get('ref');
    if (initialRef) {
      handleTrack(initialRef);
    }
  }, [searchParams]);

  const stagesTimeline = [
    { key: 'applied', label: 'Application Submitted' },
    { key: 'screening', label: 'Resume Screening' },
    { key: 'interview_1', label: 'Interview Round 1' },
    { key: 'technical_round', label: 'Technical Assessment' },
    { key: 'final_round', label: 'Final Evaluation' },
    { key: 'offered', label: 'Decision & Offer' }
  ];

  const getStageIndex = (stageKey) => {
    const map = {
      applied: 0,
      screening: 1,
      interview_1: 2,
      technical_round: 3,
      final_round: 4,
      offered: 5,
      hired: 5,
      rejected: 1
    };
    return map[stageKey] || 0;
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Application Status Tracker</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Enter your Application Reference ID (e.g. APP-2026-1001) or email address to view real-time recruitment pipeline updates.
        </p>
      </div>

      {/* Search Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleTrack();
        }}
        className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3 shadow-sm flex flex-col sm:flex-row gap-2"
      >
        <div className="relative flex-1 flex items-center">
          <Search className="absolute left-3.5 h-4.5 w-4.5 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            required
            placeholder="Enter Application Reference ID or Email..."
            value={refInput}
            onChange={(e) => setRefInput(e.target.value)}
            className="w-full rounded-xl bg-transparent py-2.5 pl-10 pr-4 text-xs font-medium text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-hidden"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !refInput.trim()}
          className="rounded-xl bg-[#70C100] hover:bg-[#62aa00] px-6 py-2.5 text-xs font-black text-black shadow-md shadow-[#70C100]/25 disabled:opacity-50 cursor-pointer transition-colors"
        >
          {loading ? 'Searching...' : 'Track Status'}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 p-4 text-xs text-rose-700 dark:text-rose-300 text-center">
          {error}
        </div>
      )}

      {/* Tracking Result Card */}
      {application && (
        <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8 shadow-sm space-y-8 animate-fade-in">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-gray-800">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#4e8500] dark:text-[#84e000] font-mono">
                {application.applicationNumber}
              </span>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">{application.jobTitle}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Candidate: <strong className="text-gray-900 dark:text-gray-200">{application.personalInfo?.fullName}</strong> • Applied on{' '}
                {formatDate(application.createdAt)}
              </p>
            </div>
            <StatusBadge stage={application.stage} size="lg" />
          </div>

          {/* Stepper Progress Bar */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Recruitment Milestone Timeline</h4>
            <div className="relative flex flex-col sm:flex-row justify-between gap-4 pt-2">
              {stagesTimeline.map((item, idx) => {
                const currentIndex = getStageIndex(application.stage);
                const isPassed = idx <= currentIndex && application.stage !== 'rejected';
                const isCurrent = idx === currentIndex && application.stage !== 'rejected';

                return (
                  <div key={item.key} className="flex sm:flex-col items-center gap-3 sm:text-center flex-1">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-black transition-all ${
                        isCurrent
                          ? 'bg-[#70C100] text-black ring-4 ring-[#70C100]/25 shadow-md'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
                      }`}
                    >
                      {isPassed && !isCurrent ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                    </div>
                    <div>
                      <p
                        className={`text-xs ${
                          isCurrent
                            ? 'font-bold text-[#4e8500] dark:text-[#84e000]'
                            : isPassed
                            ? 'font-semibold text-gray-800 dark:text-gray-200'
                            : 'text-gray-400 dark:text-gray-500 font-medium'
                        }`}
                      >
                        {item.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status Details Box */}
          <div className="rounded-2xl bg-gray-50 dark:bg-gray-800/60 p-4 border border-gray-100 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-300 space-y-1.5">
            <p className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-[#559400] dark:text-[#84e000]" />
              Latest Status Note:
            </p>
            <p>
              Your profile is actively progressing through our recruitment stages. Our talent team reviews applications daily and will reach out with interview details or video links via email.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};

