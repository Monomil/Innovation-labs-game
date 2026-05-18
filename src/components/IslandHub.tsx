import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGame } from '../store/GameContext';
import { ZONES, Zone } from '../types';
import { Button, Card, FloatingElement } from './ui/GameUI';
import { 
  Gem, 
  Settings, 
  BookHeart, 
  Lock, 
  Trophy,
  Star,
  Home as HomeIcon,
  Sparkles,
  Sparkle,
  Palmtree,
  Flame,
  Cloud,
  Waves,
  TreePine,
  Music,
  Moon,
  HelpCircle,
  ShoppingBag,
  Map as MapIcon,
  BrainCircuit,
  Heart,
  X,
  MessageCircle,
  LayoutGrid,
  User,
  Activity,
  ArrowRight,
  Shirt
} from 'lucide-react';
import { AizaChatbot } from './AizaChatbot';
import { PetView } from './PetView';
import { PetShop } from './PetShop';
import { PetAdoptionModal } from './PetAdoptionModal';
import { MoodTracker } from './MoodTracker';
import { AdventureMap } from './AdventureMap';
import { GameIntroScreen } from './ui/GameIntroScreen';
import { Onboarding } from './Onboarding';
import { Compass, Gamepad2 } from 'lucide-react';
import { AizaLogo } from './AizaLogo';
import { EmojiStore } from './EmojiStore';
import { AvatarRenderer } from './AvatarRenderer';

const LucideIcons = {
  Palmtree,
  Flame,
  Cloud,
  Waves,
  TreePine,
  Music,
  Moon,
  HelpCircle,
  BrainCircuit,
  Star,
  Heart,
  Trophy,
  MapIcon
};

interface IslandHubProps {
  onSelectZone: (zone: Zone) => void;
  onOpenJournal: () => void;
  onOpenParentDash: () => void;
  onOpenMoodTracker: () => void;
  onOpenAdventure: () => void;
}

import { LevelUpCelebration } from './LevelUpCelebration';

