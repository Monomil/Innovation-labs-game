/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameChildProps } from './MiniGameEngine';
import { Sparkles, TreePine, Timer, Gem, Star, ArrowRight, Eye, MousePointer2 } from 'lucide-react';

type GamePhase = 'difficulty' | 'playing' | 'failed' | 'success';

interface DifficultyOption {
  id: 'easy' | 'medium' | 'hard' | 'extreme';
  label: string;
  time: number;
  reward: number;
  sequenceLength: number;
}

const DIFFICULTIES: DifficultyOption[] = [
  { id: 'easy', label: 'Easy', time: 30, reward: 20, sequenceLength: 3 },
  { id: 'medium', label: 'Medium', time: 60, reward: 50, sequenceLength: 5 },
  { id: 'hard', label: 'Hard', time: 90, reward: 100, sequenceLength: 7 },
  { id: 'extreme', label: 'Extreme', time: 120, reward: 150, sequenceLength: 10 }
];

interface Rune {
  id: number;
  icon: string;
  color: string;
}

const FOREST_RUNES: Rune[] = [
  { id: 1, icon: '🍄', color: '#10b981' }, // Mushroom
  { id: 2, icon: '🌸', color: '#ec4899' }, // Flower
  { id: 3, icon: '🌿', color: '#84cc16' }, // Leaf
  { id: 4, icon: '💎', color: '#06b6d4' }, // Gem
  { id: 5, icon: '🦉', color: '#8b5cf6' }, // Owl
  { id: 6, icon: '🦋', color: '#3b82f6' }, // Butterfly
  { id: 7, icon: '🧚', color: '#f59e0b' }, // Fairy
  { id: 8, icon: '🌙', color: '#6366f1' }, // Moon
  { id: 9, icon: '🌟', color: '#facc15' }, // Star
];

