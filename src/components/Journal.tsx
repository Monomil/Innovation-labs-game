/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGame } from '../store/GameContext';
import { Button, Card, FloatingElement } from './ui/GameUI';
import { Heart, Send, Calendar, Star, Lock, ArrowLeft, Gem, Sparkles, BookOpen } from 'lucide-react';
import { MoodLog } from '../types';

interface JournalProps {
  onBack: () => void;
}

export function Journal({ onBack }: JournalProps) {
  const { gameState, logMood, addGems } = useGame();
  const [selectedMood, setSelectedMood] = useState<MoodLog['mood'] | null>(null);
  const [note, setNote] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [activePrompt, setActivePrompt] = useState('');

  const prompts = [
    "If your heart was a color today, what would it be?",
    "What was the bravest thing you did today?",
    "If you could send a magical hug to someone, who would it be?",
    "What is something that made you giggle today?",
    "Even heroes feel worried sometimes. What's one thing you want to tell your pet friend?",
    "Imagine you are in the Calm Beach. What can you see in the sand?"
  ];

  useEffect(() => {
    setActivePrompt(prompts[Math.floor(Math.random() * prompts.length)]);
  }, []);

  const moods: { type: MoodLog['mood']; icon: string; label: string; color: string }[] = [
    { type: 'happy', icon: '😊', label: 'Happy', color: 'from-yellow-300 to-yellow-500' },
    { type: 'calm', icon: '😌', label: 'Calm', color: 'from-emerald-300 to-emerald-500' },
    { type: 'worried', icon: '😟', label: 'Worried', color: 'from-indigo-300 to-indigo-500' },
    { type: 'angry', icon: '😡', label: 'Angry', color: 'from-rose-400 to-rose-600' },
    { type: 'confused', icon: '🤔', label: 'Confused', color: 'from-blue-300 to-blue-500' },
    { type: 'sleepy', icon: '😴', label: 'Sleepy', color: 'from-violet-300 to-violet-500' },
  ];

  const handleSave = () => {
    if (!selectedMood) return;
    logMood(selectedMood, note);
    addGems(20);
    setShowConfirmation(true);
    setTimeout(() => {
      setShowConfirmation(false);
      onBack();
    }, 2500);
  };

  return (
    <div className="h-full bg-[#FFF0F5] relative overflow-hidden flex flex-col font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-pink-200/30 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200/20 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />

      {/* Header Overlay */}
      <div className="relative z-10 px-6 py-6 flex justify-between items-center">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onBack} 
          className="w-14 h-14 bg-white rounded-3xl shadow-xl flex items-center justify-center text-pink-500 border-2 border-pink-100"
        >
          <ArrowLeft size={28} />
        </motion.button>
        <div className="text-center">
           <h1 className="text-2xl font-black text-indigo-950 uppercase tracking-[0.2em]">Magical Journal</h1>
           <div className="flex justify-center items-center gap-1">
              <div className="w-1.5 h-1.5 bg-pink-400 rounded-full" />
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
              <div className="w-1.5 h-1.5 bg-teal-400 rounded-full" />
           </div>
        </div>
        <div className="w-14 h-14 bg-white rounded-3xl shadow-xl flex items-center justify-center text-yellow-500 border-2 border-yellow-100">
           <BookOpen size={28} />
        </div>
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto px-6 pb-12 no-scrollbar">
        <div className="max-w-2xl mx-auto space-y-8">
           
           {/* Mood Step */}
           <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
              <Card className="p-8 border-white/50 bg-white/60 backdrop-blur-md shadow-2xl relative">
                <div className="absolute -top-4 right-8 bg-indigo-600 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">Step 1</div>
                <h2 className="text-2xl font-black text-indigo-950 mb-8 text-center tracking-tight">Today I feel...</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {moods.map((m) => (
                    <motion.button
                      key={m.type}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedMood(m.type)}
                      className={`p-6 rounded-[32px] flex flex-col items-center gap-3 border-4 transition-all shadow-sm ${
                        selectedMood === m.type 
                          ? `border-white ring-4 ring-pink-300 bg-gradient-to-br ${m.color} text-white` 
                          : 'border-white bg-white text-indigo-900 group'
                      }`}
                    >
                      <span className="text-4xl drop-shadow-md group-hover:scale-110 transition-transform">{m.icon}</span>
                      <span className="font-black text-xs uppercase tracking-widest">{m.label}</span>
                    </motion.button>
                  ))}
                </div>
              </Card>
           </motion.div>

           {/* AI Prompt & Entry */}
           <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <Card className="p-10 border-white/50 bg-white/60 backdrop-blur-md shadow-2xl relative group">
                <div className="absolute -top-4 right-8 bg-pink-500 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">Step 2</div>
                
                <div className="mb-8 flex flex-col items-center gap-4">
                   <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-xl border-2 border-indigo-100 rotate-[-8deg] group-hover:rotate-0 transition-transform">
                      <Sparkles className="text-indigo-400" size={32} />
                   </div>
                   <h3 className="text-lg font-black text-indigo-900 text-center leading-tight">
                     {activePrompt}
                   </h3>
                </div>

                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Tell your journal anything..."
                  className="w-full h-48 p-8 rounded-[40px] bg-white border-4 border-indigo-50/50 outline-none focus:border-pink-300 font-bold text-indigo-900 text-xl placeholder:text-indigo-100 shadow-inner resize-none transition-all"
                />

                <div className="mt-8 flex flex-col gap-6">
                  <Button 
                    variant="accent" 
                    onClick={handleSave} 
                    disabled={!selectedMood}
                    className="w-full h-20 rounded-[32px] text-xl shadow-pink-200"
                  >
                    <div className="flex items-center gap-4">
                       <Send size={28} />
                       <span>Safe Keep (+20 Gems!)</span>
                       <Gem className="fill-white" />
                    </div>
                  </Button>
                  <p className="text-center text-indigo-300 font-bold text-xs uppercase tracking-widest px-8">
                     Your magic words are saved in your personal treasure chest where only you can read them.
                  </p>
                </div>
              </Card>
           </motion.div>

           {/* History Bar */}
           <div className="pb-12">
              <h3 className="text-sm font-black text-indigo-950 mb-6 flex items-center gap-2 uppercase tracking-widest px-2">
                <Calendar size={18} className="text-pink-500" /> Recent Magic Entries
              </h3>
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar px-2">
                {(gameState?.moodLogs || []).slice().reverse().map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex-shrink-0 w-24 h-24 bg-white/80 rounded-3xl shadow-xl flex flex-col items-center justify-center gap-1 border-2 border-white"
                  >
                    <span className="text-3xl">{moods.find(m => m.type === log.mood)?.icon || '✨'}</span>
                    <span className="text-[10px] font-black text-indigo-300 uppercase tracking-tighter">
                      {new Date(log.timestamp).toLocaleDateString(undefined, { weekday: 'short' })}
                    </span>
                  </motion.div>
                ))}
                {(gameState?.moodLogs || []).length === 0 && (
                  <div className="w-full h-24 flex items-center justify-center bg-white/40 rounded-3xl border-2 border-dashed border-white text-indigo-300 font-black italic text-sm">
                    Begin your quest with an entry!
                  </div>
                )}
              </div>
           </div>
        </div>
      </div>

      {/* Reward Overlay */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-indigo-950/60 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 1.5, opacity: 0 }}
              className="bg-yellow-400 p-12 rounded-[60px] shadow-[0_0_80px_rgba(250,204,21,0.5)] flex flex-col items-center border-[12px] border-white"
            >
              <FloatingElement>
                <div className="relative mb-8">
                   <Star className="text-white fill-white w-32 h-32" />
                   <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-4 border-dashed border-white/50 rounded-full" 
                   />
                </div>
              </FloatingElement>
              <h2 className="text-5xl font-black text-white text-center mb-2 tracking-tighter">SUCCESS!</h2>
              <div className="flex items-center gap-4 bg-white/20 px-6 py-3 rounded-full">
                <span className="text-3xl font-black text-white">+20</span>
                <Gem size={32} className="fill-white text-white drop-shadow-md" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
