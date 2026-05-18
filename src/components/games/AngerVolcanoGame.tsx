/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameChildProps } from './MiniGameEngine';
import { Wind, Flame, Gem, Star, ArrowRight, ArrowLeft, Timer } from 'lucide-react';

type GamePhase = 'difficulty' | 'playing' | 'failed' | 'success';

interface DifficultyOption {
  id: 'easy' | 'medium' | 'hard' | 'extreme';
  label: string;
  time: number;
  reward: number;
  speed: number;
}

const DIFFICULTIES: DifficultyOption[] = [
  { id: 'easy', label: 'Easy', time: 30, reward: 20, speed: 1 },
  { id: 'medium', label: 'Medium', time: 60, reward: 50, speed: 1.2 },
  { id: 'hard', label: 'Hard', time: 90, reward: 100, speed: 1.5 },
  { id: 'extreme', label: 'Extreme', time: 120, reward: 150, speed: 2 }
];

export function AngerVolcanoGame({ state: engineState, onScore, onCompleteLevel, onFail }: GameChildProps) {
  const [phase, setPhase] = useState<GamePhase>('difficulty');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyOption | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [streak, setStreak] = useState(0);
  const [breathingState, setBreathingState] = useState<'inhale' | 'exhale'>('inhale');
  const [hasPressedInCycle, setHasPressedInCycle] = useState(false);
  const [lavaTemp, setLavaTemp] = useState(100); // 100 = Hot, 0 = Calm
  const [lastActionTime, setLastActionTime] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const cycleRef = useRef<NodeJS.Timeout| null>(null);

  // Cycle duration based on difficulty speed
  const getCycleDuration = () => {
    if (!selectedDifficulty) return 4000;
    return 4000 / selectedDifficulty.speed;
  };

  const startGame = (diff: DifficultyOption) => {
    setSelectedDifficulty(diff);
    setTimeLeft(diff.time);
    setPhase('playing');
    setLavaTemp(100);
    setStreak(0);
    setBreathingState('inhale');
    setHasPressedInCycle(true); // Grace for first breath
  };

  const handleAction = (type: 'inhale' | 'exhale') => {
    if (phase !== 'playing') return;
    
    // Prevent spamming
    const now = Date.now();
    if (now - lastActionTime < 400) {
       handleFailure("Too fast! Relax your rhythm.");
       return;
    }
    setLastActionTime(now);

    if (type === breathingState) {
      if (hasPressedInCycle && streak > 0) return; // Already pressed this cycle
      
      // Success
      setHasPressedInCycle(true);
      setStreak(prev => prev + 1);
      onScore(10 * (selectedDifficulty?.speed || 1));
      setLavaTemp(prev => Math.max(0, prev - 5));
      setFeedback("Perfect!");
      setTimeout(() => setFeedback(null), 800);
    } else {
      // Failure
      handleFailure(type === 'inhale' ? "Exhale first!" : "Inhale first!");
    }
  };

  const handleFailure = (msg: string) => {
    if (phase !== 'playing') return;
    setFeedback(msg);
    setPhase('failed');
    if (cycleRef.current) clearInterval(cycleRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeout(() => {
      onFail();
    }, 2500);
  };

  // Breathing Cycle Logic
  useEffect(() => {
    if (phase !== 'playing' || !selectedDifficulty) return;

    const cycle = () => {
      setHasPressedInCycle(prev => {
        if (!prev) {
          handleFailure("Missed a breath! Stay focused.");
          return false;
        }
        return false;
      });

      setBreathingState(prev => prev === 'inhale' ? 'exhale' : 'inhale');
      setFeedback(null);
    };

    const intervalId = setInterval(cycle, getCycleDuration());
    cycleRef.current = intervalId;

    return () => {
      if (cycleRef.current) clearInterval(cycleRef.current);
    };
  }, [phase, selectedDifficulty]);

  // Timer Logic
  useEffect(() => {
    if (phase !== 'playing' || timeLeft <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSuccess();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, timeLeft]);

  const handleSuccess = () => {
    setPhase('success');
    // Calculate final rewards based on difficulty
    const bonusGems = selectedDifficulty?.reward || 0;
    onScore(bonusGems * 10); // Translate gems to internal score for the engine
    setTimeout(() => {
      onCompleteLevel();
    }, 2000);
  };

  if (phase === 'difficulty') {
    return (
      <div className="absolute inset-0 z-[300] bg-[#1a0b0b] flex flex-col items-center justify-center p-8 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full"
        >
           <div className="text-center mb-12">
              <div className="w-24 h-24 bg-orange-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-[0_0_50px_rgba(234,88,12,0.5)]">
                 <Timer className="text-white" size={48} />
              </div>
              <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase mb-4">Choose Your Challenge</h2>
              <p className="text-orange-300 font-bold text-lg opacity-80">How long can you maintain your calm breathing?</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {DIFFICULTIES.map((diff) => (
                <button
                  key={diff.id}
                  onClick={() => startGame(diff)}
                  className="bg-white/5 border-4 border-white/10 p-8 rounded-[40px] hover:bg-white/10 hover:border-orange-500/50 transition-all group relative overflow-hidden flex flex-col items-center text-center"
                >
                   <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform">
                      <Wind size={80} />
                   </div>
                   <span className="text-orange-500 font-black uppercase tracking-[0.3em] text-xs mb-2">{diff.label}</span>
                   <h3 className="text-4xl font-black text-white italic tracking-tighter mb-4">{diff.time} SECONDS</h3>
                   <div className="flex items-center gap-2 bg-yellow-400/20 px-4 py-2 rounded-full border border-yellow-400/30">
                      <Gem className="text-yellow-400" size={16} />
                      <span className="text-yellow-400 font-black uppercase tracking-widest text-[10px]">{diff.reward} GEMS REWARD</span>
                   </div>
                </button>
              ))}
           </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-between py-12 px-8 overflow-hidden bg-[#0c0d21]">
      {/* Background Visuals */}
      <div className="absolute inset-0 pointer-events-none">
         {/* Lava Rivers */}
         <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-orange-600/30 to-transparent" />
         
         {/* The Volcano Shell */}
         <motion.div 
           animate={{ 
             scale: [1, 1.02, 1],
             y: lavaTemp > 70 ? [0, -5, 0, 5, 0] : 0
           }}
           transition={{ duration: 3, repeat: Infinity }}
           className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[500px]"
         >
            <div className={`w-full h-full rounded-t-full transition-colors duration-2000 ${lavaTemp > 30 ? 'bg-[#332b26]' : 'bg-[#1e293b]'}`}>
               <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-40 h-20 blur-3xl opacity-60 rounded-full transition-colors duration-2000 ${lavaTemp > 30 ? 'bg-orange-500' : 'bg-cyan-500'}`} />
               <div className={`absolute top-4 left-1/2 -translate-x-1/2 w-20 h-10 blur-xl opacity-80 rounded-full transition-colors duration-2000 ${lavaTemp > 30 ? 'bg-yellow-400' : 'bg-cyan-300'}`} />
            </div>
         </motion.div>

         {/* Particles */}
         <EmberParticles color={lavaTemp > 30 ? '#f97316' : '#22d3ee'} />
      </div>

      {/* Top HUD */}
      <div className="relative z-10 w-full max-w-4xl flex justify-between items-start">
         <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20">
               <Timer className="text-cyan-400" size={24} />
               <span className="text-3xl font-black text-white font-mono">{timeLeft}s</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-2 rounded-2xl border border-white/20">
               <Star className="text-yellow-400" size={20} />
               <span className="text-lg font-black text-white italic tracking-tighter uppercase">Streak: {streak}</span>
            </div>
         </div>

         <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 flex items-center gap-4">
            <Gem className="text-yellow-400" size={24} />
            <div>
               <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none">Potential Reward</p>
               <p className="text-2xl font-black text-white italic tracking-tighter leading-none">{selectedDifficulty?.reward} GEMS</p>
            </div>
         </div>
      </div>

      {/* Center Breathing Orb */}
      <div className="relative z-20 flex flex-col items-center">
         <motion.div
           animate={{ 
             scale: breathingState === 'inhale' ? 1.5 : 0.8,
             backgroundColor: lavaTemp > 30 ? (breathingState === 'inhale' ? '#f97316' : '#ea580c') : '#22d3ee',
             boxShadow: breathingState === 'inhale' ? `0 0 100px ${lavaTemp > 30 ? '#f97316' : '#22d3ee'}` : '0 0 20px rgba(255,255,255,0.2)'
           }}
           transition={{ duration: getCycleDuration() / 1000, ease: "easeInOut" }}
           className="w-48 h-48 rounded-full border-8 border-white/40 flex items-center justify-center relative"
         >
            <Wind size={64} className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
            
            {/* Pulsing rings */}
            <motion.div 
               animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="absolute inset-0 border-4 border-white/20 rounded-full"
            />
         </motion.div>

         <AnimatePresence mode="wait">
            <motion.h3 
              key={breathingState}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="text-6xl font-black text-white italic uppercase tracking-tighter mt-12 drop-shadow-2xl text-center"
            >
               {breathingState === 'inhale' ? "INHALE NOW" : "EXHALE NOW"}
            </motion.h3>
         </AnimatePresence>

         {feedback && (
           <motion.div 
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className={`mt-4 px-8 py-3 rounded-full font-black uppercase italic tracking-widest text-xl 
               ${feedback.includes('Perfect') ? 'bg-emerald-500 text-white shadow-[0_0_30px_rgba(16,185,129,0.5)]' : 'bg-rose-500 text-white shadow-[0_0_30px_rgba(244,63,94,0.5)]'}`}
           >
              {feedback}
           </motion.div>
         )}
      </div>

      {/* Bottom Buttons */}
      <div className="relative z-30 w-full max-w-md grid grid-cols-2 gap-6">
         <motion.button
           whileTap={{ scale: 0.9 }}
           onClick={() => handleAction('inhale')}
           className={`h-32 rounded-[40px] border-8 flex flex-col items-center justify-center gap-2 transition-all 
             ${breathingState === 'inhale' ? 'bg-white border-white text-indigo-950 shadow-[0_15px_40px_rgba(255,255,255,0.4)]' : 'bg-white/5 border-white/20 text-white/40'}`}
         >
            <Wind size={32} />
            <span className="font-black uppercase italic tracking-tighter text-2xl">INHALE</span>
         </motion.button>

         <motion.button
           whileTap={{ scale: 0.9 }}
           onClick={() => handleAction('exhale')}
           className={`h-32 rounded-[40px] border-8 flex flex-col items-center justify-center gap-2 transition-all 
             ${breathingState === 'exhale' ? 'bg-white border-white text-indigo-950 shadow-[0_15px_40px_rgba(255,255,255,0.4)]' : 'bg-white/5 border-white/20 text-white/40'}`}
         >
            <div className="rotate-180"><Wind size={32} /></div>
            <span className="font-black uppercase italic tracking-tighter text-2xl">EXHALE</span>
         </motion.button>
      </div>

      {/* Failure/Success Overlays */}
      <AnimatePresence>
         {phase === 'failed' && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="absolute inset-0 z-[100] bg-rose-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center"
           >
              <div className="w-48 h-48 bg-rose-500 rounded-full flex items-center justify-center text-8xl mb-8 animate-bounce">🌋</div>
              <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter mb-4">The volcano is still rumbling!</h2>
              <p className="text-2xl text-rose-200 font-bold mb-12">Take a deep breath and try again!</p>
           </motion.div>
         )}

         {phase === 'success' && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="absolute inset-0 z-[100] bg-cyan-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center"
           >
              <div className="w-48 h-48 bg-cyan-400 rounded-full flex items-center justify-center text-8xl mb-8">💎</div>
              <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter mb-4">Volcano Calmed!</h2>
              <p className="text-2xl text-cyan-200 font-bold mb-12">You cooled the lava with your calm breathing!</p>
           </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}

function EmberParticles({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
       {[...Array(20)].map((_, i) => (
         <motion.div
           key={i}
           className="absolute w-2 h-2 rounded-full"
           style={{ backgroundColor: color, left: `${Math.random() * 100}%` }}
           animate={{ 
             y: [-100, 1000],
             x: [0, (Math.random() - 0.5) * 100, 0],
             opacity: [0, 1, 0]
           }}
           transition={{ 
             duration: 5 + Math.random() * 5, 
             repeat: Infinity,
             delay: Math.random() * 5
           }}
         />
       ))}
    </div>
  );
}
