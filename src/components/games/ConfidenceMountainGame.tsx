/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameChildProps } from './MiniGameEngine';
import { Shield, Trophy, CloudOff, ArrowBigUp, Zap } from 'lucide-react';

interface Platform {
  id: number;
  x: number;
  y: number;
  width: number;
  type: 'stable' | 'moving' | 'unstable';
}

export function ConfidenceMountainGame({ state, level, onScore, onCompleteLevel, onFail }: GameChildProps) {
  const [playerY, setPlayerY] = useState(0);
  const [playerX, setPlayerX] = useState(50);
  const [isJumping, setIsJumping] = useState(false);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [scoreY, setScoreY] = useState(0);
  const [shieldActive, setShieldActive] = useState(false);
  const [shieldCharge, setShieldCharge] = useState(100);
  const [hazards, setHazards] = useState<{id: number, x: number, y: number}[]>([]);

  const mountainHeight = level === 'boss' ? 5000 : 1000 + (level * 1000);

  // Initialize Platforms
  useEffect(() => {
     const newPlatforms: Platform[] = [];
     for(let h = 200; h < mountainHeight; h += 300) {
        newPlatforms.push({
           id: h,
           x: Math.random() * 60 + 20,
           y: h,
           width: 150 + Math.random() * 100,
           type: h > 2000 ? 'moving' : 'stable'
        });
     }
     setPlatforms(newPlatforms);
  }, [mountainHeight]);

  // Player Gravity / Movement
  useEffect(() => {
     if (state !== 'level1' && state !== 'level2' && state !== 'level3' && state !== 'boss') return;

     const interval = setInterval(() => {
        if (!isJumping) {
           setPlayerY(prev => Math.max(0, prev - 15)); // Fall
        }
        
        // Horizontal movement if on moving platform
        const standingOn = platforms.find(p => 
           playerY >= p.y && playerY <= p.y + 20 &&
           playerX >= p.x - 5 && playerX <= p.x + 15
        );
        
        // Death check
        if (playerY <= scoreY - 500 && scoreY > 0) {
           onFail();
        }
     }, 30);

     return () => clearInterval(interval);
  }, [state, isJumping, playerY, playerX, platforms, scoreY]);

  const jump = () => {
     if (isJumping) return;
     setIsJumping(true);
     onScore(10);
     
     // Animation
     const jumpHeight = 400;
     const startY = playerY;
     let traveled = 0;
     const interval = setInterval(() => {
        traveled += 20;
        setPlayerY(prev => prev + 20);
        if (traveled >= jumpHeight) {
           clearInterval(interval);
           setIsJumping(false);
        }
     }, 20);

     // Update score relative to height
     if (playerY > scoreY) setScoreY(playerY);
  };

  const move = (dir: 'left' | 'right') => {
     setPlayerX(prev => {
        const next = dir === 'left' ? prev - 5 : prev + 5;
        return Math.max(10, Math.min(90, next));
     });
  };

  useEffect(() => {
     if (scoreY >= mountainHeight) {
        onCompleteLevel();
     }
  }, [scoreY, mountainHeight, onCompleteLevel]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0f172a] overflow-hidden">
      {/* Mountain Layers */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_#1e293b_0%,_#0f172a_100%)]" />
      
      {/* World Content (Camera relative to scoreY) */}
      <div 
         className="absolute inset-x-0 bottom-0 transition-transform duration-500 ease-out"
         style={{ transform: `translateY(${scoreY}px)` }}
      >
         {/* Baseline */}
         <div className="absolute bottom-0 w-full h-[1000px] bg-slate-900 border-t-8 border-slate-700" />
         
         {/* Platforms */}
         {platforms.map(p => (
            <motion.div
               key={p.id}
               className="absolute h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full border-4 border-white shadow-[0_10px_20px_rgba(0,0,0,0.4)]"
               style={{ 
                  bottom: p.y, 
                  left: `${p.x}%`, 
                  width: p.width,
                  transform: 'translateX(-50%)'
               }}
            >
               <div className="absolute inset-0 bg-white/20 blur-sm" />
            </motion.div>
         ))}

         {/* Boss Shadow (if level boss) */}
         {level === 'boss' && (
            <div className="absolute" style={{ bottom: mountainHeight + 200, left: '50%', transform: 'translateX(-50%)' }}>
               <div className="text-[200px] filter drop-shadow-[0_0_100px_#ef4444] opacity-80 cursor-not-allowed">😈</div>
               <span className="block text-white font-black text-4xl italic text-center uppercase tracking-tighter">THE DOUBT MONSTER</span>
            </div>
         )}
      </div>

      {/* Player (Fixed Y in screen for camera feel) */}
      <motion.div 
         className="absolute z-[250] flex flex-col items-center"
         style={{ 
            left: `${playerX}%`, 
            bottom: '40%',
            transform: 'translateX(-50%)'
         }}
      >
         <div className="text-7xl mb-2 drop-shadow-2xl">🦸</div>
         {shieldActive && (
            <motion.div 
               animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
               transition={{ duration: 0.5, repeat: Infinity }}
               className="absolute inset-[-40px] rounded-full border-8 border-cyan-400 bg-cyan-400/20"
            />
         )}
         <div className="w-12 h-12 rounded-full bg-white/20 blur-xl -z-10" />
      </motion.div>

      {/* Controls */}
      <div className="absolute bottom-12 left-0 w-full px-8 flex justify-between items-end z-[260]">
         <div className="flex gap-4">
            <ControlButton icon="◀" onClick={() => move('left')} />
            <ControlButton icon="▶" onClick={() => move('right')} />
         </div>
         
         <div className="flex flex-col items-center gap-4">
             <button
               onMouseDown={() => setShieldActive(true)}
               onMouseUp={() => setShieldActive(false)}
               className="w-24 h-24 rounded-full bg-cyan-500 border-4 border-white shadow-2xl flex items-center justify-center text-white"
             >
                <Shield size={40} />
             </button>
             <span className="text-cyan-400 font-black text-[10px] uppercase tracking-widest">Confidance Shield</span>
         </div>

         <button 
            onClick={jump}
            className="w-40 h-40 rounded-full bg-amber-400 border-8 border-white shadow-[0_20px_60px_rgba(245,158,11,0.5)] flex flex-col items-center justify-center text-indigo-900 group"
         >
            <ArrowBigUp size={48} className="translate-y-2 group-active:-translate-y-2 transition-transform" />
            <span className="font-black italic text-2xl tracking-tighter uppercase leading-none">LEAP!</span>
         </button>
      </div>

      {/* HUD Info */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-xl px-12 py-6 rounded-[40px] border border-white/10 z-[260] text-center min-w-[300px]">
         <div className="flex justify-between items-center mb-2">
            <span className="text-white/40 font-black uppercase text-[10px] tracking-widest">Altitute</span>
            <span className="text-white font-black text-2xl italic tracking-tighter">{Math.round(scoreY)}m / {mountainHeight}m</span>
         </div>
         <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
               animate={{ width: `${(scoreY / mountainHeight) * 100}%` }}
               className="h-full bg-amber-400 shadow-[0_0_15px_#fbbf24]"
            />
         </div>
      </div>
    </div>
  );
}

function ControlButton({ icon, onClick }: { icon: string, onClick: () => void }) {
   return (
      <motion.button
         whileHover={{ scale: 1.1 }}
         whileTap={{ scale: 0.9 }}
         onMouseDown={onClick}
         className="w-24 h-24 bg-white/5 backdrop-blur-xl rounded-3xl border-4 border-white/10 flex items-center justify-center text-4xl text-white shadow-2xl"
      >
         {icon}
      </motion.button>
   );
}
