import React, { useEffect, useState, useMemo } from 'react';
import { applicationApi } from '../api/applicationApi';
import { formatCurrency, formatDate } from '../utils/formatters';
import { DataTable, DataTableColumnHeader } from '../components/ui/data-table';
import { Skeleton } from '../components/ui/skeleton';
import { UserCheck, LayoutGrid, Table as TableIcon } from 'lucide-react';

export const AdminSelectedPage = () => {
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  const loadHiredCandidates = async () => {
    setLoading(true);
    try {
      const res = await applicationApi.getApplications({ stage: 'hired', limit: 100 });
      const offeredRes = await applicationApi.getApplications({ stage: 'offered', limit: 100 });
      const combined = [...(res.data.applications || []), ...(offeredRes.data.applications || [])];
      setSelectedCandidates(combined);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHiredCandidates();
  }, []);

  const columns = useMemo(
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
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-bold text-xs uppercase shrink-0">
                {c.personalInfo?.fullName?.charAt(0) || 'H'}
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
        accessorKey: 'experience.expectedCtc',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Compensation" />
        ),
        cell: ({ row }) => (
          <span className="font-bold text-emerald-700 dark:text-emerald-400">
            {formatCurrency(row.original.experience?.expectedCtc || 150000)} / yr
          </span>
        ),
      },
      {
        accessorKey: 'scorecard.overall',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Rating" />
        ),
        cell: ({ row }) => (
          <span className="font-bold text-[#4e8500] dark:text-[#84e000]">
            ★ {row.original.scorecard?.overall || 4.8} / 5.0
          </span>
        ),
      },
      {
        accessorKey: 'stage',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Stage" />
        ),
        cell: ({ row }) => {
          const stage = row.original.stage;
          return (
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                stage === 'hired'
                  ? 'bg-green-50 dark:bg-green-950/60 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800'
                  : 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800'
              }`}
            >
              {stage === 'hired' ? 'HIRED' : 'OFFER SENT'}
            </span>
          );
        },
      },
      {
        id: 'actions',
        header: () => <div className="text-right">Action</div>,
        cell: ({ row }) => (
          <div className="text-right">
            <a
              href={`mailto:${row.original.personalInfo?.email}?subject=Welcome to the team!`}
              className="rounded-lg bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors"
            >
              Contact
            </a>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Selected & Hired Candidates</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Directory of extended offers and accepted candidates preparing for onboarding
          </p>
        </div>

        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'table'
                ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-2xs'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
            title="Table view"
          >
            <TableIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-2xs'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
            title="Grid cards view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <DataTable
          columns={columns}
          data={selectedCandidates}
          loading={loading}
          emptyMessage="No candidates in Selected/Offered stage."
          showPagination={true}
          pageSize={10}
          pageSizeOptions={[5, 10, 20, 50]}
        />
      ) : (
        /* Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32 rounded" />
                      <Skeleton className="h-3 w-24 rounded" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <div className="space-y-2 py-3 border-y border-gray-100 dark:border-gray-800">
                  <Skeleton className="h-3.5 w-full rounded" />
                  <Skeleton className="h-3.5 w-full rounded" />
                  <Skeleton className="h-3.5 w-full rounded" />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <Skeleton className="h-3 w-28 rounded" />
                  <Skeleton className="h-6 w-24 rounded-lg" />
                </div>
              </div>
            ))
          ) : selectedCandidates.length === 0 ? (
            <div className="col-span-full rounded-3xl border border-dashed border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 py-16 text-center">
              <UserCheck className="mx-auto h-10 w-10 text-gray-300 dark:text-gray-600 mb-3" />
              <h3 className="text-base font-bold text-gray-800 dark:text-gray-200">No candidates in Selected/Offered stage</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Candidates transitioned to 'Offer Extended' or 'Hired' will appear in this directory.
              </p>
            </div>
          ) : (
            selectedCandidates.map((c) => (
              <div
                key={c._id}
                className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-2xs space-y-4 relative overflow-hidden transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-bold text-sm uppercase">
                      {c.personalInfo?.fullName?.charAt(0) || 'H'}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white">{c.personalInfo?.fullName}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{c.jobTitle}</p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                      c.stage === 'hired'
                        ? 'bg-green-50 dark:bg-green-950/60 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800'
                        : 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800'
                    }`}
                  >
                    {c.stage === 'hired' ? 'HIRED' : 'OFFER SENT'}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300 border-y border-gray-100 dark:border-gray-800 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 dark:text-gray-500">Department:</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{c.department}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 dark:text-gray-500">Offered Compensation:</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">
                      {formatCurrency(c.experience?.expectedCtc || 150000)} / yr
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 dark:text-gray-500">Contact Email:</span>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{c.personalInfo?.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 dark:text-gray-500">Interview Rating:</span>
                    <span className="font-bold text-[#4e8500] dark:text-[#84e000]">
                      ★ {c.scorecard?.overall || 4.8} / 5.0
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[11px] text-gray-400 dark:text-gray-500">
                    Ref: <strong className="font-mono text-gray-600 dark:text-gray-300">{c.applicationNumber}</strong>
                  </span>
                  <a
                    href={`mailto:${c.personalInfo?.email}?subject=Welcome to the team!`}
                    className="rounded-lg bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors"
                  >
                    Contact Candidate
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminSelectedPage;


