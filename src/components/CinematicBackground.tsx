import React from 'react';
import { motion } from 'motion/react';

export function CinematicBackground() {
  return (
    <div className="fixed inset-0 z-0 bg-[#020314] overflow-hidden">
       {/* Cyber Grid Base (Tron-inspired) */}
       <div className="absolute inset-x-0 top-0 h-full opacity-10 pointer-events-none" 
            style={{ backgroundImage: `linear-gradient(rgba(34,211,238,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.2) 1px, transparent 1px)`, backgroundSize: '100px 100px', transform: 'perspective(1000px) rotateX(60deg) translateY(-20%)', transformOrigin: 'top' }} />

       {/* Deep Navy/Purple Base Gradient */}
       <div className="absolute inset-0 bg-gradient-to-b from-[#0a0c2e] via-[#020314] to-[#0a0514]" />
       
       {/* Holographic Planet Glows */}
       <div className="absolute top-[10%] left-[10%] w-[300px] h-[300px] bg-cyan-500/10 blur-[80px] rounded-full animate-pulse" />
       <div className="absolute top-[40%] right-[10%] w-[400px] h-[400px] bg-purple-500/10 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '3s' }} />

       {/* Cosmic Mist Layers */}
       <motion.div 
         animate={{ 
           opacity: [0.3, 0.5, 0.3],
           scale: [1, 1.2, 1],
           rotate: [0, 5, 0]
         }}
         transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
         className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.15)_0%,transparent_50%)] blur-[100px]"
       />
       <motion.div 
         animate={{ 
           opacity: [0.2, 0.4, 0.2],
           scale: [1.2, 1, 1.2],
           rotate: [0, -5, 0]
         }}
         transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
         className="absolute -bottom-1/4 -right-1/4 w-[150%] h-[150%] bg-[radial-gradient(circle_at_70%_70%,rgba(192,38,211,0.15)_0%,transparent_50%)] blur-[100px]"
       />

       {/* Floating Stars */}
       {[...Array(60)].map((_, i) => (
         <motion.div
           key={`star-${i}`}
           initial={{ 
             x: `${Math.random() * 100}%`, 
             y: `${Math.random() * 100}%`, 
             opacity: Math.random(),
             scale: Math.random() * 0.5 + 0.5
           }}
           animate={{ 
             opacity: [Math.random() * 0.5, 1, Math.random() * 0.5],
             scale: [0.8, 1.2, 0.8]
           }}
           transition={{ 
             duration: 3 + Math.random() * 5, 
             repeat: Infinity,
             delay: Math.random() * 5
           }}
           className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_8px_white]"
         />
       ))}

       {/* Magic Energy Trails / Streaks */}
       {[...Array(8)].map((_, i) => (
         <motion.div
           key={`streak-${i}`}
           initial={{ 
             x: '-10%', 
             y: `${20 + Math.random() * 60}%`, 
             opacity: 0,
             scaleX: 0
           }}
           animate={{ 
             x: '120%',
             opacity: [0, 0.2, 0],
             scaleX: [1, 2, 1]
           }}
           transition={{ 
             duration: 10 + Math.random() * 15, 
             repeat: Infinity,
             delay: i * 4,
             ease: "linear"
           }}
           className="absolute w-[300px] h-0.5 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent blur-sm"
         />
       ))}

       {/* Neon Pink/Cyan Ambient Fog */}
       <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-pink-500/10 via-transparent to-transparent pointer-events-none" />
       
       {/* Emotional Spark Particles */}
       <SparkParticleLayer />
    </div>
  );
}

function SparkParticleLayer() {
  return (
    <div className="absolute inset-0 pointer-events-none">
       {[...Array(30)].map((_, i) => {
         const colorClass = Math.random() > 0.5 ? 'bg-cyan-300' : 'bg-pink-400';
         const shadowClass = Math.random() > 0.5 ? 'shadow-[0_0_15px_#67e8f9]' : 'shadow-[0_0_15px_#f472b6]';
         
         return (
           <motion.div
             key={`spark-${i}`}
             initial={{ 
               x: `${Math.random() * 100}%`, 
               y: `${100 + Math.random() * 20}%`, 
               scale: 0 
             }}
             animate={{ 
               y: '-20%',
               x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
               opacity: [0, 0.6, 0],
               scale: [0, 1, 0.5]
             }}
             transition={{ 
               duration: 15 + Math.random() * 20, 
               repeat: Infinity,
               delay: Math.random() * 15,
               ease: "linear"
             }}
             className={`absolute w-1.5 h-1.5 rounded-full blur-[1px] ${colorClass} ${shadowClass}`}
           />
         );
       })}
    </div>
  );
}
