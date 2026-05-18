/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { useState, useEffect } from 'react';
import { GameProvider, useGame } from './store/GameContext';
import { AizaLogo } from './components/AizaLogo';
import { IslandHub as Dashboard } from './components/IslandHub';
import { Journal } from './components/Journal';
import { ZoneScreen } from './components/ZoneScreen';
import { AdminAccess } from './components/AdminAccess';
import { AuthScreen } from './components/AuthScreen';
import { CinematicBackground } from './components/CinematicBackground';
import { AdventureMap } from './components/AdventureMap';
import { Zone, ZONES } from './types';

// New Game Components
// Removed old specific imports, will use ZoneScreen which handles everything

import { motion, AnimatePresence } from 'motion/react';

function GameContent() {
  const { gameState, isLoggedIn, setAvatar } = useGame();
  const [currentScreen, setCurrentScreen] = useState<string>('intro');
  const [selectedGameOrZoneId, setSelectedGameOrZoneId] = useState<string | null>(null);

  // Auto-detect if we should skip intro/tutorial if user already has a name/avatar
  useEffect(() => {
    if (currentScreen === 'intro') {
      const timer = setTimeout(() => {
        if (!isLoggedIn) {
          setCurrentScreen('auth');
        } else if (!gameState.avatar) {
          setCurrentScreen('avatar');
        } else {
          setCurrentScreen('dashboard');
        }
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [currentScreen, isLoggedIn, gameState.avatar]);

  useEffect(() => {
    if (isLoggedIn && currentScreen === 'auth') {
      setCurrentScreen('dashboard');
    }
    if (!isLoggedIn && currentScreen !== 'intro' && currentScreen !== 'auth') {
      setCurrentScreen('auth');
    }
  }, [isLoggedIn, currentScreen]);

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pendingScreen, setPendingScreen] = useState<string | null>(null);

  const transitionTo = (screen: string, zoneId?: string) => {
    setPendingScreen(screen);
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentScreen(screen);
      if (zoneId) setSelectedGameOrZoneId(zoneId);
      setIsTransitioning(false);
      setPendingScreen(null);
    }, 2000);
  };

  const handleBackToHub = () => {
    transitionTo('dashboard');
  };

  const handleBackToMap = () => {
    transitionTo('adventure');
  };

  const activeZone = ZONES.find(z => z.miniGameId === selectedGameOrZoneId || z.id === selectedGameOrZoneId);

  // Robust screen mapping
  const renderScreen = () => {
    try {
      if (currentScreen === "intro") {
        return (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.5, filter: 'blur(20px)' }}
            className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-[#020314] z-50 overflow-hidden"
          >
            <CinematicBackground />
            
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: 1,
                opacity: 1,
              }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="relative z-10"
            >
              <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] scale-150 rounded-full" />
              <AizaLogo size="xl" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-16 relative z-10 flex flex-col items-center gap-4"
            >
               <div className="w-64 h-1.5 bg-white/10 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                    className="h-full bg-gradient-to-r from-cyan-400 via-white to-pink-500 shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                  />
               </div>
               <p className="text-cyan-300 font-black uppercase tracking-[0.5em] text-xs filter drop-shadow-[0_0_5px_rgba(103,232,249,0.5)]">
                  Loading Magical Universe
               </p>
            </motion.div>
          </motion.div>
        );
      }

      if (currentScreen === "auth") return <AuthScreen onStart={() => {}} />;
      
      if (currentScreen === "dashboard") {
        return (
          <Dashboard 
            onSelectZone={(zone) => {
              transitionTo('game', zone.id);
            }}
            onOpenJournal={() => transitionTo('journal')}
            onOpenParentDash={() => transitionTo('admin')}
            onOpenMoodTracker={() => transitionTo('mood')} 
            onOpenAdventure={() => transitionTo('adventure')}
          />
        );
      }

      if (currentScreen === "adventure" || currentScreen === "adventureLand") {
        return (
          <div className="h-full w-full bg-[#1a1c4b] overflow-hidden">
            <AdventureMap 
              onBack={handleBackToHub} 
              onSelectZone={(zone) => {
                transitionTo('game', zone.id);
              }} 
            />
          </div>
        );
      }

      if (currentScreen === "game") {
        return (
          <div className="h-full bg-[#0a0a2a] overflow-hidden">
            {activeZone ? (
               <ZoneScreen zone={activeZone} onBack={handleBackToMap} />
            ) : (
               <div className="h-full flex flex-col items-center justify-center p-8 text-white bg-[#020314]">
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center"
                  >
                    <div className="text-9xl mb-8">🧭</div>
                    <h3 className="text-5xl font-black mb-6 italic uppercase tracking-tighter">Preparing your adventure...</h3>
                    <p className="text-white/40 mb-10 text-xl font-medium">Sit tight, Aiza is gathering the magical energies!</p>
                    <button 
                      onClick={handleBackToHub} 
                      className="bg-indigo-600 hover:bg-indigo-500 px-12 py-5 rounded-[40px] font-black uppercase italic tracking-tighter text-2xl shadow-[0_20px_50px_rgba(79,70,229,0.4)] transition-all active:scale-95"
                    >
                      Return to Map
                    </button>
                  </motion.div>
               </div>
            )}
          </div>
        );
      }

      if (currentScreen === "journal") return <Journal onBack={handleBackToHub} />;
      if (currentScreen === "admin") return <AdminAccess onBack={handleBackToHub} />;
      
      if (currentScreen === "shop") {
        return (
          <div className="h-full w-full bg-[#0a0a2a] p-8 flex flex-col items-center">
             <div className="max-w-4xl w-full">
                <div className="flex justify-between items-center mb-12">
                   <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter">PET SHOP</h2>
                   <button onClick={handleBackToHub} className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-black border border-white/10 transition-all">BACK</button>
                </div>
                <div className="bg-emerald-900/40 rounded-[40px] p-12 border-4 border-emerald-500/20 text-center">
                   <div className="text-8xl mb-8">🛍️</div>
                   <p className="text-emerald-400 font-black text-2xl uppercase tracking-widest">Store Coming Soon!</p>
                </div>
             </div>
          </div>
        );
      }

      if (currentScreen === "chat") {
        return (
          <div className="h-full w-full bg-[#0a0a2a] p-8 flex flex-col items-center">
             <div className="max-w-4xl w-full">
                <div className="flex justify-between items-center mb-12">
                   <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter">AIZA CHAT</h2>
                   <button onClick={handleBackToHub} className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-black border border-white/10 transition-all">BACK</button>
                </div>
                <div className="bg-cyan-900/40 rounded-[40px] p-12 border-4 border-cyan-500/20 text-center">
                   <div className="text-8xl mb-8">🦊</div>
                   <p className="text-cyan-400 font-black text-2xl uppercase tracking-widest">Let's talk about your feelings!</p>
                </div>
             </div>
          </div>
        );
      }

      if (currentScreen === "pet") {
        return (
          <div className="h-full w-full bg-[#0a0a2a] p-8 flex flex-col items-center">
             <div className="max-w-4xl w-full">
                <div className="flex justify-between items-center mb-12">
                   <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter">PET CARE</h2>
                   <button onClick={handleBackToHub} className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-black border border-white/10 transition-all">BACK</button>
                </div>
                <div className="bg-orange-900/40 rounded-[40px] p-12 border-4 border-orange-500/20 text-center">
                   <div className="text-8xl mb-8">🐾</div>
                   <p className="text-orange-400 font-black text-2xl uppercase tracking-widest">Your pet is resting!</p>
                </div>
             </div>
          </div>
        );
      }

      // Final fallthrough inside try
      return (
        <Dashboard 
          onSelectZone={(zone) => { setSelectedGameOrZoneId(zone.id); setCurrentScreen('game'); }}
          onOpenJournal={() => setCurrentScreen('journal')}
          onOpenParentDash={() => setCurrentScreen('admin')}
          onOpenMoodTracker={() => setCurrentScreen('mood')} 
          onOpenAdventure={() => setCurrentScreen('adventure')}
        />
      );
    } catch (err) {
      console.error("Screen render error:", err);
      return (
        <div className="h-full flex flex-col items-center justify-center p-8 text-white bg-indigo-900">
           <h1 className="text-4xl font-black mb-4">AIZA World is loading safely</h1>
           <p className="mb-8">Something went wrong, but we're here!</p>
           <button onClick={() => setCurrentScreen('dashboard')} className="bg-white text-indigo-900 px-8 py-3 rounded-full font-black">GO TO DASHBOARD</button>
        </div>
      );
    }
  };

  return (
    <div className="font-sans antialiased text-indigo-900 select-none overflow-hidden h-screen bg-[#0a0a2a] w-full flex flex-col">
      <main className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentScreen} 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="h-full w-full"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>

        {/* HQ TO ADVENTURE TRANSITION OVERLAY */}
        <AnimatePresence>
          {isTransitioning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[1000] flex flex-col items-center justify-center pointer-events-none"
            >
               {/* Cyber Portal Effect */}
               <motion.div 
                 initial={{ scale: 0, opacity: 0 }}
                 animate={{ scale: [0, 4, 10], opacity: [0, 1, 0] }}
                 transition={{ duration: 2, ease: "easeInOut" }}
                 className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 rounded-full blur-[100px]"
               />
               
               <motion.div
                 initial={{ opacity: 0, y: 50 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -50 }}
                 className="relative z-10 text-center"
               >
                  <div className="text-8xl mb-8 animate-bounce">⚡</div>
                  <h2 className="text-6xl font-black text-white italic uppercase tracking-tighter mb-4">
                    {pendingScreen === 'dashboard' ? 'Returning to HQ' : 'Initiating Portal...'}
                  </h2>
                  <div className="flex gap-2 justify-center">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        className="w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.8)]"
                      />
                    ))}
                  </div>
               </motion.div>

               {/* Grid Warp Lines */}
               <div className="absolute inset-0 flex justify-around pointer-events-none opacity-20">
                  {[...Array(10)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      exit={{ scaleY: 0 }}
                      className="w-px h-full bg-cyan-400 blur-[1px]"
                      style={{ left: `${i * 10}%` }}
                    />
                  ))}
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}
