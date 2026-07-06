import React from 'react';

export const Loader = ({ size = 'medium', fullScreen = false }) => {
  const sizeClasses = {
    small: 'w-4 h-4 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-16 h-16 border-4',
  };

  const spinner = (
    <div
      className={`animate-spin rounded-full border-indigo-600 border-t-transparent ${sizeClasses[size]}`}
      role="status"
      aria-label="loading"
    ></div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-50/70 dark:bg-slate-950/70 backdrop-blur-sm z-50 transition-all duration-300">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full py-6">
      {spinner}
    </div>
  );
};
export default Loader;
