/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Timer, 
  Trophy, 
  Gem, 
  Star, 
  Pause, 
  Play, 
  RotateCcw, 
  Map as MapIcon, 
  Settings, 
  Info,
  ChevronRight,
  Heart,
  XCircle,
  CheckCircle2
} from 'lucide-react';
import { Zone } from '../../types';
import { GameState, GameScore } from './types';
import { Button, Card } from '../ui/GameUI';
import { useGame } from '../../store/GameContext';
import { AvatarRenderer } from '../AvatarRenderer';

interface MiniGameEngineProps {
  zone: Zone;
  onBack: () => void;
  onWin: (gems: number, xp: number) => void;
  onLose: () => void;
  children: (props: GameChildProps) => React.ReactNode;
  initialTimeLimit?: number;
}

export interface GameChildProps {
  state: GameState;
  level: 1 | 2 | 3 | 'boss';
  score: number;
  onScore: (points: number) => void;
  onCompleteLevel: () => void;
  onFail: () => void;
  gameData: any;
}

export function MiniGameEngine({ zone, onBack, onWin, onLose, children, initialTimeLimit = 180 }: MiniGameEngineProps) {
  const { completeZone, addXP, addGems, gameState: globalGameState } = useGame();
  
  const [gameState, setGameState] = useState<GameState>('level1');
  const [level, setLevel] = useState<1 | 2 | 3 | 'boss'>(1);
  const [score, setScore] = useState(0);
  const [gems, setGems] = useState(0);
  const [timeLeft, setTimeLeft] = useState(initialTimeLimit);
  const [isPaused, setIsPaused] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  // Stats for the end screen
  const [earnedXP, setEarnedXP] = useState(0);
  const [earnedGems, setEarnedGems] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (['level1', 'level2', 'level3', 'boss'].includes(gameState) && !isPaused && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp();
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
  }, [gameState, isPaused, timeLeft]);

  const handleTimeUp = () => {
    if (score >= zone.reward * 0.5) {
       handleGameWin(); // Partial win if score is decent
    } else {
       setGameState('lose');
       onLose();
    }
  };

  const handleScore = (points: number) => {
    setScore(prev => prev + points);
    // Every 50 points might earn a gem
    if (Math.floor((score + points) / 50) > Math.floor(score / 50)) {
      setGems(prev => prev + 1);
    }
  };

  const startLevel = (lvl: 1 | 2 | 3 | 'boss') => {
    setLevel(lvl);
    setGameState(`level${lvl === 'boss' ? 3 : lvl}` as GameState);
    if (lvl === 'boss') setGameState('boss');
  };

  const onNextLevel = () => {
    if (level === 1) startLevel(2);
    else if (level === 2) startLevel(3);
    else if (level === 3) startLevel('boss');
    else handleGameWin();
  };

  const handleGameWin = () => {
    const finalGems = zone.reward + gems;
    const finalXP = zone.xpReward + Math.floor(score / 5);
    setEarnedGems(finalGems);
    setEarnedXP(finalXP);
    setGameState('win');
    onWin(finalGems, finalXP);
  };

  const handleRetry = () => {
    setScore(0);
    setGems(0);
    setTimeLeft(initialTimeLimit);
    startLevel(1);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Progress percentage
  const levelOrder = [1, 2, 3, 'boss'];
  const progress = ((levelOrder.indexOf(level) + 1) / levelOrder.length) * 100;

  return (
    <div className="fixed inset-0 z-[200] bg-[#020314] flex flex-col overflow-hidden font-sans">
      {/* HUD Header */}
      <div className="relative z-[210] p-6 flex justify-between items-center bg-white/5 backdrop-blur-xl border-b border-white/10 shadow-2xl">
         <div className="flex items-center gap-6">
            <div className="flex flex-col">
               <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{zone.name}</span>
               <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Level {level}</h2>
                  <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                     />
                  </div>
               </div>
            </div>
         </div>

         <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                  <Timer size={20} />
               </div>
               <span className={`text-2xl font-black font-mono transition-colors ${timeLeft < 10 ? 'text-rose-400 animate-pulse' : 'text-white'}`}>
                  {formatTime(timeLeft)}
               </span>
            </div>

            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center text-yellow-400">
                  <Trophy size={20} />
               </div>
               <span className="text-2xl font-black text-white font-mono">{score.toString().padStart(5, '0')}</span>
            </div>

            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Gem size={20} />
               </div>
               <span className="text-2xl font-black text-white font-mono">{gems}</span>
            </div>
         </div>

         <button 
           onClick={() => setIsPaused(true)}
           className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110 active:scale-90"
         >
            <Pause />
         </button>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 relative overflow-hidden">
         {/* Background based on zone */}
         <div className={`absolute inset-0 bg-gradient-to-br ${zone.thumbGradient} opacity-30`} />
         <div className="absolute inset-0 bg-[#020314]/80" />

         <AnimatePresence mode="wait">
            {gameState === 'tutorial' && (
               <TutorialOverlay 
                 zone={zone} 
                 onStart={() => startLevel(1)} 
               />
            )}

            {['level1', 'level2', 'level3', 'boss'].includes(gameState) && (
               <motion.div 
                 key="game-content"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="absolute inset-0 z-[205]"
               >
                  {children({
                    state: gameState,
                    level,
                    score,
                    onScore: handleScore,
                    onCompleteLevel: onNextLevel,
                    onFail: () => setGameState('lose'),
                    gameData: {}
                  })}
               </motion.div>
            )}

            {gameState === 'win' && (
               <WinOverlay 
                 gems={earnedGems} 
                 xp={earnedXP} 
                 onContinue={onBack}
                 onPlayAgain={handleRetry}
               />
            )}

            {gameState === 'lose' && (
               <LoseOverlay 
                 onRetry={handleRetry}
                 onMap={onBack}
               />
            )}
         </AnimatePresence>

         {/* Pause Menu */}
         <AnimatePresence>
            {isPaused && (
               <PauseMenu 
                 onClose={() => setIsPaused(false)}
                 onRestart={() => { setIsPaused(false); handleRetry(); }}
                 onHowToPlay={() => setShowHowToPlay(true)}
                 onMap={onBack}
               />
            )}
         </AnimatePresence>

         {/* How to Play Detail Modal */}
         <AnimatePresence>
            {showHowToPlay && (
               <HowToPlayModal 
                 zone={zone}
                 onClose={() => setShowHowToPlay(false)}
               />
            )}
         </AnimatePresence>
      </div>
    </div>
  );
}

