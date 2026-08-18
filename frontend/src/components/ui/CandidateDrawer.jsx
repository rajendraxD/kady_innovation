import React, { useState } from 'react';
import { Drawer } from '../common/Drawer';
import { StatusBadge } from '../common/StatusBadge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';
import { STAGES } from '../../utils/constants';
import { formatCurrency, formatDate } from '../../utils/formatters';

import {
  Mail,
  Phone,
  MapPin,
  FileText,
  Calendar,
  Briefcase,
  GraduationCap,
  Sparkles,
  ExternalLink,
  MessageSquare,
  Star,
  Trash2,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { applicationApi } from '../../api/applicationApi';

export const CandidateDrawer = ({
  candidate,
  isOpen,
  onClose,
  onStageChange,
  onScheduleInterview,
  onOpenScorecard,
  onDelete
}) => {
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState(candidate?.hrNotes || []);
  const [loadingNote, setLoadingNote] = useState(false);

  if (!candidate) return null;

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setLoadingNote(true);
    try {
      const res = await applicationApi.addNote(candidate._id, newNote);
      setNotes(res.data.notes);
      setNewNote('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingNote(false);
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={candidate.personalInfo?.fullName || 'Candidate Profile'}
      subtitle={`Applied for ${candidate.jobTitle || 'Role'} • Ref: ${candidate.applicationNumber}`}
      width="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Candidate Header & Stage Quick Actions */}
        <div className="rounded-2xl bg-gradient-to-br from-[#70C100]/15 to-emerald-500/10 dark:from-[#70C100]/15 dark:to-emerald-950/30 p-5 border border-[#70C100]/25">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#70C100] font-black text-black text-lg shadow-md shadow-[#70C100]/20">
                {candidate.personalInfo?.fullName?.charAt(0) || 'C'}
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-900 dark:text-white">{candidate.personalInfo?.fullName}</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {candidate.experience?.currentDesignation || 'Candidate'}{' '}
                  {candidate.experience?.currentCompany && `at ${candidate.experience?.currentCompany}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge stage={candidate.stage} size="lg" />
              <div className="rounded-xl bg-white dark:bg-gray-800/80 px-2.5 py-1 text-xs font-bold text-[#4e8500] dark:text-[#84e000] shadow-2xs border border-[#70C100]/30 flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span>{candidate.matchScore || 85}% Match</span>
              </div>
            </div>
          </div>

          {/* Quick Action Toolbar */}
          <div className="mt-4 pt-4 border-t border-[#70C100]/20 flex flex-wrap items-center gap-2">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mr-1">Move Stage:</label>
            <div className="w-36">
              <Select
                items={STAGES.map((s) => ({ label: s.label, value: s.key }))}
                value={candidate.stage}
                onValueChange={(val) => onStageChange(candidate._id, val)}
              >
                <SelectTrigger className="w-full h-[32px] rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-semibold cursor-pointer">
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs">
                  {STAGES.map((s) => (
                    <SelectItem key={s.key} value={s.key}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <button
              type="button"
              onClick={() => onScheduleInterview(candidate)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#70C100] hover:bg-[#62aa00] px-3 py-1.5 text-xs font-black text-black shadow-2xs transition-colors cursor-pointer ml-auto"
            >
              <Calendar className="h-3.5 w-3.5" />
              Schedule Interview
            </button>

            <button
              type="button"
              onClick={() => onOpenScorecard(candidate)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 shadow-2xs hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <Star className="h-3.5 w-3.5 text-amber-500" />
              Scorecard
            </button>

            <button
              type="button"
              onClick={() => onDelete(candidate._id)}
              title="Move to Recycle Bin"
              className="rounded-lg p-1.5 text-gray-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 p-3">
            <Mail className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            <div>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium block">Email Address</span>
              <a href={`mailto:${candidate.personalInfo?.email}`} className="font-semibold text-[#4e8500] dark:text-[#84e000] hover:underline">
                {candidate.personalInfo?.email}
              </a>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 p-3">
            <Phone className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            <div>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium block">Phone</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">{candidate.personalInfo?.phone || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Professional Experience & Salary */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1.5">
            <Briefcase className="h-3.5 w-3.5 text-[#559400] dark:text-[#84e000]" />
            Experience & Compensation
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-gray-400 dark:text-gray-500 text-[11px] block">Total Experience</span>
              <span className="font-bold text-gray-900 dark:text-white">{candidate.experience?.totalYears || 0} Years</span>
            </div>
            <div>
              <span className="text-gray-400 dark:text-gray-500 text-[11px] block">Notice Period</span>
              <span className="font-bold text-gray-900 dark:text-white">{candidate.experience?.noticePeriodDays || 30} Days</span>
            </div>
            <div>
              <span className="text-gray-400 dark:text-gray-500 text-[11px] block">Current CTC</span>
              <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(candidate.experience?.currentCtc)}</span>
            </div>
            <div>
              <span className="text-gray-400 dark:text-gray-500 text-[11px] block">Expected CTC</span>
              <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(candidate.experience?.expectedCtc)}</span>
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1.5">
            <GraduationCap className="h-3.5 w-3.5 text-[#559400] dark:text-[#84e000]" />
            Education & Academics
          </h4>
          <p className="text-xs font-semibold text-gray-900 dark:text-white">
            {candidate.education?.highestDegree || "Bachelor's Degree"} —{' '}
            <span className="text-gray-600 dark:text-gray-400 font-normal">{candidate.education?.fieldOfStudy || 'Computer Science'}</span>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {candidate.education?.institution || 'University'} • Graduated {candidate.education?.graduationYear || 2024}
          </p>
        </div>

        {/* Key Skills */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">Key Skills</h4>
          <div className="flex flex-wrap gap-1.5">
            {candidate.skills && candidate.skills.length > 0 ? (
              candidate.skills.map((skill, i) => (
                <span
                  key={i}
                  className="rounded-lg bg-[#70C100]/15 dark:bg-[#70C100]/15 border border-[#70C100]/30 px-2.5 py-1 text-xs font-bold text-[#4e8500] dark:text-[#84e000]"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-400 dark:text-gray-500">No skill tags attached.</span>
            )}
          </div>
        </div>

        {/* Resume Preview Link */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-[#559400] dark:text-[#84e000]" />
            <div>
              <p className="text-xs font-bold text-gray-900 dark:text-white">{candidate.resumeFileName || 'Resume.pdf'}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Uploaded candidate resume</p>
            </div>
          </div>
          <a
            href={candidate.resumeUrl || '#'}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#4e8500] dark:text-[#84e000] hover:underline"
          >
            <span>Open Document</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {/* Internal HR Notes & Activity Feed */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1.5">
            <MessageSquare className="h-3.5 w-3.5 text-[#559400] dark:text-[#84e000]" />
            Internal HR Notes
          </h4>

          <form onSubmit={handleAddNote} className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add an internal evaluation note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="flex-1 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#70C100] focus:outline-hidden"
              />
              <button
                type="submit"
                disabled={loadingNote || !newNote.trim()}
                className="rounded-xl bg-[#70C100] hover:bg-[#62aa00] px-4 py-2 text-xs font-black text-black disabled:opacity-50 cursor-pointer transition-colors"
              >
                Post
              </button>
            </div>
          </form>


          <div className="space-y-2.5 max-h-48 overflow-y-auto">
            {notes.length === 0 ? (
              <p className="text-xs text-gray-400 dark:text-gray-500 italic">No internal notes added yet.</p>
            ) : (
              notes.map((n, idx) => (
                <div key={idx} className="rounded-lg bg-gray-50 dark:bg-gray-800/70 p-2.5 border border-gray-100 dark:border-gray-750 text-xs">
                  <div className="flex items-center justify-between text-[10px] text-gray-400 dark:text-gray-500 mb-1">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">{n.author}</span>
                    <span>{formatDate(n.createdAt)}</span>
                  </div>
                  <p className="text-gray-800 dark:text-gray-200">{n.note}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Drawer>
  );
};