export function ConfusionForestGame({ onScore, onCompleteLevel, onFail }: GameChildProps) {
  const [phase, setPhase] = useState<GamePhase>('difficulty');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyOption | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [highlightedRune, setHighlightedRune] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = (diff: DifficultyOption) => {
    setSelectedDifficulty(diff);
    setTimeLeft(diff.time);
    setPhase('playing');
    setScore(0);
    setStreak(0);
    generateNewRound(diff, 0);
  };

  const generateNewRound = (diff: DifficultyOption, currentStreak: number) => {
    const newSequence = [];
    const length = Math.min(3 + Math.floor(currentStreak / 2), diff.sequenceLength);
    for (let i = 0; i < length; i++) {
      newSequence.push(Math.floor(Math.random() * FOREST_RUNES.length) + 1);
    }
    setSequence(newSequence);
    setPlayerInput([]);
    showSequence(newSequence);
  };

  const showSequence = (seq: number[]) => {
    setIsShowingSequence(true);
    let i = 0;
    const interval = setInterval(() => {
      if (i >= seq.length) {
        clearInterval(interval);
        setHighlightedRune(null);
        setIsShowingSequence(false);
        return;
      }
      setHighlightedRune(seq[i]);
      i++;
      setTimeout(() => setHighlightedRune(null), 600);
    }, 1000);
  };

  const handleRuneClick = (runeId: number) => {
    if (isShowingSequence || phase !== 'playing') return;

    const nextCorrectId = sequence[playerInput.length];
    
    if (runeId === nextCorrectId) {
      const newInput = [...playerInput, runeId];
      setPlayerInput(newInput);
      
      if (newInput.length === sequence.length) {
        // Round Complete
        setScore(prev => prev + 1);
        setStreak(prev => prev + 1);
        onScore(100);
        setFeedback({ msg: 'Perfect Path!', type: 'success' });
        setTimeout(() => {
          setFeedback(null);
          if (selectedDifficulty) generateNewRound(selectedDifficulty, streak + 1);
        }, 1500);
      }
    } else {
      // Wrong Input
      handleFailure("The path became confused!");
    }
  };

  const handleFailure = (msg: string) => {
    if (phase !== 'playing') return;
    setFeedback({ msg, type: 'error' });
    setPhase('failed');
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeout(() => onFail(), 2500);
  };

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
    const bonus = selectedDifficulty?.reward || 0;
    onScore(bonus * 10);
    setTimeout(() => onCompleteLevel(), 2000);
  };

  if (phase === 'difficulty') {
    return (
      <div className="absolute inset-0 z-[300] bg-[#051c0f] flex flex-col items-center justify-center p-8 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full"
        >
           <div className="text-center mb-12">
              <div className="w-24 h-24 bg-emerald-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.5)]">
                 <Eye className="text-white" size={48} />
              </div>
              <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase mb-4">Confusion Forest</h2>
              <p className="text-emerald-300 font-bold text-lg opacity-80">Follow the fireflies and clear the magical mist!</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {DIFFICULTIES.map((diff) => (
                <button
                  key={diff.id}
                  onClick={() => startGame(diff)}
                  className="bg-white/5 border-4 border-white/10 p-8 rounded-[40px] hover:bg-white/10 hover:border-emerald-500/50 transition-all group relative overflow-hidden flex flex-col items-center text-center"
                >
                   <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform">
                      <Sparkles size={80} />
                   </div>
                   <span className="text-emerald-500 font-black uppercase tracking-[0.3em] text-xs mb-2">{diff.label}</span>
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
    <div className="absolute inset-0 flex flex-col items-center justify-between py-12 px-8 overflow-hidden bg-[#051c0f]">
      {/* Background Visuals */}
      <div className="absolute inset-0 pointer-events-none">
         <motion.div 
           animate={{ opacity: [0.2, 0.4, 0.2] }}
           transition={{ duration: 10, repeat: Infinity }}
           className="absolute inset-0 bg-emerald-950/40 blur-[100px]"
         />
         {/* Tree Shadows */}
         <div className="absolute top-0 left-0 w-full h-full opacity-10 flex flex-wrap gap-20 p-20 justify-center">
            {[...Array(6)].map((_, i) => <TreePine key={i} size={200} className="text-emerald-400" />)}
         </div>
         {/* Moving Fireflies */}
         <Fireflies />
      </div>

      {/* Top HUD */}
      <div className="relative z-10 w-full max-w-4xl flex justify-between items-start">
         <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20">
               <Timer className="text-emerald-400" size={24} />
               <span className="text-3xl font-black text-white font-mono">{timeLeft}s</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-2 rounded-2xl border border-white/20">
               <Star className="text-yellow-400" size={20} />
               <span className="text-lg font-black text-white italic tracking-tighter uppercase">Streak: {streak}</span>
            </div>
         </div>

         <div className="flex flex-col items-end gap-2 text-right">
            <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 flex items-center gap-4">
               <Gem className="text-yellow-400" size={24} />
               <div className="text-right">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none">Potential Reward</p>
                  <p className="text-2xl font-black text-white italic tracking-tighter leading-none">{selectedDifficulty?.reward} GEMS</p>
               </div>
            </div>
            {isShowingSequence ? (
              <div className="flex items-center gap-2 text-cyan-400 animate-pulse font-black uppercase text-xs tracking-widest bg-cyan-950/40 px-4 py-1.5 rounded-full mt-2">
                <Eye size={14} /> Watch the firefly!
              </div>
            ) : (
              <div className="flex items-center gap-2 text-emerald-400 font-black uppercase text-xs tracking-widest bg-emerald-950/40 px-4 py-1.5 rounded-full mt-2">
                <MousePointer2 size={14} /> Repeat the path!
              </div>
            )}
         </div>
      </div>

      {/* Grid of Magical Runes */}
      <div className="relative z-20 grid grid-cols-3 gap-4 md:gap-8 bg-black/20 p-8 rounded-[50px] border-4 border-emerald-500/10 backdrop-blur-sm">
         {FOREST_RUNES.map((rune) => (
            <motion.button
              key={rune.id}
              whileHover={!isShowingSequence ? { scale: 1.05, y: -5 } : {}}
              whileTap={!isShowingSequence ? { scale: 0.9 } : {}}
              onClick={() => handleRuneClick(rune.id)}
              className={`w-24 h-24 md:w-32 md:h-32 rounded-[30px] md:rounded-[40px] border-4 flex items-center justify-center text-4xl md:text-5xl shadow-2xl transition-all duration-300 relative overflow-hidden
                ${highlightedRune === rune.id ? 'bg-white border-white scale-110 z-30 shadow-[0_0_50px_rgba(255,255,255,0.8)]' : 
                  isShowingSequence ? 'bg-white/5 border-white/5 opacity-50 grayscale' : 'bg-emerald-900/40 border-emerald-500/20 text-white hover:bg-emerald-800/60 hover:border-emerald-400/50'}`}
            >
               {rune.icon}
               {highlightedRune === rune.id && (
                 <motion.div 
                   layoutId="rune-glow"
                   className="absolute inset-0 bg-white/20 blur-xl scale-150"
                 />
               )}
            </motion.button>
         ))}

         <AnimatePresence>
            {feedback && (
              <motion.div 
                initial={{ scale: 0.5, opacity: 0, y: 50 }}
                animate={{ scale: 1.2, opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`absolute inset-x-0 -top-20 flex justify-center z-50 pointer-events-none`}
              >
                 <div className={`px-10 py-4 rounded-full font-black uppercase italic tracking-widest text-2xl shadow-2xl
                   ${feedback.type === 'success' ? 'bg-emerald-500 text-white shadow-[0_0_40px_rgba(16,185,129,0.5)]' : 'bg-rose-500 text-white shadow-[0_0_40px_rgba(244,63,94,0.5)]'}`}>
                    {feedback.msg}
                 </div>
              </motion.div>
            )}
         </AnimatePresence>
      </div>

      {/* Progress Circles */}
      <div className="relative z-10 flex gap-4 bg-white/5 p-4 rounded-[30px] border border-white/10 backdrop-blur-md">
         {sequence.map((_, idx) => (
            <div 
              key={idx}
              className={`w-4 h-4 md:w-6 md:h-6 rounded-full border-2 transition-all duration-500
                ${playerInput.length > idx ? 'bg-emerald-400 border-emerald-400 scale-125' : 
                  isShowingSequence && highlightedRune === sequence[idx] ? 'bg-white border-white animate-pulse' : 'bg-white/5 border-white/20'}`}
            />
         ))}
      </div>

      {/* Success/Failure Overlays */}
      <AnimatePresence>
         {phase === 'failed' && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="absolute inset-0 z-[100] bg-rose-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center"
           >
              <div className="w-48 h-48 bg-rose-500 rounded-full flex items-center justify-center text-8xl mb-8 animate-bounce">🌫️</div>
              <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter mb-4">The forest is still confusing!</h2>
              <p className="text-2xl text-rose-200 font-bold mb-12">Take a moment, focus, and try again!</p>
           </motion.div>
         )}

         {phase === 'success' && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="absolute inset-0 z-[100] bg-emerald-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center"
           >
              <div className="w-48 h-48 bg-emerald-400 rounded-full flex items-center justify-center text-8xl mb-8">✨</div>
              <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter mb-4">Path Restored!</h2>
              <p className="text-2xl text-emerald-200 font-bold mb-12">You focus solved the forest's mystery!</p>
           </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}

function Fireflies() {
  return (
    <div className="absolute inset-0 overflow-hidden">
       {[...Array(15)].map((_, i) => (
         <motion.div
           key={i}
           className="absolute w-1.5 h-1.5 bg-yellow-400 rounded-full blur-[2px] shadow-[0_0_10px_gold]"
           style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
           animate={{ 
             x: [0, (Math.random() - 0.5) * 500, 0],
             y: [0, (Math.random() - 0.5) * 500, 0],
             opacity: [0.1, 0.8, 0.1]
           }}
           transition={{ 
             duration: 10 + Math.random() * 10, 
             repeat: Infinity,
             ease: "easeInOut"
           }}
         />
       ))}
    </div>
  );
}
