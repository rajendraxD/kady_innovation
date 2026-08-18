import React, { useEffect, useState } from 'react';
import { recycleBinApi } from '../api/recycleBinApi';
import { Settings, Shield, Clock, Bell, Check, Save } from 'lucide-react';

export const AdminSettingsPage = () => {
  const [retentionDays, setRetentionDays] = useState(60);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await recycleBinApi.getRetentionSettings();
        setRetentionDays(res.data.retentionDays || 60);
      } catch (err) {
        console.error(err);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedMessage(null);
    try {
      await recycleBinApi.updateRetentionSettings(retentionDays);
      setSavedMessage('Settings successfully updated!');
      setTimeout(() => setSavedMessage(null), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Platform & Retention Settings</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">Configure global data lifecycle rules and recruiter preferences</p>
      </div>

      {savedMessage && (
        <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/50 p-3.5 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span>{savedMessage}</span>
        </div>
      )}

      {/* Retention Policy Form */}
      <form onSubmit={handleSave} className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm space-y-6 text-xs transition-colors">
        <div className="flex items-start gap-3.5 pb-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#70C100]/15 dark:bg-[#70C100]/15 text-[#4e8500] dark:text-[#84e000]">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">GDPR & Candidate Data Retention</h3>
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
              Set the duration soft-deleted candidate records remain in the Recycle Bin before being flagged for permanent automated purge.
            </p>
          </div>
        </div>

        <div>
          <label className="font-semibold text-gray-800 dark:text-gray-200 block mb-2">
            Retention Expiration Period: <span className="font-bold text-[#4e8500] dark:text-[#84e000]">{retentionDays} Days</span>
          </label>
          <input
            type="range"
            min="15"
            max="180"
            step="15"
            value={retentionDays}
            onChange={(e) => setRetentionDays(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#70C100]"
          />
          <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1.5 font-semibold">
            <span>15 Days (Strict)</span>
            <span>60 Days (Recommended)</span>
            <span>180 Days (Extended)</span>
          </div>
        </div>

        <div className="rounded-xl bg-gray-50 dark:bg-gray-800/60 p-4 border border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-300 space-y-2">
          <span className="font-semibold text-gray-800 dark:text-gray-200 block">Compliance Guidelines:</span>
          <p className="text-[11px]">
            • Candidate data in Recycle Bin remains encrypted at rest.<br />
            • Recruiters can restore candidates anytime prior to expiration.<br />
            • Permanent deletion completely purges resume documents and interview records.
          </p>
        </div>

        <div className="flex justify-end pt-3 border-t border-gray-100 dark:border-gray-800">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#70C100] hover:bg-[#62aa00] px-5 py-2.5 text-xs font-black text-black shadow-md shadow-[#70C100]/25 disabled:opacity-50 cursor-pointer transition-colors"
          >
            <Save className="h-3.5 w-3.5" />
            <span>{saving ? 'Saving...' : 'Save Retention Policy'}</span>
          </button>
        </div>
      </form>

    </div>
  );
};

