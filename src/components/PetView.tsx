import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Utensils, Zap, Sparkles, ShowerHead as Shower, Play, Moon, Package, Trophy, X, ShoppingBag } from 'lucide-react';
import { useGame } from '../store/GameContext';
import { Pet, PetStats } from '../types';
import { PET_ITEMS } from '../constants/petItems';
import { Button } from './ui/GameUI';

import { FantasyPet } from './FantasyPet';
// ... rest of imports

export function PetView() {
  const { gameState, interactWithPet, usePetItem } = useGame();
  const [showInventory, setShowInventory] = useState(false);
  const [currentAction, setCurrentAction] = useState<'idle' | 'eat' | 'sleep' | 'play'>('idle');
  
  const safePets = gameState?.pets || [];
  const activePet = safePets.find(p => p.id === gameState?.activePetId) || null;
  
  useEffect(() => {
    if (activePet) {
      if (activePet.stats.energy < 20) setCurrentAction('sleep');
      else if (activePet.stats.hunger < 20) setCurrentAction('eat');
      else setCurrentAction('idle');
    }
  }, [activePet?.stats.energy, activePet?.stats.hunger]);

  if (!activePet) return null;

  const StatBar = ({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode, color: string }) => (
    <div className="flex flex-col gap-2 bg-indigo-950/30 p-4 rounded-3xl border border-white/5">
      <div className="flex justify-between items-center text-[10px] font-black text-white/60 uppercase tracking-[0.2em] px-1">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-white/5 rounded-lg">{icon}</div>
          {label}
        </div>
        <span className="text-white font-black">{Math.round(value)}%</span>
      </div>
      <div className="h-3 bg-black/20 rounded-full overflow-hidden border border-white/10 shadow-inner">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className={`h-full bg-gradient-to-r ${color} transition-all duration-1000 shadow-[0_0_15px_rgba(255,255,255,0.3)]`}
        />
      </div>
    </div>
  );

  const getPetEmoji = (pet: Pet) => {
    if (pet.stats.hunger < 30) return '🤤';
    if (pet.stats.energy < 30) return '😴';
    if (pet.stats.cleanliness < 30) return '🧼';
    if (pet.stats.happiness > 80) return '🤩';
    if (pet.stats.happiness < 40) return '😢';
    
    switch (pet.type) {
      case 'cat': return '🐱';
      case 'dog': return '🐶';
      case 'rabbit': return '🐰';
      default: return '🐾';
    }
  };

  return (
    <div className="relative group overflow-hidden rounded-[80px] bg-[#0a2e37] border-8 border-white/10 shadow-[0_60px_120px_rgba(0,0,0,0.8)] pb-8">
      {/* HABITAT ENVIRONMENT - SEMI-3D LOOK */}
      <div className="relative h-[450px] overflow-hidden">
        {/* Dynamic Sky */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-400 to-blue-300">
           <motion.div 
             animate={{ x: [-200, 1000] }}
             transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
             className="absolute top-10 left-0 text-9xl opacity-30 blur-sm"
           >
             ☁️
           </motion.div>
           <motion.div 
             animate={{ x: [1000, -200] }}
             transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
             className="absolute top-32 left-0 text-[180px] opacity-20 blur-md"
           >
             ☁️
           </motion.div>
        </div>

        {/* Rolling Hills / Ground */}
        <div className="absolute bottom-0 inset-x-0 h-48 bg-emerald-500 rounded-t-[100%] scale-x-150 translate-y-10 shadow-[inset_0_20px_60px_rgba(0,0,0,0.1)]">
           {/* Grass Textures */}
           <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')]" />
           
           {/* Trees & Props */}
           <div className="absolute top-0 left-1/4 -translate-y-full text-7xl drop-shadow-xl animate-bounce-slow">🌲</div>
           <div className="absolute top-5 right-1/4 -translate-y-full text-6xl drop-shadow-xl rotate-12">🌳</div>
           <div className="absolute top-10 left-1/3 -translate-y-full text-4xl drop-shadow-lg">🍄</div>
           
           {/* Interactive Habitat Items */}
           <div className="absolute -top-10 left-1/2 -translate-x-[200px] text-7xl drop-shadow-lg filter saturate-150 animate-float-3d">🛏️</div>
           <div className="absolute -top-8 left-1/2 translate-x-[120px] text-6xl drop-shadow-lg filter saturate-150">🥣</div>
           <div className="absolute -top-12 left-1/2 -translate-x-[50px] translate-y-20 text-6xl drop-shadow-lg filter saturate-150 animate-bounce-slow">⚽</div>
           <div className="absolute -top-16 left-1/2 translate-x-[250px] text-5xl drop-shadow-lg">🪵</div>
        </div>

        {/* Pet Stage Area */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-20">
           <div className="relative">
              {/* Emotional Aura */}
              <motion.div 
                animate={{ 
                  scale: [1, 1.4, 1],
                  opacity: [0.2, 0.5, 0.2]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-x-[-100px] inset-y-[-100px] bg-white rounded-full blur-[100px] opacity-20"
              />
              
              <div className="relative group">
                 {/* Shadow */}
                 <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-48 h-12 bg-black/40 blur-2xl rounded-full" />
                 
                 <motion.div
                   animate={{ 
                     y: [0, -10, 0],
                     rotate: [0, 1, -1, 0]
                   }}
                   transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                   className="relative flex flex-col items-center"
                 >
                    <FantasyPet 
                      type={activePet.type} 
                      action={currentAction} 
                      mood={activePet.stats.happiness > 70 ? 'happy' : activePet.stats.happiness < 40 ? 'sad' : 'neutral'} 
                    />
                    
                    {/* Interaction Feedback (Hearts/Sparks) */}
                    <AnimatePresence>
                       {activePet.stats.happiness > 80 && (
                          <motion.div
                            initial={{ opacity: 0, y: 0 }}
                            animate={{ opacity: [0, 1, 0], y: -200, x: [-50, 50, -50] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute z-20 text-5xl"
                          >
                             💖
                          </motion.div>
                       )}
                    </AnimatePresence>
                 </motion.div>

                 {/* Custom Interaction Floating Label */}
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.5 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white px-8 py-3 rounded-full shadow-2xl border-4 border-indigo-100 flex items-center gap-3 min-w-max"
                 >
                    <div className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xl font-black text-indigo-900 italic tracking-tighter uppercase">{activePet.name}</span>
                 </motion.div>
              </div>
           </div>
        </div>
        
        {/* Floating Clouds/Particles in foreground */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              x: [-100, 1200],
              opacity: [0, 0.4, 0]
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              delay: i * 4,
              ease: "linear"
            }}
            className="absolute top-[20%] left-0 text-6xl pointer-events-none"
            style={{ top: `${10 + i * 15}%` }}
          >
            ☁️
          </motion.div>
        ))}
      </div>

      {/* STATS & INTERACTION SECTION */}
      <div className="px-10 -mt-12 relative z-20">
         <div className="bg-[#0a0a2a]/90 backdrop-blur-3xl rounded-[60px] border-4 border-white/10 p-10 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               <StatBar label="Energy" value={activePet.stats.energy} icon={<Zap size={16} />} color="from-yellow-400 to-amber-500" />
               <StatBar label="Happiness" value={activePet.stats.happiness} icon={<Heart size={16} />} color="from-pink-400 to-rose-500" />
               <StatBar label="Hunger" value={activePet.stats.hunger} icon={<Utensils size={16} />} color="from-orange-400 to-red-600" />
               <StatBar label="Hygiene" value={activePet.stats.cleanliness} icon={<Shower size={16} />} color="from-blue-400 to-indigo-500" />
               <StatBar label="Trust" value={activePet.stats.trust} icon={<Trophy size={16} />} color="from-emerald-400 to-teal-500" />
               
               <div className="flex items-center justify-center p-6 bg-white/5 rounded-3xl border-2 border-white/5">
                  <button 
                    onClick={() => setShowInventory(true)}
                    className="flex flex-col items-center gap-2 group"
                  >
                     <Package size={32} className="text-white/40 group-hover:text-white transition-colors" />
                     <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Inventory</span>
                  </button>
               </div>
            </div>

            {/* ACTION GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
               <PetActionButton icon={<Utensils size={24} />} label="Feed Pet" color="bg-orange-600" onClick={() => setShowInventory(true)} />
               <PetActionButton icon={<Play size={24} />} label="Play Time" color="bg-pink-600" onClick={() => interactWithPet(activePet.id, 'play')} />
               <PetActionButton icon={<Shower size={24} />} label="Wash Pet" color="bg-blue-600" onClick={() => interactWithPet(activePet.id, 'brush')} />
               <PetActionButton icon={<Moon size={24} />} label="Go Sleep" color="bg-indigo-600" onClick={() => interactWithPet(activePet.id, 'rest')} />
            </div>
         </div>
      </div>

      {/* INVENTORY DRAWER */}
      <AnimatePresence>
        {showInventory && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed inset-x-8 bottom-8 top-1/4 z-[100] bg-indigo-950/95 backdrop-blur-3xl rounded-[60px] border-8 border-white/20 p-12 shadow-[0_-20px_100px_rgba(0,0,0,0.5)] flex flex-col"
          >
             <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                   <Package className="text-indigo-300" size={40} />
                   <div>
                      <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">Pet Backpack</h3>
                      <p className="text-indigo-400/60 font-black uppercase tracking-widest text-[10px] mt-1">Select an item to use</p>
                   </div>
                </div>
                <button onClick={() => setShowInventory(false)} className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-indigo-950 transition-all border-4 border-white/10">
                   <X size={32} />
                </button>
             </div>

             <div className="flex-1 overflow-y-auto no-scrollbar grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
                {gameState.petInventory.length === 0 ? (
                  <div className="col-span-full flex flex-col items-center justify-center opacity-40 py-20">
                     <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center mb-6">
                        <ShoppingBag size={64} className="text-white/20" />
                     </div>
                     <p className="text-xl font-black text-white uppercase tracking-widest">Backpack is empty</p>
                     <p className="text-indigo-300 mt-2 font-bold">Visit the Magic Shop to find gems and snacks!</p>
                  </div>
                ) : (
                  gameState.petInventory.map((itemId, i) => {
                    const item = PET_ITEMS.find(it => it.id === itemId);
                    if (!item) return null;
                    return (
                      <motion.button
                        key={i}
                        whileHover={{ y: -10, scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (activePet) {
                            usePetItem(activePet.id, itemId);
                            setShowInventory(false);
                          }
                        }}
                        className="bg-white/5 border-4 border-white/10 p-8 rounded-[40px] flex flex-col items-center gap-4 hover:bg-white hover:border-white transition-all group"
                      >
                         <span className="text-6xl filter drop-shadow-lg group-hover:scale-110 transition-transform">{item.icon}</span>
                         <div className="text-center">
                            <p className="text-[10px] font-black text-white group-hover:text-indigo-900 uppercase tracking-widest">{item.name}</p>
                            <p className="text-[8px] text-teal-400 font-black uppercase mt-1">Tap to use</p>
                         </div>
                      </motion.button>
                    );
                  })
                )}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PetActionButton({ icon, label, color, onClick }: { icon: React.ReactNode; label: string; color: string; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${color} p-6 rounded-[35px] border-4 border-white/20 shadow-xl flex flex-col items-center gap-2 group transition-all`}
    >
       <div className="text-white drop-shadow-lg group-hover:scale-110 transition-transform">
          {icon}
       </div>
       <span className="text-[10px] font-black text-white uppercase tracking-widest">{label}</span>
    </motion.button>
  );
}
