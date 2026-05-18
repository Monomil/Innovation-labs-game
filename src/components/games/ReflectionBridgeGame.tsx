/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameChildProps } from './MiniGameEngine';
import { Rainbow, Stars, Sun, Heart, Sparkles, ChevronRight } from 'lucide-react';

export function ReflectionBridgeGame({ state, level, onScore, onCompleteLevel, onFail }: GameChildProps) {
  const [step, setStep] = useState(0);
  const [balance, setBalance] = useState(50);
  const [wisdom, setWisdom] = useState(0);

  const challenges = [
    {
      id: 1,
      title: "Dealing with Anger",
      question: "When I feel like a volcano ready to erupt, the best first step is to:",
      options: [
        { text: "Roar like a lion and stomp my feet", isCorrect: false, gain: -10 },
        { text: "Take slow, deep breaths to cool the lava", isCorrect: true, gain: 20 },
        { text: "Hide away until the feeling goes away", isCorrect: false, gain: 0 }
      ]
    },
    {
      id: 2,
      title: "Sorting Worries",
      question: "I have a worry that 'nobody likes me'. This thought is likely:",
      options: [
        { text: "A real fact I should focus on", isCorrect: false, gain: -10 },
        { text: "A heavy imagination cloud that isn't true", isCorrect: true, gain: 20 },
        { text: "Something to keep secret forever", isCorrect: false, gain: -5 }
      ]
    },
    {
      id: 3,
      title: "Building Joy",
      question: "To keep my inner joy glow shining bright, I should:",
      options: [
        { text: "Practice gratitude and celebrate small wins", isCorrect: true, gain: 20 },
        { text: "Wait for someone to bring me a gift", isCorrect: false, gain: 5 },
        { text: "Ignore my feelings and just keep playing", isCorrect: false, gain: 0 }
      ]
    }
  ];

  const handleOption = (option: any) => {
     if (option.isCorrect) {
        onScore(500);
        setWisdom(prev => prev + 1);
     } else {
        onScore(-100);
     }
     setBalance(prev => Math.max(0, Math.min(100, prev + option.gain)));
     setStep(prev => prev + 1);
  };

  useEffect(() => {
     if (step >= challenges.length) {
        onCompleteLevel();
     }
  }, [step, onCompleteLevel]);

  useEffect(() => {
     if (balance <= 0) onFail();
  }, [balance, onFail]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#020617] overflow-hidden">
      {/* Space Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1e1b4b_0%,_#020617_100%)] opacity-80" />
      
      {/* Rainbow Bridge UI */}
      <div className="absolute bottom-0 w-full h-1/2 flex items-center justify-center pointer-events-none">
         <motion.div 
            animate={{ 
               background: [
                  'linear-gradient(to right, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #6366f1, #a855f7)',
                  'linear-gradient(to right, #a855f7, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #6366f1)',
                  'linear-gradient(to right, #6366f1, #a855f7, #ef4444, #f97316, #eab308, #22c55e, #3b82f6)'
               ]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            className="w-[120%] h-40 blur-3xl opacity-20 rotate-[-10deg]"
         />
      </div>

      <AnimatePresence mode="wait">
         {step < challenges.length ? (
            <motion.div
               key={step}
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 1.1 }}
               className="relative z-[210] max-w-2xl w-full px-8"
            >
               <div className="text-center mb-12">
                  <span className="text-cyan-400 font-black uppercase text-xl tracking-[0.4em] mb-4 block">Reflection #{step + 1}</span>
                  <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase mb-4 drop-shadow-[0_0_20px_white]">{challenges[step].title}</h2>
               </div>

               <div className="bg-white/5 backdrop-blur-3xl p-12 rounded-[60px] border-4 border-white/10 shadow-2xl mb-12">
                  <p className="text-3xl font-black text-white italic text-center leading-tight mb-12">
                     "{challenges[step].question}"
                  </p>

                  <div className="space-y-6">
                     {challenges[step].options.map((opt, i) => (
                        <motion.button
                           key={i}
                           whileHover={{ scale: 1.02, x: 20 }}
                           whileTap={{ scale: 0.98 }}
                           onClick={() => handleOption(opt)}
                           className="w-full p-8 bg-white/10 border-2 border-white/20 rounded-[35px] text-left hover:bg-white/20 hover:border-white transition-all shadow-xl flex items-center gap-6 group"
                        >
                           <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white font-black group-hover:bg-white group-hover:text-indigo-950">
                              {i + 1}
                           </div>
                           <p className="text-2xl font-black text-white italic tracking-tighter">{opt.text}</p>
                        </motion.button>
                     ))}
                  </div>
               </div>
            </motion.div>
         ) : null}
      </AnimatePresence>

      {/* Balance Bar */}
      <div className="absolute bottom-12 w-full max-w-xl px-12 z-[220]">
         <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-3">
               <Stars className="text-yellow-400" size={24} />
               <span className="text-white font-black uppercase text-xs tracking-widest">Growth Balance</span>
            </div>
            <span className="text-white font-black text-4xl italic tracking-tighter">{Math.round(balance)}%</span>
         </div>
         <div className="w-full h-8 bg-black border-4 border-white/10 rounded-full overflow-hidden relative shadow-inner">
            <div className="absolute left-1/2 top-0 w-1 h-full bg-white/20 z-10" />
            <motion.div 
               animate={{ width: `${balance}%` }}
               className="h-full bg-gradient-to-r from-indigo-600 via-cyan-400 to-emerald-400 shadow-[0_0_30px_rgba(34,211,238,0.5)]"
            />
         </div>
      </div>

      {/* Wisdom Orbs */}
      <div className="absolute top-12 flex gap-8">
         {[...Array(challenges.length)].map((_, i) => (
            <motion.div
               key={i}
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
               className={`w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all ${
                  wisdom > i ? 'bg-white border-white shadow-[0_0_20px_white] text-indigo-900' : 'bg-transparent border-white/20 text-white/10'
               }`}
            >
               <Sparkles size={24} />
            </motion.div>
         ))}
      </div>
    </div>
  );
}
