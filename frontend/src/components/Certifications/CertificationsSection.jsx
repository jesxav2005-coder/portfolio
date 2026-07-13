import React, { useState, useEffect, useRef } from 'react';
import CircularGallery from '../CircularGallery/CircularGallery';
import { certificatesData } from './certificatesData';
import './CertificationsSection.css';

// Map data to CircularGallery items structure (declared statically outside the component to prevent recreating references on re-renders)
const galleryItems = certificatesData.map(cert => ({
  image: cert.image,
  text: cert.name
}));

export const CertificationsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const appRef = useRef(null);
  const chipsContainerRef = useRef(null);
  const activeChipRef = useRef(null);

  const totalCerts = certificatesData.length;
  const activeCert = certificatesData[activeIndex];

  // Center active badge chip in scroll container
  useEffect(() => {
    const chip = activeChipRef.current;
    const container = chipsContainerRef.current;
    if (chip && container) {
      const left = chip.offsetLeft - (container.clientWidth / 2) + (chip.clientWidth / 2);
      container.scrollTo({ left, behavior: 'smooth' });
    }
  }, [activeIndex]);

  const handleChipClick = (index) => {
    setActiveIndex(index);
    if (appRef.current && appRef.current.medias && appRef.current.medias[0]) {
      const width = appRef.current.medias[0].width;
      appRef.current.scroll.target = width * index;
    }
  };

  return (
    <section id="certificates" className="certifications-section">
      <div className="certifications-container">
        <div className="text-center mb-10">
          <span className="text-xs sm:text-sm lg:text-base font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
            Credentials & Achievements
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mt-1">
            Certifications & Badges
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base mt-2">
            Scroll, drag, or click a badge below to explore my verified credentials
          </p>
        </div>

        {/* 3D Curved WebGL Gallery Viewport */}
        <div className="gallery-wrapper relative h-[480px] sm:h-[680px] rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-slate-900/10 dark:bg-slate-950/20">
          <CircularGallery
            items={galleryItems}
            bend={2.5}
            textColor="#00BFFF"
            borderRadius={0.06}
            font="bold 24px Figtree"
            scrollSpeed={2}
            scrollEase={0.08}
            onChangeActiveIndex={setActiveIndex}
            onInit={(app) => { appRef.current = app; }}
          />
        </div>

        {/* Premium Active Credentials Details Panel */}
        {activeCert && (
          <div className="mt-8 max-w-[850px] mx-auto px-2 sm:px-4">
            <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-850 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row gap-6 items-center md:items-start transition-all duration-300">
              
              {/* Badge Left */}
              <div className="flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 bg-slate-100 dark:bg-slate-900 rounded-xl p-3 border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-inner">
                <img 
                  src={activeCert.badge} 
                  alt={activeCert.badgeLabel} 
                  className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(0,191,255,0.4)]"
                />
              </div>

              {/* Details Right */}
              <div className="flex-grow text-center md:text-left space-y-4">
                <div>
                  <span className="text-xs sm:text-sm font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block">
                    {activeCert.issuer} &bull; {activeCert.type}
                  </span>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 leading-snug">
                    {activeCert.name}
                  </h3>
                  <span className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 block mt-1">
                    Category: {activeCert.category} &bull; Issued {activeCert.date}
                  </span>
                </div>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-1">
                  {activeCert.pills.map((pill, idx) => (
                    <span 
                      key={idx} 
                      className="text-[10px] sm:text-xs font-bold px-3.5 py-1.5 rounded-full bg-indigo-500/10 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 dark:border-indigo-400/20"
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Badges Earned Scroller Row */}
        <div className="cert-badges-section mt-10">
          <h4 className="cert-badges-label text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider mb-4 px-1">
            Credentials Portfolio
          </h4>
          <div className="cert-badges-row-scroller" ref={chipsContainerRef}>
            <div className="cert-badges-row flex gap-3 pb-2">
              {certificatesData.map((cert, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={cert.id}
                    ref={isActive ? activeChipRef : null}
                    className={`cert-badge-chip flex items-center gap-3 px-4 py-2 bg-white dark:bg-slate-900 border rounded-xl shadow-sm transition-all duration-300 ${isActive ? 'active border-indigo-500 dark:border-indigo-400 bg-indigo-50/20 dark:bg-indigo-950/20' : 'border-slate-200 dark:border-slate-800'}`}
                    onClick={() => handleChipClick(index)}
                  >
                    <img 
                      src={cert.badge} 
                      alt={cert.badgeLabel} 
                      className="cert-badge-img w-8 h-8 object-contain" 
                    />
                    <div className="cert-badge-info text-left">
                      <span className="cert-badge-chip-label text-xs sm:text-sm font-semibold text-slate-900 dark:text-white block truncate max-w-[120px] sm:max-w-[160px]">
                        {cert.badgeLabel}
                      </span>
                      <span className="cert-badge-chip-date text-[10px] text-slate-500 block">
                        {cert.date}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CertificationsSection;
