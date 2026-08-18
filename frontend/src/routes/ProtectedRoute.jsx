import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { checkAuth } from '../features/auth/authSlice';

export const ProtectedRoute = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    dispatch(checkAuth()).finally(() => {
      setChecking(false);
    });
  }, [dispatch]);

  if (checking || loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-3 border-[#70C100] border-t-transparent" />
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Verifying secure admin session...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
};
