import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { jobApi } from '../api/jobApi';
import { DEPARTMENTS, WORKPLACE_TYPES, EMPLOYMENT_TYPES, EXPERIENCE_LEVELS } from '../utils/constants';
import { formatCurrency } from '../utils/formatters';
import { Skeleton } from '../components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Spinner } from '../components/ui/spinner';
import { Search, Briefcase, ArrowRight, RotateCcw, AlertCircle } from 'lucide-react';

const PAGE_SIZE = 12;

export const JobsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(0);

  const search = searchParams.get('search') || '';
  const department = searchParams.get('department') || 'All';
  const workplaceType = searchParams.get('workplaceType') || 'All';
  const employmentType = searchParams.get('employmentType') || 'All';
  const experienceLevel = searchParams.get('experienceLevel') || 'All';

  const sentinelRef = useRef(null);
  const loadMoreRef = useRef(null);
  const paginationRef = useRef(pagination);
  const loadingMoreRef = useRef(false);
  const fetchSeqRef = useRef(0);

  const hasMore = pagination.page < pagination.pages;

  useEffect(() => {
    paginationRef.current = pagination;
  }, [pagination]);

  // Initial load / full reset whenever any filter changes.
  useEffect(() => {
    const seq = ++fetchSeqRef.current;
    setLoading(true);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    jobApi
      .getJobs({
        search,
        department,
        workplaceType,
        employmentType,
        experienceLevel,
        page: 1,
        limit: PAGE_SIZE,
        status: 'active'
      })
      .then((res) => {
        if (seq !== fetchSeqRef.current) return;
        setJobs(res.data.jobs || []);
        setPagination(res.data.pagination || { total: 0, page: 1, pages: 1 });
      })
      .catch((err) => {
        if (seq !== fetchSeqRef.current) return;
        setError(err.message || 'Failed to load jobs');
        setJobs([]);
        setPagination({ total: 0, page: 1, pages: 1 });
      })
      .finally(() => {
        if (seq === fetchSeqRef.current) setLoading(false);
      });
  }, [search, department, workplaceType, employmentType, experienceLevel, refresh]);

  // Append the next page of results.
  const loadMore = useCallback(async () => {
    if (loadingMoreRef.current) return;

    const nextPage = paginationRef.current.page + 1;
    if (nextPage > paginationRef.current.pages) return;

    loadingMoreRef.current = true;
    setLoadingMore(true);
    const seq = fetchSeqRef.current;

    try {
      const res = await jobApi.getJobs({
        search,
        department,
        workplaceType,
        employmentType,
        experienceLevel,
        page: nextPage,
        limit: PAGE_SIZE,
        status: 'active'
      });
      // Filters changed while this request was in flight — discard stale results.
      if (seq !== fetchSeqRef.current) return;

      setJobs((prev) => {
        const seen = new Set(prev.map((job) => job._id));
        return [...prev, ...(res.data.jobs || []).filter((job) => !seen.has(job._id))];
      });
      setPagination(res.data.pagination || paginationRef.current);

      // The observer only fires on intersection *changes*, so if the sentinel is
      // still in view after appending (e.g. fast scroll to bottom), nudge it to
      // load the next page instead of waiting for another scroll event.
      const sentinel = sentinelRef.current;
      if (sentinel && res.data.pagination?.hasNextPage) {
        requestAnimationFrame(() => {
          const rect = sentinel.getBoundingClientRect();
          const viewport = window.innerHeight;
          if (rect.top <= viewport + 300) {
            loadMoreRef.current?.();
          }
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, [search, department, workplaceType, employmentType, experienceLevel]);

  // Keep the observer callback pointing at the latest loadMore without recreating the observer.
  useEffect(() => {
    loadMoreRef.current = loadMore;
  });

  // Trigger the next page when the sentinel scrolls into view.
  // The sentinel only exists after the initial load finishes, so this must
  // re-run when loading/hasMore change rather than only on mount.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMoreRef.current?.();
      },
      { rootMargin: '300px 0px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loading, hasMore]);

  const updateParam = (key, val) => {
    const next = new URLSearchParams(searchParams);
    if (val && val !== 'All') {
      next.set(key, val);
    } else {
      next.delete(key);
    }
    setSearchParams(next);
  };

  const handleResetFilters = () => {
    setSearchParams({});
  };

  const handleRetry = () => setRefresh((n) => n + 1);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Open Requisitions</h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
          Explore all active full-time, contract, and remote roles available at KADY.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-2xs space-y-4">
        {/* Search Field */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search by job title, skill tags, or department keywords..."
            value={search}
            onChange={(e) => updateParam('search', e.target.value)}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/60 py-2.5 pl-10 pr-4 text-xs font-medium text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:bg-white dark:focus:bg-gray-800 focus:border-[#70C100] focus:outline-hidden"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 block mb-1">Department</label>
            <Select
              items={DEPARTMENTS.map((d) => ({ label: d, value: d }))}
              value={department}
              onValueChange={(val) => updateParam('department', val)}
            >
              <SelectTrigger className="w-full h-[36px] rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs font-medium cursor-pointer">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-xs">
                {DEPARTMENTS.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 block mb-1">Workplace</label>
            <Select
              items={WORKPLACE_TYPES.map((w) => ({ label: w, value: w }))}
              value={workplaceType}
              onValueChange={(val) => updateParam('workplaceType', val)}
            >
              <SelectTrigger className="w-full h-[36px] rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs font-medium cursor-pointer">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-xs">
                {WORKPLACE_TYPES.map((w) => (
                  <SelectItem key={w} value={w}>
                    {w}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 block mb-1">Employment Type</label>
            <Select
              items={EMPLOYMENT_TYPES.map((e) => ({ label: e, value: e }))}
              value={employmentType}
              onValueChange={(val) => updateParam('employmentType', val)}
            >
              <SelectTrigger className="w-full h-[36px] rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs font-medium cursor-pointer">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-xs">
                {EMPLOYMENT_TYPES.map((e) => (
                  <SelectItem key={e} value={e}>
                    {e}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 block mb-1">Experience Level</label>
            <Select
              items={EXPERIENCE_LEVELS.map((exp) => ({ label: exp, value: exp }))}
              value={experienceLevel}
              onValueChange={(val) => updateParam('experienceLevel', val)}
            >
              <SelectTrigger className="w-full h-[36px] rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs font-medium cursor-pointer">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-xs">
                {EXPERIENCE_LEVELS.map((exp) => (
                  <SelectItem key={exp} value={exp}>
                    {exp}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results summary & reset */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
          <span>
            Showing <strong className="text-gray-900 dark:text-gray-100">{jobs.length}</strong> of <strong className="text-gray-900 dark:text-gray-100">{pagination.total}</strong> active openings
          </span>
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1 font-semibold text-[#4e8500] dark:text-[#84e000] hover:underline cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            Reset Filters
          </button>
        </div>
      </div>

      {/* Jobs Catalog */}
      {error ? (
        <div className="rounded-3xl border border-dashed border-red-300 dark:border-red-900/50 bg-white dark:bg-gray-900 py-16 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-red-300 dark:text-red-600 mb-3" />
          <h3 className="text-base font-bold text-gray-800 dark:text-gray-200">Couldn't load jobs</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{error}</p>
          <button
            type="button"
            onClick={handleRetry}
            className="mt-4 rounded-xl bg-[#70C100] hover:bg-[#62aa00] px-4 py-2 text-xs font-black text-black shadow-md shadow-[#70C100]/25 cursor-pointer"
          >
            Try Again
          </button>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-4 w-16 rounded-md" />
              </div>
              <Skeleton className="h-6 w-3/4 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-full rounded" />
                <Skeleton className="h-3.5 w-5/6 rounded" />
              </div>
              <div className="flex gap-2 pt-1">
                <Skeleton className="h-5 w-14 rounded" />
                <Skeleton className="h-5 w-16 rounded" />
                <Skeleton className="h-5 w-12 rounded" />
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                <Skeleton className="h-4 w-28 rounded" />
                <Skeleton className="h-4 w-16 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 py-16 text-center">
          <Briefcase className="mx-auto h-10 w-10 text-gray-300 dark:text-gray-600 mb-3" />
          <h3 className="text-base font-bold text-gray-800 dark:text-gray-200">No matching jobs found</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or resetting filters to view all available roles.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-4 rounded-xl bg-[#70C100] hover:bg-[#62aa00] px-4 py-2 text-xs font-black text-black shadow-md shadow-[#70C100]/25 cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="group rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-2xs hover:border-[#70C100]/60 hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#4e8500] dark:text-[#84e000]">
                      {job.department}
                    </span>
                    <span className="rounded-md bg-[#70C100]/15 dark:bg-[#70C100]/15 px-2 py-0.5 text-[10px] font-bold text-[#4e8500] dark:text-[#84e000] border border-[#70C100]/30">
                      {job.workplaceType}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-[#4e8500] dark:group-hover:text-[#84e000] transition-colors">
                    {job.title}
                  </h3>

                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {job.skills?.slice(0, 3).map((skill, i) => (
                      <span
                        key={i}
                        className="rounded bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-[10px] font-medium text-gray-700 dark:text-gray-300"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skills?.length > 3 && (
                      <span className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-[10px] font-medium text-gray-500 dark:text-gray-400">
                        +{job.skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-3.5 text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {formatCurrency(job.salaryMin)} - {formatCurrency(job.salaryMax)}
                  </span>
                  <Link
                    to={`/jobs/${job._id}`}
                    className="inline-flex items-center gap-1 font-bold text-[#4e8500] dark:text-[#84e000] group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Apply</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Infinite scroll sentinel */}
          <div ref={sentinelRef} className="flex items-center justify-center gap-2 py-8">
            {loadingMore ? (
              <>
                <Spinner className="size-4 text-[#70C100]" />
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Loading more jobs…</span>
              </>
            ) : hasMore ? (
              <span className="text-xs text-gray-400 dark:text-gray-500">Scroll for more openings</span>
            ) : (
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {pagination.total > 0 ? `All ${pagination.total} openings loaded` : ''}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
};
