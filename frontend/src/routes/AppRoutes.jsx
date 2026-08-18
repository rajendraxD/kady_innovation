import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { MainLayout } from '../layouts/MainLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Public Pages
import { HomePage } from '../pages/HomePage';
import { JobsPage } from '../pages/JobsPage';
import { JobDetailsPage } from '../pages/JobDetailsPage';
import { ApplyJobPage } from '../pages/ApplyJobPage';
import { ApplicationStatusPage } from '../pages/ApplicationStatusPage';

// Admin Pages
import { AdminLoginPage } from '../pages/AdminLoginPage';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';
import { AdminJobsPage } from '../pages/AdminJobsPage';
import { AdminCandidatesPage } from '../pages/AdminCandidatesPage';
import { AdminPipelinePage } from '../pages/AdminPipelinePage';
import { AdminMeetingsPage } from '../pages/AdminMeetingsPage';
import { AdminSelectedPage } from '../pages/AdminSelectedPage';
import { AdminResumeBuddyPage } from '../pages/AdminResumeBuddyPage';
import { AdminRecycleBinPage } from '../pages/AdminRecycleBinPage';
import { AdminSettingsPage } from '../pages/AdminSettingsPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Candidate Portal */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />
        <Route path="/apply/:id" element={<ApplyJobPage />} />
        <Route path="/track-status" element={<ApplicationStatusPage />} />
      </Route>

      {/* Admin Login */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Protected Admin Portal */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="jobs" element={<AdminJobsPage />} />
          <Route path="candidates" element={<AdminCandidatesPage />} />
          <Route path="pipeline" element={<AdminPipelinePage />} />
          <Route path="meetings" element={<AdminMeetingsPage />} />
          <Route path="selected" element={<AdminSelectedPage />} />
          <Route path="resume-buddy" element={<AdminResumeBuddyPage />} />
          <Route path="recycle-bin" element={<AdminRecycleBinPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
