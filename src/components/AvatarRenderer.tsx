import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Avatar, EMOJI_CHARACTERS } from '../types';

interface AvatarRendererProps {
  avatar?: Avatar | null;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'giant';
  className?: string;
  animate?: boolean;
}

export function AvatarRenderer({ avatar, size = 'md', className = '', animate = true }: AvatarRendererProps) {
  const character = EMOJI_CHARACTERS.find(c => c?.id === avatar?.characterId) || EMOJI_CHARACTERS[0];
  
  const sizeClasses = {
    sm: 'text-4xl w-12 h-12',
    md: 'text-7xl w-24 h-24',
    lg: 'text-[10rem] w-48 h-48',
    xl: 'text-[14rem] w-64 h-64',
    giant: 'text-[20rem] w-80 h-80'
  };

  const getExpressionEmoji = () => {
    if (!avatar) return character.emoji;
    // For specific expressions, we could overlay or swap emojis
    // But since character is a specific emoji, we'll just bounce it for now
    return character.emoji;
  };

  return (
    <div className={`relative flex items-center justify-center ${sizeClasses[size as keyof typeof sizeClasses]} ${className} group`}>
      {/* Background Aura */}
      {animate && (
        <motion.div 
          animate={{ 
            scale: [1, 1.4, 1],
            opacity: [0.1, 0.3, 0.1],
            rotate: [0, 90, 180, 270, 360]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-cyan-500/20 blur-3xl rounded-full -z-10"
        />
      )}

      {/* Main Emoji Character */}
      <motion.div
        animate={animate ? {
          y: [0, -15, 0],
          scale: [1, 1.05, 1],
          rotate: [0, 2, -2, 0]
        } : {}}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="relative z-10 flex items-center justify-center select-none filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)] transition-all group-hover:scale-110"
      >
        <span className="leading-none">{getExpressionEmoji()}</span>
        
        {/* Expression Indicator / Particles */}
        <AnimatePresence>
          {avatar?.expression === 'happy' && (
             <motion.div 
               initial={{ opacity: 0, scale: 0 }}
               animate={{ opacity: 1, scale: 1 }}
               className="absolute -top-4 -right-4 text-2xl"
             >
                ✨
             </motion.div>
          )}
        </AnimatePresence>

        {/* Shadow */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-2/3 h-4 bg-black/20 blur-xl rounded-full -z-10" />
      </motion.div>

      {/* Rarity Ring */}
      <div className={`absolute inset-[-10%] border-4 border-dashed rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000 animate-spin-slow 
        ${character.rarity === 'legendary' ? 'border-yellow-400' : 
          character.rarity === 'epic' ? 'border-purple-400' : 
          character.rarity === 'rare' ? 'border-blue-400' : 'border-white/10'}`} 
      />
    </div>
  );
}
