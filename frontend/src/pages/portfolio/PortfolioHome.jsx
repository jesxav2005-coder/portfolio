import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Play, Pause, Award, Calendar, MapPin, Mail, Sparkles, ChevronDown, Briefcase, GraduationCap } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Loader from '../../components/common/Loader';
import HeroSection from '../../components/portfolio/HeroSection';
import SkillBar from '../../components/portfolio/SkillBar';
import RoamingTechStack from '../../components/portfolio/RoamingTechStack';
import ProjectCard from '../../components/portfolio/ProjectCard';
import CertificationsSection from '../../components/Certifications/CertificationsSection';
import ContactForm from '../../components/portfolio/ContactForm';
import ResumeModal from '../../components/portfolio/ResumeModal';
import ProjectDetailsModal from '../../components/portfolio/ProjectDetailsModal';
import ElasticPhoto from '../../components/About/ElasticPhoto';
import avatarPlaceholder from '../../assets/avatar_placeholder.svg';
import projectPlaceholder from '../../assets/project_placeholder.svg';

export const PortfolioHome = () => {
  const { 
    getProfile, 
    getSkills, 
    getProjects, 
    getExperiences,
    getCertificates, 
    getAchievements, 
    trackVisit 
  } = useApi();

  // State for Video Section
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef(null);

  // State for Skills Tab
  const [activeTab, setActiveTab] = useState('All');

  // State for Projects Show All
  const [showAllProjects, setShowAllProjects] = useState(false);

  // State for Enhancements Modals & Filters
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectFilter, setProjectFilter] = useState('All');

  useEffect(() => {
    const seen = localStorage.getItem('dragHintSeen');
    if (!seen) {
      setTimeout(() => {
        const hint = document.getElementById('drag-hint');
        if (hint) {
          hint.style.transition = 'opacity 1s';
          hint.style.opacity = '0';
        }
        localStorage.setItem('dragHintSeen', 'true');
      }, 4000);
    } else {
      const hint = document.getElementById('drag-hint');
      if (hint) hint.style.display = 'none';
    }
  }, []);

  // 1. Log analytics view on load
  useEffect(() => {
    trackVisit('/home', document.referrer).catch((err) => {
      console.error('Analytics tracking failed:', err);
    });
  }, []);

  // 2. Fetch Data using React Query
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await getProfile();
      return res.data.data;
    }
  });

  const { data: skills = [], isLoading: skillsLoading } = useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const res = await getSkills();
      return res.data.data;
    }
  });

  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await getProjects();
      return res.data.data;
    }
  });

  const { data: certs = [], isLoading: certsLoading } = useQuery({
    queryKey: ['certificates'],
    queryFn: async () => {
      const res = await getCertificates();
      return res.data.data;
    }
  });

  const { data: achievements = [], isLoading: achievementsLoading } = useQuery({
    queryKey: ['achievements'],
    queryFn: async () => {
      const res = await getAchievements();
      return res.data.data;
    }
  });

  const { data: experiences = [], isLoading: experiencesLoading } = useQuery({
    queryKey: ['experiences'],
    queryFn: async () => {
      const res = await getExperiences();
      return res.data.data;
    }
  });

  // Toggle Video Playback
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (profileLoading || skillsLoading || projectsLoading || experiencesLoading || certsLoading || achievementsLoading) {
    return <Loader fullScreen={true} />;
  }

  // Filter skills based on tab
  const filteredSkills = activeTab === 'All' 
    ? skills 
    : skills.filter(s => s.category.toLowerCase() === activeTab.toLowerCase());

  // Filter projects dynamically based on tech stack and category tag
  const filteredProjects = projects.filter((project) => {
    if (projectFilter === 'All') return true;
    const stackStr = (project.tech_stack || []).join(' ').toLowerCase();
    const titleStr = project.title.toLowerCase();
    
    if (projectFilter === 'AI & Python') {
      return stackStr.includes('python') || stackStr.includes('ai') || stackStr.includes('nlp') || titleStr.includes('ai') || titleStr.includes('forecasting') || titleStr.includes('chatbot');
    }
    if (projectFilter === 'IoT & Hardware') {
      return stackStr.includes('iot') || stackStr.includes('esp32') || stackStr.includes('sensors') || titleStr.includes('punch');
    }
    if (projectFilter === 'Web Development') {
      return stackStr.includes('react') || stackStr.includes('html') || stackStr.includes('css') || stackStr.includes('vite') || stackStr.includes('fullstack') || stackStr.includes('canteen');
    }
    return true;
  });

  // Stagger animation setup
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      <Navbar profile={profile} />

      {/* 2. Hero Section */}
      <HeroSection profile={profile} onViewResume={() => setIsResumeOpen(true)} />

      {/* 3. Intro Video Section */}
      {profile?.video_url && (
        <section className="py-20 bg-slate-100 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800/80 transition-colors duration-300">
          <div className="max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto px-4 text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeInUpVariants}
            >
              <span className="text-xs sm:text-sm lg:text-base font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                A Quick Intro
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mt-1 mb-8">
                Video Greeting
              </h2>
            </motion.div>

            {/* Video Wrapper */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 aspect-video group bg-black"
            >
              <video
                ref={videoRef}
                src={profile.video_url}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
              {/* Overlay Control */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={togglePlay}
                  className="p-4 rounded-full bg-white/90 text-slate-900 shadow-lg hover:scale-110 transition-transform focus:outline-none"
                  aria-label={isPlaying ? 'Pause Intro Video' : 'Play Intro Video'}
                >
                  {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* 4. About Me */}
      <section id="about" className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-7xl lg:max-w-[85vw] xl:max-w-[80vw] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Photo Left */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5 flex flex-col items-center justify-center"
            >
              <div className="relative w-80 h-80 sm:w-[26rem] sm:h-[26rem] md:w-[32rem] md:h-[32rem] lg:w-[36rem] lg:h-[36rem] xl:w-[42rem] xl:h-[42rem] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-200 dark:bg-slate-800">
                <ElasticPhoto
                  src={profile?.photo_url ? (profile.photo_url.startsWith('http') ? profile.photo_url : `${import.meta.env.VITE_API_URL || ''}${profile.photo_url}`) : avatarPlaceholder}
                  alt="Jeshintha"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            {/* Text Right */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-6 lg:space-y-8"
            >
              <div>
                <span className="text-xs sm:text-sm lg:text-base font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                  About Me
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mt-1">
                  My Background & Philosophy
                </h2>
              </div>

              <div className="text-slate-600 dark:text-slate-300 space-y-4 sm:space-y-6 text-base md:text-lg lg:text-xl leading-relaxed lg:leading-loose">
                <p>
                  {profile?.bio || 'I am a software engineer focused on developing secure, maintainable, and high-performance server architectures and client applications.'}
                </p>
                <p>
                  I believe in writing clean, well-tested code, collaborating with partners to clarify ambiguity, and using state-of-the-art technologies (like Next.js, Framer Motion, and Claude API) to build interfaces that feel premium.
                </p>
              </div>

              {/* Quick-Stat Chips */}
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="px-6 py-4.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-center min-w-[120px] lg:min-w-[150px]">
                  <span className="block text-2xl lg:text-3xl xl:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">{experiences.length}</span>
                  <span className="text-[10px] sm:text-xs lg:text-sm font-semibold text-slate-500 uppercase tracking-wider">Internships</span>
                </div>
                <div className="px-6 py-4.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-center min-w-[120px] lg:min-w-[150px]">
                  <span className="block text-2xl lg:text-3xl xl:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">{projects.length}</span>
                  <span className="text-[10px] sm:text-xs lg:text-sm font-semibold text-slate-500 uppercase tracking-wider">Projects Built</span>
                </div>
                <div className="px-6 py-4.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-center min-w-[120px] lg:min-w-[150px]">
                  <span className="block text-2xl lg:text-3xl xl:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">{certs.length}</span>
                  <span className="text-[10px] sm:text-xs lg:text-sm font-semibold text-slate-500 uppercase tracking-wider">Certificates</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. Skills */}
      <section 
        id="skills" 
        className="py-20 border-y border-slate-200 dark:border-slate-800 transition-colors duration-300 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)' }}
      >
        {/* Roaming Tech Logos Background */}
        <RoamingTechStack />

        {/* Content Layer */}
        <div className="relative z-10 max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-[70vw] mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-xs sm:text-sm lg:text-base font-bold text-indigo-400 uppercase tracking-widest">
              My Expertise
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mt-1">
              Skills & Proficiencies
            </h2>

            {/* Tab Bar */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              {['All', 'Frontend', 'Backend', 'DevOps', 'Tools'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 lg:px-6 lg:py-2.5 rounded-lg text-sm lg:text-base xl:text-lg font-semibold transition-all duration-200 ${
                    activeTab === tab 
                      ? 'bg-indigo-600 text-white shadow-md neon-glow' 
                      : 'bg-white/5 hover:bg-white/10 text-slate-350 border border-white/10 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Animated Skills Progress Bars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {filteredSkills.map((skill) => (
              <SkillBar key={skill.id} name={skill.name} proficiency={skill.proficiency} />
            ))}
            {filteredSkills.length === 0 && (
              <p className="text-center text-slate-400 col-span-2 py-4">No skills under this category.</p>
            )}
          </div>
        </div>
      </section>

      {/* 5.5. Experiences Timeline */}
      <section id="experience" className="py-20 bg-slate-100 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-[70vw] mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-xs sm:text-sm lg:text-base font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              My Journey
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mt-1">
              Internship & Experience
            </h2>
          </div>

          <div className="relative border-l-2 border-indigo-100 dark:border-indigo-950/60 ml-4 md:ml-6 space-y-12 lg:space-y-16 py-2">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative pl-8 md:pl-10 group"
              >
                {/* Timeline Node Icon */}
                <div className="absolute -left-4.5 md:-left-5.5 top-1.5 bg-indigo-600 text-white rounded-full p-2.5 shadow-md group-hover:scale-110 transition-transform duration-200 ring-4 ring-white dark:ring-slate-900">
                  <Briefcase className="w-4 h-4" />
                </div>

                {/* Content Card */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 lg:p-10 xl:p-12 shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-950/80 transition-all duration-300">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-4 mb-4">
                    <div>
                      <h3 className="text-xl lg:text-2xl xl:text-3xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                        {exp.role}
                      </h3>
                      <p className="text-sm lg:text-base xl:text-lg font-semibold text-slate-500 dark:text-slate-400 mt-1">
                        {exp.company}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs lg:text-sm xl:text-base text-slate-400 dark:text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{exp.start_date} – {exp.end_date}</span>
                      </span>
                      {exp.location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{exp.location}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-slate-650 dark:text-slate-400 text-lg sm:text-xl lg:text-2xl leading-relaxed whitespace-pre-line">
                      {exp.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
            {experiences.length === 0 && (
              <p className="text-center text-slate-500 pl-8">No experiences added yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* 5.6. Education Timeline */}
      <section id="education" className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-[70vw] mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-xs sm:text-sm lg:text-base font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              Academic Background
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mt-1">
              Education
            </h2>
          </div>

          <div className="relative border-l-2 border-indigo-100 dark:border-indigo-950/60 ml-4 md:ml-6 space-y-12 lg:space-y-16 py-2">
            {/* College */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative pl-8 md:pl-10 group"
            >
              <div className="absolute -left-4.5 md:-left-5.5 top-1.5 bg-indigo-600 text-white rounded-full p-2.5 shadow-md group-hover:scale-110 transition-transform duration-200 ring-4 ring-white dark:ring-slate-900">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 lg:p-10 xl:p-12 shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-950/80 transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-4 mb-4">
                  <div>
                    <h3 className="text-xl lg:text-2xl xl:text-3xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                      Bachelor of Engineering (B.E)
                    </h3>
                    <p className="text-base sm:text-lg lg:text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                      Prince Dr. K. Vasudevan College of Engineering and Technology
                    </p>
                    <p className="text-sm sm:text-base lg:text-lg text-slate-500 dark:text-slate-400 mt-1">
                      Computer Science & Engineering
                    </p>
                  </div>
                  <div className="flex flex-col items-start md:items-end justify-center shrink-0">
                    <span className="text-sm sm:text-base text-slate-400 dark:text-slate-500 block">
                      2023 – 2027 [Present]
                    </span>
                    <span className="inline-block mt-2 px-3.5 py-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-sm sm:text-base font-bold rounded-lg shadow-sm border border-indigo-100 dark:border-indigo-950/60">
                      CGPA: 84.5%
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* School XII */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative pl-8 md:pl-10 group"
            >
              <div className="absolute -left-4.5 md:-left-5.5 top-1.5 bg-indigo-600 text-white rounded-full p-2.5 shadow-md group-hover:scale-110 transition-transform duration-200 ring-4 ring-white dark:ring-slate-900">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 lg:p-10 xl:p-12 shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-950/80 transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-4 mb-4">
                  <div>
                    <h3 className="text-xl lg:text-2xl xl:text-3xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                      Higher Secondary School (Class XII)
                    </h3>
                    <p className="text-base sm:text-lg lg:text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                      Revoor Padmanaba Chettiar Mat High Sec School
                    </p>
                  </div>
                  <div className="flex flex-col items-start md:items-end justify-center shrink-0">
                    <span className="text-sm sm:text-base text-slate-400 dark:text-slate-500 block">
                      2022 – 2023
                    </span>
                    <span className="inline-block mt-2 px-3.5 py-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-sm sm:text-base font-bold rounded-lg shadow-sm border border-indigo-100 dark:border-indigo-950/60">
                      Mark: 490 / 600
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* School X */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative pl-8 md:pl-10 group"
            >
              <div className="absolute -left-4.5 md:-left-5.5 top-1.5 bg-indigo-600 text-white rounded-full p-2.5 shadow-md group-hover:scale-110 transition-transform duration-200 ring-4 ring-white dark:ring-slate-900">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 lg:p-10 xl:p-12 shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-950/80 transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-4 mb-4">
                  <div>
                    <h3 className="text-xl lg:text-2xl xl:text-3xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                      Secondary School (Class X)
                    </h3>
                    <p className="text-base sm:text-lg lg:text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                      V.O.C Mat High Sec School
                    </p>
                  </div>
                  <div className="flex flex-col items-start md:items-end justify-center shrink-0">
                    <span className="text-sm sm:text-base text-slate-400 dark:text-slate-500 block">
                      2020 – 2021
                    </span>
                    <span className="inline-block mt-2 px-3.5 py-1.5 bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 text-sm sm:text-base font-bold rounded-lg shadow-sm border border-violet-100 dark:border-violet-950/60">
                      All Pass (Corona Batch)
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. Projects */}
      <section id="projects" className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-7xl lg:max-w-[85vw] xl:max-w-[80vw] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-xs sm:text-sm lg:text-base font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              My Portfolio
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mt-1">
              Featured Projects
            </h2>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {['All', 'AI & Python', 'IoT & Hardware', 'Web Development'].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setProjectFilter(cat);
                  setShowAllProjects(false); // Reset show all when filter changes
                }}
                className={`px-4.5 py-1.5 lg:px-6 lg:py-2.5 rounded-full text-xs sm:text-sm lg:text-base font-bold uppercase tracking-wider transition-all duration-205 border ${
                  projectFilter === cat 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm neon-glow' 
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-350 dark:hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid View */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 xl:gap-12">
            {filteredProjects.slice(0, showAllProjects ? filteredProjects.length : 3).map((project) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                description={project.description}
                screenshot_url={project.screenshot_url}
                github_url={project.github_url}
                demo_url={project.demo_url}
                tech_stack={project.tech_stack}
                status={project.status}
                onViewDetails={() => setSelectedProject(project)}
              />
            ))}
            {filteredProjects.length === 0 && (
              <p className="text-center text-slate-500 col-span-3 py-8">No projects found in this category.</p>
            )}
          </div>

          {/* View All Button */}
          {filteredProjects.length > 3 && (
            <div className="text-center mt-12">
              <button
                onClick={() => setShowAllProjects(!showAllProjects)}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 lg:px-8 lg:py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all neon-glow-hover shadow-sm text-base lg:text-lg xl:text-xl"
              >
                <span>{showAllProjects ? 'Show Less' : 'View All Projects'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showAllProjects ? 'rotate-180' : ''}`} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 7. Certificates */}
      <CertificationsSection />

      {/* 7.5 Beyond Engineering (Leadership & Activities) */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl lg:max-w-[85vw] xl:max-w-[80vw] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs sm:text-sm lg:text-base font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              Beyond Engineering
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mt-1">
              Leadership & Athletics
            </h2>
            <p className="text-sm lg:text-base xl:text-lg text-slate-500 dark:text-slate-400 mt-2 max-w-xl mx-auto">
              Succeeding in competitive team environments and building discipline through sport and service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 xl:gap-12">
            {/* Card 1: Boxing */}
            <motion.div 
              whileHover={{ y: -6 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 lg:p-10 xl:p-12 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="w-12 h-12 bg-violet-50 dark:bg-violet-950/20 text-violet-650 dark:text-violet-400 rounded-xl flex items-center justify-center text-2xl mb-6 shadow-inner border border-violet-100/50 dark:border-violet-900/30">
                🥊
              </div>
              <h3 className="text-xl lg:text-2xl xl:text-3xl font-bold text-slate-900 dark:text-white mb-3">National-Level Boxing</h3>
              <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 dark:text-slate-400 leading-relaxed">
                Gold medalist in Anna University boxing matches. Competing at high levels built resilience, split-second critical decisions, and physical/mental endurance.
              </p>
            </motion.div>

            {/* Card 2: NCC */}
            <motion.div 
              whileHover={{ y: -6 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 lg:p-10 xl:p-12 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-650 dark:text-indigo-400 rounded-xl flex items-center justify-center text-2xl mb-6 shadow-inner border border-indigo-100/50 dark:border-indigo-900/30">
                🎖️
              </div>
              <h3 className="text-xl lg:text-2xl xl:text-3xl font-bold text-slate-900 dark:text-white mb-3">NCC Cadet</h3>
              <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 dark:text-slate-400 leading-relaxed">
                National Cadet Corps training developed systematic planning, operational leadership, extreme accountability, and structured collaboration skills under pressure.
              </p>
            </motion.div>

            {/* Card 3: Web Club */}
            <motion.div 
              whileHover={{ y: -6 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 lg:p-10 xl:p-12 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center text-2xl mb-6 shadow-inner">
                💻
              </div>
              <h3 className="text-xl lg:text-2xl xl:text-3xl font-bold text-slate-900 dark:text-white mb-3">Web Club Coordinator</h3>
              <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 dark:text-slate-400 leading-relaxed">
                Organizing design workshops, mentoring junior developers in CSS/JS, and coordinating campus events. Fostering a community of learning and creative expression.
              </p>
            </motion.div>

            {/* Card 4: Rotaract */}
            <motion.div 
              whileHover={{ y: -6 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 lg:p-10 xl:p-12 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="w-12 h-12 bg-violet-50 dark:bg-violet-950/20 text-violet-650 dark:text-violet-400 rounded-xl flex items-center justify-center text-2xl mb-6 shadow-inner border border-violet-100/50 dark:border-violet-900/30">
                🎒
              </div>
              <h3 className="text-xl lg:text-2xl xl:text-3xl font-bold text-slate-900 dark:text-white mb-3">Rotaract Chairman</h3>
              <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 dark:text-slate-400 leading-relaxed">
                Served as the Project Chairman for the "Back to School" initiative in the Rotaract Club. Coordinated community resource collections, donation drives, and educational support tools to empower underprivileged students.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 8. Achievements */}
      <section id="achievements" className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-[70vw] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs sm:text-sm lg:text-base font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              Highlights
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mt-1">
              Honors & Accomplishments
            </h2>
          </div>

          {/* Staggered achievements list */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6 lg:space-y-8"
          >
            {achievements.map((ach) => (
              <motion.div
                key={ach.id}
                variants={fadeInUpVariants}
                className="flex items-start gap-4 p-6 lg:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm transition-colors duration-300"
              >
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-indigo-600 dark:text-indigo-400">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <span className="text-xs lg:text-sm xl:text-base font-bold text-slate-400 dark:text-slate-500">
                    {ach.achieved_date}
                  </span>
                  <h4 className="text-lg lg:text-xl xl:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                    {ach.title}
                  </h4>
                  <p className="text-lg sm:text-xl lg:text-2xl text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
                    {ach.description}
                  </p>
                </div>
              </motion.div>
            ))}
            {achievements.length === 0 && (
              <p className="text-center text-slate-500 py-4">No achievements listed yet.</p>
            )}
          </motion.div>
        </div>
      </section>

      {/* 9. Resume Section */}
      <section className="py-20 bg-slate-100 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-[70vw] mx-auto px-4 text-center">
          <div className="mb-8">
            <span className="text-xs sm:text-sm lg:text-base font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              My CV
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mt-1">
              Curriculum Vitae
            </h2>
          </div>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex flex-col items-center p-8 lg:p-12 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-md max-w-sm lg:max-w-md xl:max-w-lg w-full"
          >
            {/* Mock resume icon/thumbnail */}
            <div className="w-20 h-24 bg-indigo-100 dark:bg-indigo-950/20 text-indigo-500 rounded-lg flex items-center justify-center shadow-md mb-6 relative border border-indigo-200/50 dark:border-indigo-900/30">
              <Award className="w-10 h-10" />
              <div className="absolute top-2 right-2 w-3 h-3 bg-violet-500 rounded-full animate-ping"></div>
            </div>
            
            <h3 className="font-bold text-lg lg:text-xl xl:text-2xl text-slate-900 dark:text-white mb-1">Jeshintha_X_Resume.pdf</h3>
            <p className="text-xs lg:text-sm text-slate-400 dark:text-slate-500 mb-6">
              Last Updated: {profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'Recent'}
            </p>

            <button
              onClick={() => setIsResumeOpen(true)}
              className="w-full text-center py-3 lg:py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all neon-glow neon-glow-hover shadow-md shadow-indigo-500/10 cursor-pointer lg:text-lg"
            >
              View Resume
            </button>
          </motion.div>
        </div>
      </section>

      {/* 10. Contact */}
      <section id="contact" className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-7xl lg:max-w-[85vw] xl:max-w-[80vw] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Contact Details Left */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5 space-y-8"
            >
              <div>
                <span className="text-xs sm:text-sm lg:text-base font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                  Let's Connect
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mt-1">
                  Get in Touch
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-4 text-sm sm:text-base lg:text-lg xl:text-xl leading-relaxed">
                  Have an interesting project proposal or a contract opportunity? Fill out the form, and I'll respond within 24 hours.
                </p>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-indigo-600 dark:text-indigo-400">
                    <Mail className="w-5 h-5 lg:w-6 lg:h-6" />
                  </div>
                  <div>
                    <span className="block text-xs lg:text-sm font-semibold text-slate-400 dark:text-slate-500">Email Address</span>
                    <a href={`mailto:${profile?.social_links?.email || 'jesxav2005@gmail.com'}`} className="font-semibold text-slate-700 dark:text-slate-200 hover:underline lg:text-lg xl:text-xl">
                      {profile?.social_links?.email || 'jesxav2005@gmail.com'}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-indigo-600 dark:text-indigo-400">
                    <MapPin className="w-5 h-5 lg:w-6 lg:h-6" />
                  </div>
                  <div>
                    <span className="block text-xs lg:text-sm font-semibold text-slate-400 dark:text-slate-500">Location</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200 lg:text-lg xl:text-xl">
                      Chennai, India
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form Right */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7 bg-white dark:bg-slate-900 p-8 lg:p-12 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg transition-colors duration-300"
            >
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 12. Footer */}
      <Footer socialLinks={profile?.social_links || {}} />

      {/* Enhancements Modals */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
        profile={profile}
        experiences={experiences}
        projects={projects}
        skills={skills}
        achievements={achievements}
      />

      <ProjectDetailsModal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
      />
    </div>
  );
};
export default PortfolioHome;
