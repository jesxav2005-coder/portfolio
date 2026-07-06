import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Mail, FileText } from 'lucide-react';
import avatarPlaceholder from '../../assets/avatar_placeholder.svg'; // We'll create or generate this image asset
import IntroVideoPlayer from './IntroVideoPlayer';

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

const TwitterIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const YoutubeIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
    <polygon points="10 15 15 12 10 9" />
  </svg>
);

const LeetcodeIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16.102 17.93l-2.69 2.607c-.441.428-1.028.662-1.633.65a2.235 2.235 0 0 1-1.583-.679l-4.46-4.522a2.316 2.316 0 0 1 0-3.238l4.46-4.522a2.234 2.234 0 0 1 1.583-.679c.605-.012 1.192.222 1.633.65l2.69 2.608" />
    <path d="M9.087 14.785l6.649-6.728" />
    <path d="M11.666 17.387L18.315 10.66" />
  </svg>
);

// Typewriter component for cycled text animations
const Typewriter = ({ words, speed = 100, eraseSpeed = 50, delay = 2000 }) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];
    let timer;

    if (isDeleting) {
      timer = setTimeout(() => {
        setText(currentWord.substring(0, text.length - 1));
      }, eraseSpeed);
    } else {
      timer = setTimeout(() => {
        setText(currentWord.substring(0, text.length + 1));
      }, speed);
    }

    if (!isDeleting && text === currentWord) {
      timer = setTimeout(() => setIsDeleting(true), delay);
    } else if (isDeleting && text === '') {
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % words.length);
    }

    return () => clearTimeout(timer);
  }, [text, isDeleting, wordIndex, words, speed, eraseSpeed, delay]);

  return (
    <span className="text-indigo-500 border-r-2 border-indigo-500 pr-1 animate-pulse">
      {text}
    </span>
  );
};

