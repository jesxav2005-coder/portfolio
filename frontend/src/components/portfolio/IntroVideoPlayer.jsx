import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

const introVideo = '/intro-video.mp4';

export const IntroVideoPlayer = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState('0:00');
  const [currentTime, setCurrentTime] = useState('0:00');

  // 3D Tilt State
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Always initialize muted to comply with browser autoplay requirements
      video.muted = true;
      setIsMuted(true);
      video.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.log("Muted autoplay failed/prevented", err);
        });
    }
  }, []);

  // Listen for chatbot activation to pause and mute the video
  useEffect(() => {
    const handleMuteVideo = () => {
      const video = videoRef.current;
      if (video) {
        video.pause();
        setIsPlaying(false);
        video.muted = true;
        setIsMuted(true);
      }
    };

    window.addEventListener('mute-video', handleMuteVideo);
    return () => window.removeEventListener('mute-video', handleMuteVideo);
  }, []);

  const handleStartWithAudio = (e) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    setIsMuted(false);
    video.play()
      .then(() => setIsPlaying(true))
      .catch(err => console.log("Play failed", err));
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      // Unmute when explicitly playing via user click
      video.muted = false;
      setIsMuted(false);
      video.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.log("Play failed", err));
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    const progressVal = (video.currentTime / video.duration) * 100;
    setProgress(isNaN(progressVal) ? 0 : progressVal);
    setCurrentTime(formatTime(video.currentTime));
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(formatTime(video.duration));
  };

  const formatTime = (secs) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleProgressClick = (e) => {
    const video = videoRef.current;
    const progressBar = e.currentTarget;
    if (!video || !progressBar) return;
    
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    
    video.currentTime = percentage * video.duration;
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    window.dispatchEvent(new CustomEvent('open-ai-voice'));
  };

  // Mouse move tilt handlers
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const xc = (x / rect.width) - 0.5;
    const yc = (y / rect.height) - 0.5;
    
    setTilt({
      x: -yc * 15, // Tilt X
      y: xc * 15   // Tilt Y
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div 
      className="hero-video-frame"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: isHovered ? 'none' : 'transform 0.5s ease',
        transformStyle: 'preserve-3d',
        cursor: 'pointer'
      }}
    >
      {/* 1. Video Element */}
      <video
        ref={videoRef}
        src={introVideo}
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
        playsInline
        autoPlay
        preload="auto"
        muted={isMuted}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleVideoEnded}
        onClick={togglePlay}
        onError={(e) => {
          console.error("Video player error:", e.target?.error);
        }}
      />

      {/* Center Unmute Overlay (shows only if video is muted to invite user audio activation gesture) */}
      {isMuted && (
        <div 
          onClick={handleStartWithAudio}
          className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-[1px] transition-all duration-300 z-10 hover:bg-black/35 rounded-xl"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-indigo-650 text-white flex items-center justify-center shadow-lg border border-indigo-400/40 animate-pulse hover:scale-110 transition-transform">
            <Volume2 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <span className="text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-4 bg-slate-950/80 px-4 py-2 rounded-full border border-slate-800 select-none shadow-md">
            Click to Unmute & Listen
          </span>
        </div>
      )}

      {/* 2. HUD Corner Brackets (floating 25px in Z-space) */}
      {/* Top Left */}
      <div 
        className="absolute w-5 h-5" 
        style={{ top: '8px', left: '8px', borderTop: '2px solid #00BFFF', borderLeft: '2px solid #00BFFF', borderTopLeftRadius: '3px', transform: 'translateZ(25px)' }} 
      />
      {/* Top Right */}
      <div 
        className="absolute w-5 h-5" 
        style={{ top: '8px', right: '8px', borderTop: '2px solid #00BFFF', borderRight: '2px solid #00BFFF', borderTopRightRadius: '3px', transform: 'translateZ(25px)' }} 
      />
      {/* Bottom Left */}
      <div 
        className="absolute w-5 h-5" 
        style={{ bottom: '8px', left: '8px', borderBottom: '2px solid #00BFFF', borderLeft: '2px solid #00BFFF', borderBottomLeftRadius: '3px', transform: 'translateZ(25px)' }} 
      />
      {/* Bottom Right */}
      <div 
        className="absolute w-5 h-5" 
        style={{ bottom: '8px', right: '8px', borderBottom: '2px solid #00BFFF', borderRight: '2px solid #00BFFF', borderBottomRightRadius: '3px', transform: 'translateZ(25px)' }} 
      />

      {/* 3. Status Labels (floating 20px in Z-space) */}
      <div 
        className="absolute select-none pointer-events-none"
        style={{ top: '12px', left: '16px', transform: 'translateZ(20px)', fontSize: '9px', color: '#00c8ff', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'monospace', fontWeight: 'bold' }}
      >
        SYS.ACTIVE
      </div>
      <div 
        className="absolute select-none pointer-events-none"
        style={{ bottom: '44px', right: '16px', transform: 'translateZ(20px)', fontSize: '9px', color: '#00c8ff', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'monospace', fontWeight: 'bold' }}
      >
        ID::JX-001
      </div>

      {/* 4. Scanning Line Animation (floating 10px in Z-space) */}
      <div className="hero-scan-line" style={{ transform: 'translateZ(10px)' }} />

      {/* 5. Pulsing Glow Border (floating 15px in Z-space) */}
      <div className="hero-glow-border" style={{ transform: 'translateZ(15px)' }} />

      {/* 6. Custom Video Controls Bar (floating 30px in Z-space) */}
      <div 
        className="absolute left-0 right-0 flex items-center gap-2"
        style={{ 
          background: 'linear-gradient(transparent, rgba(0,0,0,0.85))', 
          padding: '20px 12px 10px', 
          transform: 'translateZ(30px)',
          opacity: isHovered ? 1 : 0.8,
          transition: 'opacity 0.3s ease',
          bottom: '0'
        }}
      >
        {/* a) Play/Pause button */}
        <button 
          onClick={togglePlay}
          style={{ width: '24px', height: '24px', borderRadius: '50%', border: '1px solid #00BFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00BFFF', background: 'transparent', cursor: 'pointer', outline: 'none' }}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={10} fill="currentColor" /> : <Play size={10} fill="currentColor" style={{ marginLeft: '1px' }} />}
        </button>

        {/* b) Progress bar */}
        <div 
          onClick={handleProgressClick}
          style={{ flex: 1, height: '2px', background: '#1a1a1a', borderRadius: '2px', cursor: 'pointer', position: 'relative' }}
        >
          <div 
            style={{ height: '100%', background: '#00BFFF', borderRadius: '2px', width: `${progress}%` }} 
          />
        </div>

        {/* c) Time display */}
        <div style={{ fontSize: '10px', color: '#00BFFF', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
          {currentTime} / {duration}
        </div>

        {/* d) Mute/Unmute button */}
        <button 
          onClick={toggleMute}
          style={{ background: 'transparent', border: 'none', color: '#00BFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', outline: 'none', transition: 'transform 0.2s ease' }}
          className="hover:scale-110"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>
    </div>
  );
};

export default IntroVideoPlayer;
