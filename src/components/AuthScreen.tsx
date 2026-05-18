/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGame } from '../store/GameContext';
import { Button, Card } from './ui/GameUI';
import { Sparkles, Gamepad2, Heart, Users, ChevronRight, PlusCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { AizaLogo } from './AizaLogo';
import { CinematicBackground } from './CinematicBackground';

interface AuthScreenProps {
  onStart: () => void;
}

export function AuthScreen({ onStart }: AuthScreenProps) {
  const { gameState, login, registerProfile } = useGame();
  const [mode, setMode] = useState<'selection' | 'register'>('selection');
  
  // Registration Form State
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    pet: 'cat' as 'cat' | 'dog' | 'rabbit'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Spirit name is required!";
    
    const ageNum = parseInt(formData.age);
    if (!formData.age || ageNum < 5 || ageNum > 10) {
      newErrors.age = "Explorers must be between 5 and 10 years old.";
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid adult's email for safety.";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      registerProfile({
        name: formData.name,
        age: parseInt(formData.age),
        email: formData.email,
        petSelection: formData.pet
      });
      onStart();
    }
  };

  const handleSelect = (profileId: string) => {
    login(profileId);
    onStart();
  };

  return (
    <div className="h-full min-h-screen flex flex-col items-center justify-center p-6 bg-[#020314] relative overflow-hidden font-sans">
      <CinematicBackground />
      
      <AnimatePresence mode="wait">
        {mode === 'selection' ? (
          <motion.div
            key="selection"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="relative z-10 w-full max-w-5xl"
          >
            <div className="text-center mb-16">
               <motion.div 
                 initial={{ scale: 0 }}
                 animate={{ scale: 1 }}
                 className="mb-12 flex justify-center"
               >
                  <AizaLogo size="lg" />
               </motion.div>
               <p className="text-cyan-300 font-extrabold uppercase tracking-[0.4em] text-[10px] filter drop-shadow-[0_0_8px_rgba(103,232,249,0.5)]">Choose Your Explorer</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {gameState.profiles.map(profile => (
                 <motion.button
                   key={profile.id}
                   whileHover={{ scale: 1.05, y: -5 }}
                   whileTap={{ scale: 0.95 }}
                   onClick={() => handleSelect(profile.id)}
                   className="bg-white/5 border-4 border-white/10 p-10 rounded-[50px] backdrop-blur-3xl flex flex-col items-center gap-6 transition-all hover:border-indigo-500/50 hover:bg-white/10 group shadow-[0_30px_60px_rgba(0,0,0,0.4)] relative overflow-hidden"
                 >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-28 h-28 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-[35px] flex items-center justify-center text-6xl shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-transform relative z-10">
                      {profile.petSelection === 'cat' ? '🐱' : profile.petSelection === 'dog' ? '🐶' : '🐰'}
                    </div>
                    <div className="text-center relative z-10">
                      <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">{profile.name}</h3>
                      <p className="text-cyan-300 font-black text-[10px] uppercase tracking-widest mt-2 opacity-60">Level {profile.lastLevel || 1} Explorer</p>
                    </div>
                 </motion.button>
               ))}

               <motion.button
                 whileHover={{ scale: 1.05 }}
                 onClick={() => setMode('register')}
                 className="bg-white text-indigo-950 border-4 border-white/20 p-10 rounded-[50px] flex flex-col items-center justify-center gap-6 transition-all shadow-[0_40px_80px_rgba(255,255,255,0.1)] group relative overflow-hidden"
               >
                 <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                 <div className="w-20 h-20 bg-indigo-950 text-white rounded-full flex items-center justify-center group-hover:rotate-90 transition-transform">
                    <PlusCircle size={40} />
                 </div>
                 <span className="font-black italic uppercase tracking-tighter text-3xl">New Spirit</span>
               </motion.button>
            </div>
            
            {gameState.profiles.length === 0 && (
              <p className="text-indigo-300/40 text-center mt-12 font-black uppercase tracking-[0.3em] text-[10px]">
                Waiting for the first adventurer to manifest...
              </p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="register"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="relative z-10 w-full max-w-2xl"
          >
            <div className="p-12 border-4 border-white/10 rounded-[60px] bg-white/5 backdrop-blur-3xl shadow-[0_50px_100px_rgba(0,0,0,0.6)] relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-3xl animate-pulse">✨</div>
               </div>

               <div className="flex justify-between items-center mb-12">
                  <button onClick={() => setMode('selection')} className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white/40 hover:text-white transition-all hover:bg-white/10">
                     <ArrowLeft size={32} />
                  </button>
                  <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter text-center flex-1">Manifest Spirit</h2>
                  <div className="w-16 h-16" />
               </div>

               <form onSubmit={handleRegister} className="space-y-10">
                  <div className="space-y-3">
                     <label className="block text-[10px] font-black text-cyan-400 uppercase tracking-widest ml-4">Full Spirit Name</label>
                     <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Luna Moon"
                        className={`w-full p-8 rounded-[35px] bg-black/40 border-4 ${errors.name ? 'border-rose-500' : 'border-white/10'} text-white font-black text-2xl outline-none focus:border-indigo-500/50 transition-all placeholder:text-white/10`}
                     />
                     {errors.name && <p className="text-rose-400 text-[10px] font-black uppercase tracking-widest ml-4">{errors.name}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                     <div className="space-y-3">
                        <label className="block text-[10px] font-black text-cyan-400 uppercase tracking-widest ml-4">Explorer Age</label>
                        <input
                           type="number"
                           value={formData.age}
                           onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                           placeholder="5-10"
                           className={`w-full p-8 rounded-[35px] bg-black/40 border-4 ${errors.age ? 'border-rose-500' : 'border-white/10'} text-white font-black text-2xl outline-none focus:border-indigo-500/50 transition-all text-center placeholder:text-white/10`}
                        />
                        {errors.age && <p className="text-rose-400 text-[10px] font-black uppercase tracking-widest ml-4">{errors.age}</p>}
                     </div>
                     <div className="space-y-3">
                        <label className="block text-[10px] font-black text-cyan-400 uppercase tracking-widest ml-4">Choosing Pet</label>
                        <div className="flex gap-3">
                           {(['cat', 'dog', 'rabbit'] as const).map((p) => (
                             <button
                               key={p}
                               type="button"
                               onClick={() => setFormData({ ...formData, pet: p })}
                               className={`flex-1 h-[96px] rounded-[35px] text-4xl flex items-center justify-center transition-all ${
                                 formData.pet === p ? 'bg-indigo-600 text-white shadow-2xl scale-105 border-4 border-white/20' : 'bg-black/40 text-white/20 grayscale hover:bg-black/60'
                               }`}
                             >
                               {p === 'cat' ? '🐱' : p === 'dog' ? '🐶' : '🐰'}
                             </button>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="space-y-3">
                     <label className="block text-[10px] font-black text-cyan-400 uppercase tracking-widest ml-4">Guardian Email (For Safety)</label>
                     <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="adult@example.com"
                        className={`w-full p-8 rounded-[35px] bg-black/40 border-4 ${errors.email ? 'border-rose-500' : 'border-white/10'} text-white font-black text-2xl outline-none focus:border-indigo-500/50 transition-all placeholder:text-white/10`}
                     />
                     {errors.email && <p className="text-rose-400 text-[10px] font-black uppercase tracking-widest ml-4">{errors.email}</p>}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-28 bg-white text-indigo-950 font-black text-4xl italic uppercase tracking-tighter rounded-[40px] shadow-[0_30px_70px_rgba(255,255,255,0.15)] flex items-center justify-center gap-4 group hover:scale-[1.02] active:scale-98 transition-all"
                  >
                     BEGIN JOURNEY <ChevronRight size={40} className="group-hover:translate-x-2 transition-transform" />
                  </Button>
               </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
