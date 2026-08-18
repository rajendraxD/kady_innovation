import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Bell, ExternalLink, PanelLeft } from 'lucide-react';
import { fetchNotifications, decrementUnread } from '../../features/notifications/notificationsSlice';
import { notificationApi } from '../../api/aiApi';
import { ThemeToggle } from './ThemeToggle';

export const AdminHeader = ({
  title = 'Dashboard',
  subtitle = 'Welcome back to your hiring pipeline',
  onToggleSidebar = () => {},
  isSidebarCollapsed = false
}) => {
  const dispatch = useDispatch();
  const { items: notifications, unreadCount } = useSelector((state) => state.notifications);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkRead = async (id) => {
    try {
      await notificationApi.markAsRead(id);
      dispatch(decrementUnread());
      dispatch(fetchNotifications());
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 px-4 md:px-8 backdrop-blur-xs">
      {/* Page Title & Sidebar Toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar menu"
          title="Toggle sidebar menu (Ctrl+B)"
          className="rounded-xl p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors cursor-pointer border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xs"
        >
          <PanelLeft className="h-4.5 w-4.5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">{title}</h1>
          {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">{subtitle}</p>}
        </div>
      </div>


      {/* Header Utilities */}
      <div className="flex items-center gap-3">
       
        {/* View Public Portal */}
        <Link
          to="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 shadow-2xs hover:bg-gray-50 dark:hover:bg-gray-750 hover:text-[#4e8500] dark:hover:text-[#84e000] transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">View Public Portal</span>
        </Link>

         {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-xl p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors cursor-pointer border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
          >
            <Bell className="h-4.5 w-4.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-2xs">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50 animate-in fade-in-50 zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 px-4 py-3 bg-gray-50/50 dark:bg-gray-800/50">
                <span className="text-xs font-bold text-gray-900 dark:text-gray-100">Notifications</span>
                <button
                  type="button"
                  onClick={() => handleMarkRead('all')}
                  className="text-[11px] font-medium text-[#4e8500] dark:text-[#84e000] hover:underline cursor-pointer"
                >
                  Mark all as read
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-800">
                {notifications.length === 0 ? (
                  <p className="p-4 text-center text-xs text-gray-400 dark:text-gray-500">No notifications right now.</p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif._id}
                      onClick={() => handleMarkRead(notif._id)}
                      className={`p-3 text-xs transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/60 cursor-pointer ${
                        !notif.read ? 'bg-[#70C100]/10 dark:bg-[#70C100]/10' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900 dark:text-gray-150">{notif.title}</span>
                        {!notif.read && <span className="h-1.5 w-1.5 rounded-full bg-[#70C100]" />}
                      </div>
                      <p className="mt-0.5 text-gray-600 dark:text-gray-400 leading-snug">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

