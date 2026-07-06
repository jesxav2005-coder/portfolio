import React from 'react';
import { X, ExternalLink, Cpu, Database, Layout, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import projectPlaceholder from '../../assets/project_placeholder.svg';

const GithubIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

// Custom rich project detail mapping
const projectDetailsContent = {
  "Punch Detector – AutoScore": {
    challenge: "Traditional combat sports scoring is highly subjective and lacks analytical feedback for training athletes. Capturing microsecond-level punch velocity and force requires low-latency hardware integration.",
    solution: "Designed an IoT boxing glove glove module using ESP32, an MPU6050 accelerometer/gyroscope, and force-sensitive resistors. The glove streams sensor logs over WebSockets to a FastAPI server, which scores punches in real-time and renders stats on an interactive training dashboard.",
    architecture: "ESP32 Sensor Glove ➔ WebSocket Stream ➔ FastAPI Backend Analytics ➔ React.js Live Dashboard & SQLite Storage.",
    features: [
      "Real-time impact force measurement (in G-force/Newtons).",
      "WebSocket integration for sub-50ms latency scoring visualization.",
      "Custom athlete training profiles showing punch speed trends.",
      "Integrated audio feedback alerts for impact threshold achievements."
    ]
  },
  "Retail SOP AI Assistant": {
    challenge: "Retail floor associates spend considerable time looking up standard operating procedures (SOPs) in dense manuals, causing delays in operations and customer service bottlenecks.",
    solution: "Developed an AI-powered conversational assistant that indexes company policy documents. Using LangChain and a custom RAG pipeline, the assistant parses natural language queries and extracts role-specific, actionable operational instructions in seconds.",
    architecture: "PDF Policy Parser ➔ Vector Embeddings DB ➔ FastAPI Endpoint ➔ Anthropic Claude API ➔ React Chat client with feedback analytics.",
    features: [
      "Role-based search gating (Manager, cashier, stockroom clearance levels).",
      "Strict grounding context to prevent LLM hallucinations about policy guidelines.",
      "Admin analytics panel tracking common operational friction points.",
      "One-click feedback flagging for incorrect or outdated procedures."
    ]
  },
  "Smart College Canteen Pre-Booking & Demand Forecasting Platform": {
    challenge: "College canteens face extreme lunch-hour queues (exceeding 20 minutes) and suffer from 30%+ daily food wastage due to unpredictable campus attendance.",
    solution: "Built a mobile-first pre-ordering web application with secure payments and QR codes for pickups. Integrated a scikit-learn forecasting model in the backend to predict food order quantities based on past sales patterns, weather, and exam schedules.",
    architecture: "React.js Client ➔ FastAPI Backend ➔ SQLite Database ➔ Razorpay Payment Gateway ➔ scikit-learn Linear Regression model.",
    features: [
      "Secure pre-booking checkout using HMAC signature verification.",
      "Dynamic order validation via cryptographically-signed QR codes.",
      "Predictive kitchen dashboard reducing daily food ingredient waste.",
      "Real-time order status tracking with WebSocket notifications."
    ]
  },
  "AI-Assisted Portfolio Website": {
    challenge: "Generic developer portfolios fail to engage recruiters and lack secure methods to showcase full-stack capabilities, like live API logs or conversational widgets.",
    solution: "Constructed this responsive full-stack portfolio. It integrates a secure admin panel, active visitor tracking, and an interactive AI chatbot trained on resume details, highlighting advanced frontend and backend design patterns.",
    architecture: "Vite + Tailwind CSS + Framer Motion ➔ Flask (Python) ➔ SQLite database ➔ Nginx reverse proxy routing.",
    features: [
      "Secure Admin dashboard with dashboard analytics and CRUD panels.",
      "Full visitor session logging (pages, devices, locations).",
      "Interactive chatbot powered by Claude API with context parsing.",
      "Custom print stylesheet rendering A4-ready resume PDF exports."
    ]
  }
};

export const ProjectDetailsModal = ({ isOpen, onClose, project }) => {
  if (!isOpen || !project) return null;

  const content = projectDetailsContent[project.title] || {
    challenge: "Details about challenges faced during construction are stored in the documentation.",
    solution: "Developed using clean, modular programming principles with full code repositories available on GitHub.",
    architecture: "React Client Interface ➔ Backend APIs ➔ Database server.",
    features: ["Clean code design", "Responsive frontend framework", "Interactive controls"]
  };

  const image = project.screenshot_url || projectPlaceholder;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0"
      />

      {/* Modal Box */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col transition-colors duration-300 text-slate-900 dark:text-white"
      >
        {/* Header Image Cover */}
        <div className="relative aspect-video sm:aspect-[21/9] bg-slate-50 dark:bg-slate-950 overflow-hidden shrink-0">
          <img 
            src={image} 
            alt={project.title} 
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = projectPlaceholder; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Close Button on Top Right */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors focus:outline-none"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white">
            <span className="px-3 py-1.5 bg-indigo-600 rounded-md text-xs sm:text-sm uppercase font-bold tracking-wider">
              {project.status || "Completed"}
            </span>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mt-2 tracking-tight">
              {project.title}
            </h3>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Top Quick Meta */}
          <div className="flex flex-wrap gap-4 items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="text-sm sm:text-base lg:text-lg text-slate-500 dark:text-slate-400 font-semibold">
              Project Duration: {project.start_date || "2024"} {project.end_date ? `to ${project.end_date}` : ""}
            </div>
            
            {/* Project Links */}
            <div className="flex gap-4">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-sm sm:text-base font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 transition-colors"
                >
                  <GithubIcon className="w-4 h-4 sm:w-5 h-5" />
                  <span>Repository</span>
                </a>
              )}
              {project.demo_url && (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-sm sm:text-base font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-300 dark:bg-indigo-500 dark:hover:bg-violet-500 dark:hover:text-slate-950 dark:hover:shadow-[0_0_12px_rgba(15,240,252,0.5)]"
                >
                  <ExternalLink className="w-4 h-4 sm:w-5 h-5" />
                  <span>Live Demo</span>
                </a>
              )}
            </div>
          </div>

          {/* Grid Layout for details */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Main Story Details */}
            <div className="md:col-span-8 space-y-6">
              {/* Challenge */}
              <div>
                <h4 className="text-sm sm:text-base font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-2 mb-2.5">
                  <ShieldAlert className="w-5 h-5 text-indigo-650 dark:text-indigo-400" />
                  <span>The Challenge</span>
                </h4>
                <p className="text-base sm:text-lg lg:text-xl text-slate-650 dark:text-slate-300 leading-relaxed">
                  {content.challenge}
                </p>
              </div>

              {/* Solution */}
              <div>
                <h4 className="text-sm sm:text-base font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-2 mb-2.5">
                  <Cpu className="w-5 h-5 text-indigo-650 dark:text-indigo-400" />
                  <span>The Solution</span>
                </h4>
                <p className="text-base sm:text-lg lg:text-xl text-slate-650 dark:text-slate-300 leading-relaxed">
                  {content.solution}
                </p>
              </div>

              {/* System Architecture */}
              <div>
                <h4 className="text-sm sm:text-base font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-2 mb-2.5">
                  <Database className="w-5 h-5 text-indigo-650 dark:text-indigo-400" />
                  <span>Architecture</span>
                </h4>
                <p className="text-sm sm:text-base lg:text-lg font-mono text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 leading-relaxed">
                  {content.architecture}
                </p>
              </div>
            </div>

            {/* Features & Stack Panel */}
            <div className="md:col-span-4 space-y-6">
              {/* Features list */}
              <div>
                <h4 className="text-sm sm:text-base font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-2 mb-3">
                  <Layout className="w-5 h-5 text-indigo-650 dark:text-indigo-400" />
                  <span>Key Features</span>
                </h4>
                <ul className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-400 space-y-2 list-disc pl-5 leading-relaxed">
                  {content.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>

              {/* Tech Stack list */}
              <div>
                <h4 className="text-sm sm:text-base font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3">
                  Technologies Used
                </h4>
                <div className="flex flex-wrap gap-2.5">
                  {project.tech_stack?.map((t, idx) => (
                    <span 
                      key={idx} 
                      className="px-3.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm sm:text-base lg:text-lg font-bold text-slate-600 dark:text-slate-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectDetailsModal;
