import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  Users, 
  MessageSquare, 
  FolderGit2, 
  Briefcase,
  Award,
  Eye,
  MailOpen,
  Calendar
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import { useApi } from '../../hooks/useApi';
import StatCard from '../../components/admin/StatCard';
import Loader from '../../components/common/Loader';
import { formatDate } from '../../utils/helpers';

const PIE_COLORS = ['#4f46e5', '#a855f7', '#06b6d4'];

export const Dashboard = () => {
  const { adminGetDashboard, adminMarkMessageRead } = useApi();
  const queryClient = useQueryClient();

  const { data: metrics, isLoading } = useQuery({
    queryKey: ['adminDashboard'],
    queryFn: async () => {
      const res = await adminGetDashboard();
      return res.data.data;
    }
  });

  const markReadMutation = useMutation({
    mutationFn: (id) => adminMarkMessageRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminDashboard']);
    }
  });

  if (isLoading) return <Loader />;

  const {
    total_visitors = 0,
    unread_messages_count = 0,
    active_projects_count = 0,
    certificates_count = 0,
    experiences_count = 0,
    recent_messages = [],
    visitor_chart = [],
    device_chart = []
  } = metrics || {};

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          A summary of your website metrics and recent messages.
        </p>
      </div>

      {/* 5 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <StatCard
          title="Total Unique Visitors"
          value={total_visitors}
          icon={<Users className="w-6 h-6" />}
          description="All-time unique IP hashes"
        />
        <StatCard
          title="Unread Messages"
          value={unread_messages_count}
          icon={<MessageSquare className="w-6 h-6" />}
          description="Awaiting response"
        />
        <StatCard
          title="Active Projects"
          value={active_projects_count}
          icon={<FolderGit2 className="w-6 h-6" />}
          description="Showcased on portfolio"
        />
        <StatCard
          title="Experiences"
          value={experiences_count}
          icon={<Briefcase className="w-6 h-6" />}
          description="Internships & jobs"
        />
        <StatCard
          title="Certificates"
          value={certificates_count}
          icon={<Award className="w-6 h-6" />}
          description="Earned credentials"
        />
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart - 2 cols width on large screens */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
          <h3 className="text-md font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <span>Daily Visitors (Last 30 Days)</span>
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={visitor_chart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:hidden" />
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" className="hidden dark:block" />
                <XAxis 
                  dataKey="date" 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  tickFormatter={(val) => val.split('-').slice(1).join('/')}
                />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip 
                  contentStyle={{ 
                    background: '#1e293b', 
                    border: 'none', 
                    borderRadius: '8px', 
                    color: '#fff', 
                    fontSize: '12px' 
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="visitors" 
                  stroke="#4f46e5" 
                  strokeWidth={3} 
                  activeDot={{ r: 6 }} 
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Doughnut Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
          <h3 className="text-md font-bold text-slate-800 dark:text-slate-200 mb-4">
            Device Distribution
          </h3>
          <div className="h-[250px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={device_chart}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {device_chart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: '#1e293b', 
                    border: 'none', 
                    borderRadius: '8px', 
                    color: '#fff', 
                    fontSize: '12px' 
                  }} 
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Messages table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-md font-bold text-slate-800 dark:text-slate-200">
            Recent Messages
          </h3>
          <Link
            to="/admin/messages"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
          >
            View All Messages
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/20 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Subject</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm">
              {recent_messages.map((msg) => (
                <tr 
                  key={msg.id}
                  className={`hover:bg-slate-50/50 dark:hover:bg-slate-950/10 transition-colors ${
                    !msg.is_read ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold ${
                      !msg.is_read 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 animate-pulse' 
                        : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {!msg.is_read ? 'New' : 'Read'}
                    </span>
                  </td>
                  <td className="px-6 py-4">{msg.name}</td>
                  <td className="px-6 py-4 truncate max-w-xs">{msg.subject}</td>
                  <td className="px-6 py-4 text-xs text-slate-400">{formatDate(msg.created_at)}</td>
                  <td className="px-6 py-4 text-right">
                    {!msg.is_read && (
                      <button
                        onClick={() => markReadMutation.mutate(msg.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Mark as read"
                      >
                        <MailOpen className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {recent_messages.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                    No recent messages.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
