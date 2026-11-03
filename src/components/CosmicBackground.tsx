import React, { useEffect, useRef } from 'react';

export const CosmicBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Generate stars
    const starCount = Math.floor((width * height) / 9000);
    const stars: Array<{
      x: number;
      y: number;
      radius: number;
      alpha: number;
      originalAlpha: number;
      twinkleSpeed: number;
      color: string;
    }> = [];

    const starColors = ['#ffffff', '#a5b4fc', '#93c5fd', '#c4b5fd', '#fbcfe8'];

    for (let i = 0; i < starCount; i++) {
      const alpha = Math.random() * 0.7 + 0.2;
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.4,
        alpha,
        originalAlpha: alpha,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        color: starColors[Math.floor(Math.random() * starColors.length)],
      });
    }

    // Shooting stars
    const shootingStars: Array<{
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      opacity: number;
      active: boolean;
    }> = [];

    const spawnShootingStar = () => {
      shootingStars.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.5),
        length: Math.random() * 80 + 40,
        speed: Math.random() * 10 + 12,
        angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1),
        opacity: 1,
        active: true,
      });
    };

    let lastShootingStarTime = Date.now();

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle twinkling stars
      for (const star of stars) {
        star.alpha += Math.sin(Date.now() * star.twinkleSpeed) * 0.01;
        const clampedAlpha = Math.max(0.1, Math.min(1, star.alpha));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = clampedAlpha;
        ctx.shadowBlur = star.radius > 1.2 ? 6 : 0;
        ctx.shadowColor = star.color;
        ctx.fill();
      }

      ctx.shadowBlur = 0;

      // Occasional shooting star
      const now = Date.now();
      if (now - lastShootingStarTime > 4500 && Math.random() < 0.4) {
        spawnShootingStar();
        lastShootingStarTime = now;
      }

      // Render shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        if (!s.active) {
          shootingStars.splice(i, 1);
          continue;
        }

        const headX = s.x;
        const headY = s.y;
        const tailX = s.x - Math.cos(s.angle) * s.length;
        const tailY = s.y - Math.sin(s.angle) * s.length;

        const grad = ctx.createLinearGradient(headX, headY, tailX, tailY);
        grad.addColorStop(0, `rgba(255, 255, 255, ${s.opacity})`);
        grad.addColorStop(0.3, `rgba(165, 180, 252, ${s.opacity * 0.8})`);
        grad.addColorStop(1, 'rgba(165, 180, 252, 0)');

        ctx.beginPath();
        ctx.moveTo(headX, headY);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.8;
        ctx.globalAlpha = s.opacity;
        ctx.stroke();

        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.opacity -= 0.018;

        if (s.opacity <= 0 || s.x > width + 100 || s.y > height + 100) {
          s.active = false;
        }
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-65"
      aria-hidden="true"
    />
  );
};
