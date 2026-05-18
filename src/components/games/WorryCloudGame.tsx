/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameChildProps } from './MiniGameEngine';
import { Cloud, CloudLightning, Sun, Rainbow, Gem, Star, Timer, CheckCircle, ChevronRight, MousePointer2 } from 'lucide-react';

type GamePhase = 'instructions' | 'phase1' | 'transition' | 'phase2' | 'summary';

interface Thought {
  id: number;
  text: string;
  type: 'real' | 'imagination';
  x: number;
  y: number;
  speed: number;
}


const THOUGHTS_POOL: Omit<Thought, 'id' | 'x' | 'y' | 'speed'>[] = [
  { text: "I forgot my homework.", type: 'real' },
  { text: "I lost my favorite toy.", type: 'real' },
  { text: "A monster lives under my bed.", type: 'imagination' },
  { text: "Everyone secretly hates me.", type: 'imagination' },
  { text: "I missed the school bus.", type: 'real' },
  { text: "I might fail my math test.", type: 'real' },
  { text: "The moon is following me home.", type: 'imagination' },
  { text: "I can fly if I believe hard enough.", type: 'imagination' },
  { text: "I have a scraped knee.", type: 'real' },
  { text: "My shadows will come alive at night.", type: 'imagination' },
  { text: "I didn't finish my dinner.", type: 'real' },
  { text: "I can talk to animals in my sleep.", type: 'imagination' },
  { text: "The clouds are made of cotton candy.", type: 'imagination' },
  { text: "I am late for lunch.", type: 'real' },
];

interface Bubble {
  id: number;
  type: 'normal' | 'gold' | 'rainbow' | 'storm';
  x: number;
  y: number;
  size: number;
  speed: number;
}

