import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { DEPARTMENTS, EXPERIENCE_LEVELS } from '../../utils/constants';
import { jobApi } from '../../api/jobApi';
import { Sparkles, Check, RefreshCw } from 'lucide-react';

export const JDGeneratorModal = ({ isOpen, onClose, onApplyJD }) => {
  const [params, setParams] = useState({
    roleTitle: '',
    department: 'Engineering',
    experienceLevel: 'Mid-level',
    keySkills: ''
  });
  const [loading, setLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!params.roleTitle.trim()) return;
    setLoading(true);
    try {
      const res = await jobApi.generateJD(params);
      setGeneratedResult(res.data.jd);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUseJD = () => {
    if (generatedResult && onApplyJD) {
      onApplyJD(generatedResult);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Job Description Generator"
      subtitle="Craft structured, production-ready job descriptions with role-tailored responsibilities and skills"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5 text-xs">
        {/* Prompt Config */}
        <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Target Role Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Senior Frontend Engineer, DevOps Specialist..."
              value={params.roleTitle}
              onChange={(e) => setParams({ ...params, roleTitle: e.target.value })}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#70C100] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Department</label>
            <select
              value={params.department}
              onChange={(e) => setParams({ ...params, department: e.target.value })}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-xs focus:border-[#70C100] focus:outline-hidden cursor-pointer"
            >
              {DEPARTMENTS.filter((d) => d !== 'All').map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Experience Tier</label>
            <select
              value={params.experienceLevel}
              onChange={(e) => setParams({ ...params, experienceLevel: e.target.value })}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-xs focus:border-[#70C100] focus:outline-hidden cursor-pointer"
            >
              {EXPERIENCE_LEVELS.filter((e) => e !== 'All').map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Key Tech Skills (Comma Separated)</label>
            <input
              type="text"
              placeholder="e.g. React, Node.js, TypeScript, Docker, Kubernetes"
              value={params.keySkills}
              onChange={(e) => setParams({ ...params, keySkills: e.target.value })}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#70C100] focus:outline-hidden"
            />
          </div>

          <div className="sm:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={loading || !params.roleTitle.trim()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#70C100] hover:bg-[#62aa00] px-4 py-2 text-xs font-black text-black shadow-md shadow-[#70C100]/25 disabled:opacity-50 cursor-pointer transition-colors"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Generating AI Draft...
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 text-black" />
                  Generate Job Description
                </>
              )}
            </button>
          </div>
        </form>

        {/* Generated Preview */}
        {generatedResult && (
          <div className="rounded-2xl border border-[#70C100]/30 bg-[#70C100]/10 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#70C100]/20 pb-2">
              <span className="font-bold text-gray-900 dark:text-white">AI Generated Draft</span>
              <button
                type="button"
                onClick={handleUseJD}
                className="inline-flex items-center gap-1 rounded-lg bg-[#70C100] hover:bg-[#62aa00] px-3 py-1.5 text-xs font-black text-black shadow-xs cursor-pointer transition-colors"
              >
                <Check className="h-3.5 w-3.5" />
                Apply to Job Form
              </button>
            </div>


            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-300 block">Overview</span>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{generatedResult.description}</p>
            </div>

            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-300 block">Key Responsibilities</span>
              <ul className="mt-1 list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                {generatedResult.responsibilities?.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-300 block">Role Requirements</span>
              <ul className="mt-1 list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                {generatedResult.requirements?.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

