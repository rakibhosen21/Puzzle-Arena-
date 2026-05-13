import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

const FuturisticBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      alpha: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 1.5 + 0.2;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * 0.4 - 0.2;
        this.alpha = Math.random() * 0.4 + 0.1;
        this.color = `rgba(234, 179, 8, ${this.alpha})`; // Yellow-500
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Mouse reaction
        const dx = mouseRef.current.x - this.x;
        const dy = mouseRef.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 250) {
          this.x -= dx / 150;
          this.y -= dy / 150;
        }

        if (this.x > canvas!.width) this.x = 0;
        else if (this.x < 0) this.x = canvas!.width;
        if (this.y > canvas!.height) this.y = 0;
        else if (this.y < 0) this.y = canvas!.height;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        if (Math.random() > 0.98) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(234, 179, 8, 0.8)';
        } else {
          ctx.shadowBlur = 0;
        }
      }
    }

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      const particleCount = Math.min(window.innerWidth / 6, 180);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    const handleResize = () => init();
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-[#020202]">
      {/* Scanline Effect */}
      <div className="absolute inset-0 z-50 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      {/* Canvas Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 opacity-60" />

      {/* Glowing Grid Floor */}
      <div 
        className="absolute bottom-0 left-0 w-full h-full opacity-10 pointer-events-none"
        style={{
          perspective: '1500px',
        }}
      >
        <motion.div 
          animate={{
            translateY: [0, -60, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(234, 179, 8, 0.4) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(234, 179, 8, 0.4) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
            transform: 'rotateX(75deg) translateY(-30%) scale(2)',
            transformOrigin: 'top',
          }}
        />
      </div>

      {/* Hero Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vh] flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute w-[800px] h-[800px] rounded-full bg-yellow-500/20 blur-[150px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute w-[1200px] h-[1200px] rounded-full bg-amber-600/10 blur-[200px]"
        />
      </div>

      {/* Ambient Moving Yellow Beams */}
      <div className="absolute inset-0 overflow-hidden">
        {[20, 50, 80].map((left, i) => (
          <motion.div
            key={i}
            animate={{
              x: ['-10%', '110%'],
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 20 + i * 10,
              repeat: Infinity,
              ease: "linear",
              delay: i * 5
            }}
            className="absolute top-0 w-[300px] h-full bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent blur-[120px] -skew-x-12"
            style={{ left: `${left}%` }}
          />
        ))}
      </div>

      {/* Rotating Cyber Rings */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 overflow-hidden">
        {[600, 900, 1200].map((size, i) => (
          <motion.div
            key={i}
            animate={{
              rotate: i % 2 === 0 ? 360 : -360,
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 30 + i * 10,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute border border-yellow-500/30 rounded-full"
            style={{ 
              width: size, 
              height: size,
              borderStyle: i === 1 ? 'dashed' : 'solid',
              borderWidth: i === 0 ? '2px' : '1px'
            }}
          />
        ))}
      </div>

      {/* Floating Geometric Elements */}
      <div className="absolute inset-0 opacity-5">
        {[1, 2, 3, 4, 5].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: ['0vh', '100vh'],
              rotate: [0, 360],
              opacity: [0, 0.5, 0]
            }}
            transition={{
              duration: 25 + i * 5,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute text-yellow-500 border border-yellow-500/20"
            style={{
              width: 80 + i * 30,
              height: 80 + i * 30,
              left: `${15 * i + 10}%`,
              top: '-10%',
              borderRadius: i % 2 === 0 ? '0' : '50%',
              clipPath: i === 2 ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none'
            }}
          />
        ))}
      </div>

      {/* Dynamic Scan Line */}
      <motion.div
        animate={{
          top: ['-10%', '110%'],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute left-0 w-full h-[1px] bg-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.5)] z-10"
      />

      {/* Global Pulse Overlay */}
      <motion.div
        animate={{
          opacity: [0, 0.1, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 bg-yellow-500/5 mix-blend-overlay"
      />

      {/* Dark Depth Vignet */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-[#020202] opacity-100" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#020202] via-transparent to-[#020202] opacity-40" />
    </div>

  );
};

export default FuturisticBackground;
