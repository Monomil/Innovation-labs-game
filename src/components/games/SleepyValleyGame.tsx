/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameChildProps } from './MiniGameEngine';
import { Moon, Star, Ghost, Sparkles, VolumeX } from 'lucide-react';

interface SleepItem {
  id: number;
  type: 'pillow' | 'blanket' | 'star';
  emoji: string;
  x: number;
  y: number;
}

export function SleepyValleyGame({ state, level, onScore, onCompleteLevel, onFail }: GameChildProps) {
  const [items, setItems] = useState<SleepItem[]>([]);
  const [noiseScore, setNoiseScore] = useState(0);
  const [quietness, setQuietness] = useState(100);
  const [collected, setCollected] = useState({ pillow: 0, blanket: 0, star: 0 });
  const [noises, setNoises] = useState<{id: number, x: number, y: number}[]>([]);

  const goal = level === 'boss' ? 10 : 3 + (level * 2);

  // Spawn Items
  useEffect(() => {
     if (state !== 'level1' && state !== 'level2' && state !== 'level3' && state !== 'boss') return;

     const interval = setInterval(() => {
        if (items.length < 6) {
           const types: ('pillow' | 'blanket' | 'star')[] = ['pillow', 'blanket', 'star'];
           const type = types[Math.floor(Math.random() * types.length)];
           const emojis = { pillow: '☁️', blanket: '🧶', star: '⭐' };
           
           const newItem: SleepItem = {
              id: Date.now() + Math.random(),
              type,
              emoji: emojis[type],
              x: Math.random() * 80 + 10,
              y: Math.random() * 60 + 20
           };
           setItems(prev => [...prev, newItem]);
        }
     }, 2000);

     return () => clearInterval(interval);
  }, [state, items.length]);

  // Spawn Noise Spirits
  useEffect(() => {
     if (state !== 'level2' && state !== 'level3' && state !== 'boss') return;

     const numericLevel = level === 'boss' ? 4 : level;
     const interval = setInterval(() => {
        const newNoise = {
           id: Date.now() + Math.random(),
           x: Math.random() * 80 + 10,
           y: Math.random() * 60 + 20
        };
        setNoises(prev => [...prev, newNoise]);
        // Noises decay quietness instantly
        setQuietness(prev => Math.max(0, prev - 5));
     }, 3000 / numericLevel);

     return () => clearInterval(interval);
  }, [state, level]);

  // Background Quietness Decay
  useEffect(() => {
     const decay = setInterval(() => {
        if (noises.length > 0) {
           setQuietness(prev => Math.max(0, prev - (noises.length * 0.5)));
        } else {
           setQuietness(prev => Math.min(100, prev + 0.5));
        }
     }, 200);
     return () => clearInterval(decay);
  }, [noises]);

  const collectItem = (item: SleepItem) => {
     setItems(prev => prev.filter(i => i.id !== item.id));
     setCollected(prev => ({ ...prev, [item.type]: prev[item.type] + 1 }));
     onScore(150);

     const total = collected.pillow + collected.blanket + collected.star + 1;
     if (total >= goal * 3) {
        onCompleteLevel();
     }
  };

  const zapNoise = (id: number) => {
     setNoises(prev => prev.filter(n => n.id !== id));
     onScore(200);
     setQuietness(prev => Math.min(100, prev + 10));
  };

  useEffect(() => {
     if (quietness <= 0) onFail();
  }, [quietness, onFail]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a2e]">
      {/* Night Sky Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#1a1a4a_0%,_#0a0a2e_100%)]" />
      
      {/* Floating Sparkles */}
      <div className="absolute inset-0 pointer-events-none">
         {[...Array(15)].map((_, i) => (
            <motion.div
               key={i}
               animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.5, 1] }}
               transition={{ duration: 3 + Math.random() * 3, repeat: Infinity }}
               className="absolute"
               style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
            >
               <Sparkles className="text-yellow-200/40" size={Math.random() * 20 + 10} />
            </motion.div>
         ))}
      </div>

      <div className="relative z-[210] w-full h-full p-12">
         {/* Items to collect */}
         <AnimatePresence>
            {items.map(item => (
               <motion.button
                  key={item.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1, y: [0, -10, 0] }}
                  exit={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.5, y: { duration: 2, repeat: Infinity } }}
                  onClick={() => collectItem(item)}
                  className="absolute z-[211] p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/30 transition-all group"
                  style={{ left: `${item.x}%`, top: `${item.y}%` }}
               >
                  <div className="text-6xl group-hover:scale-125 transition-transform">{item.emoji}</div>
               </motion.button>
            ))}

            {/* Noise Spirits */}
            {noises.map(noise => (
               <motion.button
                  key={noise.id}
                  initial={{ scale: 0, opacity: 0, rotate: -45 }}
                  animate={{ scale: 1, opacity: 1, rotate: [0, 10, -10, 0] }}
                  exit={{ scale: 0, rotate: 90 }}
                  transition={{ duration: 0.3, rotate: { duration: 0.5, repeat: Infinity } }}
                  onClick={() => zapNoise(noise.id)}
                  className="absolute z-[215]"
                  style={{ left: `${noise.x}%`, top: `${noise.y}%` }}
               >
                  <div className="relative">
                     <Ghost className="text-rose-400 fill-rose-400/20" size={100} />
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl">📢</div>
                  </div>
               </motion.button>
            ))}
         </AnimatePresence>
      </div>

      {/* Quietness Meter */}
      <div className="absolute bottom-12 w-full max-w-lg px-8 z-[220]">
         <div className="flex justify-between items-end mb-2">
            <div className="flex items-center gap-2">
               <VolumeX className={`${quietness < 30 ? 'text-rose-500 animate-pulse' : 'text-indigo-300'}`} size={16} />
               <span className="text-indigo-400 font-black uppercase tracking-widest text-xs">Quiet Meter</span>
            </div>
            <span className="text-white font-black text-2xl tracking-tighter italic">{Math.round(quietness)}%</span>
         </div>
         <div className="w-full h-6 bg-white/10 rounded-full border-2 border-indigo-500/30 overflow-hidden shadow-2xl">
            <motion.div 
               animate={{ width: `${quietness}%`, backgroundColor: quietness < 30 ? '#ef4444' : '#6366f1' }}
               className="h-full shadow-[0_0_20px_rgba(99,102,241,0.5)]"
            />
         </div>
      </div>

      {/* HUD Info */}
      <div className="absolute top-12 left-12 flex gap-4 z-[220]">
         <HUDCount label="Pillows" count={collected.pillow} goal={goal} icon="☁️" />
         <HUDCount label="Blankets" count={collected.blanket} goal={goal} icon="🧶" />
         <HUDCount label="Stars" count={collected.star} goal={goal} icon="⭐" />
      </div>
    </div>
  );
}

function HUDCount({ label, count, goal, icon }: { label: string, count: number, goal: number, icon: string }) {
   return (
      <div className="bg-white/5 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/10">
         <span className="block text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-1">{label}</span>
         <div className="flex items-center gap-2">
            <span className="text-xl">{icon}</span>
            <span className="text-xl font-black text-white">{count} <span className="text-white/20 text-sm">/ {goal}</span></span>
         </div>
      </div>
   );
}
