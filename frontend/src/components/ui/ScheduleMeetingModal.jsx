import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { INTERVIEW_ROUNDS } from '../../utils/constants';
import { meetingApi } from '../../api/meetingApi';
import { Calendar, Video, Clock, User, Mail, Sparkles } from 'lucide-react';

export const ScheduleMeetingModal = ({ isOpen, onClose, candidate, onSuccess }) => {
  const [formData, setFormData] = useState(() => ({
    round: 'Technical Round',
    interviewerName: 'David Miller (Lead Architect)',
    interviewerEmail: 'david.miller@company.com',
    scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    durationMinutes: 45,
    meetingLink: 'https://meet.google.com/kady-session',
    notes: ''
  }));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!candidate) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await meetingApi.scheduleMeeting({
        applicationId: candidate._id,
        candidateName: candidate.personalInfo?.fullName,
        candidateEmail: candidate.personalInfo?.email,
        jobTitle: candidate.jobTitle,
        ...formData
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to schedule meeting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule Candidate Interview"
      subtitle={`Booking interview for ${candidate.personalInfo?.fullName} (${candidate.jobTitle})`}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {error && (
          <div className="rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/50 p-3 text-rose-700 dark:text-rose-300">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Interview Round</label>
            <select
              value={formData.round}
              onChange={(e) => setFormData({ ...formData, round: e.target.value })}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-xs focus:border-[#70C100] focus:outline-hidden cursor-pointer"
            >
              {INTERVIEW_ROUNDS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Duration (Minutes)</label>
            <select
              value={formData.durationMinutes}
              onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value, 10) })}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-xs focus:border-[#70C100] focus:outline-hidden cursor-pointer"
            >
              <option value={30}>30 Minutes</option>
              <option value={45}>45 Minutes</option>
              <option value={60}>60 Minutes (1 Hour)</option>
              <option value={90}>90 Minutes</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Interviewer Name</label>
            <input
              type="text"
              required
              value={formData.interviewerName}
              onChange={(e) => setFormData({ ...formData, interviewerName: e.target.value })}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 focus:border-[#70C100] focus:outline-hidden"
            />
          </div>
          <div>
            <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Interviewer Email</label>
            <input
              type="email"
              required
              value={formData.interviewerEmail}
              onChange={(e) => setFormData({ ...formData, interviewerEmail: e.target.value })}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 focus:border-[#70C100] focus:outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Date & Time</label>
          <input
            type="datetime-local"
            required
            value={formData.scheduledAt}
            onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 focus:border-[#70C100] focus:outline-hidden"
          />
        </div>

        <div>
          <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Meeting Video URL</label>
          <div className="flex items-center gap-2">
            <input
              type="url"
              required
              value={formData.meetingLink}
              onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
              className="flex-1 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 focus:border-[#70C100] focus:outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Interview Prep Notes (Optional)</label>
          <textarea
            rows={3}
            placeholder="Focus areas, coding challenge topics, or panel instructions..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 focus:border-[#70C100] focus:outline-hidden"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-300 dark:border-gray-750 bg-white dark:bg-gray-800 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-[#70C100] hover:bg-[#62aa00] px-5 py-2 text-xs font-black text-black shadow-md shadow-[#70C100]/25 disabled:opacity-50 cursor-pointer transition-colors"
          >
            {loading ? 'Scheduling...' : 'Confirm & Send Invites'}
          </button>
        </div>

      </form>
    </Modal>
  );
};

