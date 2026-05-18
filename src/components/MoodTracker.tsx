import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Smile, Frown, Flame, Ghost, Moon, Cloud, Heart, X, Sparkles, ChevronRight } from 'lucide-react';
import { useGame } from '../store/GameContext';
import { Button } from './ui/GameUI';

const MOODS = [
  { id: 'happy', icon: <Smile size={48} />, label: 'Happy', color: 'bg-green-500', bg: 'bg-green-50', text: 'text-green-600' },
  { id: 'calm', icon: <Sparkles size={48} />, label: 'Calm', color: 'bg-teal-400', bg: 'bg-teal-50', text: 'text-teal-600' },
  { id: 'worried', icon: <Cloud size={48} />, label: 'Worried', color: 'bg-indigo-400', bg: 'bg-indigo-50', text: 'text-indigo-600' },
  { id: 'angry', icon: <Flame size={48} />, label: 'Angry', color: 'bg-red-500', bg: 'bg-red-50', text: 'text-red-600' },
  { id: 'sleepy', icon: <Moon size={48} />, label: 'Sleepy', color: 'bg-blue-400', bg: 'bg-blue-50', text: 'text-blue-600' },
  { id: 'confused', icon: <HelpCircle size={48} />, label: 'Confused', color: 'bg-orange-400', bg: 'bg-orange-50', text: 'text-orange-600' },
];

import { HelpCircle } from 'lucide-react';

export function MoodTracker({ onClose }: { onClose: () => void }) {
  const { logMood } = useGame();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [note, setNote] = useState('');

  const handleSave = () => {
    if (!selectedMood) return;
    logMood(selectedMood as any, note);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 50 }}
        className="relative w-full max-w-2xl bg-white rounded-[60px] shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="p-10 bg-indigo-50 flex justify-between items-center border-b-4 border-indigo-100">
           <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-indigo-600 shadow-xl border-2 border-indigo-100 rotate-3">
                 <Heart size={32} className="fill-indigo-600" />
              </div>
              <h2 className="text-4xl font-black text-indigo-950 italic tracking-tighter uppercase leading-none">Inner Weather</h2>
           </div>
           <button onClick={onClose} className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-indigo-950 shadow-md hover:bg-red-50 hover:text-red-500 transition-all border border-indigo-100">
              <X size={24} />
           </button>
        </div>

        <div className="p-10 space-y-10">
           <div className="text-center">
              <p className="text-indigo-400 font-black uppercase tracking-[0.3em] text-xs">How is your heart feeling today?</p>
           </div>

           <div className="grid grid-cols-3 gap-6">
              {MOODS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMood(m.id)}
                  className={`relative p-6 rounded-[40px] border-4 transition-all flex flex-col items-center gap-4 group ${
                    selectedMood === m.id 
                      ? `${m.bg} ${m.text} border-indigo-500 scale-110 shadow-2xl` 
                      : 'bg-white border-indigo-50 text-indigo-200 hover:border-indigo-200'
                  }`}
                >
                   <div className={`transition-transform group-hover:scale-110 ${selectedMood === m.id ? 'scale-110' : ''}`}>
                      {m.icon}
                   </div>
                   <span className="text-xs font-black uppercase tracking-widest">{m.label}</span>
                   
                   {selectedMood === m.id && (
                     <motion.div layoutId="mood-check" className="absolute -top-3 -right-3 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                        <ChevronRight size={16} />
                     </motion.div>
                   )}
                </button>
              ))}
           </div>

           <AnimatePresence>
             {selectedMood && (
               <motion.div
                 initial={{ opacity: 0, height: 0 }}
                 animate={{ opacity: 1, height: 'auto' }}
                 className="space-y-6 pt-6"
               >
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block ml-4">Tell me more (Optional)</label>
                     <textarea
                       value={note}
                       onChange={(e) => setNote(e.target.value)}
                       placeholder="What made you feel this way?"
                       className="w-full bg-indigo-50/50 border-2 border-indigo-100 rounded-[30px] p-6 text-indigo-900 font-bold focus:outline-none focus:border-indigo-400 transition-all placeholder:text-indigo-200 min-h-[120px] resize-none"
                     />
                  </div>

                  <Button
                    onClick={handleSave}
                    className="w-full h-20 bg-indigo-600 text-white rounded-[30px] font-black text-xl tracking-widest hover:bg-indigo-500 shadow-2xl group"
                  >
                     SAVE LOG <ChevronRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </Button>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
