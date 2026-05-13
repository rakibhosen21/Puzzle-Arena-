import React from 'react';
import { motion } from 'motion/react';

const ConcreteText: React.FC = () => {
  return (
    <div className="relative select-none pointer-events-none mb-4 flex items-center justify-center min-h-[150px]">
      {/* Background Chromatic Aberration Layers (Yellow Theme) */}
      <motion.h2
        className="absolute inset-0 text-[15vw] font-black tracking-tighter text-[#ffd700] mix-blend-screen opacity-20 flex items-center justify-center"
        animate={{
          x: [-4, 4, -2],
          y: [2, -2, 2],
          skewX: [-2, 2, -1],
          filter: ['blur(2px)', 'blur(4px)', 'blur(2px)']
        }}
        transition={{
          duration: 0.15,
          repeat: Infinity,
          repeatType: "mirror"
        }}
        style={{ filter: 'blur(2px)' }}
      >
        CONCRETE
      </motion.h2>
      <motion.h2
        className="absolute inset-0 text-[15vw] font-black tracking-tighter text-[#ffaa00] mix-blend-screen opacity-20 flex items-center justify-center"
        animate={{
          x: [4, -4, 2],
          y: [-2, 2, -2],
          skewY: [-1, 1, 0],
          filter: ['blur(3px)', 'blur(1px)', 'blur(3px)']
        }}
        transition={{
          duration: 0.12,
          repeat: Infinity,
          repeatType: "mirror"
        }}
        style={{ filter: 'blur(2px)' }}
      >
        CONCRETE
      </motion.h2>

      {/* Main Animated Text */}
      <motion.h2
        className="relative text-[15vw] font-black tracking-tighter leading-none flex items-center justify-center z-20"
        style={{
          color: 'transparent',
          WebkitTextStroke: '1.5px rgba(234, 179, 8, 0.4)',
        }}
      >
        <motion.span
          animate={{
            backgroundImage: [
              'linear-gradient(90deg, #eaal08, #fbbf24, #f59e0b, #eaal08)',
              'linear-gradient(180deg, #f59e0b, #eaal08, #fbbf24, #f59e0b)',
              'linear-gradient(270deg, #fbbf24, #f59e0b, #eaal08, #fbbf24)',
              'linear-gradient(0deg, #eaal08, #fbbf24, #f59e0b, #eaal08)',
            ],
            textShadow: [
              '0 0 15px rgba(234, 179, 8, 0.6)',
              '0 0 35px rgba(251, 191, 36, 0.8)',
              '0 0 15px rgba(234, 179, 8, 0.6)',
            ],
            scale: [1, 1.03, 0.98, 1.01, 1],
            rotate: [0, 0.5, -0.5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-300 relative select-none"
        >
          CONCRETE
        </motion.span>
      </motion.h2>

      {/* Morphing Energy Field Behind Text */}
      <motion.div
        animate={{
          scale: [0.8, 1.2, 0.9, 1.1, 0.8],
          opacity: [0.1, 0.3, 0.2, 0.4, 0.1],
          rotate: [0, 90, 180, 270, 360],
        }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute w-[40vw] h-[15vw] bg-yellow-500/20 blur-[80px] rounded-[30%70%70%30%/30%30%70%70%] -z-10"
      />

      {/* Glitch Overlay Blocks (Yellow Theme) */}
      {[1, 2, 3, 4, 5].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            opacity: [0, 0.9, 0, 0.7, 0],
            top: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
            height: [`${Math.random() * 8}px`, `${Math.random() * 15}px`],
            x: [0, (Math.random() - 0.5) * 40, 0]
          }}
          transition={{
            duration: 0.1 + Math.random() * 0.1,
            repeat: Infinity,
            repeatDelay: Math.random() * 4 + 1
          }}
          className="absolute left-0 w-full bg-yellow-400/40 blur-[1px] z-30"
        />
      ))}
    </div>
  );
};

export default ConcreteText;