// --- Internal Components ---

function IntroOverlay({ zone, onStart }: { zone: Zone, onStart: () => void }) {
  const { gameState } = useGame();
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[220] flex items-center justify-center p-8 bg-black/60 backdrop-blur-md"
    >
       <motion.div
         initial={{ scale: 0.8, y: 50 }}
         animate={{ scale: 1, y: 0 }}
         className="max-w-xl w-full text-center flex flex-col items-center"
       >
          <div className="relative mb-12">
             <motion.div
               animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }}
               transition={{ duration: 4, repeat: Infinity }}
               className="text-[120px] drop-shadow-[0_0_50px_rgba(255,255,255,0.3)] relative z-10"
             >
                {getZoneEmoji(zone.id)}
             </motion.div>
             <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-20">
                {gameState.avatar && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                     <AvatarRenderer avatar={gameState.avatar} size="md" />
                  </motion.div>
                )}
             </div>
          </div>
          
          <h1 className="text-6xl font-black text-white italic tracking-tighter uppercase mb-4 leading-none">{zone.name}</h1>
          <p className="text-xl text-indigo-200 font-bold mb-12 italic leading-tight">"{zone.description}"</p>
          
          <Button size="xl" variant="accent" onClick={onStart} className="w-full h-24 rounded-[40px] text-3xl italic tracking-tighter shadow-[0_20px_50px_rgba(245,158,11,0.4)]">
             BEGIN MISSION <ChevronRight size={32} />
          </Button>
       </motion.div>
    </motion.div>
  );
}

