import React, { useEffect, useState } from 'react';
import { applicationApi } from '../api/applicationApi';
import { jobApi } from '../api/jobApi';
import { STAGES } from '../utils/constants';
import { StatusBadge } from '../components/common/StatusBadge';
import { CandidateDrawer } from '../components/ui/CandidateDrawer';
import { ScheduleMeetingModal } from '../components/ui/ScheduleMeetingModal';
import { ScorecardModal } from '../components/ui/ScorecardModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Skeleton } from '../components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { formatCurrency, formatDate } from '../utils/formatters';
import { DataTable, DataTableColumnHeader } from '../components/ui/data-table';
import {
  Users,
  Search,
  Filter,
  Download,
  Calendar,
  Star,
  Trash2,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  FileText
} from 'lucide-react';

export const AdminCandidatesPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Server-side Pagination & Filters
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
    hasNextPage: false,
    hasPrevPage: false
  });

  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [jobFilter, setJobFilter] = useState('All');
  const [minExp, setMinExp] = useState('');

  // Modals & Drawer
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [scheduleCandidate, setScheduleCandidate] = useState(null);
  const [scorecardCandidate, setScorecardCandidate] = useState(null);

  // Confirm dialog state
  const [confirm, setConfirm] = useState({ open: false, variant: 'danger', title: '', message: '', confirmText: 'Confirm', onConfirm: null, loading: false });

  const openConfirm = (options) => setConfirm({ open: true, loading: false, ...options });
  const closeConfirm = () => setConfirm((prev) => ({ ...prev, open: false, loading: false }));
  const runConfirm = async () => {
    setConfirm((prev) => ({ ...prev, loading: true }));
    try {
      await confirm.onConfirm();
    } finally {
      closeConfirm();
    }
  };


  // Columns definition for Shadcn DataTable
  const columns = React.useMemo(
    () => [
      {
        accessorKey: 'personalInfo.fullName',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Candidate" />
        ),
        cell: ({ row }) => {
          const c = row.original;
          return (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#70C100]/15 dark:bg-[#70C100]/20 text-[#4e8500] dark:text-[#84e000] font-black text-xs uppercase shrink-0">
                {c.personalInfo?.fullName?.charAt(0) || 'C'}
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white">{c.personalInfo?.fullName}</p>
                <p className="text-[11px] text-gray-400 dark:text-gray-500">{c.personalInfo?.email}</p>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'jobTitle',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Role & Dept" />
        ),
        cell: ({ row }) => {
          const c = row.original;
          return (
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{c.jobTitle}</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500">{c.department}</p>
            </div>
          );
        },
      },
      {
        accessorKey: 'experience.totalYears',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Experience" />
        ),
        cell: ({ row }) => (
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {row.original.experience?.totalYears || 0} yrs
          </span>
        ),
      },
      {
        accessorKey: 'matchScore',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Match" />
        ),
        cell: ({ row }) => (
          <span className="rounded-md bg-[#70C100]/15 dark:bg-[#70C100]/15 px-2 py-0.5 text-[10px] font-bold text-[#4e8500] dark:text-[#84e000] border border-[#70C100]/30">
            {row.original.matchScore || 85}%
          </span>
        ),
      },
      {
        accessorKey: 'stage',
        header: 'Stage',
        cell: ({ row }) => (
          <div onClick={(e) => e.stopPropagation()}>
            <StatusBadge stage={row.original.stage} size="xs" />
          </div>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Applied" />
        ),
        cell: ({ row }) => (
          <span className="text-gray-500 dark:text-gray-400 text-[11px]">
            {formatDate(row.original.createdAt)}
          </span>
        ),
      },
      {
        id: 'actions',
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
          const c = row.original;
          return (
            <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => setScheduleCandidate(c)}
                title="Schedule Interview"
                className="rounded-lg p-1.5 text-gray-400 hover:bg-[#70C100]/15 dark:hover:bg-gray-800 hover:text-[#4e8500] dark:hover:text-[#84e000] transition-colors cursor-pointer"
              >
                <Calendar className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setScorecardCandidate(c)}
                title="Score Candidate"
                className="rounded-lg p-1.5 text-gray-400 hover:bg-amber-50 dark:hover:bg-gray-800 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
              >
                <Star className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDeleteCandidate(c._id)}
                title="Move to Recycle Bin"
                className="rounded-lg p-1.5 text-gray-400 hover:bg-rose-50 dark:hover:bg-gray-800 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        },
      },
    ],
    []
  );


  const loadCandidates = async () => {
    setLoading(true);
    try {
      const [candRes, jobsRes] = await Promise.all([
        applicationApi.getApplications({
          search,
          stage: stageFilter,
          jobId: jobFilter,
          minExperience: minExp || undefined,
          page,
          limit
        }),
        jobApi.getJobs({ all: true })
      ]);
      setCandidates(candRes.data.applications || []);
      if (candRes.data.pagination) {
        setPagination(candRes.data.pagination);
      }
      setJobs(jobsRes.data.jobs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Reset to page 1 when search or filters change
  useEffect(() => {
    setPage(1);
  }, [search, stageFilter, jobFilter, minExp]);

  useEffect(() => {
    loadCandidates();
  }, [search, stageFilter, jobFilter, minExp, page, limit]);


  const handleStageChange = async (id, newStage) => {
    try {
      await applicationApi.updateStage(id, newStage);
      loadCandidates();
      if (selectedCandidate && selectedCandidate._id === id) {
        setSelectedCandidate({ ...selectedCandidate, stage: newStage });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCandidate = (id) => {
    openConfirm({
      variant: 'warning',
      title: 'Move to Recycle Bin?',
      message: 'This candidate application will be moved to the Recycle Bin. You can restore it later from the Recycle Bin page.',
      confirmText: 'Move to Bin',
      onConfirm: async () => {
        await applicationApi.moveToRecycleBin(id);
        setSelectedCandidate(null);
        loadCandidates();
      },
    });
  };

  const handleExportCSV = () => {
    if (candidates.length === 0) return;
    const headers = ['RefNumber', 'FullName', 'Email', 'Phone', 'Role', 'Department', 'ExperienceYrs', 'Stage', 'MatchScore'];
    const rows = candidates.map((c) => [
      c.applicationNumber,
      `"${c.personalInfo?.fullName || ''}"`,
      c.personalInfo?.email || '',
      c.personalInfo?.phone || '',
      `"${c.jobTitle || ''}"`,
      `"${c.department || ''}"`,
      c.experience?.totalYears || 0,
      c.stage,
      c.matchScore || 85
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `KADY_Candidates_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Candidate Talent Pool</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Review applicant profiles, stage progression, match scores, and interview histories
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 rounded-xl border border-gray-300 dark:border-gray-750 bg-white dark:bg-gray-800 px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 shadow-2xs hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
        >
          <Download className="h-3.5 w-3.5" />
          Export Candidates CSV
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-2xs space-y-3 text-xs transition-colors">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search candidate name, email, skills, or reference..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 py-2.5 pl-10 pr-3 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:bg-white dark:focus:bg-gray-800 focus:border-[#70C100] focus:ring-1 focus:ring-[#70C100] focus:outline-hidden transition-all"
            />
          </div>

          {/* Filter by Job */}
          <div>
            <Select
              items={[{ label: 'All Job Requisitions', value: 'All' }, ...jobs.map((j) => ({ label: j.title, value: j._id }))]}
              value={jobFilter}
              onValueChange={(val) => setJobFilter(val)}
            >
              <SelectTrigger className="w-full h-[38px] rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs font-medium cursor-pointer focus:border-[#70C100]">
                <SelectValue placeholder="All Job Requisitions" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-xs shadow-xl">
                <SelectItem value="All">All Job Requisitions</SelectItem>
                {jobs.map((j) => (
                  <SelectItem key={j._id} value={j._id}>
                    {j.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filter by Stage */}
          <div>
            <Select
              items={[{ label: 'All Stages', value: 'All' }, ...STAGES.map((s) => ({ label: s.label, value: s.key }))]}
              value={stageFilter}
              onValueChange={(val) => setStageFilter(val)}
            >
              <SelectTrigger className="w-full h-[38px] rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs font-medium cursor-pointer focus:border-[#70C100]">
                <SelectValue placeholder="All Stages" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-xs shadow-xl">
                <SelectItem value="All">All Stages</SelectItem>
                {STAGES.map((s) => (
                  <SelectItem key={s.key} value={s.key}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Candidate Data Table powered by Shadcn DataTable with Server-Side Pagination */}
      <DataTable
        columns={columns}
        data={candidates}
        loading={loading}
        emptyMessage="No candidates match the selected filters."
        onRowClick={(candidate) => setSelectedCandidate(candidate)}
        showPagination={true}
        pageSize={limit}
        pageSizeOptions={[5, 10, 20, 50]}
        serverPagination={{
          page,
          pageSize: limit,
          total: pagination.total,
          totalPages: pagination.pages,
          onPageChange: (newPage) => setPage(newPage),
          onPageSizeChange: (newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }
        }}
      />



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

      {/* Schedule Interview Modal */}
      <ScheduleMeetingModal
        isOpen={!!scheduleCandidate}
        candidate={scheduleCandidate}
        onClose={() => setScheduleCandidate(null)}
        onSuccess={loadCandidates}
      />

      {/* Scorecard Modal */}
      <ScorecardModal
        isOpen={!!scorecardCandidate}
        candidate={scorecardCandidate}
        onClose={() => setScorecardCandidate(null)}
        onSuccess={loadCandidates}
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirm.open}
        onClose={closeConfirm}
        onConfirm={runConfirm}
        title={confirm.title}
        message={confirm.message}
        variant={confirm.variant}
        confirmText={confirm.confirmText}
        loading={confirm.loading}
      />
    </div>
  );
};
