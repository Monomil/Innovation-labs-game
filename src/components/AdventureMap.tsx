import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  Lock, 
  Star, 
  Map as MapIcon, 
  HelpCircle,
  BrainCircuit,
  Flame,
  Cloud,
  Moon,
  Trophy,
  ArrowRight,
  Gem,
  Waves,
  Heart,
  Music,
  TreePine,
  Palmtree,
  ArrowLeft
} from 'lucide-react';
import { ZONES, Zone } from '../types';
import { useGame } from '../store/GameContext';

const LucideIcons = {
  Flame,
  Cloud,
  BrainCircuit,
  Star,
  Waves,
  Heart,
  Music,
  Moon,
  Trophy,
  MapIcon,
  HelpCircle,
  TreePine,
  Palmtree
};

interface AdventureMapProps {
  onBack: () => void;
  onSelectZone: (zone: Zone) => void;
}

const adventureZones = [
  { id: "angerVolcano", title: "Anger Volcano", emoji: "🌋", x: 12, y: 18, color: "#ff4b2b" },
  { id: "worryCloudHills", title: "Worry Cloud Hills", emoji: "☁️", x: 38, y: 15, color: "#7aa7ff" },
  { id: "confusionForest", title: "Confusion Forest", emoji: "🌲", x: 65, y: 20, color: "#15b66d" },
  { id: "memoryMeadow", title: "Memory Meadow", emoji: "🌼", x: 20, y: 45, color: "#ffe45c" },
  { id: "calmBeach", title: "Calm Beach", emoji: "🏖️", x: 48, y: 48, color: "#00c9c8" },
  { id: "creatureVillage", title: "Creature Village", emoji: "🏡", x: 75, y: 45, color: "#ff9f43" },
  { id: "festivalTown", title: "Festival Town", emoji: "🎵", x: 18, y: 72, color: "#d946ef" },
  { id: "sleepyValley", title: "Sleepy Valley", emoji: "🌙", x: 45, y: 76, color: "#6d5dfc" },
  { id: "confidenceMountain", title: "Confidence Mountain", emoji: "⛰️", x: 70, y: 73, color: "#facc15" },
  { id: "finalEmotionBridge", title: "Final Emotion Bridge", emoji: "🌈", x: 90, y: 88, color: "#ffffff" }
];

const zoneIdMapping: Record<string, string> = {
  angerVolcano: 'anger-volcano',
  worryCloudHills: 'worry-hills',
  confusionForest: 'confusion-forest',
  memoryMeadow: 'memory-meadow',
  calmBeach: 'calm-beach',
  creatureVillage: 'creature-village',
  festivalTown: 'festival-town',
  sleepyValley: 'sleepy-valley',
  confidenceMountain: 'confidence-mountain',
  finalEmotionBridge: 'reflection-bridge'
};

