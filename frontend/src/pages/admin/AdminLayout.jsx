import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';
import Sidebar from '../../components/admin/Sidebar';
import Loader from '../../components/common/Loader';

export const AdminLayout = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { adminGetDashboard } = useApi();

  // Query unread message counts from Dashboard endpoint
  const { data: dashboardData } = useQuery({
    queryKey: ['adminDashboardCount'],
    queryFn: async () => {
      const res = await adminGetDashboard();
      return res.data.data;
    },
    enabled: isAuthenticated,
    refetchInterval: 30000, // Poll every 30 seconds for new messages
  });

  if (authLoading) {
    return <Loader fullScreen={true} />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const unreadCount = dashboardData?.unread_messages_count || 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      {/* Fixed Sidebar */}
      <Sidebar unreadCount={unreadCount} />

      {/* Content wrapper */}
      <div className="flex-grow pl-16 md:pl-60 min-h-screen flex flex-col">
        {/* Main Panel */}
        <main className="flex-grow p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default AdminLayout;
