import React, { useEffect, useState, useMemo } from 'react';
import { recycleBinApi } from '../api/recycleBinApi';
import { getRetentionBadge, formatDate, formatCurrency } from '../utils/formatters';
import { DataTable, DataTableColumnHeader } from '../components/ui/data-table';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Trash2, RotateCcw, ShieldAlert, Users, Briefcase, Search, Building } from 'lucide-react';

export const AdminRecycleBinPage = () => {
  const [activeTab, setActiveTab] = useState('candidates'); // 'candidates' | 'jobs'
  const [candidateTrash, setCandidateTrash] = useState([]);
  const [jobTrash, setJobTrash] = useState([]);
  const [retentionDays, setRetentionDays] = useState(60);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Confirm dialog state
  const [confirm, setConfirm] = useState({ open: false, variant: 'danger', title: '', message: '', onConfirm: null, loading: false });

  const openConfirm = (options) => setConfirm({ ...confirm, open: true, loading: false, ...options });
  const closeConfirm = () => setConfirm((prev) => ({ ...prev, open: false, loading: false }));
  const runConfirm = async () => {
    setConfirm((prev) => ({ ...prev, loading: true }));
    try {
      await confirm.onConfirm();
    } finally {
      closeConfirm();
    }
  };

  const loadTrash = async () => {
    setLoading(true);
    try {
      const res = await recycleBinApi.getTrash();
      setCandidateTrash(res.data.candidates || res.data.trash || []);
      setJobTrash(res.data.jobs || []);
      setRetentionDays(res.data.defaultRetention || 60);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrash();
  }, []);

  // Candidate Actions
  const handleRestoreCandidate = (id) => {
    openConfirm({
      variant: 'primary',
      title: 'Restore Candidate?',
      message: 'This candidate profile will be moved back to the active candidates list and resume normal processing.',
      confirmText: 'Yes, Restore',
      onConfirm: async () => {
        await recycleBinApi.restoreApplication(id);
        loadTrash();
      },
    });
  };

  const handlePermanentDeleteCandidate = (id) => {
    openConfirm({
      variant: 'danger',
      title: 'Permanently Delete Candidate?',
      message: 'This candidate profile will be permanently wiped from the system. This action is irreversible and cannot be undone.',
      confirmText: 'Delete Permanently',
      onConfirm: async () => {
        await recycleBinApi.permanentDelete(id);
        loadTrash();
      },
    });
  };

  const handleEmptyCandidateTrash = () => {
    openConfirm({
      variant: 'danger',
      title: 'Empty Candidates Trash?',
      message: `All ${candidateTrash.length} deleted candidate records will be permanently purged. This action cannot be undone.`,
      confirmText: 'Purge All Candidates',
      onConfirm: async () => {
        await recycleBinApi.emptyTrash();
        loadTrash();
      },
    });
  };

  // Job Actions
  const handleRestoreJob = (id) => {
    openConfirm({
      variant: 'primary',
      title: 'Restore Job Opening?',
      message: 'This job requisition will be restored and made active again in the Job Openings list.',
      confirmText: 'Yes, Restore',
      onConfirm: async () => {
        await recycleBinApi.restoreJob(id);
        loadTrash();
      },
    });
  };

  const handlePermanentDeleteJob = (id) => {
    openConfirm({
      variant: 'danger',
      title: 'Permanently Delete Job?',
      message: 'This job requisition will be permanently wiped from the system. This action is irreversible and cannot be undone.',
      confirmText: 'Delete Permanently',
      onConfirm: async () => {
        await recycleBinApi.permanentDeleteJob(id);
        loadTrash();
      },
    });
  };

  const handleEmptyJobTrash = () => {
    openConfirm({
      variant: 'danger',
      title: 'Empty Jobs Trash?',
      message: `All ${jobTrash.length} deleted job requisitions will be permanently purged. This action cannot be undone.`,
      confirmText: 'Purge All Jobs',
      onConfirm: async () => {
        await recycleBinApi.emptyJobsTrash();
        loadTrash();
      },
    });
  };

  // Filtered lists
  const filteredCandidates = useMemo(() => {
    return candidateTrash.filter(
      (item) =>
        item.personalInfo?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        item.jobTitle?.toLowerCase().includes(search.toLowerCase()) ||
        item.applicationNumber?.toLowerCase().includes(search.toLowerCase()) ||
        item.personalInfo?.email?.toLowerCase().includes(search.toLowerCase())
    );
  }, [candidateTrash, search]);

  const filteredJobs = useMemo(() => {
    return jobTrash.filter(
      (job) =>
        job.title?.toLowerCase().includes(search.toLowerCase()) ||
        job.department?.toLowerCase().includes(search.toLowerCase()) ||
        job.workplaceType?.toLowerCase().includes(search.toLowerCase()) ||
        job.employmentType?.toLowerCase().includes(search.toLowerCase())
    );
  }, [jobTrash, search]);

  const candidateColumns = useMemo(
    () => [
      {
        accessorKey: 'personalInfo.fullName',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Candidate Details" />
        ),
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div>
              <p className="font-bold text-gray-900 dark:text-white">{item.personalInfo?.fullName}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">{item.personalInfo?.email}</p>
            </div>
          );
        },
      },
      {
        accessorKey: 'jobTitle',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Role & Reference" />
        ),
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{item.jobTitle}</p>
              <p className="text-[10px] font-mono text-gray-400 dark:text-gray-500">{item.applicationNumber}</p>
            </div>
          );
        },
      },
      {
        accessorKey: 'deletedAt',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Deleted Date" />
        ),
        cell: ({ row }) => (
          <span className="text-gray-500 dark:text-gray-400">{formatDate(row.original.deletedAt)}</span>
        ),
      },
      {
        accessorKey: 'daysRemaining',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Retention Status" />
        ),
        cell: ({ row }) => {
          const item = row.original;
          const badge = getRetentionBadge(item.retentionStatus, item.daysRemaining);
          return (
            <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold border ${badge.className}`}>
              {badge.label}
            </span>
          );
        },
      },
      {
        id: 'actions',
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => handleRestoreCandidate(item._id)}
                className="inline-flex items-center gap-1 rounded-lg bg-[#70C100]/15 dark:bg-[#70C100]/15 px-2.5 py-1 text-xs font-bold text-[#4e8500] dark:text-[#84e000] hover:bg-[#70C100]/25 transition-colors cursor-pointer border border-[#70C100]/30"
              >
                <RotateCcw className="h-3 w-3" />
                Restore
              </button>
              <button
                type="button"
                onClick={() => handlePermanentDeleteCandidate(item._id)}
                className="rounded-lg p-1 text-gray-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                title="Permanent Wipe"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        },
      },
    ],
    []
  );

  const jobColumns = useMemo(
    () => [
      {
        accessorKey: 'title',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Job Title & Department" />
        ),
        cell: ({ row }) => {
          const job = row.original;
          return (
            <div>
              <p className="font-bold text-gray-900 dark:text-white">{job.title}</p>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                <Building className="h-3 w-3 text-gray-400" />
                <span>{job.department}</span>
                <span>•</span>
                <span>{job.experienceLevel}</span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'workplaceType',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Workplace & Compensation" />
        ),
        cell: ({ row }) => {
          const job = row.original;
          return (
            <div>
              <div className="flex items-center gap-1.5">
                <span className="rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-[10px] font-semibold text-gray-700 dark:text-gray-300">
                  {job.workplaceType}
                </span>
                <span className="rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-[10px] font-semibold text-gray-700 dark:text-gray-300">
                  {job.employmentType}
                </span>
              </div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                {formatCurrency(job.salaryMin)} - {formatCurrency(job.salaryMax)} / yr
              </p>
            </div>
          );
        },
      },
      {
        accessorKey: 'deletedAt',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Deleted Date" />
        ),
        cell: ({ row }) => (
          <span className="text-gray-500 dark:text-gray-400">{formatDate(row.original.deletedAt)}</span>
        ),
      },
      {
        accessorKey: 'daysRemaining',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Retention Status" />
        ),
        cell: ({ row }) => {
          const job = row.original;
          const badge = getRetentionBadge(job.retentionStatus, job.daysRemaining);
          return (
            <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold border ${badge.className}`}>
              {badge.label}
            </span>
          );
        },
      },
      {
        id: 'actions',
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
          const job = row.original;
          return (
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => handleRestoreJob(job._id)}
                className="inline-flex items-center gap-1 rounded-lg bg-[#70C100]/15 dark:bg-[#70C100]/15 px-2.5 py-1 text-xs font-bold text-[#4e8500] dark:text-[#84e000] hover:bg-[#70C100]/25 transition-colors cursor-pointer border border-[#70C100]/30"
              >
                <RotateCcw className="h-3 w-3" />
                Restore
              </button>
              <button
                type="button"
                onClick={() => handlePermanentDeleteJob(job._id)}
                className="rounded-lg p-1 text-gray-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                title="Permanent Wipe"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        },
      },
    ],
    []
  );

  const activeCount = activeTab === 'candidates' ? candidateTrash.length : jobTrash.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Recycle Bin & Data Retention</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Soft-deleted candidate profiles and job requisitions with automated GDPR lifecycle countdowns
          </p>
        </div>

        {activeCount > 0 && (
          <button
            type="button"
            onClick={activeTab === 'candidates' ? handleEmptyCandidateTrash : handleEmptyJobTrash}
            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/60 px-3.5 py-2 text-xs font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900 transition-colors cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Empty {activeTab === 'candidates' ? 'Candidates' : 'Jobs'} Trash</span>
          </button>
        )}
      </div>

      {/* Retention Policy Banner */}
      <div className="rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/70 dark:bg-amber-950/40 p-4 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
        <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Enterprise GDPR Auto-Purge Policy Active</p>
          <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5">
            Deleted candidate data and job requisitions are securely stored for <strong>{retentionDays} days</strong> before permanent automated wipeout.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('candidates')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'candidates'
              ? 'bg-[#70C100] text-black shadow-xs'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Deleted Candidates ({candidateTrash.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('jobs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'jobs'
              ? 'bg-[#70C100] text-black shadow-xs'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <Briefcase className="h-4 w-4" />
          <span>Deleted Job Openings ({jobTrash.length})</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3 shadow-2xs transition-colors">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder={
              activeTab === 'candidates'
                ? 'Search deleted candidates by name, job, email, or reference...'
                : 'Search deleted jobs by title, department, workplace, or type...'
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 py-2 pl-9 pr-3 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:bg-white dark:focus:bg-gray-800 focus:border-[#70C100] focus:outline-hidden"
          />
        </div>
      </div>

      {/* TAB 1: Candidates Trash Table powered by Shadcn DataTable */}
      {activeTab === 'candidates' && (
        <DataTable
          columns={candidateColumns}
          data={filteredCandidates}
          loading={loading}
          emptyMessage="Recycle bin is clean! No deleted candidate records found."
          showPagination={true}
          pageSize={10}
          pageSizeOptions={[5, 10, 20, 50]}
        />
      )}

      {/* TAB 2: Job Openings Trash Table powered by Shadcn DataTable */}
      {activeTab === 'jobs' && (
        <DataTable
          columns={jobColumns}
          data={filteredJobs}
          loading={loading}
          emptyMessage="Recycle bin is clean! No deleted job requisitions found."
          showPagination={true}
          pageSize={10}
          pageSizeOptions={[5, 10, 20, 50]}
        />
      )}

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

export default AdminRecycleBinPage;