function TutorialOverlay({ zone, onStart }: { zone: Zone, onStart: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[220] flex items-center justify-center p-8 bg-indigo-950/90 backdrop-blur-2xl"
    >
       <motion.div
         initial={{ scale: 0.9, opacity: 0 }}
         animate={{ scale: 1, opacity: 1 }}
         className="max-w-2xl w-full bg-white/5 rounded-[60px] border-4 border-white/10 p-12 relative overflow-hidden"
       >
          <div className="absolute top-0 right-0 p-8">
             <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-4xl animate-pulse">✨</div>
          </div>

          <div className="flex items-center gap-4 mb-8">
             <Info className="text-indigo-400" size={32} />
             <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">How To Play</h2>
          </div>

          <div className="space-y-6 mb-12">
             {getInstructions(zone.id).map((step, i) => (
                <div key={i} className="flex gap-6 items-start">
                   <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-black text-white shrink-0 mt-1">{i + 1}</div>
                   <p className="text-xl text-white font-bold leading-tight pt-2">{step}</p>
                </div>
             ))}
          </div>

          <div className="grid grid-cols-2 gap-6 mb-12">
             <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-2">Controls</span>
                <div className="flex items-center gap-4">
                   <div className="text-3xl">🖱️</div>
                   <p className="text-white font-black uppercase text-[10px] tracking-widest leading-none">Tap or Click to<br/>Interact</p>
                </div>
             </div>
             <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-2">Rewards</span>
                <div className="flex items-center gap-4 text-emerald-400">
                   <Gem size={24} />
                   <p className="text-white font-black uppercase text-[10px] tracking-widest leading-none">Earn Gems &<br/>Growth XP</p>
                </div>
             </div>
          </div>

          <Button size="xl" variant="accent" onClick={onStart} className="w-full h-24 rounded-[40px] text-3xl italic tracking-tighter shadow-[0_20px_50px_rgba(245,158,11,0.4)]">
             I'M READY! <Play fill="currentColor" size={24} />
          </Button>
       </motion.div>
    </motion.div>
  );
}

function WinOverlay({ gems, xp, onContinue, onPlayAgain }: { gems: number, xp: number, onContinue: () => void, onPlayAgain: () => void }) {
  const { gameState } = useGame();
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-[250] flex flex-col items-center justify-center bg-indigo-950/95 backdrop-blur-3xl p-8"
    >
       <div className="mb-12 relative flex items-center justify-center">
          <motion.div 
            animate={{ rotate: 360, scale: [1, 1.2, 1] }} 
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-yellow-400 opacity-20 blur-[100px] rounded-full"
          />
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            className="w-64 h-64 bg-white rounded-full flex items-center justify-center border-[10px] border-yellow-400 shadow-[0_0_80px_rgba(250,204,21,0.4)] relative z-10 overflow-hidden"
          >
             {gameState.avatar && (
                <div className="absolute inset-0 flex items-center justify-center opacity-40 grayscale group-hover:grayscale-0 transition-all">
                   <AvatarRenderer avatar={gameState.avatar} size="xl" className="scale-125" />
                </div>
             )}
             <Trophy size={140} className="text-yellow-500 fill-yellow-400 relative z-20 drop-shadow-2xl" />
          </motion.div>
          
          {gameState.avatar && (
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: -160, opacity: 1 }}
              transition={{ delay: 0.8, type: "spring" }}
              className="absolute z-30"
            >
               <AvatarRenderer avatar={gameState.avatar} size="lg" />
            </motion.div>
          )}
       </div>

       <h2 className="text-7xl font-black text-white italic uppercase tracking-tighter mb-4 text-center">MISSION COMPLETE</h2>
       <p className="text-2xl text-cyan-300 font-extrabold uppercase tracking-[.4em] mb-12 opacity-80">You brought light to the world!</p>

       <div className="grid grid-cols-2 gap-8 w-full max-w-lg mb-16">
          <div className="bg-white/10 p-8 rounded-[40px] border-4 border-yellow-400/30 text-center">
             <div className="w-16 h-16 bg-yellow-400 rounded-2xl mx-auto mb-4 flex items-center justify-center text-indigo-900">
                <Gem size={32} />
             </div>
             <div className="text-4xl font-black text-white uppercase italic tracking-tighter">+{gems} GEMS</div>
          </div>
          <div className="bg-white/10 p-8 rounded-[40px] border-4 border-cyan-400/30 text-center">
             <div className="w-16 h-16 bg-cyan-400 rounded-2xl mx-auto mb-4 flex items-center justify-center text-indigo-900">
                <Star size={32} />
             </div>
             <div className="text-4xl font-black text-white uppercase italic tracking-tighter">+{xp} XP</div>
          </div>
       </div>

       <div className="flex flex-col gap-4 w-full max-w-md">
          <Button size="xl" variant="accent" onClick={onContinue} className="w-full h-24 rounded-[40px] text-3xl italic tracking-tighter">
             CONTINUE ADVENTURE <ChevronRight size={32} />
          </Button>
          <button 
            onClick={onPlayAgain}
            className="w-full py-4 text-white font-black uppercase tracking-widest text-[10px] opacity-40 hover:opacity-100 transition-all hover:underline"
          >
             Replay This Mission
          </button>
       </div>
    </motion.div>
  );
}

