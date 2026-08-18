import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../features/auth/authSlice';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  GitPullRequest,
  CalendarDays,
  UserCheck,
  Sparkles,
  Trash2,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  X
} from 'lucide-react';
import { KadyLogo, KadyMark } from './KadyLogo';

export const AdminSidebar = ({
  collapsed = false,
  setCollapsed = () => {},
  mobileOpen = false,
  setMobileOpen = () => {}
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/admin/login');
  };

  const navItems = [
    { section: 'RECRUITMENT & HIRING' },
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/jobs', icon: Briefcase, label: 'Job Openings' },
    { to: '/admin/candidates', icon: Users, label: 'All Candidates' },
    { to: '/admin/pipeline', icon: GitPullRequest, label: 'Interview Pipeline' },
    { to: '/admin/meetings', icon: CalendarDays, label: 'Meeting Schedules' },
    { to: '/admin/selected', icon: UserCheck, label: 'Selected Hires' },
    { section: 'AI & DATA RETENTION' },
    { to: '/admin/resume-buddy', icon: Sparkles, label: 'Resume Buddy AI', badge: 'AI' },
    { to: '/admin/recycle-bin', icon: Trash2, label: 'Recycle Bin' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' }
  ];

  const handleToggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem('kady-sidebar-collapsed', String(next));
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden animate-in fade-in-0 duration-150"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop Collapsible Sidebar */}
      <aside
        className={`hidden md:flex fixed inset-y-0 left-0 z-30 flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-all duration-200 ease-in-out ${
          collapsed ? 'w-[72px]' : 'w-64'
        }`}
      >
        {/* Brand Header */}
        <div
          className={`flex h-16 items-center border-b border-gray-100 dark:border-gray-800 px-3.5 ${
            collapsed ? 'justify-center' : 'justify-between px-5'
          }`}
        >
          <NavLink
            to="/admin/dashboard"
            className="flex items-center gap-2.5 overflow-hidden"
            title="KADY Enterprise ATS"
          >
            {collapsed ? (
              <KadyMark className="h-6 w-auto shrink-0" />
            ) : (
              <KadyLogo className="h-6 w-auto shrink-0" />
            )}
          </NavLink>

        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
          {navItems.map((item, index) => {
            if (item.section) {
              return collapsed ? (
                <div
                  key={index}
                  className="my-3 mx-2 border-t border-gray-100 dark:border-gray-800"
                />
              ) : (
                <div
                  key={index}
                  className="px-3 pt-4 pb-1 text-[10px] font-bold tracking-wider text-gray-400 dark:text-gray-500 uppercase"
                >
                  {item.section}
                </div>
              );
            }

            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `group flex items-center rounded-xl text-xs font-semibold transition-all duration-150 relative ${
                    collapsed
                      ? 'justify-center h-10 w-10 mx-auto'
                      : 'justify-between px-3 py-2.5'
                  } ${
                    isActive
                      ? 'bg-[#70C100]/15 dark:bg-[#70C100]/15 text-[#4e8500] dark:text-[#84e000] border border-[#70C100]/30 shadow-2xs font-bold'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-gray-100'
                  }`
                }
              >
                <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
                  <Icon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
                  {!collapsed && <span>{item.label}</span>}
                </div>

                {!collapsed && item.badge && (
                  <span className="rounded-md bg-[#70C100] px-1.5 py-0.5 text-[9px] font-black text-black shadow-2xs">
                    {item.badge}
                  </span>
                )}

                {collapsed && item.badge && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#70C100]" />
                )}
              </NavLink>
            );
          })}
        </div>

        {/* User Profile & Logout */}
        <div className="border-t border-gray-100 dark:border-gray-800 p-2.5">
          {collapsed ? (
            <div className="flex flex-col items-center gap-2">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#70C100] text-xs font-black text-black uppercase shadow-2xs"
                title={`${user?.name || 'Administrator'} (${user?.email || 'admin@email.com'})`}
              >
                {user?.name?.charAt(0) || 'A'}
              </div>
              <button
                type="button"
                onClick={handleLogout}
                title="Sign out"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-xl bg-gray-50 dark:bg-gray-800/60 p-2.5 border border-gray-100 dark:border-gray-750">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#70C100] text-xs font-black text-black uppercase">
                  {user?.name?.charAt(0) || 'A'}
                </div>
                <div className="overflow-hidden">
                  <p className="truncate text-xs font-semibold text-gray-900 dark:text-gray-100">{user?.name || 'Administrator'}</p>
                  <p className="truncate text-[10px] text-gray-500 dark:text-gray-400">{user?.email || 'admin@email.com'}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                title="Sign out"
                className="rounded-lg p-1.5 text-gray-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Drawer Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-transform duration-200 ease-in-out md:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-gray-100 dark:border-gray-800 px-5">
          <NavLink
            to="/admin/dashboard"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2.5"
          >
            <KadyLogo className="h-6 w-auto" />
          </NavLink>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item, index) => {
            if (item.section) {
              return (
                <div
                  key={index}
                  className="px-3 pt-4 pb-1 text-[10px] font-bold tracking-wider text-gray-400 dark:text-gray-500 uppercase"
                >
                  {item.section}
                </div>
              );
            }

            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-[#70C100]/15 dark:bg-[#70C100]/15 text-[#4e8500] dark:text-[#84e000] border border-[#70C100]/30 shadow-2xs font-bold'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-gray-100'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="rounded-md bg-[#70C100] px-1.5 py-0.5 text-[9px] font-black text-black shadow-2xs">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* User Profile & Logout */}
        <div className="border-t border-gray-100 dark:border-gray-800 p-3">
          <div className="flex items-center justify-between rounded-xl bg-gray-50 dark:bg-gray-800/60 p-2.5 border border-gray-100 dark:border-gray-750">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#70C100] text-xs font-black text-black uppercase">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="truncate text-xs font-semibold text-gray-900 dark:text-gray-100">{user?.name || 'Administrator'}</p>
                <p className="truncate text-[10px] text-gray-500 dark:text-gray-400">{user?.email || 'admin@email.com'}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              title="Sign out"
              className="rounded-lg p-1.5 text-gray-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

    </>
  );
};
