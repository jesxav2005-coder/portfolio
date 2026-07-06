import React from 'react';

export const StatCard = ({ title, value, icon, description }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex items-center justify-between transition-colors duration-300 hover:shadow-md">
      <div>
        <span className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          {value}
        </h3>
        {description && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
            {description}
          </p>
        )}
      </div>
      <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl text-indigo-600 dark:text-indigo-400">
        {icon}
      </div>
    </div>
  );
};
export default StatCard;
