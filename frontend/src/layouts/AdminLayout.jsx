import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../components/common/AdminSidebar';
import { AdminHeader } from '../components/common/AdminHeader';

export const AdminLayout = ({ title, subtitle }) => {
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('kady-sidebar-collapsed') === 'true';
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setMobileOpen((prev) => !prev);
    } else {
      setCollapsed((prev) => {
        const next = !prev;
        localStorage.setItem('kady-sidebar-collapsed', String(next));
        return next;
      });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans">
      <AdminSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <div
        className={`flex flex-col min-h-screen transition-all duration-200 ease-in-out ${
          collapsed ? 'md:pl-[72px]' : 'md:pl-64'
        }`}
      >
        <AdminHeader
          title={title}
          subtitle={subtitle}
          onToggleSidebar={toggleSidebar}
          isSidebarCollapsed={collapsed}
        />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};