function LoseOverlay({ onRetry, onMap }: { onRetry: () => void, onMap: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-[250] flex flex-col items-center justify-center bg-indigo-950/95 backdrop-blur-3xl p-8"
    >
       <div className="mb-12">
          <div className="w-64 h-64 bg-white/5 rounded-full flex items-center justify-center border-[10px] border-white/10 shadow-2xl">
             <Heart size={140} className="text-rose-400 fill-rose-500/20" />
          </div>
       </div>

       <h2 className="text-7xl font-black text-white italic uppercase tracking-tighter mb-4 text-center">ALMOST THERE!</h2>
       <p className="text-2xl text-rose-300 font-extrabold uppercase tracking-[.4em] mb-12 opacity-80 text-center">You're improving! Let's try once more.</p>

       <div className="flex flex-col gap-4 w-full max-w-md">
          <Button size="xl" variant="primary" onClick={onRetry} className="w-full h-24 rounded-[40px] text-3xl italic tracking-tighter bg-indigo-600 shadow-[0_20px_50px_rgba(79,70,229,0.4)]">
             RETRY MISSION <RotateCcw size={32} className="ml-4" />
          </Button>
          <button 
            onClick={onMap}
            className="w-full h-20 rounded-[40px] bg-white/5 border-2 border-white/10 text-white font-black uppercase italic tracking-tighter text-xl hover:bg-white/10 transition-all"
          >
             Back to Map
          </button>
       </div>
    </motion.div>
  );
}

function PauseMenu({ onClose, onRestart, onHowToPlay, onMap }: { onClose: () => void, onRestart: () => void, onHowToPlay: () => void, onMap: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-md p-8"
    >
       <motion.div
         initial={{ scale: 0.9, y: 30 }}
         animate={{ scale: 1, y: 0 }}
         className="bg-white rounded-[60px] p-12 max-w-md w-full shadow-2xl relative overflow-hidden"
       >
          <div className="text-center mb-10">
             <h2 className="text-5xl font-black text-indigo-950 italic uppercase tracking-tighter mb-2">PAUSED</h2>
             <p className="text-indigo-400 font-black uppercase text-[10px] tracking-widest">Adventure is waiting!</p>
          </div>

          <div className="space-y-4">
             <Button size="lg" className="w-full h-20 rounded-[30px] flex justify-between px-10" onClick={onClose}>
                <span>RESUME</span> <Play fill="currentColor" />
             </Button>
             <button onClick={onRestart} className="w-full h-20 rounded-[30px] bg-indigo-50 text-indigo-600 border-4 border-indigo-100 flex items-center justify-between px-10 font-black italic tracking-tighter text-2xl hover:bg-indigo-100 transition-all">
                RESTART <RotateCcw />
             </button>
             <button onClick={onHowToPlay} className="w-full h-20 rounded-[30px] bg-indigo-50 text-indigo-600 border-4 border-indigo-100 flex items-center justify-between px-10 font-black italic tracking-tighter text-2xl hover:bg-indigo-100 transition-all">
                HOW TO PLAY <Info />
             </button>
             <button onClick={onMap} className="w-full h-20 rounded-[30px] bg-rose-50 text-rose-600 border-4 border-rose-100 flex items-center justify-between px-10 font-black italic tracking-tighter text-2xl hover:bg-rose-100 transition-all">
                EXIT TO MAP <MapIcon />
             </button>
          </div>
       </motion.div>
    </motion.div>
  );
}

