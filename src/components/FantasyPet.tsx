import React from 'react';
import { motion } from 'motion/react';

interface FantasyPetProps {
  type: 'cat' | 'dog' | 'rabbit';
  action?: 'idle' | 'eat' | 'sleep' | 'play';
  mood?: 'happy' | 'sad' | 'neutral';
}

export function FantasyPet({ type, action = 'idle', mood = 'happy' }: FantasyPetProps) {
  const getPetColors = () => {
    switch (type) {
      case 'cat': return { primary: '#60A5FA', secondary: '#3B82F6', accent: '#DBEAFE' };
      case 'dog': return { primary: '#FDBA74', secondary: '#F97316', accent: '#FFEDD5' };
      case 'rabbit': return { primary: '#D1D5DB', secondary: '#9CA3AF', accent: '#F3F4F6' };
      default: return { primary: '#818CF8', secondary: '#4F46E5', accent: '#E0E7FF' };
    }
  };

  const colors = getPetColors();

  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
       <motion.div
         animate={action === 'idle' ? {
           y: [0, -10, 0],
           scale: [1, 1.05, 1]
         } : action === 'eat' ? {
           scale: [1, 1.1, 1, 1.1, 1],
           rotate: [0, 5, -5, 5, 0]
         } : action === 'sleep' ? {
           scale: [1, 0.95, 1],
           opacity: [1, 0.8, 1]
         } : {}}
         transition={{ 
           duration: action === 'sleep' ? 4 : 2, 
           repeat: Infinity,
           ease: "easeInOut"
         }}
         className="relative w-48 h-48"
       >
          {/* Main Body */}
          <div className="absolute inset-4 rounded-[40%] shadow-2xl border-b-8 border-black/10 overflow-hidden" 
               style={{ backgroundColor: colors.primary, backgroundImage: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}>
             {/* Fur Texture / Shading */}
             <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,white_0%,transparent_50%)]" />
             
             {/* Belly */}
             <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-24 h-24 bg-white/30 rounded-full" />
          </div>

          {/* Ears */}
          <PetEars type={type} color={colors.secondary} action={action} />

          {/* Face */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-20 z-20 flex justify-center items-center gap-10">
             <PetEyes mood={mood} action={action} color={colors.secondary} />
             <PetNose type={type} />
          </div>

          {/* Tail */}
          <PetTail type={type} color={colors.secondary} action={action} />
       </motion.div>

       {/* Zzz for sleep */}
       {action === 'sleep' && (
         <motion.div
           animate={{ y: [0, -100], x: [0, 20], opacity: [0, 1, 0], scale: [0.5, 1.5] }}
           transition={{ duration: 3, repeat: Infinity }}
           className="absolute top-0 right-0 text-3xl font-black text-indigo-400"
         >
           Zzz
         </motion.div>
       )}
    </div>
  );
}

function PetEars({ type, color, action }: { type: string; color: string; action: string }) {
  const isRabbit = type === 'rabbit';
  const isCat = type === 'cat';
  
  return (
    <>
       {/* Left Ear */}
       <motion.div 
         animate={action === 'sleep' ? { rotate: [-10, -5, -10] } : { rotate: [-5, 5, -5] }}
         transition={{ duration: 3, repeat: Infinity }}
         className={`absolute top-0 left-8 h-20 bg-indigo-500 rounded-t-full shadow-lg origin-bottom`}
         style={{ 
            backgroundColor: color,
            width: isRabbit ? '20px' : '30px', 
            height: isRabbit ? '80px' : '40px',
            borderRadius: isCat ? '50% 50% 0 0' : '40% 40% 0 0'
         }} 
       />
       {/* Right Ear */}
       <motion.div 
         animate={action === 'sleep' ? { rotate: [10, 5, 10] } : { rotate: [5, -5, 5] }}
         transition={{ duration: 3.5, repeat: Infinity }}
         className={`absolute top-0 right-8 h-20 bg-indigo-500 rounded-t-full shadow-lg origin-bottom`}
         style={{ 
            backgroundColor: color,
            width: isRabbit ? '20px' : '30px', 
            height: isRabbit ? '80px' : '40px',
            borderRadius: isCat ? '50% 50% 0 0' : '40% 40% 0 0'
         }} 
       />
    </>
  );
}

function PetEyes({ mood, action, color }: { mood: string; action: string; color: string }) {
  const isAsleep = action === 'sleep';
  
  return (
    <div className="flex gap-12">
       {/* Left Eye */}
       <div className="relative">
          {isAsleep ? (
            <div className="w-8 h-1 bg-black/40 rounded-full mt-4" />
          ) : (
            <motion.div 
              animate={{ height: [12, 12, 2, 12] }}
              transition={{ duration: 4, repeat: Infinity, times: [0, 0.9, 0.95, 1] }}
              className="w-12 h-12 bg-white rounded-full border-4 border-black/10 overflow-hidden relative"
            >
               <motion.div 
                 animate={{ x: [-2, 2, -2] }}
                 transition={{ duration: 3, repeat: Infinity }}
                 className="absolute top-2 left-2 w-6 h-6 bg-slate-900 rounded-full"
               >
                  <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full" />
               </motion.div>
            </motion.div>
          )}
       </div>
       {/* Right Eye */}
       <div className="relative">
          {isAsleep ? (
            <div className="w-8 h-1 bg-black/40 rounded-full mt-4" />
          ) : (
            <motion.div 
              animate={{ height: [12, 12, 2, 12] }}
              transition={{ duration: 4.2, repeat: Infinity, times: [0, 0.9, 0.95, 1] }}
              className="w-12 h-12 bg-white rounded-full border-4 border-black/10 overflow-hidden relative"
            >
               <motion.div 
                 animate={{ x: [-2, 2, -2] }}
                 transition={{ duration: 3.2, repeat: Infinity }}
                 className="absolute top-2 left-2 w-6 h-6 bg-slate-900 rounded-full"
               >
                  <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full" />
               </motion.div>
            </motion.div>
          )}
       </div>
    </div>
  );
}

function PetNose({ type }: { type: string }) {
  return (
    <div className="absolute left-1/2 top-[70%] -translate-x-1/2 flex flex-col items-center">
       <div className="w-6 h-4 bg-pink-400 rounded-full shadow-inner" />
       {type === 'cat' && (
         <div className="w-8 h-4 border-b-2 border-slate-900/20 rounded-full mt-[-2px]" />
       )}
    </div>
  );
}

function PetTail({ type, color, action }: { type: string; color: string; action: string }) {
  return (
    <motion.div
      animate={action === 'sleep' ? { rotate: [-5, 5, -5] } : { rotate: [-20, 20, -20] }}
      transition={{ duration: 2.5, repeat: Infinity }}
      className="absolute bottom-4 -right-4 h-24 w-8 rounded-full origin-top z-0"
      style={{ 
        backgroundColor: color,
        borderRadius: type === 'rabbit' ? '50%' : '20px 20px 40px 40px',
        width: type === 'rabbit' ? '30px' : '25px',
        height: type === 'rabbit' ? '30px' : '80px'
      }}
    />
  );
}
