import React from 'react';
import { X, Printer, Mail, Phone, Award, Briefcase, GraduationCap, Code } from 'lucide-react';
import { motion } from 'framer-motion';

const GithubIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const ResumeModal = ({ 
  isOpen, 
  onClose, 
  profile, 
  experiences = [], 
  projects = [], 
  skills = [], 
  achievements = [] 
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (skill.is_active) {
      const cat = skill.category || 'Other';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(skill);
    }
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm print:p-0 print:bg-white print:static">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 print:hidden"
      />

      {/* Modal Container */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col print:shadow-none print:rounded-none print:w-full print:max-w-none print:max-h-none print:overflow-visible print:bg-white"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 print:hidden rounded-t-2xl">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <span>Interactive Resume Viewer</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Fully dynamic resume generated directly from your portfolio database.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all neon-glow neon-glow-hover active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="p-8 md:p-12 print:p-0 bg-white text-slate-800 dark:bg-slate-900 dark:text-slate-200 print:text-black print:bg-white overflow-y-auto print:overflow-visible flex-grow">
          <style dangerouslySetInnerHTML={{__html: `
            @media print {
              body * {
                visibility: hidden;
              }
              .print\\:static, .print\\:static * {
                visibility: visible;
              }
              .print\\:static {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                margin: 0;
                padding: 0;
                box-shadow: none !important;
                background: white !important;
                color: black !important;
              }
              .dark {
                color-scheme: light !important;
              }
            }
          `}} />

          <div className="print:static w-full">
            {/* Header / Name Card */}
            <div className="border-b-2 border-indigo-600 dark:border-indigo-500 pb-6 mb-8 print:border-black print:pb-4 print:mb-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white print:text-black tracking-tight">
                    {profile?.full_name || "Jeshintha X"}
                  </h1>
                  <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 print:text-black mt-1 uppercase tracking-wide">
                    {profile?.title || "Computer Science Engineering Student"}
                  </p>
                </div>
                {/* Social Links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm text-slate-600 dark:text-slate-400 print:text-black">
                  {profile?.social_links?.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-indigo-600 dark:text-indigo-400 print:text-black" />
                      <span>{profile.social_links.email}</span>
                    </div>
                  )}
                  {profile?.social_links?.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-indigo-600 dark:text-indigo-400 print:text-black" />
                      <span>{profile.social_links.phone}</span>
                    </div>
                  )}
                  {profile?.social_links?.linkedin && (
                    <a 
                      href={profile.social_links.linkedin.startsWith('http') ? profile.social_links.linkedin : `https://${profile.social_links.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 hover:text-indigo-650 dark:hover:text-indigo-400 transition-colors"
                    >
                      <LinkedinIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400 print:text-black" />
                      <span className="text-xs break-all">linkedin.com/in/jeshintha-x-8b3b60294</span>
                    </a>
                  )}
                  {profile?.social_links?.github && (
                    <a 
                      href={profile.social_links.github.startsWith('http') ? profile.social_links.github : `https://${profile.social_links.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 hover:text-indigo-650 dark:hover:text-indigo-400 transition-colors"
                    >
                      <GithubIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400 print:text-black" />
                      <span className="text-xs break-all">github.com/jesxav2005-coder</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Resume Content Body */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 print:gap-6">
              {/* Left Column (Bio, Experience, Projects) */}
              <div className="lg:col-span-8 flex flex-col gap-6 print:col-span-8">
                {/* Summary */}
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white print:text-black border-b border-slate-200 dark:border-slate-800 print:border-black pb-1 mb-3 uppercase tracking-wider">
                    Professional Summary
                  </h2>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 print:text-black">
                    {profile?.bio}
                  </p>
                </div>

                {/* Education */}
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white print:text-black border-b border-slate-200 dark:border-slate-800 print:border-black pb-1 mb-3 uppercase tracking-wider">
                    Education
                  </h2>
                  <div className="space-y-4">
                    {/* B.E. College */}
                    <div className="relative pl-4 border-l border-slate-250 dark:border-slate-800 print:border-black">
                      <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700 print:bg-black" />
                      <div className="flex justify-between items-start flex-wrap gap-1">
                        <h3 className="font-bold text-slate-900 dark:text-white print:text-black text-sm">
                          Bachelor of Engineering (B.E) in Computer Science & Engineering
                        </h3>
                        <span className="text-xs text-slate-400 dark:text-slate-500 print:text-black font-semibold">
                          2023 - 2027 [Present]
                        </span>
                      </div>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 print:text-black font-semibold mt-1">
                        Prince Dr. K. Vasudevan College of Engineering and Technology
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 print:text-black mt-1">
                        CGPA: 84.5%
                      </p>
                    </div>

                    {/* Class XII */}
                    <div className="relative pl-4 border-l border-slate-250 dark:border-slate-800 print:border-black">
                      <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700 print:bg-black" />
                      <div className="flex justify-between items-start flex-wrap gap-1">
                        <h3 className="font-bold text-slate-900 dark:text-white print:text-black text-sm">
                          Higher Secondary (Class XII)
                        </h3>
                        <span className="text-xs text-slate-400 dark:text-slate-500 print:text-black font-semibold">
                          2022 - 2023
                        </span>
                      </div>
                      <p className="text-xs text-slate-650 dark:text-slate-450 print:text-black mt-1">
                        Revoor Padmanaba Chettiar Mat High Sec School
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 print:text-black mt-1">
                        Mark: 490 / 600
                      </p>
                    </div>

                    {/* Class X */}
                    <div className="relative pl-4 border-l border-slate-250 dark:border-slate-800 print:border-black">
                      <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700 print:bg-black" />
                      <div className="flex justify-between items-start flex-wrap gap-1">
                        <h3 className="font-bold text-slate-900 dark:text-white print:text-black text-sm">
                          Secondary School (Class X)
                        </h3>
                        <span className="text-xs text-slate-400 dark:text-slate-500 print:text-black font-semibold">
                          2020 - 2021
                        </span>
                      </div>
                      <p className="text-xs text-slate-650 dark:text-slate-450 print:text-black mt-1">
                        V.O.C Mat High Sec School
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 print:text-black mt-1">
                        All Pass (Corona Batch)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Experience Timeline */}
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white print:text-black border-b border-slate-200 dark:border-slate-800 print:border-black pb-1 mb-3 uppercase tracking-wider">
                    Internships & Experience
                  </h2>
                  <div className="space-y-4">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="relative pl-4 border-l border-indigo-500 print:border-black">
                        <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-600 print:bg-black" />
                        <div className="flex justify-between items-start flex-wrap gap-1">
                          <h3 className="font-bold text-slate-900 dark:text-white print:text-black text-sm">
                            {exp.role} — <span className="text-indigo-600 dark:text-indigo-400 print:text-black font-semibold">{exp.company}</span>
                          </h3>
                          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 print:text-black">
                            {exp.start_date} - {exp.end_date}
                          </span>
                        </div>
                        {exp.location && (
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5 print:text-black">
                            📍 {exp.location}
                          </p>
                        )}
                        <p className="text-xs text-slate-600 dark:text-slate-400 print:text-black mt-2 whitespace-pre-line leading-relaxed">
                          {exp.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Projects */}
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white print:text-black border-b border-slate-200 dark:border-slate-800 print:border-black pb-1 mb-3 uppercase tracking-wider">
                    Key Projects
                  </h2>
                  <div className="space-y-4">
                    {projects.map((proj) => (
                      <div key={proj.id} className="relative pl-4 border-l border-slate-250 dark:border-slate-800 print:border-black">
                        <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700 print:bg-black" />
                        <div className="flex justify-between items-start flex-wrap gap-1">
                          <h3 className="font-bold text-slate-900 dark:text-white print:text-black text-sm">
                            {proj.title}
                          </h3>
                          <span className="text-xs text-slate-400 dark:text-slate-500 print:text-black font-semibold">
                            {proj.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-650 dark:text-slate-450 print:text-black mt-1">
                          {proj.description}
                        </p>
                        {proj.tech_stack && (
                          <p className="text-[10px] text-indigo-600 dark:text-indigo-400 print:text-black font-mono mt-1.5">
                            Technologies: {proj.tech_stack.join(', ')}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column (Skills, Achievements) */}
              <div className="lg:col-span-4 flex flex-col gap-6 print:col-span-4">
                {/* Skills */}
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white print:text-black border-b border-slate-200 dark:border-slate-800 print:border-black pb-1 mb-3 uppercase tracking-wider">
                    Skills
                  </h2>
                  <div className="space-y-4">
                    {Object.keys(skillsByCategory).map((cat) => (
                      <div key={cat}>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 print:text-black mb-1.5">
                          {cat}
                        </h3>
                        <div className="flex flex-wrap gap-1.5">
                          {skillsByCategory[cat].map((s) => (
                            <span 
                              key={s.id} 
                              className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 print:bg-white print:text-black print:border print:border-slate-300 text-xs rounded font-medium"
                            >
                              {s.name} ({s.proficiency}%)
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Achievements / Honors */}
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white print:text-black border-b border-slate-200 dark:border-slate-800 print:border-black pb-1 mb-3 uppercase tracking-wider">
                    Honors & Awards
                  </h2>
                  <div className="space-y-3">
                    {achievements.map((ach) => (
                      <div key={ach.id} className="flex gap-2.5 items-start">
                        <Award className="w-4 h-4 text-violet-500 dark:text-violet-400 print:text-black shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white print:text-black text-xs">
                            {ach.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 print:text-black mt-0.5">
                            {ach.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Extracurricular / Core Leadership Roles */}
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white print:text-black border-b border-slate-200 dark:border-slate-800 print:border-black pb-1 mb-3 uppercase tracking-wider">
                    Activities
                  </h2>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 print:text-black space-y-2 list-disc pl-4">
                    <li>National-level Boxing Champion at Anna University</li>
                    <li>National Cadet Corps (NCC) Cadet (Discipline & leadership training)</li>
                    <li>Coordinator & Lead Designer in the College Web Development Club</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResumeModal;
