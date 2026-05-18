import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, X, Sparkles, ChevronRight, Check } from 'lucide-react';
import { useGame } from '../store/GameContext';
import { Button } from './ui/GameUI';

const PET_OPTIONS = [
  { type: 'cat' as const, name: 'Whiskers', icon: '🐱', color: 'bg-orange-100 border-orange-200 text-orange-600' },
  { type: 'dog' as const, name: 'Buddy', icon: '🐶', color: 'bg-blue-100 border-blue-200 text-blue-600' },
  { type: 'rabbit' as const, name: 'Hops', icon: '🐰', color: 'bg-pink-100 border-pink-200 text-pink-600' },
];

export function PetAdoptionModal() {
  const { adoptPet } = useGame();
  const [selected, setSelected] = useState<typeof PET_OPTIONS[0] | null>(null);
  const [name, setName] = useState('');

  if (!PET_OPTIONS || PET_OPTIONS.length === 0) {
    return <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#0a0a2a] text-white">Loading pets safely...</div>;
  }

  const handleAdopt = () => {
    if (!selected || !name.trim()) return;
    adoptPet(selected.type, name);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0a0a2a]/90 backdrop-blur-3xl" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-2xl bg-white/5 border-2 border-white/20 rounded-[60px] p-10 flex flex-col items-center gap-10 shadow-2xl"
      >
        <div className="text-center">
           <div className="w-20 h-20 bg-indigo-500 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-2xl rotate-3">
              <Heart size={40} className="fill-white" />
           </div>
           <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">Adopt a Friend</h2>
           <p className="text-indigo-200/60 text-lg font-bold tracking-widest mt-2 uppercase">Your companion is waiting for you!</p>
        </div>

        <div className="grid grid-cols-3 gap-6 w-full">
           {PET_OPTIONS.map((pet) => (
             <button
               key={pet.type}
               onClick={() => {
                 setSelected(pet);
                 setName(pet.name);
               }}
               className={`relative p-6 rounded-[40px] border-4 transition-all flex flex-col items-center gap-4 group ${
                 selected?.type === pet.type 
                   ? 'bg-white border-white scale-110 shadow-[0_20px_40px_rgba(255,255,255,0.2)]' 
                   : 'bg-white/5 border-white/5 hover:bg-white/10'
               }`}
             >
                <span className="text-6xl drop-shadow-xl filter group-hover:scale-110 transition-transform">{pet.icon}</span>
                <span className={`text-[10px] font-black uppercase tracking-widest ${selected?.type === pet.type ? 'text-indigo-950' : 'text-white/40'}`}>
                  {pet.type}
                </span>
                
                {selected?.type === pet.type && (
                  <div className="absolute -top-3 -right-3 bg-indigo-600 text-white p-2 rounded-full shadow-lg border-2 border-white">
                     <Check size={16} />
                  </div>
                )}
             </button>
           ))}
        </div>

        <AnimatePresence>
          {selected && (
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="w-full space-y-8"
            >
               <div className="space-y-4">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] block text-center">Name Your New Best Friend</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter a name..."
                    className="w-full bg-white/5 border-2 border-white/10 rounded-[30px] px-8 py-6 text-2xl font-black text-white text-center italic tracking-tighter focus:outline-none focus:border-indigo-400 transition-all placeholder:text-white/10"
                  />
               </div>

               <Button 
                 onClick={handleAdopt}
                 className="w-full h-20 bg-indigo-600 text-white rounded-[30px] font-black text-xl tracking-widest hover:bg-indigo-500 shadow-2xl group"
               >
                  BRING HOME {name.toUpperCase()} <ChevronRight className="ml-2 group-hover:translate-x-2 transition-transform" />
               </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