export function WorryCloudGame({ onScore, onCompleteLevel, onFail }: GameChildProps) {
  const [phase, setPhase] = useState<GamePhase>('instructions');
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [gems, setGems] = useState(0);
  const [stormMeter, setStormMeter] = useState(50); // 0 = Clear, 100 = Stormy
  const [activeThoughts, setActiveThoughts] = useState<Thought[]>([]);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [feedback, setFeedback] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [combo, setCombo] = useState(0);
  const [timeScale, setTimeScale] = useState(1);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const spawnRef = useRef<NodeJS.Timeout | null>(null);

  // --- Utility: Spawn Thought ---
  const spawnThought = useCallback(() => {
    setActiveThoughts(prev => {
      if (prev.length >= 4) return prev;
      const template = THOUGHTS_POOL[Math.floor(Math.random() * THOUGHTS_POOL.length)];
      return [...prev, {
        ...template,
        id: Date.now() + Math.random(),
        x: -20, // Start off-screen left
        y: 20 + Math.random() * 50,
        speed: (0.1 + Math.random() * 0.2)
      }];
    });
  }, []);

  // --- Utility: Spawn Bubble ---
  const spawnBubble = useCallback(() => {
    setBubbles(prev => {
      const types: Bubble['type'][] = ['normal', 'normal', 'normal', 'gold', 'rainbow', 'storm'];
      const type = types[Math.floor(Math.random() * types.length)];
      return [...prev, {
        id: Date.now() + Math.random(),
        type,
        x: 10 + Math.random() * 80,
        y: 110, // Start bottom
        size: 60 + Math.random() * 40,
        speed: (0.4 + Math.random() * 0.8)
      }];
    });
  }, []);

  // --- Phase 1: Logic ---
  useEffect(() => {
    if (phase === 'phase1') {
      spawnRef.current = setInterval(spawnThought, 3000 / timeScale);
      const moveInterval = setInterval(() => {
        setActiveThoughts(prev => prev.map(t => ({ ...t, x: t.x + (t.speed * timeScale) })).filter(t => t.x < 110));
      }, 50);
      return () => {
        if (spawnRef.current) clearInterval(spawnRef.current);
        clearInterval(moveInterval);
      };
    }
  }, [phase, spawnThought, timeScale]);

  // --- Phase 2: Logic ---
  useEffect(() => {
    if (phase === 'phase2') {
      spawnRef.current = setInterval(spawnBubble, 800 / timeScale);
      const moveInterval = setInterval(() => {
        setBubbles(prev => prev.map(b => ({ ...b, y: b.y - (b.speed * timeScale) })).filter(b => b.y > -20));
      }, 50);
      return () => {
        if (spawnRef.current) clearInterval(spawnRef.current);
        clearInterval(moveInterval);
      };
    }
  }, [phase, spawnBubble, timeScale]);

  // Handle slow motion duration
  useEffect(() => {
    if (timeScale < 1) {
      const timer = setTimeout(() => setTimeScale(1), 5000);
      return () => clearTimeout(timer);
    }
  }, [timeScale]);

  // --- Timer ---
  useEffect(() => {
    if (['phase1', 'phase2'].includes(phase) && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handlePhaseComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, timeLeft]);

  const handlePhaseComplete = () => {
    setTimeScale(1); 
    if (phase === 'phase1') {
      setPhase('transition');
      setTimeout(() => {
        setPhase('phase2');
        setTimeLeft(60);
      }, 3000);
    } else if (phase === 'phase2') {
      setPhase('summary');
      onScore(score);
      setTimeout(() => onCompleteLevel(), 3000);
    }
  };

  const sortThought = (thoughtId: number, targetType: 'real' | 'imagination') => {
    const thought = activeThoughts.find(t => t.id === thoughtId);
    if (!thought) return;

    if (thought.type === targetType) {
      // Success
      setScore(prev => prev + 50);
      setStormMeter(prev => Math.max(0, prev - 10));
      setFeedback({ msg: 'Brilliant!', type: 'success' });
      onScore(50);
    } else {
      // Failure
      setStormMeter(prev => Math.min(100, prev + 15));
      setFeedback({ msg: 'Try again!', type: 'error' });
    }
    setActiveThoughts(prev => prev.filter(t => t.id !== thoughtId));
    setTimeout(() => setFeedback(null), 1000);
  };

  const popBubble = (bubble: Bubble) => {
    if (bubble.type === 'storm') {
        setScore(prev => Math.max(0, prev - 20));
        setCombo(0);
    } else {
        let points = 20;
        if (bubble.type === 'gold') {
            points = 100;
            setGems(prev => prev + 1);
        } else if (bubble.type === 'rainbow') {
            points = 50;
            setTimeScale(0.4);
        }
        setScore(prev => prev + (points * (1 + Math.floor(combo / 5))));
        setCombo(prev => prev + 1);
        onScore(points);
    }
    setBubbles(prev => prev.filter(b => b.id !== bubble.id));
  };

  // --- Screens ---

  if (phase === 'instructions') {
    return (
      <div className="absolute inset-0 z-[300] bg-indigo-950/95 flex items-center justify-center p-8 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-3xl w-full bg-white/5 border-4 border-white/10 rounded-[60px] p-12 relative overflow-hidden shadow-2xl"
        >
           <div className="absolute -top-10 -right-10 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full" />
           <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-cyan-500/20 blur-[100px] rounded-full" />

           <div className="text-center mb-10">
              <div className="w-24 h-24 bg-indigo-500/20 rounded-3xl mx-auto mb-6 flex items-center justify-center text-4xl shadow-[0_0_50px_rgba(99,102,241,0.3)]">
                 ☁️
              </div>
              <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase mb-2">Worry Cloud Hills</h2>
              <p className="text-indigo-300 font-bold text-lg opacity-80 uppercase tracking-widest text-[10px]">Learning to understand thoughts and worries</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 text-left">
              <div className="space-y-4">
                 <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs not-italic">1</div>
                    Phase 1: Sort
                 </h3>
                 <p className="text-indigo-100/60 font-bold leading-tight">Move thoughts into the correct boxes.</p>
                 <div className="flex flex-col gap-2">
                    <div className="bg-white/5 p-3 rounded-2xl border border-white/10 flex items-center gap-3 text-left">
                       <CheckCircle className="text-emerald-400" size={16} />
                       <span className="text-xs font-bold text-white uppercase tracking-wider">REAL WORRY</span>
                    </div>
                    <div className="bg-white/5 p-3 rounded-2xl border border-white/10 flex items-center gap-3 text-left">
                       <CloudLightning className="text-indigo-400" size={16} />
                       <span className="text-xs font-bold text-white uppercase tracking-wider">IMAGINATION</span>
                    </div>
                 </div>
              </div>

              <div className="space-y-4">
                 <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs not-italic">2</div>
                    Phase 2: Pop
                 </h3>
                 <p className="text-indigo-100/60 font-bold leading-tight">Pop worry bubbles for BIG bonus points!</p>
                 <div className="flex gap-4">
                    <div className="w-12 h-12 bg-blue-400/20 border border-blue-400/40 rounded-full flex items-center justify-center text-lg">🎈</div>
                    <div className="w-12 h-12 bg-yellow-400/20 border border-yellow-400/40 rounded-full flex items-center justify-center text-lg">🟡</div>
                    <div className="w-12 h-12 bg-pink-400/20 border border-pink-400/40 rounded-full flex items-center justify-center text-lg">🌈</div>
                 </div>
              </div>
           </div>

           <button 
             onClick={() => { setPhase('phase1'); setTimeLeft(60); }}
             className="w-full h-24 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-[40px] text-3xl font-black text-white italic tracking-tighter uppercase shadow-[0_20px_50px_rgba(99,102,241,0.4)] flex items-center justify-center gap-4 group hover:scale-[1.02] transition-all active:scale-[0.98]"
           >
              Let's Clear the Sky! <ChevronRight size={32} />
           </button>
        </motion.div>
      </div>
    );
  }

  if (phase === 'transition') {
    return (
      <div className="absolute inset-0 z-[300] bg-cyan-900/90 backdrop-blur-3xl flex flex-col items-center justify-center text-center p-8">
         <motion.div
           initial={{ scale: 0.5, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="mb-8"
         >
            <Rainbow size={120} className="text-white drop-shadow-[0_0_50px_rgba(255,255,255,0.5)]" />
         </motion.div>
         <h2 className="text-6xl font-black text-white italic uppercase tracking-tighter mb-4">Great Job!</h2>
         <p className="text-2xl text-cyan-200 font-bold mb-12">The storm is fading... get ready for the BUBBLE BONUS!</p>
         <motion.div 
           initial={{ width: 0 }}
           animate={{ width: '100%' }}
           transition={{ duration: 3 }}
           className="w-64 h-4 bg-white/20 rounded-full overflow-hidden"
         >
            <div className="h-full bg-white" />
         </motion.div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-[#0c0d21] overflow-hidden">
      {/* Background Weather System */}
      <div className="absolute inset-0 pointer-events-none">
         <div className={`absolute inset-0 transition-colors duration-[2000ms] ${stormMeter > 70 ? 'bg-indigo-950/80' : 'bg-cyan-900/40'}`} />
         
         <AnimatePresence>
            {stormMeter < 30 && (
              <motion.div 
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute top-20 left-1/2 -translate-x-1/2"
              >
                 <Sun size={200} className="text-yellow-400 opacity-20 blur-xl animate-pulse" />
                 <Sun size={120} className="text-yellow-400 opacity-40 absolute inset-0 m-auto" />
              </motion.div>
            )}
         </AnimatePresence>

         {stormMeter > 60 && <RainParticles intensity={stormMeter / 100} />}
      </div>

      {/* Game HUD */}
      <div className="relative z-50 p-8 flex justify-between items-start pointer-events-none">
         <div className="flex flex-col gap-4">
            <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 flex items-center gap-4">
               <Timer className="text-cyan-400" size={24} />
               <span className="text-3xl font-black text-white font-mono">{timeLeft}s</span>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 w-48">
               <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Storm Meter</span>
                  <CloudLightning className={stormMeter > 70 ? 'text-rose-400 animate-pulse' : 'text-indigo-400'} size={14} />
               </div>
               <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                     animate={{ width: `${stormMeter}%`, backgroundColor: stormMeter > 70 ? '#f43f5e' : '#6366f1' }}
                     className="h-full transition-all"
                  />
               </div>
            </div>
         </div>

         <div className="flex flex-col items-end gap-4">
            <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 flex items-center gap-4">
               <Star className="text-yellow-400" size={24} />
               <div className="text-right">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none">Score</p>
                  <p className="text-2xl font-black text-white italic tracking-tighter leading-none">{score.toLocaleString()}</p>
               </div>
            </div>

            {combo > 1 && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                key={combo}
                className="bg-yellow-400 text-indigo-950 px-4 py-1 rounded-full font-black italic uppercase text-xs tracking-tighter shadow-lg"
              >
                 {combo}X COMBO!
              </motion.div>
            )}
         </div>
      </div>

      {/* Main Content Area */}
      <div className="absolute inset-0 pt-32 pb-40 px-8">
         {phase === 'phase1' && (
           <div className="relative w-full h-full">
              {activeThoughts.map((thought) => (
                <motion.div
                  key={thought.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1, x: `${thought.x}vw`, y: `${thought.y}vh` }}
                  className="absolute cursor-pointer group"
                >
                   <div className="relative bg-white/10 backdrop-blur-xl border-2 border-white/20 p-6 rounded-[30px] shadow-2xl hover:bg-white/20 hover:border-white/40 transition-all max-w-[200px]">
                      <p className="text-white font-bold leading-tight text-center select-none">{thought.text}</p>
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex gap-4 opacity-0 group-hover:opacity-100 transition-all pointer-events-auto">
                         <button 
                           onClick={() => sortThought(thought.id, 'real')}
                           className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 active:scale-95"
                         >
                            <CheckCircle size={24} />
                         </button>
                         <button 
                           onClick={() => sortThought(thought.id, 'imagination')}
                           className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 active:scale-95"
                         >
                            <CloudLightning size={24} />
                         </button>
                      </div>
                   </div>
                </motion.div>
              ))}

              <div className="absolute bottom-4 inset-x-0 flex gap-8 justify-center h-24">
                 <div className="w-1/3 bg-emerald-500/10 border-4 border-dashed border-emerald-500/30 rounded-[40px] flex items-center justify-center gap-4">
                    <CheckCircle className="text-emerald-400" />
                    <span className="text-emerald-400 font-black uppercase tracking-widest text-xs">REAL WORRY</span>
                 </div>
                 <div className="w-1/3 bg-indigo-500/10 border-4 border-dashed border-indigo-500/30 rounded-[40px] flex items-center justify-center gap-4">
                    <CloudLightning className="text-indigo-400" />
                    <span className="text-indigo-400 font-black uppercase tracking-widest text-xs">IMAGINATION</span>
                 </div>
              </div>
           </div>
         )}

         {phase === 'phase2' && (
           <div className="relative w-full h-full">
              <AnimatePresence>
                 {bubbles.map((bubble) => (
                   <motion.button
                     key={bubble.id}
                     initial={{ scale: 0, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1, left: `${bubble.x}%`, top: `${bubble.y}%` }}
                     exit={{ scale: 1.5, opacity: 0 }}
                     onClick={() => popBubble(bubble)}
                     className={`absolute rounded-full flex items-center justify-center shadow-2xl group active:scale-[0.8] transition-transform`}
                     style={{ 
                        width: bubble.size, 
                        height: bubble.size,
                        backgroundColor: getBubbleColor(bubble.type, 0.2),
                        border: `4px solid ${getBubbleColor(bubble.type, 0.4)}`,
                        backdropFilter: 'blur(4px)'
                     }}
                   >
                      <span className="text-2xl drop-shadow-md group-hover:scale-125 transition-transform text-white">
                         {getBubbleIcon(bubble.type)}
                      </span>
                      {bubble.type !== 'normal' && (
                        <motion.div 
                          animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="absolute inset-0 rounded-full border-2 border-white/30"
                        />
                      )}
                   </motion.button>
                 ))}
              </AnimatePresence>
           </div>
         )}
      </div>

      <AnimatePresence>
         {feedback && (
           <motion.div 
             initial={{ scale: 0.5, opacity: 0, y: 20 }}
             animate={{ scale: 1, opacity: 1, y: 0 }}
             exit={{ scale: 0.5, opacity: 0, y: -20 }}
             className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] px-10 py-4 rounded-full font-black uppercase italic tracking-widest text-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] 
               ${feedback.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}
           >
              {feedback.msg}
           </motion.div>
         )}
      </AnimatePresence>

      <AnimatePresence>
         {phase === 'summary' && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="absolute inset-0 z-[100] bg-emerald-950/90 backdrop-blur-3xl flex flex-col items-center justify-center p-8 text-center"
           >
              <div className="w-48 h-48 bg-emerald-400 rounded-full flex items-center justify-center text-8xl mb-8 shadow-[0_0_80px_rgba(52,211,153,0.5)]">🌈</div>
              <h2 className="text-6xl font-black text-white italic uppercase tracking-tighter mb-4">You cleared the clouds!</h2>
              <div className="flex gap-12 mb-12">
                 <div className="text-center">
                    <p className="text-emerald-400 font-black uppercase tracking-widest text-xs mb-2">Final Score</p>
                    <p className="text-5xl font-black text-white italic tracking-tighter leading-none">{score}</p>
                 </div>
                 <div className="text-center">
                    <p className="text-yellow-400 font-black uppercase tracking-widest text-xs mb-2">Gems Earned</p>
                    <p className="text-5xl font-black text-white italic tracking-tighter leading-none">+{gems}</p>
                 </div>
              </div>
           </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}

// --- Helpers ---

function RainParticles({ intensity }: { intensity: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
       {[...Array(Math.floor(20 * intensity))].map((_, i) => (
         <motion.div
           key={i}
           className="absolute w-px h-10 bg-white/20"
           style={{ left: `${Math.random() * 100}%`, top: `-10%` }}
           animate={{ y: ['0vh', '110vh'], x: [0, -20] }}
           transition={{ duration: 0.5 + Math.random() * 0.5, repeat: Infinity, delay: Math.random() }}
         />
       ))}
    </div>
  );
}

function getBubbleColor(type: Bubble['type'], opacity: number) {
  switch (type) {
    case 'gold': return `rgba(255, 215, 0, ${opacity})`;
    case 'rainbow': return `rgba(255, 105, 180, ${opacity})`;
    case 'storm': return `rgba(71, 85, 105, ${opacity})`;
    default: return `rgba(59, 130, 246, ${opacity})`; // Blue for normal
  }
}

function getBubbleIcon(type: Bubble['type']) {
  switch (type) {
    case 'gold': return '🟡';
    case 'rainbow': return '🌈';
    case 'storm': return '⛈️';
    default: return '🎈';
  }
}
