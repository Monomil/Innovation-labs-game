/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Gender {
  BOY = 'boy',
  GIRL = 'girl',
  FANTASY = 'fantasy',
}

export type CharacterRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface EmojiCharacter {
  id: string;
  name: string;
  emoji: string;
  category: 'explorer' | 'space' | 'fantasy' | 'animal' | 'spirit' | 'robot' | 'hero';
  rarity: CharacterRarity;
  price: number;
  description: string;
}

export interface Avatar {
  characterId: string;
  expression: 'happy' | 'sad' | 'surprised' | 'cool' | 'wink';
}

export interface MoodLog {
  timestamp: number;
  mood: 'happy' | 'calm' | 'worried' | 'angry' | 'confused' | 'sleepy';
  note?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}

export interface CosmeticItem {
  id: string;
  name: string;
  category: 'hair' | 'outfit' | 'accessory' | 'pet';
  price: number;
  icon: string;
}

export interface PetStats {
  hunger: number;
  happiness: number;
  energy: number;
  trust: number;
  cleanliness: number;
}

export interface Pet {
  id: string;
  type: 'cat' | 'dog' | 'rabbit';
  name: string;
  stats: PetStats;
  lastUpdate: number;
}

export interface PetItem {
  id: string;
  name: string;
  type: 'food' | 'toy' | 'grooming' | 'bed' | 'treat';
  category: 'cat' | 'dog' | 'rabbit' | 'all';
  cost: number;
  icon: string;
  effect: Partial<PetStats>;
  description: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'aiza' | 'user';
  timestamp: number;
}

export interface SafetyAlert {
  id: string;
  timestamp: number;
  type: 'crisis' | 'alert';
  message: string;
  resolved: boolean;
  messageLog: ChatMessage[];
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  email: string;
  avatar: Avatar | null;
  petSelection: 'cat' | 'dog' | 'rabbit';
  createdAt: number;
}

export interface GameState {
  currentProfileId: string | null;
  profiles: UserProfile[];
  // Data per profile (will be loaded into state)
  playerName: string;
  avatar: Avatar | null;
  gems: number;
  xp: number;
  level: number;
  progress: string[]; // List of completed zone IDs
  unlockedIslands: string[];
  inventory: string[]; // IDs of owned cosmetics (Legacy, keep for compat)
  ownedCharacters: string[]; // IDs of owned EmojiCharacters
  moodLogs: MoodLog[];
  achievements: Achievement[];
  dailyCheckIn: boolean;
  lastPlayed: number;
  pets: Pet[];
  activePetId: string | null;
  petInventory: string[]; // IDs of owned pet items
  chatMessages: ChatMessage[];
  safetyAlerts: SafetyAlert[];
  firstTimeUser: boolean;
  adminPin: string;
}

export const INITIAL_GAME_STATE: GameState = {
  currentProfileId: null,
  profiles: [],
  playerName: '',
  avatar: null,
  gems: 100,
  xp: 0,
  level: 1,
  progress: [],
  unlockedIslands: ['arrival'],
  inventory: [],
  ownedCharacters: ['boy-explorer-1'],
  moodLogs: [],
  achievements: [],
  dailyCheckIn: false,
  lastPlayed: Date.now(),
  pets: [],
  activePetId: null,
  petInventory: [],
  chatMessages: [
    {
      id: 'welcome',
      text: "Hi there! I'm Aiza, your magical friend. How are you feeling today?",
      sender: 'aiza',
      timestamp: Date.now()
    }
  ],
  safetyAlerts: [],
  firstTimeUser: true,
  adminPin: '1234',
};

export interface Zone {
  id: string;
  name: string;
  description: string;
  teach: string;
  miniGameId: string;
  reward: number;
  xpReward: number;
  difficulty: 1 | 2 | 3;
  category: 'emotional' | 'social' | 'mindful' | 'focus';
  icon: string;
  color: string;
  thumbGradient: string;
  position: { x: number; y: number };
}

export const EMOJI_CHARACTERS: EmojiCharacter[] = [
  // EXPLORERS
  { id: 'boy-explorer-1', name: 'Zack the Brave', emoji: '🧑‍🚀', category: 'explorer', rarity: 'common', price: 0, description: 'Ready for any adventure!' },
  { id: 'girl-explorer-1', name: 'Maya the Wise', emoji: '👩‍🎨', category: 'explorer', rarity: 'common', price: 0, description: 'Artistic soul seeking truth.' },
  { id: 'explorer-2', name: 'Skye Scouter', emoji: '🧑‍🌾', category: 'explorer', rarity: 'rare', price: 200, description: 'Nature lover and pathfinder.' },
  
  // SPACE
  { id: 'space-1', name: 'Nova Star', emoji: '👨‍🚀', category: 'space', rarity: 'epic', price: 500, description: 'Travels between the galaxies.' },
  { id: 'space-2', name: 'Cosmo Kid', emoji: '👽', category: 'space', rarity: 'legendary', price: 1000, description: 'A friendly visitor from Orion.' },
  
  // FANTASY
  { id: 'wizard-1', name: 'Merlin Jnr', emoji: '🧙‍♂️', category: 'fantasy', rarity: 'epic', price: 600, description: 'Master of emotional spells.' },
  { id: 'fairy-1', name: 'Lumina', emoji: '🧚‍♀️', category: 'fantasy', rarity: 'rare', price: 300, description: 'Spreads magic dust of calm.' },
  
  // ANIMALS
  { id: 'cat-1', name: 'Shadow Paws', emoji: '🐱', category: 'animal', rarity: 'common', price: 100, description: 'Slinky and calm.' },
  { id: 'robot-1', name: 'Beep-Boop', emoji: '🤖', category: 'robot', rarity: 'legendary', price: 1500, description: 'Does not compute sadness.' },
  
  // EMOTIONAL HEROES
  { id: 'spirit-1', name: 'Zen Master', emoji: '🧘‍♂️', category: 'spirit', rarity: 'epic', price: 800, description: 'The embodiment of peace.' },
  { id: 'hero-1', name: 'Super Support', emoji: '🦸‍♀️', category: 'hero', rarity: 'legendary', price: 2000, description: 'Here to save your day!' },
];

