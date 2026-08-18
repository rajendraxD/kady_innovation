import React from 'react';
import { Shield, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { KadyLogo } from './KadyLogo';

export const Footer = () => {
  return (
    <footer className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <KadyLogo className="h-7 w-auto" />
            </div>
            <p className="max-w-md text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Enterprise-grade talent acquisition and recruitment management suite. Engineered for modern high-growth engineering and product organizations.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
              <Shield className="h-3.5 w-3.5 text-emerald-500" />
              <span>SOC2 Compliant • GDPR Data Retention Automated • SSL Secured</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-gray-200">Job Seekers</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-gray-500 dark:text-gray-400">
              <li>
                <Link to="/jobs" className="hover:text-[#559400] dark:hover:text-[#84e000] transition-colors">
                  Browse All Jobs
                </Link>
              </li>
              <li>
                <Link to="/track-status" className="hover:text-[#559400] dark:hover:text-[#84e000] transition-colors">
                  Track Application Status
                </Link>
              </li>
              <li>
                <span className="text-gray-400 dark:text-gray-600">Resume Autofill Assistant</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-gray-200">HR & Admin</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-gray-500 dark:text-gray-400">
              <li>
                <Link to="/admin/login" className="hover:text-[#559400] dark:hover:text-[#84e000] transition-colors">
                  Recruiter Sign In
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="hover:text-[#559400] dark:hover:text-[#84e000] transition-colors">
                  Talent Pipeline
                </Link>
              </li>
              <li>
                <Link to="/admin/resume-buddy" className="hover:text-[#559400] dark:hover:text-[#84e000] transition-colors flex items-center gap-1">
                  <span>Resume Buddy AI</span>
                  <Sparkles className="h-3 w-3 text-[#70C100]" />
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 border-t border-gray-100 dark:border-gray-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400 dark:text-gray-500">
          <p>© {new Date().getFullYear()} KADY Hiring Portal. All rights reserved.</p>

          <div className="flex items-center gap-1">
            <span>Powered by</span>
            <span className="font-semibold text-gray-600 dark:text-gray-300">KADY</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

