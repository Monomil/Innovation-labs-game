import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, X, Gem, Sparkles, ChevronRight } from 'lucide-react';
import { useGame } from '../store/GameContext';
import { PET_ITEMS } from '../constants/petItems';
import { COSMETIC_ITEMS } from '../constants/cosmeticItems';
import { PetItem, CosmeticItem } from '../types';

export function PetShop({ onClose }: { onClose: () => void }) {
  const { gameState, buyPetItem, buyCosmeticItem } = useGame();
  const [activeShop, setActiveShop] = useState<'pet' | 'avatar'>('pet');
  const [filter, setFilter] = useState<'all' | 'food' | 'toy' | 'grooming'>('all');

  const filteredPetItems = PET_ITEMS.filter(item => 
    filter === 'all' || item.type === filter
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
        className="relative w-full max-w-4xl max-h-[85vh] bg-[#0a0a2a] border-4 border-white/10 rounded-[60px] shadow-[0_50px_100px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className={`p-8 bg-gradient-to-r ${activeShop === 'pet' ? 'from-emerald-600 to-teal-600' : 'from-indigo-600 to-purple-600'} flex justify-between items-center relative overflow-hidden flex-shrink-0 transition-all duration-500`}>
           <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]" />
           <div className="relative z-10 flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center border border-white/30 rotate-3">
                 <ShoppingBag size={32} className="text-white" />
              </div>
              <div>
                 <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">
                    {activeShop === 'pet' ? 'Magic Pet Store' : 'Avatar Boutique'}
                 </h2>
                 <p className="text-white/60 text-sm font-bold tracking-widest mt-1">
                    {activeShop === 'pet' ? 'Gifts for your loyal companions' : 'The latest in island fashion'}
                 </p>
              </div>
           </div>
           
           <div className="relative z-10 flex items-center gap-3">
              <div className="bg-black/20 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-2">
                 <Gem size={20} className="text-yellow-400 fill-yellow-400" />
                 <span className="text-2xl font-black text-white italic tracking-tighter">{gameState.gems}</span>
              </div>
              <button onClick={onClose} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all text-white">
                 <X size={24} />
              </button>
           </div>
        </div>

        {/* Shop Switcher */}
        <div className="flex bg-white/5 p-2 gap-2 flex-shrink-0">
           <button 
             onClick={() => setActiveShop('pet')}
             className={`flex-1 py-4 rounded-3xl font-black uppercase tracking-widest text-xs transition-all ${activeShop === 'pet' ? 'bg-emerald-500 text-white' : 'text-white/40 hover:bg-white/10'}`}
           >
              Pet Supplies
           </button>
           <button 
             onClick={() => setActiveShop('avatar')}
             className={`flex-1 py-4 rounded-3xl font-black uppercase tracking-widest text-xs transition-all ${activeShop === 'avatar' ? 'bg-indigo-500 text-white' : 'text-white/40 hover:bg-white/10'}`}
           >
              Avatar Gear
           </button>
        </div>

        {/* Filter Navigation (Only for Pet Shop) */}
        {activeShop === 'pet' && (
          <div className="p-6 bg-white/5 border-b border-white/10 flex gap-4 overflow-x-auto no-scrollbar flex-shrink-0">
             {(['all', 'food', 'toy', 'grooming'] as const).map((f) => (
               <button
                 key={f}
                 onClick={() => setFilter(f)}
                 className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
                   filter === f ? 'bg-white text-indigo-950' : 'bg-white/5 text-white/40 hover:bg-white/10'
                 }`}
               >
                 {f}
               </button>
             ))}
          </div>
        )}

        {/* Item Grid */}
        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 no-scrollbar">
           {activeShop === 'pet' ? (
             filteredPetItems.map((item) => (
               <ShopItem key={item.id} item={item} onBuy={() => buyPetItem(item.id)} gems={gameState.gems} />
             ))
           ) : (
             COSMETIC_ITEMS.map((item) => (
               <CosmeticShopItem key={item.id} item={item} onBuy={() => buyCosmeticItem(item.id)} gems={gameState.gems} owned={gameState.inventory.includes(item.id)} />
             ))
           )}
        </div>
      </motion.div>
    </div>
  );
}

function CosmeticShopItem({ item, onBuy, gems, owned }: { item: CosmeticItem, onBuy: () => void, gems: number, owned: boolean, key?: string }) {
  const isAffordable = gems >= item.price;

  return (
    <motion.div 
       whileHover={{ y: -5 }}
       className={`bg-white/5 border-2 border-white/10 rounded-[40px] p-6 flex flex-col gap-4 group hover:border-indigo-500/50 transition-all shadow-xl ${owned ? 'opacity-60' : ''}`}
    >
       <div className="flex justify-between items-start">
          <div className="w-16 h-16 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
             {item.icon}
          </div>
          <div className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-[8px] font-black uppercase tracking-widest">
             {item.category}
          </div>
       </div>

       <div>
          <h4 className="text-lg font-black text-white uppercase tracking-tighter leading-tight mb-1">{item.name}</h4>
          <p className="text-[10px] text-white/40 font-bold leading-tight">Add some style to your explorer.</p>
       </div>

       <div className="mt-auto pt-4 flex flex-col gap-4">
          <button
            onClick={onBuy}
            disabled={!isAffordable || owned}
            className={`w-full h-14 rounded-[24px] flex items-center justify-between px-6 transition-all active:scale-95 ${
              owned ? 'bg-white/10 text-white/40 cursor-default' :
              isAffordable 
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
            }`}
          >
             <div className="flex items-center gap-2">
                {!owned && <Gem size={18} className={isAffordable ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'} />}
                <span className="text-xl font-black italic tracking-tighter">{owned ? 'OWNED' : item.price}</span>
             </div>
             <div className="flex items-center gap-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{owned ? 'ALREADY YOURS' : isAffordable ? 'PURCHASE' : 'LOCKED'}</span>
                {!owned && isAffordable && <ChevronRight size={16} />}
             </div>
          </button>
       </div>
    </motion.div>
  );
}

function ShopItem({ item, onBuy, gems }: { item: PetItem, onBuy: () => void, gems: number, key?: string }) {
  const isAffordable = gems >= item.cost;

  return (
    <motion.div 
       whileHover={{ y: -5 }}
       className="bg-white/5 border-2 border-white/10 rounded-[40px] p-6 flex flex-col gap-4 group hover:border-emerald-500/50 transition-all shadow-xl"
    >
       <div className="flex justify-between items-start">
          <div className="w-16 h-16 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
             {item.icon}
          </div>
          <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
            item.category === 'all' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-yellow-500/20 text-yellow-400'
          }`}>
             {item.category === 'all' ? 'Universal' : `${item.category} Only`}
          </div>
       </div>

       <div>
          <h4 className="text-lg font-black text-white uppercase tracking-tighter leading-tight mb-1">{item.name}</h4>
          <p className="text-[10px] text-white/40 font-bold leading-tight">{item.description}</p>
       </div>

       <div className="mt-auto pt-4 flex flex-col gap-4">
          <div className="flex items-center gap-2">
             <div className="flex-1 h-[2px] bg-white/5" />
             <div className="flex items-center gap-1 text-emerald-400">
                <Sparkles size={12} />
                <span className="text-[10px] font-black uppercase tracking-widest">+Stats Reward</span>
             </div>
             <div className="flex-1 h-[2px] bg-white/5" />
          </div>
          
          <button
            onClick={onBuy}
            disabled={!isAffordable}
            className={`w-full h-14 rounded-[24px] flex items-center justify-between px-6 transition-all active:scale-95 ${
              isAffordable 
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg' 
                : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
            }`}
          >
             <div className="flex items-center gap-2">
                <Gem size={18} className={isAffordable ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'} />
                <span className="text-xl font-black italic tracking-tighter">{item.cost}</span>
             </div>
             <div className="flex items-center gap-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{isAffordable ? 'PURCHASE' : 'LOCKED'}</span>
                {isAffordable && <ChevronRight size={16} />}
             </div>
          </button>
       </div>
    </motion.div>
  );
}