export function IslandHub({ onSelectZone, onOpenJournal, onOpenParentDash, onOpenMoodTracker, onOpenAdventure }: IslandHubProps) {
  const { gameState, completeTutorial, showLevelUp, setShowLevelUp } = useGame();
  const [viewMode, setViewMode] = useState<'map' | 'cards'>('cards');
  const [activeTab, setActiveTab] = useState<'home' | 'games' | 'pet'>('home');
  const [showStore, setShowStore] = useState(false);
  const [showBadges, setShowBadges] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showMoodTracker, setShowMoodTracker] = useState(false);
  const [showAvatarCreator, setShowAvatarCreator] = useState(false);
  const [selectedZoneToStart, setSelectedZoneToStart] = useState<Zone | null>(null);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(gameState.firstTimeUser);

  const safePets = gameState?.pets || [];
  const safeProgress = gameState?.progress || [];
  const safeZones = ZONES || [];
  const activePet = safePets.find(p => p.id === gameState?.activePetId) || null;

  if (!gameState) {
    return <div className="h-full flex items-center justify-center bg-[#0a0a2a] text-white">AIZA World is loading safely...</div>;
  }

  // Trigger celebration when gems or XP increase significantly
  const prevGems = React.useRef(gameState.gems);
  useEffect(() => {
    if (gameState.gems > prevGems.current) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 5000);
      return () => clearTimeout(timer);
    }
    prevGems.current = gameState.gems;
  }, [gameState.gems]);

  return (
    <div className="h-full bg-[#020314] relative overflow-hidden flex flex-col font-sans text-white">
      {/* GALAXY HUB BACKGROUND */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#0a0c2e_0%,#020314_100%)]" />
        <AuroraEffect />
        <GalaxyParticles />
        <FloatingCrystals />
        {/* Cinematic Planet Orbs */}
        <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-600/10 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
               className="absolute inset-0 pt-32 px-10 flex flex-col items-center overflow-y-auto no-scrollbar pb-64"
            >
               <div className="max-w-[1400px] w-full flex flex-col gap-16">
                  
                  {/* FEATURE PORTALS - REDESIGNED GRID */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                     <PortalCard 
                       title="Adventure Land"
                       subtitle="Enter the Emotional Worlds"
                       icon={<MapIcon size={84} />}
                       gradient="from-blue-600 to-indigo-950"
                       borderColor="border-blue-400/50"
                       glowColor="shadow-[0_0_80px_rgba(37,99,235,0.3)]"
                       imageUrl="🌌"
                       onClick={onOpenAdventure}
                       progress={50}
                     />

                     <PortalCard 
                       title="Pet Sanctuary"
                       subtitle={activePet ? `Tending to ${activePet.name}` : "Companion Hub"}
                       icon={<Sparkle size={84} />}
                       gradient="from-amber-600 to-orange-950"
                       borderColor="border-amber-400/50"
                       glowColor="shadow-[0_0_80px_rgba(251,191,36,0.3)]"
                       imageUrl="✨"
                       onClick={() => setActiveTab('games')}
                     />

                     <PortalCard 
                       title="AIZA Core"
                       subtitle="Holographic Intelligence"
                       icon={<MessageCircle size={84} />}
                       gradient="from-cyan-600 to-blue-950"
                       borderColor="border-cyan-400/50"
                       glowColor="shadow-[0_0_80px_rgba(6,182,212,0.3)]"
                       imageUrl="💡"
                       onClick={() => setShowChat(true)}
                       isAnimated
                     />

                     <PortalCard 
                       title="Mood Hub"
                       subtitle="Emotional Telemetry"
                       icon={<Activity size={84} />}
                       gradient="from-rose-600 to-pink-950"
                       borderColor="border-rose-400/50"
                       glowColor="shadow-[0_0_80px_rgba(225,29,72,0.3)]"
                       imageUrl="📈"
                       onClick={() => setShowMoodTracker(true)}
                     />

                     <PortalCard 
                       title="The Archive"
                       subtitle="Soul Records & Journal"
                       icon={<BookHeart size={84} />}
                       gradient="from-purple-600 to-fuchsia-950"
                       borderColor="border-purple-400/50"
                       glowColor="shadow-[0_0_80px_rgba(147,51,234,0.3)]"
                       imageUrl="📔"
                       onClick={onOpenJournal}
                     />

                     <PortalCard 
                       title="Character Vault"
                       subtitle="Emoji Store & Customisation"
                       icon={<ShoppingBag size={84} />}
                       gradient="from-emerald-600 to-teal-950"
                       borderColor="border-emerald-400/50"
                       glowColor="shadow-[0_0_80px_rgba(16,185,129,0.3)]"
                       imageUrl="💎"
                       onClick={() => setShowStore(true)}
                       isAnimated
                     />
                  </div>

                  {/* CENTRAL COMMAND CHARACTER */}
                  <div className="flex flex-col items-center py-24 mb-12">
                     <motion.div
                       animate={{ 
                         y: [0, -20, 0],
                         scale: [1, 1.05, 1]
                       }}
                       transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                       className="relative group cursor-pointer"
                       onClick={() => setShowStore(true)}
                     >
                        {/* Holographic Base Ring */}
                        <div className="absolute top-[60%] left-1/2 -translate-x-1/2 w-80 h-80 border-[8px] border-cyan-400/10 rounded-full blur-xl animate-pulse" />
                        <div className="absolute top-[65%] left-1/2 -translate-x-1/2 w-64 h-64 border-4 border-cyan-400/30 rounded-full animate-spin-slow" />
                        
                        <AvatarRenderer 
                           avatar={gameState.avatar} 
                           size="giant"
                           className="relative z-10 drop-shadow-[0_20px_100px_rgba(129,140,248,0.5)]"
                        />
                        
                        <div className="absolute bottom-full mb-10 left-1/2 -translate-x-1/2 bg-white/5 backdrop-blur-3xl p-10 rounded-[50px] border-4 border-white/10 shadow-3xl min-w-[400px] text-center transform scale-100 group-hover:scale-105 transition-all">
                           <p className="text-white font-black text-2xl italic leading-tight tracking-tight">
                               "Welcome back, {gameState.playerName}! All systems ready for exploration. Where shall we head today?"
                           </p>
                           <div className="absolute top-full left-1/2 -translate-x-1/2 border-[20px] border-transparent border-t-white/10" />
                        </div>
                     </motion.div>
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'games' && (
            <motion.div 
               key="games" 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               className="inset-0 absolute overflow-hidden pt-32 px-6 flex flex-col items-center"
            >
              <div className="max-w-4xl w-full space-y-8">
                 <div className="text-center">
                    <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Mini-Games Hub</h2>
                    <p className="text-white/40 uppercase tracking-[0.3em] font-black text-[10px]">Optional challenges & Fun activities</p>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="cursor-pointer group"
                      onClick={onOpenAdventure}
                    >
                      <Card className="p-8 h-full border-white/10 group-hover:border-indigo-400 transition-all">
                        <div className="flex items-center gap-6">
                           <div className="w-20 h-20 bg-indigo-500 rounded-3xl flex items-center justify-center text-white text-3xl group-hover:scale-110 transition-transform">
                              🗺️
                           </div>
                           <div>
                              <h4 className="text-2xl font-black italic text-white uppercase tracking-tighter">Adventure Map</h4>
                              <p className="text-white/50 text-sm">The main story journey</p>
                           </div>
                        </div>
                      </Card>
                    </motion.div>

                    <Card className="p-8 opacity-50 cursor-not-allowed">
                       <div className="flex items-center gap-6">
                          <div className="w-20 h-20 bg-slate-700 rounded-3xl flex items-center justify-center text-white text-3xl">
                             🎮
                          </div>
                          <div>
                             <h4 className="text-2xl font-black italic text-white uppercase tracking-tighter">Arcade Mode</h4>
                             <p className="text-white/50 text-sm">Coming Soon</p>
                          </div>
                       </div>
                    </Card>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Top Header Section */}
      <div className="absolute top-0 inset-x-0 p-8 z-50 flex justify-between items-center pointer-events-none">
         <div className="flex items-center gap-10 pointer-events-auto">
            {/* LARGE PLAYER AVATAR SECTION */}
            <motion.div 
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={() => setShowStore(true)}
               className="flex items-center gap-10 bg-white/10 backdrop-blur-3xl pl-12 pr-16 py-8 rounded-[60px] border-4 border-white/20 shadow-[0_30px_80px_rgba(0,0,0,0.6)] cursor-pointer group transition-all hover:bg-white/20 hover:border-indigo-400/50"
            >
               <div className="relative">
                  <AvatarRenderer 
                    avatar={gameState.avatar} 
                    size="lg" 
                  />
                  <div className="absolute -bottom-4 -right-4 bg-indigo-500 p-4 rounded-[20px] border-2 border-white/20 shadow-lg group-hover:bg-indigo-400 transition-colors">
                     <Shirt size={24} className="text-white" />
                  </div>
               </div>
               
               <div className="flex flex-col">
                  <div className="flex items-center gap-5 mb-3">
                     <span className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none drop-shadow-xl">
                        {gameState.playerName || 'Explorer'}
                     </span>
                     <div className="px-5 py-2 bg-indigo-500/30 border-2 border-indigo-400/50 rounded-full">
                        <span className="text-[12px] font-black text-indigo-300 uppercase tracking-widest">Grand Master</span>
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                     <div className="flex flex-col items-start">
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1 italic">Experience Level</span>
                        <div className="flex items-center gap-3">
                           <span className="text-2xl font-black text-indigo-400 italic tracking-tighter leading-none">LVL {gameState.level}</span>
                           <div className="w-32 h-3 bg-white/10 rounded-full overflow-hidden border border-white/5 relative shadow-inner">
                              <motion.div 
                                className="h-full bg-gradient-to-r from-teal-400 via-indigo-400 to-purple-500 shadow-[0_0_10px_rgba(99,102,241,1)]" 
                                initial={{ width: 0 }}
                                animate={{ width: `${(gameState.xp % 500) / 5}%` }} 
                              />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </motion.div>
            
            <AizaLogo size="md" className="hidden lg:block h-28" />
          </div>

          <div className="flex items-center gap-6 pointer-events-auto">
            <div className="bg-indigo-950/60 backdrop-blur-3xl px-12 py-8 rounded-[60px] border-4 border-white/20 flex items-center gap-6 shadow-[0_30px_80px_rgba(0,0,0,1)] group cursor-help transition-all hover:scale-105 hover:bg-indigo-900/80 active:scale-95">
               <div className="relative">
                  <Gem size={48} className="text-yellow-400 fill-yellow-400 group-hover:rotate-12 transition-transform" />
                  <motion.div 
                    animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-yellow-400 blur-2xl rounded-full"
                  />
               </div>
               <span className="text-7xl font-black text-white italic tracking-tighter drop-shadow-2xl">{gameState.gems}</span>
            </div>
            <button 
              onClick={() => setShowBadges(true)}
              className="w-28 h-28 rounded-[60px] bg-white/10 backdrop-blur-md border-4 border-white/20 flex items-center justify-center text-white/50 hover:text-white transition-all shadow-3xl hover:bg-white/20 hover:border-white/40"
            >
              <Trophy size={48} />
            </button>
          </div>
      </div>

      {/* FIXED BOTTOM NAVIGATION BAR */}
      <div className="absolute bottom-10 inset-x-0 h-32 pointer-events-none flex items-center justify-center px-16 z-[100]">
         <div className="max-w-7xl w-full h-full bg-white/10 backdrop-blur-3xl border-4 border-white/30 rounded-[70px] shadow-[0_40px_100px_rgba(0,0,0,0.8)] flex justify-between items-center px-12 pointer-events-auto">
            <BottomNavItem icon={<HomeIcon size={36} />} label="World" active={activeTab === 'home'} onClick={() => { setActiveTab('home'); setShowChat(false); setShowMoodTracker(false); setShowStore(false); }} color="bg-indigo-600" />
            <BottomNavItem icon={<MapIcon size={36} />} label="Journey" onClick={onOpenAdventure} color="bg-blue-600" />
            <BottomNavItem icon={<Activity size={36} />} label="Emotion" active={showMoodTracker} onClick={() => setShowMoodTracker(true)} color="bg-teal-500" />
            <BottomNavItem icon={<Sparkles size={36} />} label="Companion" active={activeTab === 'home' && !!activePet} onClick={() => setActiveTab('home')} color="bg-orange-500" />
            <BottomNavItem icon={<MessageCircle size={36} />} label="Aiza" active={showChat} onClick={() => setShowChat(true)} color="bg-cyan-500" />
            <BottomNavItem icon={<BookHeart size={36} />} label="Journal" onClick={onOpenJournal} color="bg-rose-500" />
            <BottomNavItem icon={<ShoppingBag size={36} />} label="Vault" active={showStore} onClick={() => setShowStore(true)} color="bg-emerald-500" />
         </div>
      </div>

      {/* Overlay Modals & Systems */}
      <div className="pointer-events-auto">
        <AizaChatbot isOpen={showChat} onClose={() => setShowChat(false)} />
        
        <AnimatePresence>
          {showLevelUp && <LevelUpCelebration level={gameState.level} onClose={() => setShowLevelUp(false)} />}
          {showStore && <EmojiStore onClose={() => setShowStore(false)} />}
          {showOnboarding && <Onboarding playerName={gameState.playerName} onComplete={() => { setShowOnboarding(false); completeTutorial(); }} />}
          {showMoodTracker && <MoodTracker onClose={() => setShowMoodTracker(false)} />}
          {selectedZoneToStart && (
            <GameIntroScreen 
              zone={selectedZoneToStart} 
              onStart={() => {
                onSelectZone(selectedZoneToStart);
                setSelectedZoneToStart(null);
              }}
              onBack={() => {
                setSelectedZoneToStart(null);
                onOpenAdventure();
              }}
            />
          )}
          {safePets.length === 0 && <PetAdoptionModal />}
          
          {showBadges && (
            <Modal title="Explorer Records" onClose={() => setShowBadges(false)}>
              <div className="grid grid-cols-3 gap-4">
                 {[1, 2, 3, 4, 5, 6].map(i => (
                   <div key={i} className="aspect-square bg-white/5 border border-white/10 rounded-[30px] flex items-center justify-center opacity-40 grayscale">
                      <Star size={32} className="text-white/20" />
                   </div>
                 ))}
              </div>
            </Modal>
          )}
        </AnimatePresence>
      </div>

      {/* DISCRETE ADMIN ACCESS */}
      <div className="absolute bottom-1 right-1 z-[200] opacity-10 hover:opacity-100 transition-opacity">
         <button 
           onClick={onOpenParentDash}
           className="p-1 text-[8px] font-black text-white/40 uppercase tracking-widest flex items-center gap-1"
         >
            <Lock size={8} /> Admin Access
         </button>
      </div>
    </div>
  );
}

function PortalCard({ title, subtitle, icon, gradient, borderColor, glowColor, imageUrl, onClick, progress, badge, isAnimated }: { 
  title: string; 
  subtitle: string; 
  icon: React.ReactNode; 
  gradient: string; 
  borderColor: string;
  glowColor: string;
  imageUrl: string;
  onClick: () => void;
  progress?: number;
  badge?: string;
  isAnimated?: boolean;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -15 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative h-[480px] rounded-[80px] overflow-hidden border-4 shadow-3xl transition-all cursor-pointer group bg-gradient-to-br ${gradient} ${borderColor} ${glowColor} backdrop-blur-2xl`}
    >
       {/* Holographic Texture Overlay */}
       <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 group-hover:opacity-20 transition-opacity" />
       
       {/* Portal Rim Glow */}
       <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-1000 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.2),transparent_70%)]`} />

       <div className="relative p-14 h-full flex flex-col justify-between z-10 text-left">
          <div className="flex justify-between items-start">
             <motion.div 
               animate={{ rotate: [0, 5, -5, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
               className="w-32 h-32 bg-white/10 backdrop-blur-3xl rounded-[40px] flex items-center justify-center text-white shadow-[0_0_40px_rgba(255,255,255,0.3)] border-2 border-white/30 group-hover:scale-110 transition-transform"
             >
                {icon}
             </motion.div>
             {badge && (
                <div className="bg-white/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/20">
                   <span className="text-[12px] font-black text-white uppercase tracking-[0.2em]">{badge}</span>
                </div>
             )}
          </div>

          <div className="space-y-6">
             <div>
                <h3 className="text-6xl font-black text-white italic uppercase tracking-tighter leading-[0.9] mb-4 flex items-center gap-5">
                   {title}
                   <ArrowRight className="opacity-0 group-hover:opacity-100 -translate-x-8 group-hover:translate-x-0 transition-all duration-500" size={48} />
                </h3>
                <p className="text-white/50 font-black uppercase text-sm tracking-[0.3em] group-hover:text-white/80 transition-colors">{subtitle}</p>
             </div>
             
             {progress !== undefined && (
                <div className="w-full h-5 bg-black/40 rounded-full overflow-hidden border-2 border-white/10 relative shadow-inner">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${progress}%` }}
                     transition={{ duration: 1.5, ease: "circOut" }}
                     className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_30px_rgba(34,211,238,0.8)]" 
                   />
                </div>
             )}
          </div>
       </div>

       {/* Floating Holographic Asset */}
       <motion.div 
         animate={isAnimated ? { 
           y: [0, -40, 0], 
           rotate: [0, 15, -15, 0],
           scale: [1, 1.25, 1] 
         } : { 
           y: [0, -20, 0],
           rotate: [0, 10, -10, 0]
         }}
         transition={{ duration: 5 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" }}
         className="absolute top-12 right-6 text-[220px] opacity-10 group-hover:opacity-30 transition-opacity pointer-events-none filter blur-[4px] group-hover:blur-0"
       >
          {imageUrl}
       </motion.div>
    </motion.button>
  );
}

function GalaxyParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none">
       {[...Array(50)].map((_, i) => (
         <motion.div
           key={`p-${i}`}
           initial={{ 
             x: `${Math.random() * 100}%`, 
             y: `${Math.random() * 100}%`,
             opacity: Math.random() * 0.5,
             scale: Math.random()
           }}
           animate={{ 
             opacity: [0.1, 0.4, 0.1],
             scale: [0.5, 1, 0.5],
             y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`]
           }}
           transition={{ 
             duration: 10 + Math.random() * 20, 
             repeat: Infinity, 
             ease: "linear" 
           }}
           className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_8px_white]"
         />
       ))}
    </div>
  );
}

