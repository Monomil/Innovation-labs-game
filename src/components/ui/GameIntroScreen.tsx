import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Play, Info, Trophy, Gem, Sparkles } from 'lucide-react';
import { Zone } from '../../types';

interface GameIntroScreenProps {
  zone: Zone;
  onStart: () => void;
  onBack: () => void;
}

export function GameIntroScreen({ zone, onStart, onBack }: GameIntroScreenProps) {
  return (
    <div className="fixed inset-0 z-[200] bg-indigo-950 flex items-center justify-center p-6 overflow-hidden">
      {/* Dynamic Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${zone.color} opacity-40`} />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
      
      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -1000],
            x: [0, (Math.random() - 0.5) * 200],
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 10 + Math.random() * 20,
            repeat: Infinity,
            delay: Math.random() * 10,
          }}
          className="absolute w-2 h-2 bg-white rounded-full blur-[2px]"
          style={{
            bottom: '-20px',
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-4xl w-full bg-white/10 backdrop-blur-3xl rounded-[60px] border-4 border-white/20 shadow-[0_40px_100px_rgba(0,0,0,0.6)] overflow-hidden relative"
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Visual Side */}
          <div className={`relative bg-gradient-to-br ${zone.color} p-12 flex flex-col items-center justify-center overflow-hidden`}>
            <div className="absolute inset-0 bg-white/10 skew-x-[-20deg] translate-x-20" />
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="text-[160px] relative z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
              {getZoneEmoji(zone.id)}
            </motion.div>
            
            <div className="mt-8 bg-white/20 backdrop-blur-xl px-8 py-3 rounded-full border border-white/30 relative z-10 shadow-xl">
               <span className="text-white font-black text-6xl uppercase italic tracking-tighter leading-none">READY?</span>
            </div>
          </div>

          {/* Info Side */}
          <div className="p-12 flex flex-col justify-between">
            <div>
               <div className="flex items-center gap-3 mb-4">
                  <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full border border-white/10">MISSION PREVIEW</span>
                  <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                       <Star key={i} size={14} className={i < zone.difficulty ? "text-yellow-400 fill-yellow-400" : "text-white/20"} />
                    ))}
                  </div>
               </div>

               <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none mb-4 font-display">{zone.name}</h2>
               <p className="text-indigo-100/70 font-medium text-lg leading-tight mb-8">{zone.description}</p>

               <div className="space-y-6">
                  <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
                     <div className="flex items-center gap-4 mb-4">
                        <Info className="text-teal-400" />
                        <span className="text-white font-black uppercase text-sm tracking-widest">How to Play</span>
                     </div>
                     <p className="text-white/90 text-sm font-bold leading-relaxed italic">
                        {getInstructions(zone.id)}
                     </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-white/5 rounded-2xl p-4 border border-white/10 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center text-indigo-900 shadow-lg">
                           <Gem size={20} />
                        </div>
                        <div>
                           <span className="block text-[10px] font-black text-white/40 uppercase tracking-widest">Reward</span>
                           <span className="text-xl font-black text-white">{zone.reward} Gems</span>
                        </div>
                     </div>
                     <div className="bg-white/5 rounded-2xl p-4 border border-white/10 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-teal-400 flex items-center justify-center text-indigo-900 shadow-lg">
                           <Sparkles size={20} />
                        </div>
                        <div>
                           <span className="block text-[10px] font-black text-white/40 uppercase tracking-widest">Growth</span>
                           <span className="text-xl font-black text-white">{zone.xpReward} XP</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="flex gap-4 mt-12">
               <button 
                 onClick={onBack}
                 className="flex-1 h-20 bg-white/5 text-white/60 hover:text-white rounded-[30px] font-black uppercase italic tracking-tighter text-xl border-2 border-white/10 hover:bg-white/10 transition-all"
               >
                  Cancel
               </button>
               <button 
                 onClick={onStart}
                 className="flex-[2] h-20 bg-gradient-to-r from-emerald-400 to-teal-500 text-indigo-950 rounded-[30px] font-black uppercase italic tracking-tighter text-3xl shadow-[0_10px_30px_rgba(52,211,153,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4"
               >
                  START <Play fill="currentColor" />
               </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function getZoneEmoji(id: string): string {
  const emojis: Record<string, string> = {
    'anger-volcano': '🌋',
    'confusion-forest': '🧠',
    'worry-hills': '☁️',
    'memory-meadow': '✨',
    'calm-beach': '🌊',
    'creature-village': '🏡',
    'festival-town': '🎵',
    'sleepy-valley': '🌙',
    'confidence-mountain': '🏔️',
    'reflection-bridge': '🌉'
  };
  return emojis[id] || '✨';
}

function getInstructions(id: string): string {
   const instructions: Record<string, string> = {
      'anger-volcano': 'Tap the bubbles when they appear to focus your breathing. Slow and steady wins the race!',
      'confusion-forest': 'Drag the lost emotion sparks to the matching pillars. Help the spirits find clarity!',
      'worry-hills': 'Tap the anxious clouds to drift them away and let the sun shine through your mind.',
      'memory-meadow': 'Flip the magic cards to find pairs of feelings. Sharpen your focus and win gems!',
      'calm-beach': 'Follow the rhythm of the waves to find your inner calm. A peaceful place to rest.',
      'creature-village': 'Perform acts of kindness for the local creatures to build trust and happiness.',
      'festival-town': 'Tap to the rhythm of the joy drums! Show your coordination at the great festival.',
      'sleepy-valley': 'Guide the stars to their constellations to help the valley fall into a peaceful sleep.',
      'confidence-mountain': 'Climb the peaks of positivity. Each kind word gives you the strength to reach the top!',
      'reflection-bridge': 'Walk the final path of wisdom by reflecting on everything you have learned.'
   };
   return instructions[id] || 'Focus your mind, follow the signs, and have fun exploring!';
}
