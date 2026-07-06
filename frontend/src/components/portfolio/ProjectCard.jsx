import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Code } from 'lucide-react';
import projectPlaceholder from '../../assets/project_placeholder.svg';

const GithubIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export const ProjectCard = ({ 
  title, 
  description, 
  screenshot_url, 
  github_url, 
  demo_url, 
  tech_stack = [], 
  status,
  onViewDetails
}) => {
  const screenshot = screenshot_url || projectPlaceholder;

  return (
    <motion.div
      whileHover={{ 
        y: -6, 
        boxShadow: 'var(--neon-shadow-hover)',
        borderColor: 'var(--color-border-hover)'
      }}
      onClick={onViewDetails}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col h-full transition-all duration-300 cursor-pointer group"
    >
      {/* Project Screenshot */}
      <div className="relative aspect-video overflow-hidden bg-slate-50 dark:bg-slate-950">
        <img
          src={screenshot}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { e.target.src = projectPlaceholder; }}
        />
        {status && (
          <span className={`absolute top-4 right-4 px-3 py-1.5 text-xs sm:text-sm font-bold rounded-full shadow-md ${
            status === 'Completed' 
              ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800' 
              : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
          }`}>
            {status}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="p-6 md:p-8 flex flex-col flex-grow">
        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-3 leading-tight group-hover:text-indigo-600 dark:group-hover:text-violet-500 transition-colors">
          {title}
        </h3>
        <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 dark:text-slate-400 mb-5 flex-grow line-clamp-3">
          {description}
        </p>

        {/* Tech Stack Chips */}
        <div className="flex flex-wrap gap-2.5 mb-6">
          {tech_stack.map((tech) => (
            <span
              key={tech}
              className="text-sm sm:text-base lg:text-lg font-bold px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-500 border border-indigo-200 dark:border-indigo-800"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4 mt-auto">
          {github_url ? (
            <a
              href={github_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 text-base sm:text-lg lg:text-xl font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-violet-500 transition-colors"
            >
              <GithubIcon className="w-5 h-5 lg:w-6 lg:h-6" />
              <span>Code</span>
            </a>
          ) : (
            <span className="flex items-center gap-2 text-base sm:text-lg lg:text-xl text-slate-300 dark:text-slate-700 cursor-not-allowed">
              <GithubIcon className="w-5 h-5 lg:w-6 lg:h-6" />
              <span>Private</span>
            </span>
          )}

          {demo_url ? (
            <a
              href={demo_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 text-base sm:text-lg lg:text-xl font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-violet-500 transition-colors"
            >
              <span>Live Demo</span>
              <ExternalLink className="w-5 h-5 lg:w-6 lg:h-6" />
            </a>
          ) : (
            <span className="flex items-center gap-2 text-base sm:text-lg lg:text-xl text-slate-300 dark:text-slate-700 cursor-not-allowed">
              <span>Internal</span>
              <ExternalLink className="w-5 h-5 lg:w-6 lg:h-6" />
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
export default ProjectCard;
