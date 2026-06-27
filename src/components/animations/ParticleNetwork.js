'use client';
import { useEffect, useRef, useCallback } from 'react';

// Animation tuning knobs (all distances in pixels)
const PIXELS_PER_PARTICLE = 15000;  // one particle per this many canvas pixels — higher = fewer particles
const MOUSE_REPEL_RADIUS = 120;     // particles inside this radius get pushed away from the cursor
const MOUSE_REPEL_STRENGTH = 0.02;  // how hard the push is
const PARTICLE_LINK_DISTANCE = 150; // particles closer than this are connected with a line
const MOUSE_LINK_DISTANCE = 200;    // particles closer than this to the cursor link to it

export default function ParticleNetwork({ className = '' }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: null, y: null });

  const initParticles = useCallback((canvas) => {
    const particleCount = Math.floor((canvas.width * canvas.height) / PIXELS_PER_PARTICLE);
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.3,
      });
    }
    
    return particles;
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const particles = particlesRef.current;
    const mouse = mouseRef.current;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Choose colors dynamically based on theme (blue-300/violet-400 in dark, indigo-500/violet-500 in light)
    const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
    const particleColorRgb = isDark ? '147, 197, 253' : '99, 102, 241';
    const mouseColorRgb = isDark ? '167, 139, 250' : '139, 92, 246';
    
    // Scale up opacity & stroke thickness in light mode for higher visibility
    const opacityMultiplier = isDark ? 1.0 : 1.8;
    const lineWidthMultiplier = isDark ? 1.0 : 1.4;
    
    // Update and draw particles
    particles.forEach((particle, i) => {
      // Move particles
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Bounce off edges
      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
      
      // Keep in bounds
      particle.x = Math.max(0, Math.min(canvas.width, particle.x));
      particle.y = Math.max(0, Math.min(canvas.height, particle.y));
      
      // Mouse interaction - particles move away from cursor
      if (mouse.x !== null && mouse.y !== null) {
        const dx = particle.x - mouse.x;
        const dy = particle.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < MOUSE_REPEL_RADIUS) {
          // Push is strongest right at the cursor and fades to zero at the radius edge
          const force = (MOUSE_REPEL_RADIUS - dist) / MOUSE_REPEL_RADIUS;
          particle.x += dx * force * MOUSE_REPEL_STRENGTH;
          particle.y += dy * force * MOUSE_REPEL_STRENGTH;
        }
      }
      
      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${particleColorRgb}, ${Math.min(1.0, particle.opacity * opacityMultiplier)})`;
      ctx.fill();
      
      // Draw connections
      for (let j = i + 1; j < particles.length; j++) {
        const other = particles[j];
        const dx = particle.x - other.x;
        const dy = particle.y - other.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < PARTICLE_LINK_DISTANCE) {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(other.x, other.y);
          // Lines fade out the further apart the two particles are
          const opacity = (1 - dist / PARTICLE_LINK_DISTANCE) * 0.3 * opacityMultiplier;
          ctx.strokeStyle = `rgba(${particleColorRgb}, ${Math.min(1.0, opacity)})`;
          ctx.lineWidth = 0.5 * lineWidthMultiplier;
          ctx.stroke();
        }
      }
      
      // Connect to mouse
      if (mouse.x !== null && mouse.y !== null) {
        const dx = particle.x - mouse.x;
        const dy = particle.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < MOUSE_LINK_DISTANCE) {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(mouse.x, mouse.y);
          const opacity = (1 - dist / MOUSE_LINK_DISTANCE) * 0.5 * opacityMultiplier;
          ctx.strokeStyle = `rgba(${mouseColorRgb}, ${Math.min(1.0, opacity)})`;
          ctx.lineWidth = 0.8 * lineWidthMultiplier;
          ctx.stroke();
        }
      }
    });
    
    animationRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const handleResize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
      particlesRef.current = initParticles(canvas);
    };
    
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    
    const handleMouseLeave = () => {
      mouseRef.current = { x: null, y: null };
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initParticles, animate]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-auto ${className}`}
      style={{ background: 'transparent' }}
    />
  );
}