export function AdventureMap({ onBack, onSelectZone }: AdventureMapProps) {
  const { gameState } = useGame();
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [isTravelling, setIsTravelling] = useState(false);

  const safeProgress = gameState?.progress || [];
  
  const canAccess = (zoneId: string) => {
    const realId = zoneIdMapping[zoneId] || zoneId;
    const index = ZONES.findIndex(z => z.id === realId);
    if (index <= 0) return true;
    const prevZone = ZONES[index - 1];
    return prevZone ? safeProgress.includes(prevZone.id) : false;
  };

  const handleZoneClick = (az: any) => {
    const realId = zoneIdMapping[az.id] || az.id;
    const zone = ZONES.find(z => z.id === realId);
    if (zone) {
      if (!canAccess(zone.id)) return;
      setSelectedZone(zone);
    }
  };

  const startJourney = () => {
    if (!selectedZone) return;
    setIsTravelling(true);
    setTimeout(() => {
      onSelectZone(selectedZone);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#1a1c4b] overflow-hidden font-sans adventure-map">
      {/* Ocean Map Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#56b7ff] to-[#1d77df]">
         {/* Grid and Waves */}
         <div className="absolute inset-0 pointer-events-none opacity-20" 
              style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '60px 60px' }} />
         
         <div className="absolute inset-4 md:inset-10 bg-[#f4e4bc] rounded-[60px] md:rounded-[80px] shadow-[inset_0_0_120px_rgba(0,0,0,0.3),0_40px_80px_rgba(0,0,0,0.6)] border-8 border-[#8b4513]/20 overflow-hidden">
            {/* Old Map Texture */}
            <div className="absolute inset-0 opacity-30 mix-blend-multiply pointer-events-none" 
                 style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/old-map.png')` }} />
            
            {/* Debug Box */}
            <div className="absolute top-4 left-4 bg-black/80 px-4 py-2 rounded-xl text-white text-[10px] font-mono z-[100] pointer-events-none uppercase tracking-widest">
               Adventure zones loaded: {adventureZones.length}
            </div>

            {/* Island Shapes */}
            {adventureZones.map((zone) => (
              <div 
                key={`island-${zone.id}`}
                className="absolute -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none"
                style={{ 
                  left: `${zone.x}%`, 
                  top: `${zone.y}%`,
                  width: '300px',
                  height: '180px',
                  background: `radial-gradient(ellipse at center, ${zone.color} 0%, transparent 70%)`,
                  filter: 'blur(40px)',
                  zIndex: 10
                }}
              />
            ))}

            {/* Dotted Paths */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25">
               {adventureZones.slice(0, -1).map((zone, i) => {
                  const nextZone = adventureZones[i+1];
                  return (
                    <motion.line
                      key={`path-${i}`}
                      x1={`${zone.x}%`} y1={`${zone.y}%`}
                      x2={`${nextZone.x}%`} y2={`${nextZone.y}%`}
                      stroke="#8b4513"
                      strokeWidth="6"
                      strokeDasharray="12 16"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                    />
                  );
               })}
            </svg>

            {/* Zone Buttons */}
            <div className="relative w-full h-full">
              {adventureZones.map((zone) => {
                 const isUnlocked = canAccess(zone.id);
                 const realId = zoneIdMapping[zone.id];
                 const isCompleted = safeProgress.includes(realId);
                 const isSelected = selectedZone?.id === realId;

                 return (
                   <motion.button
                     key={zone.id}
                     whileHover={{ scale: 1.05, y: -5 }}
                     whileTap={{ scale: 0.95 }}
                     onClick={() => handleZoneClick(zone)}
                     className={`map-zone absolute -translate-x-1/2 -translate-y-1/2 z-20 group ${!isUnlocked && 'grayscale opacity-60 cursor-not-allowed'}`}
                     style={{
                        left: `${zone.x}%`,
                        top: `${zone.y}%`,
                        backgroundColor: zone.color,
                        boxShadow: isSelected ? `0 0 40px ${zone.color}` : '0 12px 30px rgba(0,0,0,0.25)',
                        position: 'absolute'
                     }}
                   >
                      <span className="text-4xl md:text-5xl mb-2 group-hover:scale-125 transition-transform">{zone.emoji}</span>
                      <div className="flex flex-col items-center">
                        <strong className="text-white text-sm md:text-lg font-black uppercase tracking-tighter italic leading-none">{zone.title}</strong>
                        <small className="text-white/60 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                          {isUnlocked ? (isCompleted ? '⭐ Complete' : 'Tap to Play') : '🔒 Locked'}
                        </small>
                      </div>

                      {/* Selection Glow */}
                      {isSelected && (
                         <motion.div 
                           layoutId="zone-glow"
                           className="absolute -inset-4 border-4 border-white rounded-[40px] animate-pulse"
                         />
                      )}
                   </motion.button>
                 );
              })}

              {/* Player Icon on Map */}
              <motion.div
                animate={{ 
                  left: `${adventureZones.find(z => !safeProgress.includes(zoneIdMapping[z.id]))?.x || 85}%`,
                  top: `${(adventureZones.find(z => !safeProgress.includes(zoneIdMapping[z.id]))?.y || 88) - 4}%`
                }}
                className="absolute z-50 pointer-events-none -translate-x-1/2 -translate-y-1/2"
              >
                 <div className="relative">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-3xl border-4 border-[#8b4513] shadow-2xl flex items-center justify-center overflow-hidden">
                       <span className="text-2xl md:text-3xl">🧭</span>
                    </div>
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-2xl animate-bounce">📍</div>
                 </div>
              </motion.div>
            </div>

            <MapDecorations />
         </div>
      </div>

      {/* Interface Overlays */}
      <div className="absolute top-0 inset-x-0 p-4 md:p-8 flex justify-between items-center z-[100]">
         <button 
           onClick={onBack}
           className="bg-white px-4 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl flex items-center gap-2 md:gap-3 text-[#8b4513] font-black uppercase text-xs md:text-sm border-2 border-[#8b4513]/10 shadow-2xl active:scale-90 transition-all"
         >
            <ArrowLeft size={18} /> Back to HQ
         </button>

         <div className="bg-white px-6 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl border-4 border-[#8b4513]/5 shadow-2xl flex items-center gap-4 md:gap-10">
            <div className="flex flex-col">
               <h1 className="text-lg md:text-2xl font-black text-[#8b4513] italic uppercase tracking-tighter leading-none">Adventure Land</h1>
               <p className="text-[8px] md:text-[10px] font-black text-[#8b4513]/40 uppercase tracking-[0.2em] mt-1">Magical Emotional Islands</p>
            </div>
            <div className="w-px h-10 bg-[#8b4513]/10 hidden md:block" />
            <div className="items-center gap-4 hidden md:flex">
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Quest Progress</p>
                <p className="text-2xl font-black text-[#8b4513] leading-none tracking-tighter italic">{safeProgress.length}/10</p>
              </div>
              <div className="w-32 h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(safeProgress.length/10)*100}%` }}
                  className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                />
              </div>
            </div>
         </div>
         
         <div className="w-10 md:w-32" />
      </div>

      {/* Selected Zone UI */}
      <AnimatePresence>
         {selectedZone && !isTravelling && (
           <motion.div
             initial={{ y: 200, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             exit={{ y: 200, opacity: 0 }}
             className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 md:px-8 z-[200]"
           >
              <div className="bg-white rounded-[30px] md:rounded-[50px] shadow-[0_30px_100px_rgba(0,0,0,0.5)] border-4 border-[#8b4513]/10 p-6 md:p-10 flex flex-col md:flex-row items-center gap-6 md:gap-12 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 blur-3xl -z-10 rounded-full" />
                 
                 <div className={`w-24 h-24 md:w-36 md:h-36 rounded-[25px] md:rounded-[40px] bg-gradient-to-br ${selectedZone.color} flex items-center justify-center text-white shrink-0 shadow-2xl border-4 border-white/20`}>
                    <IconOrEmoji zone={selectedZone} size={64} />
                 </div>
                 
                 <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                       <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">Level: {selectedZone.difficulty}</span>
                       <span className="text-slate-300 font-bold hidden md:inline">|</span>
                       <span className="text-indigo-950/40 font-black uppercase text-[10px] tracking-widest hidden md:inline">{selectedZone.category}</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-indigo-950 italic uppercase tracking-tighter mb-2 leading-none">{selectedZone.name}</h2>
                    <p className="text-slate-600 font-bold text-sm md:text-lg leading-snug line-clamp-2 max-w-lg">{selectedZone.description}</p>
                 </div>

                 <div className="flex flex-col gap-3 min-w-full md:min-w-[240px]">
                    <button 
                      onClick={startJourney}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white h-16 md:h-20 rounded-[25px] md:rounded-[35px] font-black uppercase italic tracking-tighter text-xl md:text-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-4"
                    >
                       Start Game <ArrowRight size={28} />
                    </button>
                    <button 
                      onClick={() => setSelectedZone(null)}
                      className="text-slate-400 font-black uppercase text-[10px] tracking-[0.3em] h-8 hover:text-slate-600 transition-colors"
                    >
                       Choose Another Island
                    </button>
                 </div>
              </div>
           </motion.div>
         )}
      </AnimatePresence>

      <AnimatePresence>
         {isTravelling && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-[1000] bg-[#020314] flex flex-col items-center justify-center text-center p-12"
           >
              <motion.div
                animate={{ 
                  scale: [1, 2, 0.5, 50],
                  rotate: [0, 90, 180, 270, 720],
                  opacity: [1, 1, 1, 0]
                }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="text-9xl mb-12"
              >
                🌌
              </motion.div>
              <h2 className="text-6xl font-black text-white italic uppercase tracking-tighter mb-4">Navigating Portal...</h2>
              <p className="text-cyan-400 font-black tracking-[0.5em] uppercase text-2xl animate-pulse">Entering Emotional Realm</p>
           </motion.div>
         )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: styles }} />
    </div>
  );
}

function IconOrEmoji({ zone, size }: { zone: Zone, size: number }) {
  const Icon = LucideIcons[zone.icon as keyof typeof LucideIcons];
  if (Icon) return <Icon size={size} />;
  return <span style={{ fontSize: `${size/1.5}px` }}>🏝️</span>;
}

function MapDecorations() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
       {/* Landmass Decorations */}
       <div className="absolute top-[30%] left-[10%] text-6xl opacity-20">🌲</div>
       <div className="absolute top-[60%] right-[15%] text-7xl opacity-20">🌋</div>
       <div className="absolute bottom-[20%] left-[20%] text-8xl opacity-10">🏠</div>
       <div className="absolute top-[10%] right-[30%] text-5xl opacity-15">🏰</div>
       
       <motion.div 
         animate={{ x: [-100, 1200], y: [0, 50, 0] }}
         transition={{ duration: 60, repeat: Infinity }}
         className="absolute top-[40%] text-4xl opacity-30"
       >
         ⛵
       </motion.div>
    </div>
  );
}

const styles = `
.adventure-map {
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow: auto;
  background: linear-gradient(180deg, #56b7ff, #1d77df);
}
.map-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 170px;
  min-height: 120px;
  border-radius: 28px;
  color: white;
  font-size: 16px;
  font-weight: 800;
  border: 4px solid white;
  box-shadow: 0 12px 30px rgba(0,0,0,0.25);
  cursor: pointer;
  z-index: 20;
}
@media (max-width: 768px) {
  .map-zone {
    width: 110px;
    min-height: 80px;
    border-radius: 20px;
    font-size: 10px;
    border-width: 2px;
  }
}
`;
