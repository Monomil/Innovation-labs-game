/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGame } from '../store/GameContext';
import { Zone } from '../types';
import { Button, Card, FloatingElement } from './ui/GameUI';
import { 
  ArrowLeft, 
  Play, 
  Heart, 
  Star, 
  Volume2, 
  Trophy,
  CheckCircle2,
  Gem,
  Wind,
  Cloud,
  Sparkles,
  ArrowRight,
  Flame
} from 'lucide-react';

// New Game Engine & Game Components
import { MiniGameEngine } from './games/MiniGameEngine';
import { AngerVolcanoGame } from './games/AngerVolcanoGame';
import { WorryCloudGame } from './games/WorryCloudGame';
import { ConfusionForestGame } from './games/ConfusionForestGame';
import { MemoryMeadowGame } from './games/MemoryMeadowGame';
import { CalmBeachGame } from './games/CalmBeachGame';
import { CreatureVillageGame } from './games/CreatureVillageGame';
import { FestivalTownGame } from './games/FestivalTownGame';
import { SleepyValleyGame } from './games/SleepyValleyGame';
import { ConfidenceMountainGame } from './games/ConfidenceMountainGame';
import { ReflectionBridgeGame } from './games/ReflectionBridgeGame';

interface ZoneScreenProps {
  zone: Zone;
  onBack: () => void;
}

