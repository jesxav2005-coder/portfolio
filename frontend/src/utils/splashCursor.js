// src/utils/splashCursor.js

class SplashCursor {
  constructor(config = {}) {
    this.particles = [];
    this.config = {
      particleCount: config.particleCount || 8,
      particleSize: config.particleSize || 8,
      duration: config.duration || 1000, // ms
      velocity: config.velocity || 3,
      gravity: config.gravity || 0.1,
      colors: config.colors || ['#B300FF', '#A100F2', '#00BFFF'],
      colorClasses: config.colorClasses || ['violet', 'neon-purple', 'cyan'],
      ...config
    };

    this.colorIndex = 0;
    this.isInitialized = false;
    this.isActive = false;
  }

  init() {
    if (this.isInitialized) return;
    if (window.innerWidth < 768) return; // Disable on mobile for performance

    this.handleMouseMove = (e) => this.createSplash(e, false);
    this.handleClick = (e) => this.createSplash(e, true);

    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('click', this.handleClick);
    
    this.isActive = true;
    this.animate();
    this.isInitialized = true;
  }

  createSplash(event, isClick) {
    // Prevent execution if window is resized below tablet threshold
    if (window.innerWidth < 768) return;

    // Cap at 500 active particles to prevent performance degradation
    if (this.particles.length > 500) {
      const excess = this.particles.length - 500;
      for (let i = 0; i < excess; i++) {
        const p = this.particles[i];
        if (p.element && p.element.parentNode) {
          p.element.parentNode.removeChild(p.element);
        }
      }
      this.particles = this.particles.slice(excess);
    }

    const particleCount = isClick ? this.config.particleCount * 2 : this.config.particleCount;
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() * 0.5 - 0.25);
      const velocity = this.config.velocity * (isClick ? 1.5 : 1.0) + Math.random() * this.config.velocity * 0.5;
      
      const particle = {
        x: event.clientX,
        y: event.clientY,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - (isClick ? 2 : 0), // extra upward boost on click
        life: 1,
        maxLife: this.config.duration,
        size: this.config.particleSize + Math.random() * 4,
        colorClass: this.config.colorClasses[this.colorIndex % this.config.colorClasses.length],
        color: this.config.colors[this.colorIndex % this.config.colors.length],
        element: null
      };

      this.colorIndex++;
      this.particles.push(particle);
      this.renderParticle(particle);
    }
  }

  renderParticle(particle) {
    const el = document.createElement('div');
    el.className = `splash-particle ${particle.colorClass}`;
    
    // Position styling
    el.style.position = 'fixed';
    el.style.pointerEvents = 'none';
    el.style.zIndex = '99999';
    el.style.width = `${particle.size}px`;
    el.style.height = `${particle.size}px`;
    el.style.left = `${particle.x}px`;
    el.style.top = `${particle.y}px`;
    el.style.opacity = '1';
    el.style.transform = 'scale(1)';
    
    // Add premium neon glowing filter and shadow
    el.style.filter = `blur(${particle.size * 0.25}px)`;
    el.style.boxShadow = `0 0 ${particle.size * 1.5}px ${particle.color}, 0 0 ${particle.size * 3}px ${particle.color}aa`;
    
    el.innerHTML = '●';
    document.body.appendChild(el);
    particle.element = el;
  }

  animate = () => {
    if (!this.isActive) return;

    this.particles = this.particles.filter(p => {
      // Update physics
      p.vy += this.config.gravity;
      p.x += p.vx;
      p.y += p.vy;

      // Update life
      p.life -= 1 / 60; // Assuming 60fps
      const progress = 1 - (p.life / (p.maxLife / 1000));

      if (progress >= 1) {
        if (p.element && p.element.parentNode) {
          p.element.parentNode.removeChild(p.element);
        }
        return false;
      }

      // Update DOM style properties individually for high performance
      if (p.element) {
        p.element.style.left = `${p.x}px`;
        p.element.style.top = `${p.y}px`;
        p.element.style.opacity = Math.max(0, 1 - progress);
        p.element.style.transform = `scale(${1 - progress * 0.5})`;
      }

      return true;
    });

    requestAnimationFrame(this.animate);
  };

  destroy() {
    this.isActive = false;
    if (this.isInitialized) {
      document.removeEventListener('mousemove', this.handleMouseMove);
      document.removeEventListener('click', this.handleClick);
    }
    
    this.particles.forEach(p => {
      if (p.element && p.element.parentNode) {
        p.element.parentNode.removeChild(p.element);
      }
    });
    this.particles = [];
    this.isInitialized = false;
  }
}

export default SplashCursor;
