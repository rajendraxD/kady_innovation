import React, { useEffect, useState, useMemo } from 'react';
import { meetingApi } from '../api/meetingApi';
import { formatDateTime, formatDate } from '../utils/formatters';
import { DataTable, DataTableColumnHeader } from '../components/ui/data-table';
import { Modal } from '../components/common/Modal';
import { Skeleton } from '../components/ui/skeleton';
import {
  Calendar,
  Clock,
  Video,
  User,
  Star,
  CheckCircle2,
  XCircle,
  Plus,
  MessageSquare,
  LayoutGrid,
  Table as TableIcon
} from 'lucide-react';

export const AdminMeetingsPage = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  // Feedback modal
  const [feedbackMeeting, setFeedbackMeeting] = useState(null);
  const [feedbackData, setFeedbackData] = useState({
    rating: 5,
    comments: '',
    recommendation: 'Hire'
  });

  const loadMeetings = async () => {
    setLoading(true);
    try {
      const res = await meetingApi.getMeetings({ status: statusFilter, limit: 100 });
      setMeetings(res.data.meetings || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeetings();
  }, [statusFilter]);

  const handleOpenFeedback = (meeting) => {
    setFeedbackMeeting(meeting);
    setFeedbackData({
      rating: meeting.feedback?.rating || 4,
      comments: meeting.feedback?.comments || '',
      recommendation: meeting.feedback?.recommendation || 'Hire'
    });
  };

  const handleSaveFeedback = async (e) => {
    e.preventDefault();
    try {
      await meetingApi.submitFeedback(feedbackMeeting._id, feedbackData);
      setFeedbackMeeting(null);
      loadMeetings();
    } catch (err) {
      console.error(err);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'candidateName',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Candidate" />
        ),
        cell: ({ row }) => {
          const m = row.original;
          return (
            <div>
              <p className="font-bold text-gray-900 dark:text-white">{m.candidateName}</p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500">{m.jobTitle}</p>
            </div>
          );
        },
      },
      {
        accessorKey: 'round',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Round" />
        ),
        cell: ({ row }) => (
          <span className="rounded-md bg-[#70C100]/15 dark:bg-[#70C100]/15 px-2 py-0.5 text-[10px] font-bold text-[#4e8500] dark:text-[#84e000] border border-[#70C100]/30">
            {row.original.round}
          </span>
        ),
      },
      {
        accessorKey: 'scheduledAt',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Scheduled Time" />
        ),
        cell: ({ row }) => {
          const m = row.original;
          return (
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{formatDateTime(m.scheduledAt)}</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500">{m.durationMinutes || 45} mins</p>
            </div>
          );
        },
      },
      {
        accessorKey: 'interviewerName',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Interviewer Panel" />
        ),
        cell: ({ row }) => (
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            {row.original.interviewerName}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
          const status = row.original.status;
          return (
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                status === 'completed'
                  ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : status === 'scheduled'
                  ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
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
          const m = row.original;
          return (
            <div className="flex items-center justify-end gap-2">
              <a
                href={m.meetingLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-lg bg-[#70C100]/15 dark:bg-[#70C100]/15 px-2.5 py-1 text-xs font-bold text-[#4e8500] dark:text-[#84e000] hover:bg-[#70C100]/25 transition-colors"
              >
                <Video className="h-3 w-3" />
                Join
              </a>
              <button
                type="button"
                onClick={() => handleOpenFeedback(m)}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 dark:border-gray-800 px-2.5 py-1 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <Star className="h-3 w-3 text-amber-500" />
                {m.feedback?.rating ? 'Edit' : 'Feedback'}
              </button>
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Interview Meetings & Calendar</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Track upcoming interview rounds, interviewer panels, video conferencing links, and feedback
          </p>
        </div>

        <div className="flex items-center gap-3">
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

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-gray-300 dark:border-gray-750 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-xs font-semibold shadow-2xs focus:border-[#70C100] focus:outline-hidden cursor-pointer"
          >
            <option value="All">All Meeting Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {viewMode === 'table' ? (
        <DataTable
          columns={columns}
          data={meetings}
          loading={loading}
          emptyMessage="No scheduled meetings found."
          showPagination={true}
          pageSize={10}
          pageSizeOptions={[5, 10, 20, 50]}
        />
      ) : (
        /* Meetings Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-28 rounded-md" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <div className="space-y-1.5">
                  <Skeleton className="h-5 w-40 rounded" />
                  <Skeleton className="h-3.5 w-48 rounded" />
                </div>
                <div className="space-y-2 pt-1">
                  <Skeleton className="h-3.5 w-36 rounded" />
                  <Skeleton className="h-3.5 w-44 rounded" />
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                  <Skeleton className="h-7 w-24 rounded-lg" />
                  <Skeleton className="h-4 w-24 rounded" />
                </div>
              </div>
            ))
          ) : meetings.length === 0 ? (
            <div className="col-span-full rounded-3xl border border-dashed border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 py-16 text-center">
              <Calendar className="mx-auto h-10 w-10 text-gray-300 dark:text-gray-600 mb-3" />
              <h3 className="text-base font-bold text-gray-800 dark:text-gray-200">No scheduled meetings found</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                You can schedule new candidate interviews from the Candidate table or Kanban pipeline.
              </p>
            </div>
          ) : (
            meetings.map((meeting) => (
              <div
                key={meeting._id}
                className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-2xs space-y-3.5 flex flex-col justify-between transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="rounded-md bg-[#70C100]/15 dark:bg-[#70C100]/15 px-2 py-0.5 text-[10px] font-bold text-[#4e8500] dark:text-[#84e000] border border-[#70C100]/30">
                      {meeting.round}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        meeting.status === 'completed'
                          ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300'
                          : meeting.status === 'scheduled'
                          ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {meeting.status.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">{meeting.candidateName}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{meeting.jobTitle}</p>

                  <div className="mt-3 space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-gray-400" />
                      <span>{formatDateTime(meeting.scheduledAt)} ({meeting.durationMinutes}m)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-gray-400" />
                      <span>Panel: {meeting.interviewerName}</span>
                    </div>
                  </div>

                  {meeting.notes && (
                    <p className="mt-3 text-[11px] text-gray-500 dark:text-gray-400 italic bg-gray-50 dark:bg-gray-800/60 p-2 rounded-lg border border-gray-100 dark:border-gray-800">
                      "{meeting.notes}"
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-3 text-xs">
                  <a
                    href={meeting.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#70C100]/15 dark:bg-[#70C100]/15 px-2.5 py-1.5 font-bold text-[#4e8500] dark:text-[#84e000] hover:bg-[#70C100]/25 transition-colors"
                  >
                    <Video className="h-3.5 w-3.5" />
                    Join Call
                  </a>

                  <button
                    type="button"
                    onClick={() => handleOpenFeedback(meeting)}
                    className="inline-flex items-center gap-1 font-semibold text-gray-700 dark:text-gray-300 hover:text-[#4e8500] dark:hover:text-[#84e000] cursor-pointer"
                  >
                    <Star className="h-3.5 w-3.5 text-amber-500" />
                    {meeting.feedback?.rating ? 'Edit Feedback' : 'Submit Feedback'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}


      {/* Post-Interview Feedback Modal */}
      <Modal
        isOpen={!!feedbackMeeting}
        onClose={() => setFeedbackMeeting(null)}
        title="Post-Interview Candidate Feedback"
        subtitle={`Record evaluation for ${feedbackMeeting?.candidateName} (${feedbackMeeting?.round})`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveFeedback} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Overall Rating (1 - 5)</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setFeedbackData({ ...feedbackData, rating: val })}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black transition-all cursor-pointer ${
                    feedbackData.rating >= val
                      ? 'bg-[#70C100] text-black shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Recommendation</label>
            <select
              value={feedbackData.recommendation}
              onChange={(e) => setFeedbackData({ ...feedbackData, recommendation: e.target.value })}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-xs focus:border-[#70C100] focus:outline-hidden cursor-pointer"
            >
              <option value="Strong Hire">Strong Hire</option>
              <option value="Hire">Hire</option>
              <option value="Hold">Hold</option>
              <option value="Reject">Reject</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Comments & Key Takeaways</label>
            <textarea
              rows={3}
              required
              placeholder="Candidate technical strengths, communication style, or areas of concern..."
              value={feedbackData.comments}
              onChange={(e) => setFeedbackData({ ...feedbackData, comments: e.target.value })}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#70C100] focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={() => setFeedbackMeeting(null)}
              className="rounded-xl border border-gray-300 dark:border-gray-750 bg-white dark:bg-gray-800 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#70C100] hover:bg-[#62aa00] px-5 py-2 text-xs font-black text-black shadow-md shadow-[#70C100]/25 cursor-pointer transition-colors"
            >
              Save Feedback
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