export function ZoneScreen({ zone, onBack }: ZoneScreenProps) {
  const { completeZone, unlockAchievement } = useGame();
  const [gameState, setGameState] = useState<'instructions' | 'playing' | 'result' | 'rewards'>('instructions');
  const [gameOutcome, setGameOutcome] = useState<'win' | 'lose' | null>(null);
  const [earnedGems, setEarnedGems] = useState(0);
  const [earnedXP, setEarnedXP] = useState(0);

  const startMiniGame = () => {
    setGameState('playing');
  };

  const handleGameEnd = (outcome: 'win' | 'lose', gems: number = 0, xp: number = 0) => {
    setGameOutcome(outcome);
    setEarnedGems(gems);
    setEarnedXP(xp);
    setGameState('result');
    
    if (outcome === 'win') {
      completeZone(zone.id, gems, xp);
      unlockAchievement({
        id: `zone-${zone.id}`,
        title: `${zone.name} Master`,
        description: `Completed the ${zone.name} challenge!`,
        icon: 'star'
      });
    }
  };

  return (
    <div className={`min-h-screen relative overflow-hidden flex flex-col`}>
      {/* Dynamic Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${zone.color} opacity-100 z-0 transition-all duration-1000`} />
      
      {/* Content Layer */}
      <div className="relative z-10 flex-1 flex flex-col p-6">
        {/* Navigation */}
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={onBack}
            className="w-12 h-12 rounded-2xl bg-white/30 backdrop-blur-md flex items-center justify-center text-white"
          >
            <ArrowLeft />
          </button>
          <div className="bg-white/30 backdrop-blur-md px-6 py-2 rounded-2xl flex items-center gap-2 border-2 border-white/40">
            <h2 className="text-xl font-black text-white italic tracking-tighter uppercase">{zone.name}</h2>
          </div>
          <button className="w-12 h-12 rounded-2xl bg-white/30 backdrop-blur-md flex items-center justify-center text-white">
            <Volume2 />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {gameState === 'instructions' && (
            <motion.div
              key="instructions"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center py-6"
            >
              <div className="bg-white rounded-[50px] shadow-[0_30px_100px_rgba(0,0,0,0.3)] border-[6px] border-white max-w-2xl w-full overflow-hidden flex flex-col">
                 {/* Top Header */}
                 <div className={`p-8 bg-gradient-to-r ${zone.color} text-white flex items-center justify-between`}>
                    <div>
                       <h3 className="text-4xl font-black italic uppercase tracking-tighter leading-none mb-2">{zone.name}</h3>
                       <p className="text-xs font-black uppercase tracking-[0.3em] opacity-80">Goal: {zone.teach}</p>
                    </div>
                    <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-md">
                       <Star size={40} className="fill-white" />
                    </div>
                 </div>

                 {/* Body */}
                 <div className="p-10 flex flex-col gap-8">
                    <div className="grid grid-cols-2 gap-8">
                       <section>
                          <h4 className="text-indigo-400 font-black uppercase tracking-widest text-[10px] mb-3">Your Mission</h4>
                          <p className="text-indigo-900 font-bold text-lg leading-tight">
                            {zone.description}
                          </p>
                       </section>
                       <section>
                          <h4 className="text-indigo-400 font-black uppercase tracking-widest text-[10px] mb-3">Controls</h4>
                          <div className="flex items-center gap-3 bg-indigo-50 p-4 rounded-2xl border-2 border-indigo-100">
                             <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-xl">🖱️</div>
                             <p className="text-indigo-900 font-black uppercase text-xs tracking-wider">Tap or Click to<br/>Interact</p>
                          </div>
                       </section>
                    </div>

                    <div className="bg-emerald-50 rounded-3xl p-6 border-2 border-emerald-100 flex items-center gap-6">
                       <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center shrink-0">
                          <Gem className="text-yellow-500 fill-yellow-500" size={32} />
                       </div>
                       <div>
                          <h4 className="text-emerald-600 font-black uppercase tracking-widest text-[10px] mb-1">Potential Rewards</h4>
                          <p className="text-emerald-900 font-black text-xl tracking-tighter italic">Up to {zone.reward} Gems & {zone.xpReward} XP</p>
                       </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                       <button 
                         onClick={onBack}
                         className="flex-1 py-6 rounded-[28px] border-4 border-indigo-100 text-indigo-400 font-black uppercase tracking-widest text-sm hover:bg-indigo-50 transition-all active:scale-95"
                       >
                         Back to Map
                       </button>
                       <button 
                         onClick={startMiniGame}
                         className="flex-[2] py-6 rounded-[28px] bg-indigo-600 text-white font-black uppercase tracking-widest italic text-xl shadow-[0_10px_30px_rgba(79,70,229,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                       >
                         Start Game <Play fill="white" />
                       </button>
                    </div>
                 </div>
              </div>
            </motion.div>
          )}

          {gameState === 'playing' && (
            <MiniGameEngine 
              zone={zone} 
              onBack={onBack}
              onWin={(gems, xp) => {
                handleGameEnd('win', gems, xp);
              }}
              onLose={() => {
                handleGameEnd('lose');
              }}
            >
              {(props) => (
                <>
                  {zone.miniGameId === 'breathing' && <AngerVolcanoGame {...props} />}
                  {zone.miniGameId === 'worryCloud' && <WorryCloudGame {...props} />}
                  {(zone.miniGameId === 'memoryMatch' || zone.id === 'memory-meadow') && <MemoryMeadowGame {...props} />}
                  {zone.miniGameId === 'rhythmFestival' && <FestivalTownGame {...props} />}
                  {zone.miniGameId === 'calmBeach' && <CalmBeachGame {...props} />}
                  {zone.miniGameId === 'helpingCreatures' && <CreatureVillageGame {...props} />}
                  {zone.miniGameId === 'sleepyValley' && <SleepyValleyGame {...props} />}
                  {zone.miniGameId === 'confidenceQuest' && <ConfidenceMountainGame {...props} />}
                  {zone.miniGameId === 'reflectionBridge' && <ReflectionBridgeGame {...props} />}
                  {(zone.miniGameId === 'pathFollow' || zone.id === 'confusion-forest') && <ConfusionForestGame {...props} />}
                  
                  {/* Fallback for unmapped or new games */}
                  {!['breathing', 'worryCloud', 'memoryMatch', 'rhythmFestival', 'calmBeach', 'helpingCreatures', 'sleepyValley', 'confidenceQuest', 'reflectionBridge', 'pathFollow'].includes(zone.miniGameId) && zone.id !== 'confusion-forest' && zone.id !== 'memory-meadow' && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                       <motion.div
                         initial={{ scale: 0.9, opacity: 0 }}
                         animate={{ scale: 1, opacity: 1 }}
                         className="bg-white/10 backdrop-blur-3xl p-12 rounded-[60px] border-4 border-white/20 max-w-md w-full"
                       >
                          <div className="text-8xl mb-6">🏝️</div>
                          <h3 className="text-3xl font-black text-white mb-2 italic uppercase tracking-tighter">Island in Construction</h3>
                          <p className="text-white/60 mb-8 font-bold">The magic is still gathering in this part of Adventure Land!</p>
                          <Button size="lg" onClick={() => props.onCompleteLevel()}>Claim Explorer Gems Anyway!</Button>
                       </motion.div>
                    </div>
                  )}
                </>
              )}
            </MiniGameEngine>
          )}

          {gameState === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center p-8 bg-[#020314]/90 backdrop-blur-3xl"
            >
               {gameOutcome === 'win' ? (
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="w-64 h-64 bg-indigo-600 rounded-full mx-auto mb-8 flex items-center justify-center shadow-[0_0_80px_rgba(79,70,229,0.5)] border-8 border-white/20"
                    >
                      <Trophy size={120} className="text-white fill-white/20" />
                    </motion.div>
                    <h2 className="text-7xl font-black text-white italic uppercase tracking-tighter mb-4">You Did It!</h2>
                    <p className="text-2xl text-cyan-300 font-black uppercase tracking-[.3em] mb-12">Mission Successfully Completed</p>
                    <button 
                      onClick={() => setGameState('rewards')}
                      className="bg-white text-indigo-950 px-12 py-5 rounded-[40px] font-black uppercase italic tracking-tighter text-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all"
                    >
                      Collect Rewards
                    </button>
                  </div>
               ) : (
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-64 h-64 bg-rose-900/40 rounded-full mx-auto mb-8 flex items-center justify-center border-8 border-rose-500/20"
                    >
                      <Heart size={120} className="text-rose-400" />
                    </motion.div>
                    <h2 className="text-7xl font-black text-white italic uppercase tracking-tighter mb-4">Almost There!</h2>
                    <p className="text-2xl text-rose-300 font-black uppercase tracking-[.2em] mb-12">You're improving! Let's try once more.</p>
                    <div className="flex gap-4 justify-center">
                      <button 
                        onClick={() => setGameState('playing')}
                        className="bg-indigo-600 text-white px-10 py-5 rounded-[40px] font-black uppercase italic tracking-tighter text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all"
                      >
                        Try Again
                      </button>
                      <button 
                        onClick={onBack}
                        className="bg-white/10 text-white border-2 border-white/20 px-10 py-5 rounded-[40px] font-black uppercase italic tracking-tighter text-xl hover:bg-white/20 transition-all"
                      >
                        Back to Map
                      </button>
                    </div>
                  </div>
               )}
            </motion.div>
          )}

          {gameState === 'rewards' && (
            <motion.div
              key="rewards"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center text-center p-8"
            >
              <div className="relative mb-12">
                 <motion.div
                    animate={{ scale: [1, 1.3, 1], rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-yellow-400 opacity-20 blur-[80px] rounded-full"
                 />
                 <div className="w-56 h-56 bg-white rounded-full flex items-center justify-center border-8 border-yellow-400 relative z-10">
                    <CheckCircle2 className="w-32 h-32 text-yellow-500" />
                 </div>
              </div>
              
              <h2 className="text-6xl font-black text-white italic tracking-tighter uppercase mb-2">Rewards Unlocked!</h2>
              <p className="text-xl font-black text-white/60 mb-12 uppercase tracking-[0.3em]">
                Your emotional skills have grown
              </p>

              <div className="grid grid-cols-2 gap-6 w-full max-w-md mb-12">
                <div className="bg-white/10 backdrop-blur-xl rounded-[40px] border-2 border-white/20 flex flex-col items-center p-8">
                   <div className="w-16 h-16 bg-yellow-400/20 rounded-2xl flex items-center justify-center mb-4">
                      <Gem className="text-yellow-400" size={32} />
                   </div>
                   <span className="text-5xl font-black text-white tracking-tighter">+{earnedGems}</span>
                   <span className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-2">Gems Earned</span>
                </div>
                <div className="bg-white/10 backdrop-blur-xl rounded-[40px] border-2 border-white/20 flex flex-col items-center p-8">
                   <div className="w-16 h-16 bg-indigo-400/20 rounded-2xl flex items-center justify-center mb-4">
                      <Star className="text-indigo-400" size={32} />
                   </div>
                   <span className="text-5xl font-black text-white tracking-tighter">+{earnedXP}</span>
                   <span className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-2">XP Gained</span>
                </div>
              </div>

              <div className="flex flex-col gap-4 w-full max-w-md">
                <button 
                  onClick={onBack}
                  className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white h-24 rounded-[40px] text-3xl font-black italic tracking-tighter shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4"
                >
                   Continue Journey <ArrowRight size={32} />
                </button>
                <button 
                  onClick={() => setGameState('playing')} 
                  className="py-4 text-white/40 font-black uppercase tracking-[0.2em] text-xs hover:text-white transition-all underline"
                >
                  Master this skill again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
