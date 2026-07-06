import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { certificatesData } from './certificatesData';
import './CertificationsSection.css';

export const CertificationsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const activeDotRef = useRef(null);
  const activeChipRef = useRef(null);
  const dotsContainerRef = useRef(null);
  const chipsContainerRef = useRef(null);

  const totalCerts = certificatesData.length;

  // Handle Autoplay
  useEffect(() => {
    if (isHovered || totalCerts <= 1) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalCerts);
    }, 3200);
    
    return () => clearInterval(interval);
  }, [isHovered, activeIndex, totalCerts]);

  // Center active dot in scroll container
  useEffect(() => {
    const dot = activeDotRef.current;
    const container = dotsContainerRef.current;
    if (dot && container) {
      const left = dot.offsetLeft - (container.clientWidth / 2) + (dot.clientWidth / 2);
      container.scrollTo({ left, behavior: 'smooth' });
    }
  }, [activeIndex]);

  // Center active badge chip in scroll container
  useEffect(() => {
    const chip = activeChipRef.current;
    const container = chipsContainerRef.current;
    if (chip && container) {
      const left = chip.offsetLeft - (container.clientWidth / 2) + (chip.clientWidth / 2);
      container.scrollTo({ left, behavior: 'smooth' });
    }
  }, [activeIndex]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + totalCerts) % totalCerts);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % totalCerts);
  };

  const handleDotClick = (index) => {
    setActiveIndex(index);
  };

  const handleChipClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <section 
      id="certificates" 
      className="certifications-section"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="certifications-container">
        <h2 className="certifications-title">Certifications & Badges</h2>

        {/* Peek Slider */}
        <div className="cert-slider-wrapper">
          {/* Prev Arrow */}
          {totalCerts > 1 && (
            <button 
              className="cert-nav-btn prev" 
              onClick={handlePrev}
              aria-label="Previous Certificate"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Viewport */}
          <div className="cert-slider-viewport">
            <div 
              className="cert-slider-track"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {certificatesData.map((cert, index) => {
                const isActive = index === activeIndex;
                return (
                  <div 
                    key={cert.id} 
                    className={`cert-card-container ${isActive ? 'active' : 'inactive'}`}
                  >
                    <div className="cert-card">
                      {/* Gradient Line Top */}
                      <div className={`cert-gradient-bar ${cert.gradientBar}`} />
                      
                      {/* Certificate Image */}
                      <div className="cert-img-container">
                        <img 
                          src={cert.image} 
                          alt={cert.name} 
                          className="cert-image" 
                        />
                      </div>

                      {/* Certificate Details */}
                      <div className="cert-details">
                        <div className="cert-issuer-row">
                          {cert.issuer} &middot; {cert.type}
                        </div>
                        <h3 className="cert-name">{cert.name}</h3>
                        <div className="cert-meta-row">
                          {cert.category} &bull; {cert.date}
                        </div>

                        {/* Pills */}
                        <div className="cert-pills">
                          {cert.pills.map((pill, pIdx) => (
                            <span key={pIdx} className="cert-pill">
                              {pill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Next Arrow */}
          {totalCerts > 1 && (
            <button 
              className="cert-nav-btn next" 
              onClick={handleNext}
              aria-label="Next Certificate"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Dots Indicators */}
        {totalCerts > 1 && (
          <div className="cert-dots-container">
            <div className="cert-dots-scroller" ref={dotsContainerRef}>
              {certificatesData.map((_, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={index}
                    ref={isActive ? activeDotRef : null}
                    className={`cert-dot ${isActive ? 'active' : ''}`}
                    onClick={() => handleDotClick(index)}
                    aria-label={`Go to certificate ${index + 1}`}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Badges Earned Section */}
        <div className="cert-badges-section">
          <h4 className="cert-badges-label">Badges Earned</h4>
          <div className="cert-badges-row-scroller" ref={chipsContainerRef}>
            <div className="cert-badges-row">
              {certificatesData.map((cert, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={cert.id}
                    ref={isActive ? activeChipRef : null}
                    className={`cert-badge-chip ${isActive ? 'active' : ''}`}
                    onClick={() => handleChipClick(index)}
                  >
                    <img 
                      src={cert.badge} 
                      alt={cert.badgeLabel} 
                      className="cert-badge-img" 
                    />
                    <div className="cert-badge-info">
                      <span className="cert-badge-chip-label">{cert.badgeLabel}</span>
                      <span className="cert-badge-chip-date">{cert.date}</span>
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
