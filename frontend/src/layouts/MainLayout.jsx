import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';

export const MainLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-[#fafbfc] dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans selection:bg-[#70C100]/30 selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};


