import React from 'react';
import { ExternalLink, Award } from 'lucide-react';
import projectPlaceholder from '../../assets/project_placeholder.svg';

export const CertCard = ({ 
  title, 
  issuer, 
  image_url, 
  credential_url, 
  issued_date, 
  expiry_date 
}) => {
  const image = image_url || projectPlaceholder;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col sm:flex-row transition-all duration-300 hover:shadow-md neon-glow-hover group">
      {/* Cert Image */}
      <a 
        href={credential_url || '#'} 
        target={credential_url ? "_blank" : undefined} 
        rel="noopener noreferrer" 
        className={`w-full sm:w-1/3 aspect-video sm:aspect-auto sm:h-full relative overflow-hidden bg-slate-100 dark:bg-slate-950 flex items-center justify-center ${credential_url ? 'cursor-pointer hover:opacity-90' : 'cursor-default'}`}
      >
        {image_url ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => { e.target.src = projectPlaceholder; }}
          />
        ) : (
          <div className="w-full h-32 sm:h-full flex items-center justify-center bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500">
            <Award className="w-12 h-12" />
          </div>
        )}
      </a>

      {/* Details */}
      <div className="p-6 md:p-8 flex flex-col justify-between flex-grow">
        <div>
          <span className="text-sm sm:text-base font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            {issuer}
          </span>
          <h4 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mt-1.5 mb-2.5">
            {credential_url ? (
              <a 
                href={credential_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
              >
                {title}
              </a>
            ) : title}
          </h4>
          <p className="text-sm sm:text-base text-slate-400 dark:text-slate-500 mb-5">
            Issued: {issued_date} {expiry_date ? ` | Expires: ${expiry_date}` : ''}
          </p>
        </div>

        {credential_url && (
          <div className="mt-2">
            <a
              href={credential_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-white bg-slate-900 hover:bg-indigo-600 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-indigo-400 dark:hover:text-white px-4.5 py-2.5 rounded-xl transition-all neon-glow-hover"
            >
              <span>Verify Credential</span>
              <ExternalLink className="w-4 h-4 sm:w-5 h-5" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
export default CertCard;
