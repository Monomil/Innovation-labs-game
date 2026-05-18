/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameChildProps } from './MiniGameEngine';
import { Music, Star, Zap, Volume2 } from 'lucide-react';

export function FestivalTownGame({ state, level, onScore, onCompleteLevel, onFail }: GameChildProps) {
  const [activeNote, setActiveNote] = useState<number | null>(null);
  const [combo, setCombo] = useState(0);
  const [joy, setJoy] = useState(50);
  const [hits, setHits] = useState(0);
  const [perfects, setPerfects] = useState(0);

  const goal = level === 'boss' ? 30 : 10 + (level * 5);
  const speed = 1500 / (level === 'boss' ? 2 : level);

  useEffect(() => {
    if (state === 'intro' || state === 'win' || state === 'lose') return;

    const interval = setInterval(() => {
       const lane = Math.floor(Math.random() * 4);
       setActiveNote(lane);
       
       // Note timeout
       setTimeout(() => {
          setActiveNote(prev => {
             if (prev === lane) {
                // Miss
                setCombo(0);
                setJoy(prevJoy => Math.max(0, prevJoy - 10));
                return null;
             }
             return prev;
          });
       }, speed * 0.8);

    }, speed);

    return () => clearInterval(interval);
  }, [state, speed]);

  const handleHit = (lane: number) => {
     if (activeNote === lane) {
        setCombo(prev => prev + 1);
        setJoy(prev => Math.min(100, prev + 5));
        setHits(prev => prev + 1);
        setPerfects(prev => prev + 1);
        onScore(100 * (combo + 1));
        setActiveNote(null);

        if (hits + 1 >= goal) {
           onCompleteLevel();
        }
     } else {
        setCombo(0);
        setJoy(prev => Math.max(0, prev - 15));
        onScore(-50);
     }
  };

  useEffect(() => {
     if (joy <= 0) onFail();
  }, [joy, onFail]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1e1b4b] overflow-hidden">
      {/* Neon Lights Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#312e81_0%,_#1e1b4b_100%)]" />
      
      {/* Bass Visualizer effect */}
      <div className="absolute bottom-0 w-full h-1/2 flex items-end justify-center gap-1 opacity-20 pointer-events-none">
         {[...Array(20)].map((_, i) => (
            <motion.div
               key={i}
               animate={{ height: ['10%', '100%', '30%', '80%', '10%'] }}
               transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
               className="w-8 bg-indigo-400"
            />
         ))}
      </div>

      <div className="relative z-[210] flex flex-col items-center w-full max-w-4xl px-8">
         <div className="text-center mb-16">
            <h2 className="text-6xl font-black text-white italic tracking-tighter uppercase mb-2 drop-shadow-[0_0_30px_indigo]">RHYTHM REVELRY</h2>
            <p className="text-indigo-300 font-extrabold uppercase tracking-[0.4em] text-sm">Feel the beat and tap the lights!</p>
         </div>

         {/* Rhythm Lanes */}
         <div className="flex gap-12 w-full justify-center">
            {[0, 1, 2, 3].map((i) => (
               <div key={i} className="relative flex flex-col items-center">
                  <div className="w-24 h-[400px] bg-white/5 rounded-full border-2 border-white/10 relative overflow-hidden">
                     <div className={`absolute bottom-0 w-full h-24 bg-white/10 ${activeNote === i ? 'bg-yellow-400/20' : ''} transition-colors`} />
                  </div>
                  
                  <motion.button
                     whileHover={{ scale: 1.1 }}
                     whileTap={{ scale: 0.9 }}
                     onClick={() => handleHit(i)}
                     className={`mt-8 w-24 h-24 rounded-full border-8 transition-all relative z-[220] ${
                        activeNote === i 
                        ? 'bg-yellow-400 border-white shadow-[0_0_50px_gold] scale-110' 
                        : 'bg-white/10 border-white/20'
                     }`}
                  >
                     {activeNote === i && (
                        <>
                           <motion.div 
                              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                              transition={{ duration: 1, repeat: Infinity }}
                              className="absolute inset-[-12px] rounded-full border-4 border-yellow-300 -z-10"
                           />
                           <Star size={40} className="mx-auto text-indigo-900 fill-indigo-900" />
                        </>
                     )}
                  </motion.button>
               </div>
            ))}
         </div>
      </div>

      {/* Combo Indicator */}
      <AnimatePresence>
         {combo >= 5 && (
            <motion.div
               key="combo"
               initial={{ scale: 0, x: 100, opacity: 0 }}
               animate={{ scale: 1, x: 0, opacity: 1 }}
               exit={{ scale: 0, opacity: 0 }}
               className="absolute right-20 top-1/2 -translate-y-1/2 text-center"
            >
               <span className="text-yellow-400 font-black text-8xl italic tracking-tighter drop-shadow-[0_0_30px_gold]">{combo}</span>
               <span className="block text-white font-black uppercase text-2xl tracking-[0.2em] -mt-4">COMBO!</span>
            </motion.div>
         )}
      </AnimatePresence>

      {/* Crowd Happiness / Joy Meter */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 z-[220] flex items-center gap-8 bg-white/5 backdrop-blur-xl px-12 py-6 rounded-[30px] border-2 border-white/10 w-full max-w-xl">
         <div className="flex flex-col gap-1 shrink-0">
            <div className="flex items-center gap-2">
               <Zap className="text-yellow-400 fill-yellow-400" size={20} />
               <span className="text-white font-black uppercase text-[10px] tracking-widest">Crowd Energy</span>
            </div>
            <span className="text-white font-black text-3xl italic tracking-tighter">{Math.round(joy)}%</span>
         </div>
         <div className="flex-1 h-3 bg-white/10 rounded-full border border-white/20 overflow-hidden">
            <motion.div 
               animate={{ width: `${joy}%`, backgroundColor: joy > 80 ? '#fbbf24' : '#6366f1' }}
               className="h-full shadow-[0_0_20px_rgba(251,191,36,0.5)]"
            />
         </div>
         <div className="flex flex-col items-end gap-1">
            <span className="text-white/40 font-black uppercase text-[10px] tracking-widest">Progress</span>
            <span className="text-white font-black text-2xl italic tracking-tighter">{hits} / {goal}</span>
         </div>
      </div>

      {/* Music Wave Icon */}
      <div className="absolute top-12 left-12 w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white border border-white/20">
         <Volume2 />
      </div>
    </div>
  );
}
