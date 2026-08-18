import * as React from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table';
import { Skeleton } from './skeleton';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

/**
 * DataTableColumnHeader
 * Reusable sortable column header button
 */
export const DataTableColumnHeader = ({ column, title, className = '' }) => {
  if (!column.getCanSort()) {
    return <div className={`text-xs font-bold uppercase ${className}`}>{title}</div>;
  }

  const isSorted = column.getIsSorted();

  return (
    <button
      type="button"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer -ml-1 px-1 py-0.5 rounded ${className}`}
    >
      <span>{title}</span>
      {isSorted === 'desc' ? (
        <ArrowDown className="h-3.5 w-3.5 text-[#70C100]" />
      ) : isSorted === 'asc' ? (
        <ArrowUp className="h-3.5 w-3.5 text-[#70C100]" />
      ) : (
        <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
      )}
    </button>
  );
};

/**
 * DataTablePagination
 * Standard pagination controls with page jump & page size
 */
export const DataTablePagination = ({
  pageIndex,
  pageSize,
  pageCount,
  totalRows,
  startRow,
  endRow,
  canPreviousPage,
  canNextPage,
  onPageIndexChange,
  onPageSizeChange,
  selectedCount = 0,
  pageSizeOptions = [5, 10, 20, 50],
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs text-gray-500 dark:text-gray-400">
      <div className="flex-1 text-[11px]">
        {selectedCount > 0 ? (
          <span>
            {selectedCount} of {totalRows} row(s) selected.
          </span>
        ) : (
          <span>
            Showing <strong className="text-gray-900 dark:text-white font-semibold">{startRow}</strong> to{' '}
            <strong className="text-gray-900 dark:text-white font-semibold">{endRow}</strong> of{' '}
            <strong className="text-gray-900 dark:text-white font-semibold">{totalRows}</strong> total entries
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-2">
          <p className="text-[11px] font-medium whitespace-nowrap">Rows per page</p>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-8 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 px-2 text-xs font-medium text-gray-900 dark:text-gray-100 focus:border-[#70C100] focus:outline-hidden cursor-pointer"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-center text-[11px] font-medium min-w-[85px] text-gray-700 dark:text-gray-300">
          Page {pageIndex + 1} of {pageCount}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPageIndexChange(0)}
            disabled={!canPreviousPage}
            className="rounded-lg p-1.5 border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            title="First page"
            aria-label="First page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onPageIndexChange(pageIndex - 1)}
            disabled={!canPreviousPage}
            className="rounded-lg p-1.5 border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            title="Previous page"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onPageIndexChange(pageIndex + 1)}
            disabled={!canNextPage}
            className="rounded-lg p-1.5 border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            title="Next page"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onPageIndexChange(pageCount - 1)}
            disabled={!canNextPage}
            className="rounded-lg p-1.5 border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            title="Last page"
            aria-label="Last page"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * DataTable
 * Production-grade Shadcn Data Table powered by TanStack Table
 * Supports both Client-Side and Server-Side Pagination
 */
export const DataTable = ({
  columns,
  data = [],
  loading = false,
  emptyMessage = 'No records found.',
  onRowClick = null,
  showPagination = true,
  pageSize = 10,
  pageSizeOptions = [5, 10, 20, 50],
  serverPagination = null, // { page, pageSize, total, totalPages, onPageChange, onPageSizeChange }
  className = '',
}) => {
  const isServer = Boolean(serverPagination);
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [clientPagination, setClientPagination] = React.useState({
    pageIndex: 0,
    pageSize: pageSize,
  });

  const paginationState = isServer
    ? {
        pageIndex: Math.max(0, (serverPagination.page || 1) - 1),
        pageSize: serverPagination.pageSize || pageSize,
      }
    : clientPagination;

  const table = useReactTable({
    data,
    columns,
    pageCount: isServer ? serverPagination.totalPages : undefined,
    manualPagination: isServer,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      pagination: paginationState,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: (updater) => {
      if (isServer) {
        const nextState = typeof updater === 'function' ? updater(paginationState) : updater;
        if (nextState.pageIndex !== paginationState.pageIndex) {
          serverPagination.onPageChange?.(nextState.pageIndex + 1);
        }
        if (nextState.pageSize !== paginationState.pageSize) {
          serverPagination.onPageSizeChange?.(nextState.pageSize);
        }
      } else {
        setClientPagination(updater);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const totalRows = isServer
    ? (serverPagination.total ?? data.length)
    : table.getFilteredRowModel().rows.length;

  const currentPageSize = paginationState.pageSize;
  const pageIndex = paginationState.pageIndex;
  const pageCount = isServer
    ? Math.max(1, serverPagination.totalPages || Math.ceil(totalRows / currentPageSize))
    : Math.max(1, Math.ceil(totalRows / currentPageSize));

  const startRow = totalRows === 0 ? 0 : pageIndex * currentPageSize + 1;
  const endRow = Math.min((pageIndex + 1) * currentPageSize, totalRows);
  const canPreviousPage = pageIndex > 0;
  const canNextPage = pageIndex < pageCount - 1;

  const handlePageSizeChange = (newSize) => {
    if (isServer) {
      serverPagination.onPageSizeChange?.(newSize);
    } else {
      table.setPageSize(newSize);
      setClientPagination({
        pageIndex: 0,
        pageSize: newSize,
      });
    }
  };

  const handlePageIndexChange = (newIndex) => {
    if (isServer) {
      serverPagination.onPageChange?.(newIndex + 1);
    } else {
      table.setPageIndex(newIndex);
      setClientPagination((prev) => ({
        ...prev,
        pageIndex: newIndex,
      }));
    }
  };

  return (
    <div className={`rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xs overflow-hidden transition-colors ${className}`}>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50/75 dark:bg-gray-800/60 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase border-b border-gray-200 dark:border-gray-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b border-gray-200 dark:border-gray-800">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="py-3 px-4 text-left font-bold text-gray-600 dark:text-gray-300"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i} className="border-b border-gray-100 dark:border-gray-800">
                  {columns.map((_, colIndex) => (
                    <TableCell key={colIndex} className="py-3.5 px-4">
                      <Skeleton className="h-4 w-28 rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={() => onRowClick && onRowClick(row.original)}
                  className={`hover:bg-gray-50/60 dark:hover:bg-gray-800/50 transition-colors ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3.5 px-4 align-middle">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-xs text-gray-400 dark:text-gray-500"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {showPagination && totalRows > 0 && !loading && (
        <DataTablePagination
          pageIndex={pageIndex}
          pageSize={currentPageSize}
          pageCount={pageCount}
          totalRows={totalRows}
          startRow={startRow}
          endRow={endRow}
          canPreviousPage={canPreviousPage}
          canNextPage={canNextPage}
          onPageIndexChange={handlePageIndexChange}
          onPageSizeChange={handlePageSizeChange}
          selectedCount={table.getFilteredSelectedRowModel().rows.length}
          pageSizeOptions={pageSizeOptions}
        />
      )}
    </div>
  );
};

export default DataTable;