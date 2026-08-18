import React, { useEffect, useState } from 'react';
import { analyticsApi } from '../api/aiApi';
import { applicationApi } from '../api/applicationApi';
import { meetingApi } from '../api/meetingApi';
import { StatusBadge } from '../components/common/StatusBadge';
import { CandidateDrawer } from '../components/ui/CandidateDrawer';
import { ScheduleMeetingModal } from '../components/ui/ScheduleMeetingModal';
import { ScorecardModal } from '../components/ui/ScorecardModal';
import { Skeleton } from '../components/ui/skeleton';
import { formatDateTime, formatDate } from '../utils/formatters';
import {
  Users,
  Briefcase,
  GitPullRequest,
  UserCheck,
  Clock,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  TrendingUp,
  Video
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

const COLORS = ['#70C100', '#84e000', '#5fa400', '#4d7c0f', '#22c55e', '#15803d'];

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [recentApplications, setRecentApplications] = useState([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Drawer & Modal states
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [scheduleCandidate, setScheduleCandidate] = useState(null);
  const [scorecardCandidate, setScorecardCandidate] = useState(null);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, appsRes, meetingsRes] = await Promise.all([
        analyticsApi.getDashboardStats(),
        applicationApi.getApplications({ limit: 5 }),
        meetingApi.getMeetings({ status: 'scheduled' })
      ]);
      setStats(statsRes.data);
      setRecentApplications(appsRes.data.applications || []);
      setUpcomingMeetings(meetingsRes.data.meetings || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleStageChange = async (id, stage) => {
    try {
      await applicationApi.updateStage(id, stage);
      loadDashboardData();
      if (selectedCandidate && selectedCandidate._id === id) {
        setSelectedCandidate({ ...selectedCandidate, stage });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCandidate = async (id) => {
    try {
      await applicationApi.moveToRecycleBin(id);
      setSelectedCandidate(null);
      loadDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-3.5 w-24 rounded" />
                <Skeleton className="h-10 w-10 rounded-xl" />
              </div>
              <Skeleton className="h-7 w-16 rounded-lg" />
              <Skeleton className="h-3 w-28 rounded" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-2xs space-y-4">
            <Skeleton className="h-5 w-48 rounded" />
            <Skeleton className="h-3.5 w-64 rounded" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-2xs space-y-4">
            <Skeleton className="h-5 w-40 rounded" />
            <Skeleton className="h-3.5 w-52 rounded" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-2xs space-y-4">
            <Skeleton className="h-5 w-48 rounded" />
            <div className="space-y-3 pt-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-800 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-xl" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-32 rounded" />
                      <Skeleton className="h-3 w-44 rounded" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-20 rounded-md" />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-2xs space-y-4">
            <Skeleton className="h-5 w-40 rounded" />
            <div className="space-y-3 pt-2">
              {[1, 2].map((i) => (
                <div key={i} className="p-4 border border-gray-100 dark:border-gray-800 rounded-xl space-y-2">
                  <Skeleton className="h-4 w-28 rounded" />
                  <Skeleton className="h-5 w-36 rounded" />
                  <Skeleton className="h-3.5 w-48 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const metrics = stats?.metrics || {};

  return (
    <div className="space-y-8">
      {/* Top Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-2xs flex items-center justify-between transition-colors">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Total Candidates
            </span>
            <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{metrics.totalApplications || 0}</p>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
              <TrendingUp className="h-3 w-3" />
              +14% vs last month
            </span>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#70C100]/15 text-[#4e8500] dark:text-[#84e000]">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-2xs flex items-center justify-between transition-colors">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Active Job Openings
            </span>
            <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{metrics.activeJobs || 0}</p>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 block">Across departments</span>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <Briefcase className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-2xs flex items-center justify-between transition-colors">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              In Interview Pipeline
            </span>
            <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{metrics.interviewingCount || 0}</p>
            <span className="text-[10px] text-[#4e8500] dark:text-[#84e000] font-semibold mt-1 block">Active rounds</span>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
            <GitPullRequest className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-2xs flex items-center justify-between transition-colors">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Selected / Hired
            </span>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{metrics.hiredCount || 0}</p>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 block">Offer accepted: 92%</span>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#70C100]/15 text-[#4e8500] dark:text-[#84e000]">
            <UserCheck className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recruitment Funnel */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-2xs space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Recruitment Funnel & Pipeline Velocity</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Conversion stages of active applicants</p>
            </div>
            <span className="rounded-md bg-[#70C100]/15 px-2 py-1 text-[11px] font-bold text-[#4e8500] dark:text-[#84e000]">
              Live Data
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.funnelData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="stage" tick={{ fontSize: 11, fill: 'currentColor' }} />
                <YAxis tick={{ fontSize: 11, fill: 'currentColor' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#030712',
                    borderColor: '#1f2937',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="candidates" fill="#70C100" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Applications by Department */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-2xs space-y-4 transition-colors">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Department Distribution</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Applicant volume breakdown</p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.departmentData || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {stats?.departmentData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#030712',
                    borderColor: '#1f2937',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables Grid: Recent Applications & Scheduled Interviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-2xs space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Recent Candidate Applications</h3>
            <a href="/admin/candidates" className="text-xs font-semibold text-[#4e8500] dark:text-[#84e000] hover:underline">
              View All Candidates →
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/75 dark:bg-gray-800/60 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase border-y border-gray-100 dark:border-gray-800">
                <tr>
                  <th className="py-2.5 px-3">Candidate</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Match</th>
                  <th className="py-2.5 px-3">Stage</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {recentApplications.map((app) => (
                  <tr
                    key={app._id}
                    onClick={() => setSelectedCandidate(app)}
                    className="hover:bg-gray-50/70 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-3">
                      <p className="font-bold text-gray-900 dark:text-white">{app.personalInfo?.fullName}</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">{app.personalInfo?.email}</p>
                    </td>
                    <td className="py-3 px-3 font-medium text-gray-700 dark:text-gray-300">{app.jobTitle}</td>
                    <td className="py-3 px-3">
                      <span className="rounded bg-[#70C100]/15 dark:bg-[#70C100]/15 px-1.5 py-0.5 text-[10px] font-bold text-[#4e8500] dark:text-[#84e000]">
                        {app.matchScore || 85}%
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge stage={app.stage} size="xs" />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        className="font-semibold text-[#4e8500] dark:text-[#84e000] hover:underline text-xs"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Scheduled Interviews */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-2xs space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Upcoming Interviews</h3>
            <a href="/admin/meetings" className="text-xs font-semibold text-[#4e8500] dark:text-[#84e000] hover:underline">
              Calendar →
            </a>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto">
            {upcomingMeetings.length === 0 ? (
              <p className="text-xs text-gray-400 dark:text-gray-500 py-6 text-center">No upcoming interviews today.</p>
            ) : (
              upcomingMeetings.map((meeting) => (
                <div
                  key={meeting._id}
                  className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/50 p-3 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 dark:text-white">{meeting.candidateName}</span>
                    <span className="rounded bg-[#70C100]/15 dark:bg-[#70C100]/15 px-1.5 py-0.5 text-[10px] font-bold text-[#4e8500] dark:text-[#84e000]">
                      {meeting.round}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">{meeting.jobTitle}</p>
                  <div className="flex items-center justify-between pt-1 text-[11px] text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-gray-400" />
                      {formatDateTime(meeting.scheduledAt)}
                    </span>
                    <a
                      href={meeting.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#4e8500] dark:text-[#84e000] font-semibold hover:underline flex items-center gap-0.5"
                    >
                      <Video className="h-3 w-3" />
                      Join
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>



      {/* Candidate Drawer */}
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
        onSuccess={loadDashboardData}
      />

      {/* Scorecard Modal */}
      <ScorecardModal
        isOpen={!!scorecardCandidate}
        candidate={scorecardCandidate}
        onClose={() => setScorecardCandidate(null)}
        onSuccess={loadDashboardData}
      />
    </div>
  );
};
