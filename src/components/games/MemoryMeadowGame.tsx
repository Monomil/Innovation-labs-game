/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameChildProps } from './MiniGameEngine';
import { Star, Sparkles, Heart, Brain, Zap, Smile, CloudRain, Flame } from 'lucide-react';

interface Card {
  id: number;
  symbol: React.ReactNode;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export function MemoryMeadowGame({ state, level, onScore, onCompleteLevel, onFail }: GameChildProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [combo, setCombo] = useState(0);

  const symbols = [
    { emoji: '😊', icon: <Smile className="text-yellow-400" /> },
    { emoji: '😢', icon: <CloudRain className="text-blue-400" /> },
    { emoji: '😡', icon: <Flame className="text-red-500" /> },
    { emoji: '😴', icon: <Brain className="text-indigo-400" /> },
    { emoji: '🤔', icon: <Zap className="text-purple-400" /> },
    { emoji: '💖', icon: <Heart className="text-pink-500" /> },
    { emoji: '✨', icon: <Sparkles className="text-cyan-400" /> },
    { emoji: '⭐', icon: <Star className="text-amber-400" /> },
  ];

  const gridSize = level === 'boss' ? 16 : 4 + (level * 2);

  useEffect(() => {
    const pairs = symbols.slice(0, gridSize / 2);
    const gameSymbols = [...pairs, ...pairs]
      .sort(() => Math.random() - 0.5)
      .map((s, i) => ({
        id: i,
        ...s,
        isFlipped: false,
        isMatched: false
      }));
    setCards(gameSymbols);
    setFlipped([]);
    setCombo(0);
  }, [gridSize]);

  const handleFlip = (index: number) => {
    if (flipped.length === 2 || cards[index].isFlipped || cards[index].isMatched) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
       const [first, second] = newFlipped;
       if (cards[first].emoji === cards[second].emoji) {
          // Match
          setTimeout(() => {
             const matchedCards = [...cards];
             matchedCards[first].isMatched = true;
             matchedCards[second].isMatched = true;
             setCards(matchedCards);
             setFlipped([]);
             setCombo(prev => prev + 1);
             onScore(100 * (combo + 1));
             
             if (matchedCards.every(c => c.isMatched)) {
                onCompleteLevel();
             }
          }, 500);
       } else {
          // No match
          setCombo(0);
          setTimeout(() => {
             const resetCards = [...cards];
             resetCards[first].isFlipped = false;
             resetCards[second].isFlipped = false;
             setCards(resetCards);
             setFlipped([]);
          }, 1000);
       }
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0d2e1c]">
      {/* Meadow Particles */}
      <div className="absolute inset-0 pointer-events-none">
         {[...Array(20)].map((_, i) => (
            <motion.div
               key={i}
               animate={{ 
                 y: [0, -100, 0], 
                 x: [0, (Math.random() - 0.5) * 50, 0],
                 opacity: [0.2, 0.5, 0.2]
               }}
               transition={{ duration: 4 + Math.random() * 4, repeat: Infinity }}
               className="absolute text-2xl"
               style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            >
               🦋
            </motion.div>
         ))}
      </div>

      <div 
        className="relative z-[210] grid gap-4 p-8 bg-black/20 rounded-[50px] border-4 border-emerald-500/30"
        style={{ 
          gridTemplateColumns: `repeat(${Math.sqrt(gridSize)}, 1fr)`,
        }}
      >
         {cards.map((card, i) => (
            <motion.button
               key={card.id}
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={() => handleFlip(i)}
               className={`w-20 h-20 sm:w-28 sm:h-28 rounded-3xl flex items-center justify-center transition-all duration-500 relative preserve-3d shadow-2xl ${
                  card.isFlipped || card.isMatched ? 'rotate-y-180' : ''
               }`}
            >
               <div className={`absolute inset-0 bg-emerald-700 border-4 border-emerald-500 rounded-3xl backface-hidden flex items-center justify-center text-4xl text-white/20 font-black`}>
                  ?
               </div>
               <div className={`absolute inset-0 bg-white border-4 border-emerald-100 rounded-3xl rotate-y-180 backface-hidden flex items-center justify-center`}>
                  {React.cloneElement(card.symbol as React.ReactElement, { size: 48 })}
               </div>
               {card.isMatched && (
                 <motion.div 
                   initial={{ scale: 0 }}
                   animate={{ scale: 1 }}
                   className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1 border-2 border-white text-indigo-900 z-10"
                 >
                    <Star size={16} fill="currentColor" />
                 </motion.div>
               )}
            </motion.button>
         ))}
      </div>

      {/* Combo Multiplier */}
      <div className="absolute right-12 top-1/2 -translate-y-1/2 flex flex-col items-center">
         <AnimatePresence>
            {combo > 1 && (
               <motion.div
                 initial={{ scale: 0, x: 50, opacity: 0 }}
                 animate={{ scale: 1, x: 0, opacity: 1 }}
                 exit={{ scale: 0, opacity: 0 }}
                 className="bg-gradient-to-br from-yellow-400 to-orange-500 p-8 rounded-full shadow-[0_10px_40px_rgba(245,158,11,0.5)] border-4 border-white text-center"
               >
                  <span className="block text-[10px] font-black text-white/60 uppercase tracking-widest mb-1 leading-none">COMBO</span>
                  <span className="text-5xl font-black text-white italic tracking-tighter">x{combo}</span>
               </motion.div>
            )}
         </AnimatePresence>
      </div>

      {/* Statistics */}
      <div className="absolute bottom-12 w-full max-w-lg px-8">
         <div className="bg-black/40 backdrop-blur-xl px-12 py-6 rounded-[40px] border border-white/10 flex justify-between items-center text-center">
            <div>
               <span className="block text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Matched</span>
               <span className="text-3xl font-black text-white">{cards.filter(c => c.isMatched).length / 2} / {gridSize / 2}</span>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div>
               <span className="block text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Efficiency</span>
               <span className="text-3xl font-black text-white">{Math.round((gridSize / (cards.filter(c => c.isFlipped && !c.isMatched).length || gridSize)) * 100)}%</span>
            </div>
         </div>
      </div>
    </div>
  );
}
