import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShieldCheck } from 'lucide-react';
import { KadyLogo } from './KadyLogo';
import { ThemeToggle } from './ThemeToggle';

export const Navbar = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 dark:border-gray-800/80 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <KadyLogo className="h-7 w-auto" />
        </Link>


        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-300">
          <Link
            to="/jobs"
            className={`transition-colors hover:text-[#559400] dark:hover:text-[#84e000] ${location.pathname === '/jobs' ? 'text-[#559400] dark:text-[#84e000] font-bold' : ''
              }`}
          >
            Explore Openings
          </Link>
          <Link
            to="/track-status"
            className={`transition-colors hover:text-[#559400] dark:hover:text-[#84e000] ${location.pathname === '/track-status' ? 'text-[#559400] dark:text-[#84e000] font-bold' : ''
              }`}
          >
            Track Application
          </Link>
          <div className="h-4 w-px bg-gray-200 dark:bg-gray-800" />
          {/* <Link
            to="/admin/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-[#559400] dark:hover:text-[#84e000] bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 transition-colors"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-[#559400] dark:text-[#84e000]" />
            Recruiter / Admin Portal
          </Link> */}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {location.pathname !== '/jobs' && (
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 rounded-xl bg-[#70C100] hover:bg-[#62aa00] px-4 py-2 text-sm font-black text-black shadow-md shadow-[#70C100]/25 active:scale-95 transition-all duration-150 cursor-pointer"
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Find Jobs</span>
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};


