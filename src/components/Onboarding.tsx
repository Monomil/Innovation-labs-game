import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Star, ChevronRight, Heart, BrainCircuit, ArrowRight } from 'lucide-react';
import { Button } from './ui/GameUI';
import { useGame } from '../store/GameContext';

interface OnboardingProps {
  onComplete: () => void;
  playerName: string;
}

export function Onboarding({ onComplete, playerName }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const { setAvatar } = useGame();

  const ONBOARDING_STEPS = [
    {
      id: 'welcome',
      title: "Welcome to AIZA World!",
      subtitle: "A magical universe designed for discovery and growth.",
      content: "Explore enchanted islands, meet magical companions, and learn the secrets of your own emotions through fun adventures!",
      icon: "✨",
      color: "from-indigo-500 to-purple-600"
    },
    {
      id: 'avatar',
      title: "Meet Your Explorer",
      subtitle: "Your journey starts with your first character.",
      content: "We've gifted you a default Explorer to start your journey. You can unlock many more in the Character Vault using the gems you earn!",
      icon: "🎒",
      color: "from-cyan-400 to-blue-500"
    },
    {
      id: 'missions',
      title: "Play & Learn",
      subtitle: "Complete challenges to earn magical gems.",
      content: "Every game you play helps you understand your feelings better. The more you explore, the more your magical powers grow!",
      icon: "🎮",
      color: "from-emerald-400 to-teal-500"
    }
  ];

  const currentStep = ONBOARDING_STEPS[step];

  const handleNext = () => {
    if (step < ONBOARDING_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-[#020314] overflow-hidden flex flex-col items-center justify-center p-8">
      {/* Cinematic Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1e1b4b_0%,#020314_100%)]" />
        <motion.div 
           animate={{ 
             scale: [1, 1.2, 1],
             opacity: [0.1, 0.2, 0.1]
           }}
           transition={{ duration: 10, repeat: Infinity }}
           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-indigo-500/10 blur-[150px] rounded-full"
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          className="relative z-10 w-full max-w-4xl flex flex-col items-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, y: -50 }}
            className="w-full bg-white/90 backdrop-blur-3xl rounded-[60px] p-20 border-4 border-white shadow-3xl flex flex-col items-center text-center"
          >
             <div className={`w-40 h-40 rounded-[40px] bg-gradient-to-br ${currentStep.color} flex items-center justify-center text-8xl mb-12 shadow-2xl`}>
                {currentStep.icon}
             </div>
             
             <h3 className="text-[14px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-4">{currentStep.subtitle}</h3>
             <h2 className="text-7xl font-black text-indigo-950 italic uppercase tracking-tighter mb-8 leading-[0.9]">{currentStep.title}</h2>
             <p className="text-xl text-indigo-900/60 font-medium max-w-2xl leading-relaxed mb-12">
                {currentStep.content}
             </p>

             <div className="flex flex-col w-full max-w-md gap-6">
                <Button size="xl" className="w-full h-24 text-3xl font-black italic uppercase tracking-tighter" onClick={handleNext}>
                   {step === ONBOARDING_STEPS.length - 1 ? "Start Adventure" : "Next Step"} <ChevronRight className="ml-4" size={32} />
                </Button>
                
                {/* Step Progress Dots */}
                <div className="flex justify-center gap-3 mt-4">
                   {ONBOARDING_STEPS.map((_, i) => (
                     <div key={i} className={`h-3 rounded-full transition-all duration-300 ${i === step ? 'w-12 bg-indigo-500' : 'w-3 bg-indigo-100'}`} />
                   ))}
                </div>
             </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Floating Sparkles Layer */}
      <div className="fixed inset-0 pointer-events-none">
         {[...Array(6)].map((_, i) => (
           <motion.div
             key={i}
             animate={{ 
               y: [0, -40, 0],
               opacity: [0.1, 0.4, 0.1],
               rotate: [0, 180, 360]
             }}
             transition={{ 
               duration: 5 + Math.random() * 5, 
               repeat: Infinity,
               delay: i * 0.5
             }}
             className="absolute text-5xl"
             style={{ 
               left: `${Math.random() * 100}%`, 
               top: `${Math.random() * 100}%` 
             }}
           >
              {i % 2 === 0 ? '✨' : '⭐'}
           </motion.div>
         ))}
      </div>
    </div>
  );
}