function HowToPlayModal({ zone, onClose }: { zone: Zone, onClose: () => void }) {
   return (
      <motion.div 
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         className="absolute inset-0 z-[400] flex items-center justify-center bg-indigo-950/95 backdrop-blur-xl p-8"
      >
         <div className="max-w-xl w-full">
            <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter mb-10 text-center">HOW TO MASTER THIS MISSION</h2>
            <div className="space-y-8 mb-12">
               {getInstructions(zone.id).map((step, i) => (
                  <div key={i} className="flex gap-6 items-start bg-white/5 p-6 rounded-3xl border border-white/10">
                     <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center font-black text-2xl text-white shrink-0">{i + 1}</div>
                     <p className="text-2xl text-white font-bold leading-tight pt-2">{step}</p>
                  </div>
               ))}
            </div>
            <Button size="xl" className="w-full h-24 rounded-[40px]" onClick={onClose}>
               GOT IT!
            </Button>
         </div>
      </motion.div>
   );
}

// Helper functions (could be moved to shared utils)
function getZoneEmoji(id: string): string {
  const emojis: Record<string, string> = {
    'anger-volcano': '🌋',
    'confusion-forest': '🧠',
    'worry-hills': '☁️',
    'memory-meadow': '✨',
    'calm-beach': '🌊',
    'creature-village': '🏡',
    'festival-town': '🎵',
    'sleepy-valley': '🌙',
    'confidence-mountain': '🏔️',
    'reflection-bridge': '🌉'
  };
  return emojis[id] || '✨';
}

function getInstructions(id: string): string[] {
   const instructions: Record<string, string[]> = {
      'anger-volcano': [
         'Press INHALE when prompted',
         'Press EXHALE when prompted',
         'Stay focused',
         'Do not miss prompts'
      ],
      'confusion-forest': [
         'Watch the firefly light up magical runes.',
         'Repeat the pattern to clear the forest mist.',
         'Complete the path before time runs out.',
         'Stay focused as the patterns grow longer!'
      ],
      'worry-hills': [
         'Sort thoughts into REAL or IMAGINATION boxes.',
         'Clear the storm clouds to bring back the sun.',
         'Pop as many worry bubbles as you can in the bonus round!',
         'Watch out for storm bubbles that take away points.'
      ],
      'memory-meadow': [
         'Flip the magic cards hidden in the long grass.',
         'Match identical emotional symbols in streaks.',
         'Watch out for the shadow cards that hide symbols!',
         'Complete the giant memory board for big rewards.'
      ],
      'calm-beach': [
         'Listen to the waves and collect magic sea shells.',
         'Tap the rhythmic patterns in the sand.',
         'Keep your calm meter high by moving slowly.',
         'Build a beach garden for the marine creatures.'
      ],
      'creature-village': [
         'Talk to the village creatures and hear their stories.',
         'Choose kind and helpful actions to build trust.',
         'Work together as a team to fix village problems.',
         'Join the great friendship feast at the end!'
      ],
      'festival-town': [
         'Follow the neon lights and tap to the beat.',
         'Maintain your joy streak for high scores.',
         'Dance against rival performers in a show-off!',
         'Perform the ultimate rhythm finale on stage.'
      ],
      'sleepy-valley': [
         'Organise the bedtime items before time runs out.',
         'Remove noisy distractions from the valley floor.',
         'Solve star puzzles in the dream world.',
         'Help the Valley Spirit find deep, peaceful rest.'
      ],
      'confidence-mountain': [
         'Leap across platforms of positive thoughts.',
         'Blast away negative clouds with your shield.',
         'Collect gold trophies to boost your bravery.',
         'Defeat the Shadow Fear boss at the summit!'
      ],
      'reflection-bridge': [
         'Combine your skills from all previous islands.',
         'Walk the rainbow path by making wise choices.',
         'Reflect on your growth journey with AIZA.',
         'Restore balance to the entire World!'
      ]
   };
   return instructions[id] || ['Focus your mind.', 'Follow the signs.', 'Have fun adventuring!'];
}