export const HeroSection = ({ profile = {}, onViewResume }) => {
  const titles = [profile.title || 'Computer Science Engineering Student', 'Full-Stack Developer', 'IoT & Sensors Builder', 'National Boxer'];
  const socialLinks = profile.social_links || {};

  const getSocialIcon = (key) => {
    switch (key) {
      case 'github': return <GithubIcon className="w-6 h-6" />;
      case 'linkedin': return <LinkedinIcon className="w-6 h-6" />;
      case 'twitter': return <TwitterIcon className="w-6 h-6" />;
      case 'youtube': return <YoutubeIcon className="w-6 h-6" />;
      case 'email': return <Mail className="w-6 h-6" />;
      case 'leetcode': return <LeetcodeIcon className="w-6 h-6" />;
      default: return null;
    }
  };

  const handleScrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  const baseUrl = import.meta.env.VITE_API_URL || '';
  const photo = profile.photo_url 
    ? (profile.photo_url.startsWith('http') ? profile.photo_url : `${baseUrl}${profile.photo_url}`) 
    : avatarPlaceholder;

  // Stagger variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <section className="hero-container relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-violet-500/10 dark:bg-violet-500/5 blur-3xl"></div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="hero-content-wrapper relative z-10"
      >
        {/* LEFT COLUMN */}
        <div className="hero-left">
          <div className="w-full max-w-[1250px] flex flex-col items-start text-left">
            {/* Welcome Label */}
            <motion.span 
              variants={itemVariants}
              className="select-none block font-bold text-sm sm:text-base lg:text-lg uppercase tracking-widest"
              style={{ color: '#00c8ff', marginBottom: '16px' }}
            >
              Welcome to my portfolio
            </motion.span>

            {/* Hello & Name */}
            <motion.h1 
              variants={itemVariants} 
              className="font-extrabold tracking-tight text-white"
              style={{ fontSize: 'clamp(60px, 9vw, 140px)', fontWeight: '800', lineHeight: '1.05', marginBottom: '14px', whiteSpace: 'nowrap' }}
            >
              Hi, I'm <span style={{ color: '#00c8ff', whiteSpace: 'nowrap' }}>{profile.full_name || 'Jeshintha X'}</span>
            </motion.h1>

            {/* Subtitle / Role Typewriter */}
            <motion.h2 
              variants={itemVariants} 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-300 dark:text-slate-200"
              style={{ whiteSpace: 'nowrap', marginBottom: '24px' }}
            >
              I'm a <Typewriter words={titles} />
            </motion.h2>

            {/* Achievements Badges (Pills directly below typewriter) */}
            <motion.div 
              variants={itemVariants} 
              className="flex flex-row flex-nowrap items-center gap-4 mt-0"
              style={{ marginBottom: '26px', whiteSpace: 'nowrap' }}
            >
              <span 
                className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider shadow-sm select-none"
                style={{ border: '1px solid #ff4a4a', borderRadius: '28px', color: '#ff4a4a', backgroundColor: 'rgba(255, 74, 74, 0.08)', fontSize: '22px', padding: '16px 32px', flexShrink: 0 }}
              >
                 <span>🥊</span>
                 <span>National Boxer</span>
              </span>
              <span 
                className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider shadow-sm select-none"
                style={{ border: '1px solid #ffd700', borderRadius: '28px', color: '#ffd700', backgroundColor: 'rgba(255, 215, 0, 0.08)', fontSize: '22px', padding: '16px 32px', flexShrink: 0 }}
              >
                 <span>🎖️</span>
                 <span>NCC Cadet</span>
              </span>
              <span 
                className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider shadow-sm select-none"
                style={{ border: '1px solid #00c8ff', borderRadius: '28px', color: '#00c8ff', backgroundColor: 'rgba(0, 200, 255, 0.08)', fontSize: '22px', padding: '16px 32px', flexShrink: 0 }}
              >
                 <span>💻</span>
                 <span>Club Coordinator</span>
              </span>
            </motion.div>

            {/* Bio (Single unwrapped paragraph with line-height 1.6) */}
            <motion.p 
              variants={itemVariants} 
              className="text-slate-500 dark:text-slate-400 mt-2 text-left"
              style={{ maxWidth: '1200px', fontSize: '38px', lineHeight: '1.6', marginBottom: '34px' }}
            >
              <span style={{ whiteSpace: 'nowrap' }}>Computer Science Engineering student</span> passionate about web development, IoT, and building innovative projects.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              variants={itemVariants} 
              className="flex flex-row items-center gap-4 mt-0"
              style={{ width: 'auto', marginBottom: '0px' }}
            >
              <button
                onClick={handleScrollToProjects}
                className="text-white font-semibold bg-indigo-600 shadow-lg neon-glow neon-glow-hover hover:bg-indigo-700 transition-all duration-300 dark:bg-indigo-500 dark:hover:bg-violet-500 dark:hover:text-slate-950 dark:hover:shadow-[0_0_16px_rgba(15,240,252,0.6)]"
                style={{ fontSize: '30px', padding: '26px 60px', borderRadius: '20px', whiteSpace: 'nowrap', width: 'auto' }}
              >
                View Projects
              </button>
              
              <button
                onClick={onViewResume}
                className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-600 dark:text-slate-350 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-650 dark:hover:text-white transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                style={{ fontSize: '30px', padding: '26px 60px', borderRadius: '20px', whiteSpace: 'nowrap', width: 'auto' }}
              >
                <FileText className="w-7 h-7" />
                <span>View Resume</span>
              </button>
            </motion.div>

            {/* Social Icons (Square buttons) */}
            <motion.div variants={itemVariants} className="flex items-center gap-4 mt-0" style={{ marginTop: '32px' }}>
              {Object.entries(socialLinks).map(([platform, url]) => {
                if (!url) return null;
                const icon = getSocialIcon(platform);
                if (!icon) return null;
                const absoluteUrl = url.startsWith('http') || url.startsWith('mailto') ? url : `https://${url}`;
                return (
                  <a
                    key={platform}
                    href={absoluteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-btn flex items-center justify-center transition-all duration-300"
                    aria-label={platform}
                  >
                    {icon}
                  </a>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="hero-right">
          {/* Radial Gradient Glow centered behind the frame */}
          <div 
            className="absolute pointer-events-none -z-10"
            style={{
              background: 'radial-gradient(circle, rgba(0,200,255,0.06) 0%, transparent 70%)',
              width: '300px',
              height: '300px',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />
          
          <IntroVideoPlayer />
        </div>
      </motion.div>

      {/* Floating scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <button 
          onClick={handleScrollToProjects} 
          className="p-2 rounded-full border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-indigo-650 dark:hover:text-violet-500 hover:border-indigo-600 dark:hover:border-violet-500 transition-all duration-300"
          aria-label="Scroll down"
        >
          <ArrowDown className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};
export default HeroSection;
