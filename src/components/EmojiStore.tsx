import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGame } from '../store/GameContext';
import { EMOJI_CHARACTERS, EmojiCharacter, CharacterRarity } from '../types';
import { Button, Card } from './ui/GameUI';
import { AvatarRenderer } from './AvatarRenderer';
import { ShoppingBag, Star, Sparkles, Filter, X, Gem, CheckCircle2 } from 'lucide-react';

interface EmojiStoreProps {
  onClose: () => void;
}

export function EmojiStore({ onClose }: EmojiStoreProps) {
  const { gameState, buyCharacter, equipCharacter } = useGame();
  const [activeCategory, setActiveCategory] = useState<EmojiCharacter['category'] | 'all'>('all');
  const [selectedCharacter, setSelectedCharacter] = useState<EmojiCharacter | null>(null);

  const categories: { id: EmojiCharacter['category'] | 'all', label: string, icon: string }[] = [
    { id: 'all', label: 'All', icon: '🌈' },
    { id: 'explorer', label: 'Explorers', icon: '🤠' },
    { id: 'fantasy', label: 'Fantasy', icon: '🧙' },
    { id: 'space', label: 'Space', icon: '🚀' },
    { id: 'animal', label: 'Animals', icon: '🦊' },
    { id: 'spirit', label: 'Spirits', icon: '✨' },
  ];

  const filteredCharacters = EMOJI_CHARACTERS.filter(char => 
    activeCategory === 'all' || char.category === activeCategory
  );

  const isOwned = (id: string) => gameState.ownedCharacters.includes(id);
  const isEquipped = (id: string) => gameState.avatar?.characterId === id;

  const getRarityColor = (rarity: CharacterRarity) => {
    switch (rarity) {
      case 'common': return 'border-slate-400 text-slate-400 bg-slate-400/10';
      case 'rare': return 'border-blue-400 text-blue-400 bg-blue-400/10';
      case 'epic': return 'border-purple-400 text-purple-400 bg-purple-400/10';
      case 'legendary': return 'border-yellow-400 text-yellow-400 bg-yellow-400/10 shadow-[0_0_15px_rgba(250,204,21,0.4)]';
      default: return 'border-slate-400 text-slate-400';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-indigo-950/80 backdrop-blur-xl flex flex-col p-6"
    >
      {/* STORE HEADER */}
      <div className="max-w-7xl w-full mx-auto flex justify-between items-center mb-10">
         <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-indigo-500 rounded-3xl flex items-center justify-center text-white shadow-2xl">
               <ShoppingBag size={42} />
            </div>
            <div>
               <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter">Explorer Vault</h1>
               <p className="text-white/40 font-black uppercase text-xs tracking-[0.3em]">Unlock premium emoji characters</p>
            </div>
         </div>

         <div className="flex items-center gap-6">
            <div className="bg-black/40 px-8 py-5 rounded-[30px] border-2 border-white/10 flex items-center gap-4 shadow-inner">
               <Gem size={32} className="text-yellow-400 fill-yellow-400" />
               <span className="text-4xl font-black text-white italic tracking-tighter leading-none">{gameState.gems}</span>
            </div>
            <button 
              onClick={onClose}
              className="w-20 h-20 bg-white/5 hover:bg-red-500/20 text-white hover:text-red-400 rounded-3xl flex items-center justify-center transition-all border-2 border-white/10 hover:border-red-500/50"
            >
               <X size={42} />
            </button>
         </div>
      </div>

      {/* CATEGORY SELECTOR */}
      <div className="max-w-7xl w-full mx-auto flex gap-4 mb-10 overflow-x-auto no-scrollbar pb-2">
         {categories.map(cat => (
           <button
             key={cat.id}
             onClick={() => setActiveCategory(cat.id)}
             className={`px-8 py-4 rounded-[25px] flex items-center gap-4 font-black uppercase tracking-widest transition-all border-4 whitespace-nowrap ${
               activeCategory === cat.id 
                 ? 'bg-indigo-500 border-white/30 text-white shadow-xl scale-105' 
                 : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10'
             }`}
           >
             <span className="text-2xl">{cat.icon}</span>
             {cat.label}
           </button>
         ))}
      </div>

      {/* CHARACTER GRID */}
      <div className="max-w-7xl w-full mx-auto flex-1 overflow-y-auto no-scrollbar pr-2 pb-10">
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {filteredCharacters.map(char => (
              <motion.div
                key={char.id}
                layoutId={`char-${char.id}`}
                whileHover={{ y: -10, scale: 1.02 }}
                onClick={() => setSelectedCharacter(char)}
                className={`relative bg-white/5 border-4 rounded-[45px] p-8 cursor-pointer group transition-all flex flex-col items-center ${
                  isEquipped(char.id) ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/5 hover:border-white/20'
                }`}
              >
                 {isOwned(char.id) && (
                   <div className="absolute top-6 right-6 text-indigo-400">
                      <CheckCircle2 size={28} />
                   </div>
                 )}
                 <div className={`absolute top-6 left-6 px-3 py-1 rounded-full border-2 text-[8px] font-black uppercase tracking-widest ${getRarityColor(char.rarity)}`}>
                    {char.rarity}
                 </div>
                 
                 <div className="w-40 h-40 mt-6 flex items-center justify-center">
                    <AvatarRenderer 
                      avatar={{ characterId: char.id, expression: 'happy' }} 
                      size="lg" 
                    />
                 </div>

                 <div className="mt-8 text-center">
                    <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none mb-2">{char.name}</h3>
                    <div className="flex items-center justify-center gap-2">
                       {isOwned(char.id) ? (
                          <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{isEquipped(char.id) ? 'Equipped' : 'Purchased'}</span>
                       ) : (
                          <div className="flex items-center gap-2">
                             <Gem size={14} className="text-yellow-400 fill-yellow-400" />
                             <span className="text-xl font-black text-white italic tracking-tighter">{char.price}</span>
                          </div>
                       )}
                    </div>
                 </div>

                 {/* Hover Effect Glow */}
                 <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[45px]" />
              </motion.div>
            ))}
         </div>
      </div>

      {/* CHARACTER DETAIL MODAL */}
      <AnimatePresence>
         {selectedCharacter && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-md flex items-center justify-center p-6"
             onClick={() => setSelectedCharacter(null)}
           >
             <motion.div
               initial={{ scale: 0.9, y: 50, rotateX: 20 }}
               animate={{ scale: 1, y: 0, rotateX: 0 }}
               exit={{ scale: 0.9, y: 50 }}
               onClick={(e) => e.stopPropagation()}
               className="bg-[#0f111a] w-full max-w-2xl rounded-[60px] border-4 border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col items-center p-14 relative"
             >
                {/* Close Button */}
                <button 
                  onClick={() => setSelectedCharacter(null)}
                  className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white"
                >
                   <X />
                </button>

                <div className="relative mb-12">
                   <div className="absolute inset-0 bg-white blur-[100px] opacity-10 animate-pulse rounded-full" />
                   <div className="w-64 h-64 flex items-center justify-center relative z-10">
                      <AvatarRenderer 
                        avatar={{ characterId: selectedCharacter.id, expression: 'happy' }} 
                        size="giant" 
                      />
                   </div>
                </div>

                <div className="text-center mb-12 relative z-10">
                   <div className="inline-block">
                      <span className={`px-4 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest inline-block mb-3 ${getRarityColor(selectedCharacter.rarity)}`}>
                         {selectedCharacter.rarity} Explorer
                      </span>
                      <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">{selectedCharacter.name}</h2>
                      <p className="mt-4 text-white/50 text-sm leading-relaxed font-medium px-4">
                         {selectedCharacter.description}
                      </p>
                   </div>
                </div>

                <div className="relative z-10 w-full space-y-4">
                   {isOwned(selectedCharacter.id) ? (
                      <Button
                         variant="primary"
                         className={`w-full py-6 text-xl rounded-2xl flex items-center justify-center gap-3 ${isEquipped(selectedCharacter.id) ? 'bg-white/10 opacity-50 cursor-default' : ''}`}
                         onClick={() => !isEquipped(selectedCharacter.id) && equipCharacter(selectedCharacter.id)}
                      >
                         {!isEquipped(selectedCharacter.id) && <Sparkles size={24} />}
                         {isEquipped(selectedCharacter.id) ? 'Active Character' : 'Equip Character'}
                      </Button>
                   ) : (
                      <Button
                         variant="primary"
                         className="w-full py-6 text-2xl font-black italic rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-600 hover:from-yellow-300 hover:to-amber-500 shadow-[0_10px_30px_rgba(251,191,36,0.3)] text-black flex items-center justify-center gap-3"
                         onClick={() => buyCharacter(selectedCharacter.id)}
                         disabled={gameState.gems < selectedCharacter.price}
                      >
                         <Gem size={32} />
                         Buy for {selectedCharacter.price} Gems
                      </Button>
                   )}
                   <Button
                      variant="ghost"
                      className="w-full py-5 text-white/50"
                      onClick={() => setSelectedCharacter(null)}
                   >
                      Keep Looking
                   </Button>
                </div>
             </motion.div>
           </motion.div>
         )}
      </AnimatePresence>
    </motion.div>
  );
}
