import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../features/auth/authSlice';
import { Lock, Mail, ArrowRight, KeyRound } from 'lucide-react';
import { KadyLogo } from '../components/common/KadyLogo';
import { ThemeToggle } from '../components/common/ThemeToggle';

export const AdminLoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('admin@email.com');
  const [password, setPassword] = useState('admin@123');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/admin/dashboard');
    }
  };

  const handleUsePreset = () => {
    setEmail('admin@email.com');
    setPassword('admin@123');
  };

  return (
    <div className="relative flex min-h-screen flex-col justify-center bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      {/* Top bar theme toggle */}

      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center justify-center gap-2.5 group mb-6">
          <KadyLogo className="h-9 w-auto" />
        </Link>
        <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-gray-100">
          Recruiter & Admin Sign In
        </h2>
        <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
          Enter your authorized credentials to access the recruitment management portal.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-xl shadow-gray-200/50 dark:shadow-none space-y-6">
          {/* Quick preset credentials alert */}
          <div className="rounded-2xl border border-[#70C100]/30 bg-[#70C100]/10 p-3.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-[#559400] dark:text-[#84e000] shrink-0" />
              <div>
                <span className="font-bold text-gray-900 dark:text-white block">Default Admin Account:</span>
                <span className="text-[11px] text-[#4e8500] dark:text-[#84e000]">admin@email.com / admin@123</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleUsePreset}
              className="rounded-lg bg-[#70C100] hover:bg-[#62aa00] px-2.5 py-1 text-[11px] font-black text-black shadow-2xs cursor-pointer transition-colors"
            >
              Fill Credentials
            </button>
          </div>

          {error && (
            <div className="rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 p-3 text-xs text-rose-700 dark:text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@email.com"
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-2.5 pl-10 pr-4 text-xs font-medium text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#70C100] focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-2.5 pl-10 pr-4 text-xs font-medium text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#70C100] focus:outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#70C100] hover:bg-[#62aa00] py-3 text-xs font-black text-black shadow-lg shadow-[#70C100]/25 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In to Recruitment Suite</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-gray-100 dark:border-gray-800">
            <Link to="/" className="text-xs font-semibold text-[#559400] dark:text-[#84e000] hover:underline">
              ← Return to Public Job Portal
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

