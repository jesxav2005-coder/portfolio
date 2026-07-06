// Custom lightweight HTML5 Canvas-based confetti generator
export const triggerConfetti = () => {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  const handleResize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', handleResize);

  const colors = [
    '#4f46e5', // Indigo
    '#818cf8', // Indigo light
    '#10b981', // Emerald
    '#34d399', // Emerald light
    '#f59e0b', // Amber
    '#ec4899', // Pink
    '#3b82f6', // Blue
  ];
  
  const particles = [];
  const particleCount = 120;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * -height - 20, // Start above the screen
      r: Math.random() * 6 + 4,
      d: Math.random() * width,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 10 - 5,
      tiltAngleIncremental: Math.random() * 0.07 + 0.02,
      tiltAngle: 0,
      speedY: Math.random() * 3 + 2,
    });
  }

  let animationFrameId;
  const startTime = Date.now();

  function draw() {
    ctx.clearRect(0, 0, width, height);

    let active = false;
    particles.forEach((p) => {
      p.tiltAngle += p.tiltAngleIncremental;
      p.y += p.speedY;
      p.x += Math.sin(p.tiltAngle) * 0.5;
      p.tilt = Math.sin(p.tiltAngle) * 15;

      if (p.y < height) {
        active = true;
      }

      ctx.beginPath();
      ctx.lineWidth = p.r / 2;
      ctx.strokeStyle = p.color;
      ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
      ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
      ctx.stroke();
    });

    // Run for maximum 3.5 seconds
    if (active && Date.now() - startTime < 3500) {
      animationFrameId = requestAnimationFrame(draw);
    } else {
      window.removeEventListener('resize', handleResize);
      if (document.body.contains(canvas)) {
        document.body.removeChild(canvas);
      }
    }
  }

  draw();
};
