import React from 'react';
import { motion } from 'motion/react';
import { Compass, Sparkle } from 'lucide-react';

export function AizaLogo({ size = 'md', animated = true, className = '' }: { size?: 'sm' | 'md' | 'lg' | 'xl'; animated?: boolean; className?: string }) {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-5xl',
    lg: 'text-7xl',
    xl: 'text-9xl'
  };

  const iconSizes = {
    sm: 20,
    md: 40,
    lg: 64,
    xl: 100
  };

  return (
    <div className={`flex items-center gap-6 select-none group ${className}`}>
       <div className="relative">
          <motion.div
            animate={animated ? {
              rotate: [0, 360],
              filter: ["brightness(1) blur(0px)", "brightness(1.5) blur(2px)", "brightness(1) blur(0px)"]
            } : {}}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className={`relative z-10 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-4 rounded-[35%] shadow-[0_20px_50px_rgba(99,102,241,0.6)] border-4 border-white/30 backdrop-blur-xl`}
          >
             <Compass size={iconSizes[size]} className="text-white drop-shadow-[0_0_15px_white]" />
          </motion.div>
          
          {/* Multi-layered Energy Glow */}
          <motion.div 
            animate={animated ? { opacity: [0.4, 0.8, 0.4], scale: [1, 1.4, 1] } : {}}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-cyan-400 blur-3xl rounded-full -z-10"
          />
          <motion.div 
            animate={animated ? { opacity: [0.3, 0.6, 0.3], scale: [1.2, 1.8, 1.2] } : {}}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute inset-0 bg-pink-500 blur-3xl rounded-full -z-20"
          />
       </div>

       <div className="flex flex-col">
          <div className="relative">
             <h1 className={`${sizeClasses[size]} font-black italic uppercase tracking-tighter leading-none text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] relative`}>
                AIZA
                {/* Magical Shine Overlay */}
                <motion.div
                  animate={{ x: ['-200%', '300%'] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-20 pointer-events-none"
                />
             </h1>
             
             {/* Glowing Highlights */}
             <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-white to-pink-500 blur-xl opacity-20 -z-10 group-hover:opacity-40 transition-opacity" />
             
             {animated && (
               <motion.div
                 animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5], x: [0, 50], y: [0, -30] }}
                 transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
                 className="absolute -top-6 -right-6 text-cyan-300"
               >
                 <Sparkle size={24} fill="currentColor" />
               </motion.div>
             )}
          </div>
          <motion.span 
            animate={{ letterSpacing: ['0.4em', '0.6em', '0.4em'] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="text-[12px] font-black uppercase text-cyan-300/80 mt-2 leading-none filter drop-shadow-[0_0_5px_rgba(103,232,249,0.5)]"
          >
            World
          </motion.span>
       </div>
    </div>
  );
}
