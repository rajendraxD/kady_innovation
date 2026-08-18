import React, { useEffect, useState } from 'react';
import { jobApi } from '../api/jobApi';
import { DEPARTMENTS, WORKPLACE_TYPES, EMPLOYMENT_TYPES, EXPERIENCE_LEVELS } from '../utils/constants';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { JDGeneratorModal } from '../components/ui/JDGeneratorModal';
import { Skeleton } from '../components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { DataTable, DataTableColumnHeader } from '../components/ui/data-table';
import {
  Briefcase,
  Plus,
  Sparkles,
  Search,
  Edit2,
  Trash2,
  Users,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';



export const AdminJobsPage = () => {
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
  const [deptFilter, setDeptFilter] = useState('All');


  // Create / Edit modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJDModalOpen, setIsJDModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

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

  const [formData, setFormData] = useState({
    title: '',
    department: 'Engineering',
    location: 'Bengaluru / Remote',
    workplaceType: 'Remote',
    employmentType: 'Full-time',
    experienceLevel: 'Mid-level',
    salaryMin: 1500000,
    salaryMax: 2500000,
    currency: 'INR',
    description: '',
    responsibilities: '',
    requirements: '',
    skills: '',
    vacancies: 1,
    status: 'active'
  });

  const columns = React.useMemo(
    () => [
      {
        accessorKey: 'title',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Role Title" />
        ),
        cell: ({ row }) => {
          const job = row.original;
          return (
            <div>
              <p className="font-bold text-gray-900 dark:text-white">{job.title}</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-normal">{job.location}</p>
            </div>
          );
        },
      },
      {
        accessorKey: 'department',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Department" />
        ),
        cell: ({ row }) => (
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            {row.original.department}
          </span>
        ),
      },
      {
        accessorKey: 'workplaceType',
        header: 'Workplace',
        cell: ({ row }) => (
          <span className="rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-[11px] font-semibold text-gray-700 dark:text-gray-300">
            {row.original.workplaceType}
          </span>
        ),
      },
      {
        accessorKey: 'applicantsCount',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Applicants" />
        ),
        cell: ({ row }) => (
          <span className="inline-flex items-center gap-1 font-bold text-[#4e8500] dark:text-[#84e000] bg-[#70C100]/15 dark:bg-[#70C100]/15 px-2 py-0.5 rounded-md">
            <Users className="h-3 w-3" />
            {row.original.applicantsCount || 0}
          </span>
        ),
      },
      {
        id: 'compensation',
        header: 'Compensation',
        cell: ({ row }) => (
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {formatCurrency(row.original.salaryMin)} - {formatCurrency(row.original.salaryMax)}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.original.status || 'active';
          return (
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                status === 'active'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'
              }`}
            >
              {status.toUpperCase()}
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
            <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => handleOpenEdit(job)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-[#4e8500] dark:hover:text-[#84e000] transition-colors cursor-pointer"
                title="Edit Job"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleDeleteJob(job._id)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                title="Delete Job"
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


  const loadJobs = async () => {
    setLoading(true);
    try {
      const res = await jobApi.getJobs({
        all: true,
        search,
        department: deptFilter,
        page,
        limit
      });
      setJobs(res.data.jobs || []);
      if (res.data.pagination) {
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Reset to page 1 on filter changes
  useEffect(() => {
    setPage(1);
  }, [search, deptFilter]);

  useEffect(() => {
    loadJobs();
  }, [search, deptFilter, page, limit]);


  const handleOpenCreate = () => {
    setEditingJob(null);
    setFormData({
      title: '',
      department: 'Engineering',
      location: 'Remote',
      workplaceType: 'Remote',
      employmentType: 'Full-time',
      experienceLevel: 'Mid-level',
      salaryMin: 1500000,
      salaryMax: 2500000,
      currency: 'INR',
      description: '',
      responsibilities: '',
      requirements: '',
      skills: 'React, Node.js, TypeScript',
      vacancies: 1,
      status: 'active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      department: job.department,
      location: job.location,
      workplaceType: job.workplaceType,
      employmentType: job.employmentType,
      experienceLevel: job.experienceLevel,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      currency: job.currency || 'INR',
      description: job.description,
      responsibilities: job.responsibilities?.join('\n') || '',
      requirements: job.requirements?.join('\n') || '',
      skills: job.skills?.join(', ') || '',
      vacancies: job.vacancies || 1,
      status: job.status || 'active'
    });
    setIsModalOpen(true);
  };

  const handleSaveJob = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        responsibilities: formData.responsibilities.split('\n').map((r) => r.trim()).filter(Boolean),
        requirements: formData.requirements.split('\n').map((r) => r.trim()).filter(Boolean),
        skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean)
      };

      if (editingJob) {
        await jobApi.updateJob(editingJob._id, payload);
      } else {
        await jobApi.createJob(payload);
      }
      setIsModalOpen(false);
      loadJobs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteJob = (id) => {
    openConfirm({
      variant: 'danger',
      title: 'Delete Job Requisition?',
      message: 'This job opening will be moved to the Recycle Bin. All associated candidate applications will remain intact.',
      confirmText: 'Move to Bin',
      onConfirm: async () => {
        await jobApi.deleteJob(id);
        loadJobs();
      },
    });
  };

  const handleApplyJD = (generatedJD) => {
    setFormData({
      ...formData,
      title: generatedJD.title || formData.title,
      department: generatedJD.department || formData.department,
      experienceLevel: generatedJD.experienceLevel || formData.experienceLevel,
      description: generatedJD.description || formData.description,
      responsibilities: generatedJD.responsibilities?.join('\n') || formData.responsibilities,
      requirements: generatedJD.requirements?.join('\n') || formData.requirements,
      skills: generatedJD.skills?.join(', ') || formData.skills,
      salaryMin: generatedJD.salaryMin || formData.salaryMin,
      salaryMax: generatedJD.salaryMax || formData.salaryMax
    });
    setIsModalOpen(true);
  };


  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.department.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === 'All' || job.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Job Requisitions Management</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Create, manage, and post active hiring requisitions</p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsJDModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#70C100]/30 bg-[#70C100]/10 px-3.5 py-2 text-xs font-bold text-[#4e8500] dark:text-[#84e000] shadow-2xs hover:bg-[#70C100]/20 transition-colors cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Generate AI Requisition
          </button>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#70C100] hover:bg-[#62aa00] px-4 py-2 text-xs font-black text-black shadow-md shadow-[#70C100]/20 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Job Opening
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3.5 shadow-2xs flex flex-col sm:flex-row gap-3 transition-colors">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search requisitions by title or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 py-2 pl-9 pr-3 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:bg-white dark:focus:bg-gray-800 focus:border-[#70C100] focus:outline-hidden"
          />
        </div>

        <div className="w-full sm:w-52">
          <Select
            items={DEPARTMENTS.map((d) => ({ label: d, value: d }))}
            value={deptFilter}
            onValueChange={(val) => setDeptFilter(val)}
          >
            <SelectTrigger className="w-full h-[36px] rounded-xl border border-gray-200 dark:border-gray-750 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs font-medium cursor-pointer">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs">
              {DEPARTMENTS.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>


      {/* Jobs Data Table powered by Shadcn DataTable with Server-Side Pagination */}
      <DataTable
        columns={columns}
        data={jobs}
        loading={loading}
        emptyMessage="No job requisitions found matching your filter criteria."
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



      {/* Create / Edit Job Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingJob ? 'Edit Job Requisition' : 'Create New Job Requisition'}
        subtitle="Specify role parameters, qualifications, and responsibilities"
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSaveJob} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Job Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 focus:border-[#70C100] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Department *</label>
              <Select
                items={DEPARTMENTS.filter((d) => d !== 'All').map((d) => ({ label: d, value: d }))}
                value={formData.department}
                onValueChange={(val) => setFormData({ ...formData, department: val })}
              >
                <SelectTrigger className="w-full h-[38px] rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs cursor-pointer">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs">
                  {DEPARTMENTS.filter((d) => d !== 'All').map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Location *</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 focus:border-[#70C100] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Workplace Policy</label>
              <Select
                items={['Remote', 'Hybrid', 'On-site'].map((w) => ({ label: w, value: w }))}
                value={formData.workplaceType}
                onValueChange={(val) => setFormData({ ...formData, workplaceType: val })}
              >
                <SelectTrigger className="w-full h-[38px] rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs cursor-pointer">
                  <SelectValue placeholder="Select workplace policy" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs">
                  <SelectItem value="Remote">Remote</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                  <SelectItem value="On-site">On-site</SelectItem>
                </SelectContent>
              </Select>
            </div>


            <div>
              <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Min Salary (INR / yr)</label>
              <input
                type="number"
                value={formData.salaryMin}
                onChange={(e) => setFormData({ ...formData, salaryMin: parseInt(e.target.value, 10) || 0 })}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 focus:border-[#70C100] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Max Salary (INR / yr)</label>
              <input
                type="number"
                value={formData.salaryMax}
                onChange={(e) => setFormData({ ...formData, salaryMax: parseInt(e.target.value, 10) || 0 })}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 focus:border-[#70C100] focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Job Description *</label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 focus:border-[#70C100] focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Key Responsibilities (One per line)</label>
              <textarea
                rows={4}
                value={formData.responsibilities}
                onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 focus:border-[#70C100] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Requirements & Qualifications (One per line)</label>
              <textarea
                rows={4}
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 focus:border-[#70C100] focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Required Skills (Comma separated)</label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 focus:border-[#70C100] focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="rounded-xl border border-gray-300 dark:border-gray-750 bg-white dark:bg-gray-800 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#70C100] hover:bg-[#62aa00] px-5 py-2 text-xs font-black text-black shadow-md shadow-[#70C100]/25 cursor-pointer transition-colors"
            >
              {editingJob ? 'Save Changes' : 'Create Requisition'}
            </button>
          </div>
        </form>
      </Modal>

      {/* AI JD Generator Modal */}

      <JDGeneratorModal
        isOpen={isJDModalOpen}
        onClose={() => setIsJDModalOpen(false)}
        onApplyJD={handleApplyJD}
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

