/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameChildProps } from './MiniGameEngine';
import { Waves, Heart, Sparkles, Wind } from 'lucide-react';

interface Shell {
  id: number;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export function CalmBeachGame({ state, level, onScore, onCompleteLevel, onFail }: GameChildProps) {
  const [shells, setShells] = useState<Shell[]>([]);
  const [collected, setCollected] = useState(0);
  const [calmness, setCalmness] = useState(100);
  const [activeBreathing, setActiveBreathing] = useState(false);
  const [waveActive, setWaveActive] = useState(false);

  const goal = level === 'boss' ? 20 : 5 + (level * 3);

  // Spawn Shells
  useEffect(() => {
    if (state === 'intro' || state === 'win' || state === 'lose') return;

    if (shells.length < 5) {
       const newShell = {
          id: Date.now() + Math.random(),
          x: Math.random() * 80 + 10,
          y: Math.random() * 60 + 20,
          scale: 0.8 + Math.random() * 0.4,
          rotation: Math.random() * 360
       };
       setShells(prev => [...prev, newShell]);
    }
  }, [state, shells]);

  // Wave Logic
  useEffect(() => {
    const numericLevel = level === 'boss' ? 4 : level;
    const waveInterval = setInterval(() => {
       setWaveActive(true);
       setTimeout(() => {
          setWaveActive(false);
          // Wave reduces calmness if player is moving "fast" (not applicable here directly, so let's say it reduces calmness unless breathing)
          if (!activeBreathing) {
             setCalmness(prev => Math.max(0, prev - 10));
          }
       }, 3000);
    }, 8000 / numericLevel);
    return () => clearInterval(waveInterval);
  }, [level, activeBreathing]);

  // Calmness Decay
  useEffect(() => {
     const decay = setInterval(() => {
        if (!activeBreathing) {
           setCalmness(prev => Math.max(0, prev - 1));
        } else {
           setCalmness(prev => Math.min(100, prev + 2));
        }
     }, 200);
     return () => clearInterval(decay);
  }, [activeBreathing]);

  const collectShell = (id: number) => {
    if (activeBreathing) return;
    setShells(prev => prev.filter(s => s.id !== id));
    setCollected(prev => prev + 1);
    onScore(150);
    setCalmness(prev => Math.min(100, prev + 5));

    if (collected + 1 >= goal) {
       onCompleteLevel();
    }
  };

  useEffect(() => {
     if (calmness <= 0) {
        onFail();
     }
  }, [calmness, onFail]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#e0f2f1] overflow-hidden">
      {/* Ocean Waves */}
      <motion.div 
        animate={{ 
           y: waveActive ? '0%' : '100%',
        }}
        transition={{ duration: 3, ease: "easeInOut" }}
        className="absolute inset-0 z-[230] bg-cyan-400/30 backdrop-blur-md pointer-events-none border-t-8 border-white/40"
      >
         <div className="absolute bottom-0 left-0 w-full h-8 bg-white/20" />
      </motion.div>

      {/* Beach Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_#80cbc4_0%,_#e0f2f1_100%)]" />

      {/* Shells */}
      <div className="relative w-full h-full p-8 z-[210]">
         <AnimatePresence>
            {shells.map(shell => (
               <motion.button
                 key={shell.id}
                 initial={{ scale: 0, opacity: 0 }}
                 animate={{ scale: shell.scale, opacity: 1, rotate: shell.rotation }}
                 exit={{ scale: 2, opacity: 0 }}
                 onClick={() => collectShell(shell.id)}
                 className="absolute z-[211] hover:scale-125 transition-transform"
                 style={{ left: `${shell.x}%`, top: `${shell.y}%` }}
               >
                  <div className="text-6xl drop-shadow-[0_5px_15px_rgba(0,0,0,0.2)]">🐚</div>
               </motion.button>
            ))}
         </AnimatePresence>
      </div>

      {/* Breathing Interaction */}
      <div className="absolute bottom-32 flex flex-col items-center z-[240]">
         <motion.button
           onMouseDown={() => setActiveBreathing(true)}
           onMouseUp={() => setActiveBreathing(false)}
           onTouchStart={() => setActiveBreathing(true)}
           onTouchEnd={() => setActiveBreathing(false)}
           className={`w-32 h-32 rounded-full flex items-center justify-center transition-all shadow-2xl relative group ${
             activeBreathing ? 'bg-cyan-500 scale-125 border-4 border-white' : 'bg-white border-4 border-cyan-100'
           }`}
         >
            <div className="absolute inset-0 rounded-full bg-cyan-400/20 animate-ping opacity-0 group-hover:opacity-100" />
            <Wind className={`${activeBreathing ? 'text-white' : 'text-cyan-500'}`} size={48} />
            {activeBreathing && (
               <motion.div 
                 animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.2, 0.5] }}
                 transition={{ duration: 2, repeat: Infinity }}
                 className="absolute inset-[-20px] bg-cyan-300 rounded-full -z-10"
               />
            )}
         </motion.button>
         <p className="text-cyan-900 font-black uppercase text-[10px] tracking-[0.3em] mt-4 bg-white/40 px-4 py-2 rounded-full border border-white/60">
            {activeBreathing ? "BREATHING CALMLY..." : "HOLD TO BREATHE"}
         </p>
      </div>

      {/* Calmness Meter */}
      <div className="absolute bottom-12 w-full max-w-lg px-8 z-[240]">
         <div className="flex justify-between items-end mb-2">
            <div className="flex items-center gap-2">
               <Heart className={`${calmness < 30 ? 'text-rose-500 animate-pulse' : 'text-cyan-600'}`} size={16} />
               <span className="text-cyan-800 font-black uppercase tracking-widest text-xs">Inner Peace</span>
            </div>
            <span className="text-cyan-900 font-black text-2xl tracking-tighter italic">{Math.round(calmness)}%</span>
         </div>
         <div className="w-full h-6 bg-white/40 rounded-full border-2 border-white overflow-hidden shadow-xl">
            <motion.div 
              animate={{ 
                width: `${calmness}%`,
                backgroundColor: calmness < 30 ? '#fb7185' : '#06b6d4'
              }}
              className="h-full shadow-[0_0_20px_rgba(6,182,212,0.5)]"
            />
         </div>
      </div>

      {/* HUD Info */}
      <div className="absolute top-12 right-12 z-[240]">
         <div className="bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-white/60 text-right">
            <span className="block text-[10px] font-black text-cyan-800 uppercase tracking-widest mb-1">Treasures</span>
            <span className="text-4xl font-black text-cyan-900">{collected} / {goal}</span>
         </div>
      </div>
    </div>
  );
}