function FloatingCrystals() {
  return (
    <div className="absolute inset-0 pointer-events-none">
       {[...Array(6)].map((_, i) => (
         <motion.div
           key={`crystal-${i}`}
           initial={{ 
             x: `${Math.random() * 100}%`, 
             y: `${Math.random() * 100}%`,
             rotate: Math.random() * 360
           }}
           animate={{ 
             y: ['-10%', '110%'],
             rotate: [0, 360]
           }}
           transition={{ 
             duration: 40 + Math.random() * 60, 
             repeat: Infinity, 
             ease: "linear",
             delay: i * 5
           }}
           className="text-4xl opacity-5"
         >
           💎
         </motion.div>
       ))}
    </div>
  );
}


function BottomNavItem({ icon, label, active, onClick, color }: { icon: React.ReactNode; label: string; active?: boolean; onClick: () => void; color: string }) {
  return (
    <button 
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center h-full gap-2 group flex-1 transition-all duration-500`}
    >
       <div className={`w-20 h-20 rounded-[30px] flex items-center justify-center transition-all duration-500 ${
         active 
           ? `${color} text-white shadow-[0_20px_50px_rgba(0,0,0,0.6)] -translate-y-6 scale-125 ring-[6px] ring-white/30` 
           : 'text-white/30 hover:text-white/50 hover:scale-110'
       }`}>
          <div className={`${active ? 'drop-shadow-[0_0_12px_rgba(255,255,255,1)]' : ''}`}>
             {icon}
          </div>
          
          {active && (
             <motion.div 
               layoutId="nav-bg-glow"
               className={`absolute inset-0 ${color} blur-2xl opacity-20 -z-10`}
             />
          )}
       </div>
       <span className={`text-xs font-black uppercase tracking-[0.3em] transition-all font-display ${active ? 'text-white opacity-100' : 'text-white/20 opacity-0 group-hover:opacity-100'}`}>
          {label}
       </span>
    </button>
  );
}

function Modal({ title, onClose, children }: { title: string, onClose: () => void, children: React.ReactNode }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-indigo-950/60 backdrop-blur-md"
    >
      <motion.div 
        initial={{ y: 50, scale: 0.9 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 50, scale: 0.9 }}
        className="bg-white w-full max-w-lg rounded-[48px] shadow-2xl relative overflow-hidden"
      >
         <div className="bg-indigo-100/50 p-8 border-b-2 border-indigo-100 flex justify-between items-center">
            <h2 className="text-3xl font-black text-indigo-950 tracking-tight leading-none uppercase italic">{title}</h2>
            <button onClick={onClose} className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-indigo-950 shadow-md hover:bg-red-50 hover:text-red-500 transition-all border border-indigo-100">
               <X />
            </button>
         </div>
         <div className="p-8 max-h-[60vh] overflow-y-auto no-scrollbar">
            {children}
         </div>
      </motion.div>
    </motion.div>
  );
}

function QuickActionCard({ icon, title, subtitle, color, onClick }: { icon: React.ReactNode; title: string; subtitle: string; color: string; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="bg-white/5 backdrop-blur-3xl border-2 border-white/10 rounded-[40px] p-6 flex flex-col items-center gap-4 group transition-all hover:bg-white/10 hover:border-white/20 shadow-xl"
    >
       <div className={`w-20 h-20 rounded-3xl ${color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
          {icon}
       </div>
       <div className="text-center">
          <h4 className="text-lg font-black text-white italic tracking-tighter uppercase leading-none font-display">{title}</h4>
          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-1">{subtitle}</p>
       </div>
    </motion.button>
  );
}

function AuroraEffect() {
  return (
     <div className="absolute inset-0 opacity-40 pointer-events-none blur-[100px]">
        <motion.div 
           animate={{ 
             x: [-500, 500, -500],
             opacity: [0.1, 0.3, 0.1],
             rotate: [0, 10, 0],
             skew: [0, 10, 0]
           }}
           transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
           className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[conic-gradient(from_180deg_at_50%_50%,transparent_0%,rgba(99,102,241,0.25)_25%,transparent_50%,rgba(192,38,211,0.25)_75%,transparent_100%)]"
        />
        <motion.div 
           animate={{ 
             x: [500, -500, 500],
             opacity: [0.1, 0.2, 0.1],
             rotate: [0, -10, 0]
           }}
           transition={{ duration: 35, repeat: Infinity, ease: "easeInOut", delay: 5 }}
           className="absolute inset-0 bg-[#4f46e5]/10 blur-[150px]"
        />
     </div>
  );
}

function SparkleLayer() { return null; }
function CloudLayer() { return null; }
function FloatingIslands() { return null; }
function FireflyLayer() { return null; }
