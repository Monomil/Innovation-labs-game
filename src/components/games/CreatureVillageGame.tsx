/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameChildProps } from './MiniGameEngine';
import { Heart, MessagesSquare, Users, ChevronRight } from 'lucide-react';
import { Button, Card } from '../ui/GameUI';

interface Scenario {
  id: number;
  creature: string;
  emoji: string;
  problem: string;
  options: {
    text: string;
    isCorrect: boolean;
    feedback: string;
  }[];
}

export function CreatureVillageGame({ state, level, onScore, onCompleteLevel, onFail }: GameChildProps) {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [showFeedback, setShowFeedback] = useState<string | null>(null);
  const [friendship, setFriendship] = useState(50);

  const scenarios: Scenario[] = [
    {
      id: 1,
      creature: "Pip the Rabbit",
      emoji: "🐰",
      problem: "I dropped my magical carrot and it broke. I feel so sad and a bit silly for crying.",
      options: [
        { text: "It's just a carrot, don't worry!", isCorrect: false, feedback: "Pip feels ignored. It's better to acknowledge feelings first!" },
        { text: "I'm sorry Pip. It's okay to feel sad when things we love break.", isCorrect: true, feedback: "Pip feels understood! Validation is a great first step." },
        { text: "Laughter is the best medicine!", isCorrect: false, feedback: "Pip thinks you're making fun of his sadness." }
      ]
    },
    {
      id: 2,
      creature: "Grumble the Lion",
      emoji: "🦁",
      problem: "Someone used my favorite nap spot and now I'm SO ANGRY I want to roar at everyone!",
      options: [
        { text: "Tell them to move right now!", isCorrect: false, feedback: "This might start a big fight! Let's find a calmer way." },
        { text: "Let's take three deep breaths together before we talk to them.", isCorrect: true, feedback: "Grumble calmed down! Now he can solve the problem nicely." },
        { text: "Roaring is fun, let's join in!", isCorrect: false, feedback: "Now the whole village is noisy and scared." }
      ]
    },
    {
      id: 3,
      creature: "Twig the Fox",
      emoji: "🦊",
      problem: "I have a big presentation at the Festival and my tummy feels like it's full of butterflies.",
      options: [
        { text: "You're just being nervous, get over it.", isCorrect: false, feedback: "Twig feels even more worried now." },
        { text: "Nervous butterflies just mean your heart is getting ready! You can do this.", isCorrect: true, feedback: "Twig feels brave! Reframing anxiety as excitement helps." },
        { text: "Maybe you should just stay home.", isCorrect: false, feedback: "Twig missed out on a great experience." }
      ]
    }
  ];

  // Adjust scenarios based on level
  const totalScenarios = level === 'boss' ? scenarios.length : 1 + (level - 1);

  const handleOption = (option: Scenario['options'][0]) => {
     if (option.isCorrect) {
        onScore(300);
        setFriendship(prev => Math.min(100, prev + 20));
        setShowFeedback(option.feedback);
     } else {
        onScore(-100);
        setFriendship(prev => Math.max(0, prev - 15));
        setShowFeedback(option.feedback);
     }
  };

  const nextScenario = () => {
    setShowFeedback(null);
    if (currentScenario + 1 < totalScenarios) {
       setCurrentScenario(currentScenario + 1);
    } else {
       onCompleteLevel();
    }
  };

  if (friendship <= 0) onFail();

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#fff1f2] p-8">
      {/* Village Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#ffe4e6_0%,_#fff1f2_100%)] opacity-50" />
      
      <AnimatePresence mode="wait">
         {!showFeedback ? (
            <motion.div
               key="scenario"
               initial={{ y: 50, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               exit={{ y: -50, opacity: 0 }}
               className="max-w-xl w-full z-[210]"
            >
               <Card className="p-12 mb-12 border-rose-200 shadow-xl relative text-center">
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-32 bg-white rounded-full flex items-center justify-center text-7xl shadow-2xl border-8 border-rose-100">
                     {scenarios[currentScenario].emoji}
                  </div>
                  <h3 className="text-2xl font-black text-rose-500 uppercase tracking-widest mt-12 mb-6">{scenarios[currentScenario].creature}</h3>
                  <p className="text-3xl font-black text-slate-800 leading-tight italic">
                     "{scenarios[currentScenario].problem}"
                  </p>
               </Card>

               <div className="space-y-4">
                  {scenarios[currentScenario].options.map((opt, i) => (
                     <motion.button
                        key={i}
                        whileHover={{ scale: 1.02, x: 10 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleOption(opt)}
                        className="w-full p-8 bg-white border-4 border-rose-100 rounded-[35px] text-left hover:border-rose-400 transition-all shadow-lg flex items-center gap-6"
                     >
                        <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 font-black">
                           {String.fromCharCode(65 + i)}
                        </div>
                        <p className="text-xl font-bold text-slate-700">{opt.text}</p>
                     </motion.button>
                  ))}
               </div>
            </motion.div>
         ) : (
            <motion.div
               key="feedback"
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="max-w-xl w-full z-[210] text-center"
            >
               <Card className="p-16 border-emerald-200">
                  <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 text-emerald-500">
                     <MessagesSquare size={48} />
                  </div>
                  <h2 className="text-4xl font-black text-slate-800 uppercase italic tracking-tighter mb-8">AIZA's Advice</h2>
                  <p className="text-2xl font-bold text-slate-600 italic leading-relaxed mb-12">{showFeedback}</p>
                  
                  <Button size="xl" variant="secondary" onClick={nextScenario} className="w-full h-24 rounded-[40px]">
                     NEXT SCENARIO <ChevronRight size={32} />
                  </Button>
               </Card>
            </motion.div>
         )}
      </AnimatePresence>

      {/* Friendship Meter */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 z-[220] flex items-center gap-6 bg-white/40 backdrop-blur-md px-10 py-4 rounded-full border-2 border-rose-100 shadow-xl">
         <div className="flex items-center gap-3">
            <Heart size={24} className="text-rose-500 fill-rose-500" />
            <span className="text-rose-900 font-black uppercase text-xs tracking-widest leading-none">Village Trust</span>
         </div>
         <div className="w-64 h-4 bg-rose-900/10 rounded-full border border-rose-200 overflow-hidden">
            <motion.div 
               animate={{ width: `${friendship}%` }}
               className="h-full bg-gradient-to-r from-rose-400 to-pink-500"
            />
         </div>
         <span className="text-rose-900 font-black text-xl italic tracking-tighter">{Math.round(friendship)}%</span>
      </div>
    </div>
  );
}
