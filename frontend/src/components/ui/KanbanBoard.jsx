import React from 'react';
import { STAGES } from '../../utils/constants';
import { Calendar, User } from 'lucide-react';

export const KanbanBoard = ({
  applications = [],
  onCandidateClick,
  onStageChange,
  onScheduleMeeting
}) => {
  // Group applications by stage
  const columns = STAGES.map((stage) => {
    return {
      ...stage,
      candidates: applications.filter((app) => app.stage === stage.key)
    };
  });

  return (
    <div className="flex scroll-fade-x overflow-x-auto pb-4 pt-1 snap-x">
      {columns.map((column) => (
        <div
          key={column.key}
          className="flex flex-col w-72 shrink-0 rounded-2xl bg-gray-100/75 dark:bg-gray-900/80 p-3 border border-gray-200/80 dark:border-gray-800 snap-start"
        >
          {/* Column Header */}
          <div className="flex items-center justify-between px-2 py-1.5 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-900 dark:text-gray-100 tracking-tight">{column.label}</span>
              <span className="flex h-5 min-w-5 px-1.5 items-center justify-center rounded-full bg-white dark:bg-gray-800 text-[11px] font-bold text-gray-700 dark:text-gray-300 shadow-2xs border border-gray-200 dark:border-gray-700">
                {column.candidates.length}
              </span>
            </div>
          </div>

          {/* Cards List */}
          <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
            {column.candidates.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700/80 bg-white/40 dark:bg-gray-900/30 py-8 text-center">
                <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">No candidates</p>
              </div>
            ) : (
              column.candidates.map((candidate) => (
                <div
                  key={candidate._id}
                  onClick={() => onCandidateClick(candidate)}
                  className="group relative rounded-xl border border-gray-200/90 dark:border-gray-700/80 bg-white dark:bg-gray-800 p-3.5 shadow-2xs hover:shadow-md hover:border-[#70C100]/60 transition-all duration-150 cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h5 className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-[#4e8500] dark:group-hover:text-[#84e000] transition-colors">
                      {candidate.personalInfo?.fullName}
                    </h5>
                    <span className="shrink-0 rounded-md bg-[#70C100]/15 dark:bg-[#70C100]/15 px-1.5 py-0.5 text-[10px] font-bold text-[#4e8500] dark:text-[#84e000] border border-[#70C100]/30">
                      {candidate.matchScore || 85}%
                    </span>
                  </div>

                  <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 truncate mb-2.5">
                    {candidate.jobTitle || 'General Applicant'}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {candidate.skills?.slice(0, 3).map((skill, i) => (
                      <span
                        key={i}
                        className="rounded-md bg-gray-100 dark:bg-gray-700/70 px-1.5 py-0.5 text-[10px] text-gray-700 dark:text-gray-200 font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {candidate.skills?.length > 3 && (
                      <span className="rounded-md bg-gray-100 dark:bg-gray-700/70 px-1 py-0.5 text-[9px] text-gray-400 dark:text-gray-400">
                        +{candidate.skills.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700/70 pt-2 text-[10px] text-gray-500 dark:text-gray-400">
                    <span>{candidate.experience?.totalYears || 0} yrs exp</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onScheduleMeeting(candidate);
                      }}
                      title="Schedule Interview"
                      className="rounded-md p-1 text-gray-400 dark:text-gray-400 hover:bg-[#70C100]/15 dark:hover:bg-gray-700 hover:text-[#4e8500] dark:hover:text-[#84e000] transition-colors cursor-pointer"
                    >
                      <Calendar className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
};