export const ZONES: Zone[] = [
  {
    id: 'anger-volcano',
    name: 'Anger Volcano',
    description: 'The volcano is becoming too powerful. Use calm breathing to cool the lava.',
    teach: 'Calming big feelings',
    miniGameId: 'breathing',
    reward: 100,
    xpReward: 200,
    difficulty: 1,
    category: 'mindful',
    icon: 'Flame',
    color: 'from-orange-500 to-red-600',
    thumbGradient: 'from-orange-600 to-red-700',
    position: { x: 70, y: 20 }
  },
  {
    id: 'confusion-forest',
    name: 'Confusion Forest',
    description: 'The forest paths are becoming confused! Follow the glowing clues to find the way.',
    teach: 'Focus & Memory',
    miniGameId: 'pathFollow',
    reward: 100,
    xpReward: 150,
    difficulty: 2,
    category: 'emotional',
    icon: 'Eye',
    color: 'from-emerald-400 to-teal-500',
    thumbGradient: 'from-emerald-500 to-teal-600',
    position: { x: 25, y: 15 }
  },
  {
    id: 'worry-hills',
    name: 'Worry Cloud Hills',
    description: 'The sky is filled with worry clouds! Help organise thoughts and clear the sky for a sunny day.',
    teach: 'Thought Awareness',
    miniGameId: 'worryCloud',
    reward: 100,
    xpReward: 200,
    difficulty: 2,
    category: 'mindful',
    icon: 'Cloud',
    color: 'from-blue-400 to-indigo-500',
    thumbGradient: 'from-blue-500 to-indigo-700',
    position: { x: 45, y: 10 }
  },
  {
    id: 'memory-meadow',
    name: 'Memory Meadow',
    description: 'Match the magic symbols to sharpen your focus.',
    teach: 'Concentration & Focus',
    miniGameId: 'memoryMatch',
    reward: 100,
    xpReward: 150,
    difficulty: 2,
    category: 'focus',
    icon: 'Star',
    color: 'from-emerald-400 to-teal-500',
    thumbGradient: 'from-emerald-500 to-teal-700',
    position: { x: 10, y: 40 }
  },
  {
    id: 'calm-beach',
    name: 'Calm Beach',
    description: 'A peaceful place for mindfulness.',
    teach: 'Mindfulness & Relaxation',
    miniGameId: 'calmBeach',
    reward: 100,
    xpReward: 150,
    difficulty: 1,
    category: 'mindful',
    icon: 'Waves',
    color: 'from-teal-300 to-emerald-400',
    thumbGradient: 'from-cyan-500 to-blue-800',
    position: { x: 15, y: 70 }
  },
  {
    id: 'creature-village',
    name: 'Creature Village',
    description: 'Help the local creatures and spread kindness.',
    teach: 'Social Skills & Empathy',
    miniGameId: 'helpingCreatures',
    reward: 120,
    xpReward: 200,
    difficulty: 2,
    category: 'social',
    icon: 'Heart',
    color: 'from-pink-400 to-rose-500',
    thumbGradient: 'from-pink-500 to-rose-700',
    position: { x: 50, y: 45 }
  },
  {
    id: 'festival-town',
    name: 'Festival Town',
    description: 'Dance to the beat of your own heart at the rhythm festival!',
    teach: 'Joy & Coordination',
    miniGameId: 'rhythmFestival',
    reward: 150,
    xpReward: 300,
    difficulty: 3,
    category: 'focus',
    icon: 'Music',
    color: 'from-indigo-400 to-violet-500',
    thumbGradient: 'from-violet-600 to-indigo-900',
    position: { x: 85, y: 60 }
  },
  {
    id: 'sleepy-valley',
    name: 'Sleepy Valley',
    description: 'Rest and recharge your magic.',
    teach: 'Healthy Rest & Self-care',
    miniGameId: 'sleepyValley',
    reward: 100,
    xpReward: 150,
    difficulty: 1,
    category: 'mindful',
    icon: 'Moon',
    color: 'from-blue-900 to-indigo-900',
    thumbGradient: 'from-indigo-950 to-black',
    position: { x: 50, y: 85 }
  },
  {
    id: 'confidence-mountain',
    name: 'Confidence Mountain',
    description: 'Climb high and speak kind words to yourself.',
    teach: 'Self-Esteem & Positivity',
    miniGameId: 'confidenceQuest',
    reward: 150,
    xpReward: 250,
    difficulty: 2,
    category: 'emotional',
    icon: 'Trophy',
    color: 'from-orange-400 to-yellow-600',
    thumbGradient: 'from-yellow-500 to-amber-700',
    position: { x: 80, y: 40 }
  },
  {
    id: 'reflection-bridge',
    name: 'Final Emotion Bridge',
    description: 'Look back on your journey and what you\'ve learned.',
    teach: 'Reflection & Evaluation',
    miniGameId: 'reflectionBridge',
    reward: 200,
    xpReward: 500,
    difficulty: 3,
    category: 'emotional',
    icon: 'MapIcon',
    color: 'from-slate-400 to-slate-600',
    thumbGradient: 'from-purple-500 to-fuchsia-800',
    position: { x: 50, y: 65 }
  },
];
