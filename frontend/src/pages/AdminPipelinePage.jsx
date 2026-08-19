import React, { useEffect, useState } from 'react';
import { applicationApi } from '../api/applicationApi';
import { jobApi } from '../api/jobApi';
import { KanbanBoard } from '../components/ui/KanbanBoard';
import { CandidateDrawer } from '../components/ui/CandidateDrawer';
import { ScheduleMeetingModal } from '../components/ui/ScheduleMeetingModal';
import { ScorecardModal } from '../components/ui/ScorecardModal';
import { Skeleton } from '../components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Filter, GitPullRequest, RefreshCw } from 'lucide-react';

export const AdminPipelinePage = () => {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('All');
  const [loading, setLoading] = useState(true);

  // Modals & Drawer
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [scheduleCandidate, setScheduleCandidate] = useState(null);
  const [scorecardCandidate, setScorecardCandidate] = useState(null);

  const loadPipeline = async () => {
    setLoading(true);
    try {
      const [appsRes, jobsRes] = await Promise.all([
        applicationApi.getApplications({ jobId: selectedJob, limit: 100 }),
        jobApi.getJobs({ all: true })
      ]);
      setApplications(appsRes.data.applications || []);
      setJobs(jobsRes.data.jobs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPipeline();
  }, [selectedJob]);

  const handleStageChange = async (id, newStage) => {
    try {
      await applicationApi.updateStage(id, newStage);
      loadPipeline();
      if (selectedCandidate && selectedCandidate._id === id) {
        setSelectedCandidate({ ...selectedCandidate, stage: newStage });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCandidate = async (id) => {
    try {
      await applicationApi.moveToRecycleBin(id);
      setSelectedCandidate(null);
      loadPipeline();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Interactive Interview Pipeline</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Visual recruitment pipeline across all candidate screening and evaluation stages
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-56">
            <Select
              items={[{ label: 'All Job Requisitions', value: 'All' }, ...jobs.map((j) => ({ label: j.title, value: j._id }))]}
              value={selectedJob}
              onValueChange={(val) => setSelectedJob(val)}
            >
              <SelectTrigger className="w-full h-[36px] rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs font-semibold shadow-2xs cursor-pointer">
                <SelectValue placeholder="All Job Requisitions" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs">
                <SelectItem value="All">All Job Requisitions</SelectItem>
                {jobs.map((j) => (
                  <SelectItem key={j._id} value={j._id}>
                    {j.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <button
            type="button"
            onClick={loadPipeline}
            className="rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-2xs cursor-pointer transition-colors"
            title="Refresh Pipeline"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-2xs">
        {loading ? (
          <div className="flex scroll-fade-x gap-4 overflow-x-auto pb-4 pt-1">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex flex-col w-72 shrink-0 rounded-2xl bg-gray-100/75 dark:bg-gray-900/80 p-3 border border-gray-200/80 dark:border-gray-800 space-y-3"
              >
                <div className="flex items-center justify-between px-2 py-1">
                  <Skeleton className="h-4 w-24 rounded" />
                  <Skeleton className="h-5 w-5 rounded-full" />
                </div>
                <div className="space-y-2.5">
                  <div className="rounded-xl border border-gray-200/90 dark:border-gray-700/80 bg-white dark:bg-gray-800 p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-3.5 w-28 rounded" />
                      <Skeleton className="h-4 w-10 rounded" />
                    </div>
                    <Skeleton className="h-3 w-36 rounded" />
                    <div className="flex gap-1">
                      <Skeleton className="h-4 w-12 rounded" />
                      <Skeleton className="h-4 w-12 rounded" />
                    </div>
                  </div>
                  <div className="rounded-xl border border-gray-200/90 dark:border-gray-700/80 bg-white dark:bg-gray-800 p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-3.5 w-32 rounded" />
                      <Skeleton className="h-4 w-10 rounded" />
                    </div>
                    <Skeleton className="h-3 w-28 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <KanbanBoard
            applications={applications}
            onCandidateClick={(c) => setSelectedCandidate(c)}
            onStageChange={handleStageChange}
            onScheduleMeeting={(c) => setScheduleCandidate(c)}
          />
        )}
      </div>



      {/* Candidate Profile Drawer */}
      <CandidateDrawer
        candidate={selectedCandidate}
        isOpen={!!selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        onStageChange={handleStageChange}
        onScheduleInterview={(c) => {
          setSelectedCandidate(null);
          setScheduleCandidate(c);
        }}
        onOpenScorecard={(c) => {
          setSelectedCandidate(null);
          setScorecardCandidate(c);
        }}
        onDelete={handleDeleteCandidate}
      />

      {/* Schedule Modal */}
      <ScheduleMeetingModal
        isOpen={!!scheduleCandidate}
        candidate={scheduleCandidate}
        onClose={() => setScheduleCandidate(null)}
        onSuccess={loadPipeline}
      />

      {/* Scorecard Modal */}
      <ScorecardModal
        isOpen={!!scorecardCandidate}
        candidate={scorecardCandidate}
        onClose={() => setScorecardCandidate(null)}
        onSuccess={loadPipeline}
      />
    </div>
  );
};
