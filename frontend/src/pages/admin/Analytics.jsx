import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  BarChart, 
  Bar,
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
import { Calendar, Globe, Monitor, Compass } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import Loader from '../../components/common/Loader';

const PIE_COLORS = ['#4f46e5', '#a855f7', '#06b6d4'];

export const Analytics = () => {
  const { adminGetAnalytics } = useApi();
  const [days, setDays] = useState(30);

  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['adminAnalytics', days],
    queryFn: async () => {
      const res = await adminGetAnalytics(days);
      return res.data.data;
    }
  });

  if (isLoading) return <Loader />;

  const {
    daily_visitors = [],
    top_pages = [],
    device_chart = [],
    countries = []
  } = analyticsData || {};

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Analytics Logs
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Track visitor footprints, device usage, and geo-IP lookup data.
          </p>
        </div>

        {/* Date Filter */}
        <div className="flex bg-white dark:bg-slate-905 border border-slate-200 dark:border-slate-800 rounded-xl p-1 shadow-sm self-start">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                days === d
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-650 hover:bg-slate-100 dark:text-slate-350 dark:hover:bg-slate-800'
              }`}
            >
              Last {d} Days
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Unique Visitors */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
          <h3 className="text-md font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <span>Unique Visitors</span>
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={daily_visitors}>
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

        {/* Device split */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
          <h3 className="text-md font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <Monitor className="w-4 h-4 text-indigo-500" />
            <span>Devices Split</span>
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

      {/* Grid of Tables / Sub Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 pages visited */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
          <h3 className="text-md font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-500" />
            <span>Top Pages Visited</span>
          </h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top_pages} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:hidden" />
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" className="hidden dark:block" />
                <XAxis type="number" stroke="#94a3b8" fontSize={10} />
                <YAxis type="category" dataKey="page" stroke="#94a3b8" fontSize={10} width={90} />
                <Tooltip 
                  contentStyle={{ 
                    background: '#1e293b', 
                    border: 'none', 
                    borderRadius: '8px', 
                    color: '#fff', 
                    fontSize: '12px' 
                  }} 
                />
                <Bar dataKey="visits" fill="#818cf8" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Country tables */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300 flex flex-col">
          <h3 className="text-md font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-500" />
            <span>Visitor Locations (Top Countries)</span>
          </h3>
          
          <div className="flex-grow overflow-y-auto max-h-[260px] border border-slate-100 dark:border-slate-800 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/20 text-slate-550 text-[10px] font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                  <th className="px-6 py-2.5">Country</th>
                  <th className="px-6 py-2.5 text-right">Visits</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm">
                {countries.map((c, idx) => (
                  <tr key={idx} className="text-slate-700 dark:text-slate-300 hover:bg-slate-50/50 dark:hover:bg-slate-950/10">
                    <td className="px-6 py-3 font-semibold">{c.country}</td>
                    <td className="px-6 py-3 text-right font-bold text-slate-500">{c.visits}</td>
                  </tr>
                ))}
                {countries.length === 0 && (
                  <tr>
                    <td colSpan="2" className="px-6 py-8 text-center text-slate-500">
                      No country visitor data recorded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Analytics;
