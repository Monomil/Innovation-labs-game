import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Star, Gem, Sparkles } from 'lucide-react';

interface LevelUpCelebrationProps {
  level: number;
  onClose: () => void;
}

export function LevelUpCelebration({ level, onClose }: LevelUpCelebrationProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 6000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-indigo-950/40 backdrop-blur-3xl">
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, opacity: 0 }}
        className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-12 rounded-[60px] shadow-[0_50px_100px_rgba(0,0,0,0.8)] border-8 border-white/20 text-center max-w-xl w-full"
      >
        {/* Background Sparkles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[60px]">
           {[...Array(20)].map((_, i) => (
             <motion.div
               key={i}
               animate={{
                 opacity: [0, 1, 0],
                 scale: [0.5, 1, 0.5],
                 y: [0, -200],
                 x: [Math.random() * 40 - 20, Math.random() * 40 - 20]
               }}
               transition={{
                 duration: 2 + Math.random() * 2,
                 repeat: Infinity,
                 delay: Math.random() * 2
               }}
               className="absolute text-yellow-300"
               style={{
                 left: `${Math.random() * 100}%`,
                 bottom: '0%'
               }}
             >
                <Star size={Math.random() * 24 + 12} fill="currentColor" />
             </motion.div>
           ))}
        </div>

        <div className="relative z-10">
           <motion.div
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ delay: 0.3 }}
             className="w-40 h-40 bg-white/20 backdrop-blur-xl rounded-[40px] flex items-center justify-center mx-auto mb-8 border-4 border-white/30 shadow-2xl"
           >
              <Trophy size={80} className="text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]" />
           </motion.div>

           <motion.h2
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ delay: 0.5 }}
             className="text-7xl font-black text-white italic uppercase tracking-tighter leading-none mb-2"
           >
              Level Up!
           </motion.h2>
           
           <motion.div
             initial={{ scale: 0 }}
             animate={{ scale: 1 }}
             transition={{ delay: 0.7, type: 'spring' }}
             className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-500 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
           >
              {level}
           </motion.div>

           <motion.p
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 1 }}
             className="text-xl font-black text-white/80 uppercase tracking-widest mt-8"
           >
              You're growing stronger!
           </motion.p>

           <div className="mt-8 flex justify-center gap-4">
              <RewardBadge icon={<Gem size={24} />} text="+100 Gems" color="bg-yellow-500" delay={1.2} />
              <RewardBadge icon={<Sparkles size={24} />} text="New Gear" color="bg-emerald-500" delay={1.4} />
           </div>

           <motion.button
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ delay: 1.8 }}
             onClick={onClose}
             className="mt-12 bg-white text-indigo-900 px-12 py-5 rounded-[30px] font-black uppercase italic tracking-tighter text-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl"
           >
              Awesome!
           </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

function RewardBadge({ icon, text, color, delay }: { icon: React.ReactNode; text: string; color: string; delay: number }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay }}
      className={`${color} text-white px-6 py-3 rounded-2xl flex items-center gap-2 border-2 border-white/20 shadow-lg`}
    >
       {icon}
       <span className="font-black uppercase tracking-widest text-[10px]">{text}</span>
    </motion.div>
  );
}
