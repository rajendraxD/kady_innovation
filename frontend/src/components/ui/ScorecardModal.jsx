import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { RECOMMENDATIONS } from '../../utils/constants';
import { applicationApi } from '../../api/applicationApi';
import { Star, Check } from 'lucide-react';

export const ScorecardModal = ({ isOpen, onClose, candidate, onSuccess }) => {
  const [rubric, setRubric] = useState({
    technical: candidate?.scorecard?.technical || 4,
    communication: candidate?.scorecard?.communication || 4,
    problemSolving: candidate?.scorecard?.problemSolving || 4,
    cultureFit: candidate?.scorecard?.cultureFit || 4,
    recommendation: candidate?.scorecard?.recommendation || 'Hire',
    feedbackText: candidate?.scorecard?.feedbackText || ''
  });
  const [loading, setLoading] = useState(false);

  if (!candidate) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await applicationApi.submitScorecard(candidate._id, rubric);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderRatingButtons = (field) => {
    return (
      <div className="flex gap-1.5 mt-1">
        {[1, 2, 3, 4, 5].map((val) => (
          <button
            key={val}
            type="button"
            onClick={() => setRubric({ ...rubric, [field]: val })}
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-black transition-all cursor-pointer ${
              rubric[field] >= val
                ? 'bg-[#70C100] text-black shadow-2xs'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {val}
          </button>
        ))}
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Interview Scorecard & Evaluation"
      subtitle={`Rate ${candidate.personalInfo?.fullName} on core competencies`}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-gray-700 dark:text-gray-300 block">Technical Competency</label>
            {renderRatingButtons('technical')}
          </div>
          <div>
            <label className="font-semibold text-gray-700 dark:text-gray-300 block">Communication</label>
            {renderRatingButtons('communication')}
          </div>
          <div>
            <label className="font-semibold text-gray-700 dark:text-gray-300 block">Problem Solving</label>
            {renderRatingButtons('problemSolving')}
          </div>
          <div>
            <label className="font-semibold text-gray-700 dark:text-gray-300 block">Culture & Team Fit</label>
            {renderRatingButtons('cultureFit')}
          </div>
        </div>

        <div>
          <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Final Hiring Recommendation</label>
          <select
            value={rubric.recommendation}
            onChange={(e) => setRubric({ ...rubric, recommendation: e.target.value })}
            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-xs focus:border-[#70C100] focus:outline-hidden cursor-pointer"
          >
            {RECOMMENDATIONS.map((rec) => (
              <option key={rec} value={rec}>
                {rec}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Feedback & Interview Notes</label>
          <textarea
            rows={3}
            placeholder="Detailed feedback regarding candidate strengths, weaknesses, and interview performance..."
            value={rubric.feedbackText}
            onChange={(e) => setRubric({ ...rubric, feedbackText: e.target.value })}
            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#70C100] focus:outline-hidden"
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
            {loading ? 'Saving...' : 'Save Scorecard'}
          </button>
        </div>
      </form>

    </Modal>
  );
};

