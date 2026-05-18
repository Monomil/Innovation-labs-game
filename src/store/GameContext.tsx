/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  GameState, 
  INITIAL_GAME_STATE, 
  MoodLog, 
  Achievement, 
  Avatar, 
  ChatMessage, 
  Pet, 
  PetStats, 
  PetItem,
  UserProfile,
  SafetyAlert,
  EMOJI_CHARACTERS
} from '../types';
import { PET_ITEMS } from '../constants/petItems';

const DEFAULT_AVATAR: Avatar = {
  characterId: 'boy-explorer-1',
  expression: 'happy'
};

interface GameContextType {
  gameState: GameState;
  isLoggedIn: boolean;
  login: (profileId: string) => void;
  logout: () => void;
  registerProfile: (profile: Omit<UserProfile, 'id' | 'createdAt' | 'avatar'>) => void;
  deleteProfile: (profileId: string) => void;
  updateProfile: (profileId: string, updates: Partial<UserProfile>) => void;
  setAvatar: (avatar: Avatar) => void;
  addGems: (amount: number) => void;
  spendGems: (amount: number) => boolean;
  addXP: (amount: number) => void;
  completeZone: (zoneId: string, gemReward: number, xpReward: number) => void;
  logMood: (mood: MoodLog['mood'], note?: string) => void;
  unlockAchievement: (achievement: Achievement) => void;
  addToInventory: (itemId: string) => void;
  resetProfileProgress: () => void;
  sendMessage: (text: string) => void;
  adoptPet: (type: 'cat' | 'dog' | 'rabbit', name: string) => void;
  usePetItem: (petId: string, itemId: string) => void;
  setActivePet: (petId: string) => void;
  interactWithPet: (petId: string, action: 'pet' | 'brush' | 'play' | 'rest' | 'feed' | 'water' | 'treat') => void;
  buyPetItem: (itemId: string) => void;
  buyCharacter: (characterId: string) => void;
  equipCharacter: (characterId: string) => void;
  completeTutorial: () => void;
  setAdminPin: (pin: string) => void;
  resolveAlert: (alertId: string) => void;
  showLevelUp: boolean;
  setShowLevelUp: (show: boolean) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const CRISIS_PHRASES = [
  'i want to die',
  'kill myself',
  'hurt myself',
  'do not want to be here',
  'disappeared',
  'everything to stop',
  'i feel unsafe',
  'cannot cope',
  'disappear forever'
];

export function GameProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('aiza_profiles');
    if (saved) {
      const parsed: UserProfile[] = JSON.parse(saved);
      // Repair logic: ensure all profiles have an avatar
      return parsed.map(p => ({
        ...p,
        avatar: p.avatar || DEFAULT_AVATAR
      }));
    }
    return [];
  });

  const [currentProfileId, setCurrentProfileId] = useState<string | null>(null);

  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  
  // Load profiles only once
  useEffect(() => {
    const savedProfiles = localStorage.getItem('aiza_profiles');
    if (savedProfiles) {
      setProfiles(JSON.parse(savedProfiles));
    }
  }, []);

  // Sync profiles
  useEffect(() => {
    localStorage.setItem('aiza_profiles', JSON.stringify(profiles));
    setGameState(prev => ({ ...prev, profiles }));
  }, [profiles]);

  // Sync current profile ID
  useEffect(() => {
    if (currentProfileId) {
      localStorage.setItem('aiza_current_profile_id', currentProfileId);
    } else {
      localStorage.removeItem('aiza_current_profile_id');
    }
    setGameState(prev => ({ ...prev, currentProfileId }));
  }, [currentProfileId]);

  // Sync game state to specific profile storage
  useEffect(() => {
    if (currentProfileId && gameState.currentProfileId === currentProfileId) {
      localStorage.setItem(`aiza_state_${currentProfileId}`, JSON.stringify(gameState));
    }
  }, [gameState, currentProfileId]);

  const login = (profileId: string) => {
    setCurrentProfileId(profileId);
    const saved = localStorage.getItem(`aiza_state_${profileId}`);
    if (saved) {
      const parsedState = JSON.parse(saved);
      setGameState({ 
        ...INITIAL_GAME_STATE, 
        ...parsedState,
        avatar: parsedState.avatar || DEFAULT_AVATAR, // Repair state if needed
        currentProfileId: profileId, 
        profiles 
      });
    } else {
      const profile = profiles.find(p => p.id === profileId);
      setGameState({ 
        ...INITIAL_GAME_STATE, 
        currentProfileId: profileId, 
        profiles,
        playerName: profile?.name || '',
        avatar: profile?.avatar || DEFAULT_AVATAR
      });
    }
  };

  const logout = () => {
    setCurrentProfileId(null);
    setGameState({ ...INITIAL_GAME_STATE, profiles });
  };

  const registerProfile = (p: Omit<UserProfile, 'id' | 'createdAt' | 'avatar'>) => {
    const id = `profile-${Date.now()}`;
    const newProfile: UserProfile = { ...p, id, createdAt: Date.now(), avatar: DEFAULT_AVATAR };
    setProfiles(prev => [...prev, newProfile]);
    
    // Create initial state for this profile
    const initialState: GameState = {
      ...INITIAL_GAME_STATE,
      currentProfileId: id,
      profiles: [...profiles, newProfile],
      playerName: p.name,
      avatar: DEFAULT_AVATAR
    };
    
    localStorage.setItem(`aiza_state_${id}`, JSON.stringify(initialState));
    setCurrentProfileId(id);
    setGameState(initialState);
    
    // Add initial pet
    adoptPet(p.petSelection, p.petSelection.charAt(0).toUpperCase() + p.petSelection.slice(1));
  };

  const deleteProfile = (profileId: string) => {
    setProfiles(prev => prev.filter(p => p.id !== profileId));
    localStorage.removeItem(`aiza_state_${profileId}`);
    if (currentProfileId === profileId) logout();
  };

  const updateProfile = (profileId: string, updates: Partial<UserProfile>) => {
    setProfiles(prev => prev.map(p => p.id === profileId ? { ...p, ...updates } : p));
    // Also update current state if the updated profile is the active one
    if (profileId === currentProfileId) {
       setGameState(prev => ({ 
         ...prev, 
         playerName: updates.name || prev.playerName 
       }));
    }
  };

  // Pet Stat Decay Loop
  useEffect(() => {
    const decayInterval = setInterval(() => {
      setGameState(prev => {
        if (!prev?.pets || !currentProfileId) return prev;
        return {
          ...prev,
          pets: prev.pets.map(pet => ({
            ...pet,
            stats: {
              ...pet.stats,
              hunger: Math.max(0, (pet.stats?.hunger || 80) - 0.2),
              energy: Math.max(0, (pet.stats?.energy || 80) - 0.1),
              happiness: Math.max(0, (pet.stats?.happiness || 80) - 0.1),
              cleanliness: Math.max(0, (pet.stats?.cleanliness || 80) - 0.2),
            }
          }))
        };
      });
    }, 60000); 

    return () => clearInterval(decayInterval);
  }, [currentProfileId]);

  const sendMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: Date.now()
    };

    setGameState(prev => ({
      ...prev,
      chatMessages: [...prev.chatMessages, userMsg]
    }));

    // Crisis Detection
    const lowerText = text.toLowerCase();
    const isCrisis = CRISIS_PHRASES.some(phrase => lowerText.includes(phrase));

    if (isCrisis) {
      const alert: SafetyAlert = {
        id: `alert-${Date.now()}`,
        timestamp: Date.now(),
        type: 'crisis',
        message: `High-risk content detected: "${text}"`,
        resolved: false,
        messageLog: [...gameState.chatMessages, userMsg]
      };

      setGameState(prev => ({
        ...prev,
        safetyAlerts: [...prev.safetyAlerts, alert]
      }));

      // Aiza response for crisis
      setTimeout(() => {
        const aizaMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: "危机检测: I'm really glad you told me. You deserve help right now. Please tell a trusted grown-up immediately. If you are in danger or might hurt yourself, call emergency services now.",
          sender: 'aiza',
          timestamp: Date.now()
        };
        setGameState(prev => ({ ...prev, chatMessages: [...prev.chatMessages, aizaMsg] }));
      }, 500);
      return;
    }

    // Normal Responses
    setTimeout(() => {
      let response = "That's interesting! Tell me more about how that feels.";
      
      if (lowerText.includes('sad')) response = "I'm sorry you're feeling sad. Remember, it's okay to let the rain fall sometimes. Would you like to try some deep breaths?";
      else if (lowerText.includes('angry')) response = "Feeling angry is like a volcano ready to pop! Let's try to cool down together. Want to visit the Anger Volcano?";
      else if (lowerText.includes('worried') || lowerText.includes('scared')) response = "Worries are like heavy clouds. We can sweep them away together. I'm here for you.";
      else if (lowerText.includes('happy')) response = "Yay! Your happiness glows like a thousand stars! Let's celebrate that feeling.";
      else if (lowerText.includes('help')) response = "I'm always here to help. If you feel very overwhelmed, remember you can always talk to a trusted grown-up too.";
      else if (lowerText.includes('breathe')) response = "Great idea. Let's take a slow breath in... and a long breath out. Feel better?";

      const aizaMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'aiza',
        timestamp: Date.now()
      };

      setGameState(prev => ({
        ...prev,
        chatMessages: [...prev.chatMessages, aizaMsg]
      }));
    }, 1000);
  };

  const adoptPet = (type: 'cat' | 'dog' | 'rabbit', name: string) => {
    const newPet: Pet = {
      id: `pet-${Date.now()}`,
      type,
      name,
      lastUpdate: Date.now(),
      stats: {
        hunger: 80,
        happiness: 80,
        energy: 100,
        trust: 10,
        cleanliness: 100
      }
    };

    setGameState(prev => ({
      ...prev,
      pets: [...(prev?.pets || []), newPet],
      activePetId: newPet.id // Always set the first pet as active
    }));
  };

  const setActivePet = (petId: string) => {
    setGameState(prev => ({ ...prev, activePetId: petId }));
  };

  const usePetItem = (petId: string, itemId: string) => {
    const item = PET_ITEMS.find(i => i.id === itemId);
    if (!item) return;

    setGameState(prev => ({
      ...prev,
      petInventory: (prev?.petInventory || []).filter((id, i) => i !== prev.petInventory.indexOf(itemId)),
      pets: (prev?.pets || []).map(pet => {
        if (pet.id !== petId) return pet;
        const s = pet.stats;
        return {
          ...pet,
          stats: {
            hunger: Math.min(100, s.hunger + (item.effect.hunger || 0)),
            happiness: Math.min(100, s.happiness + (item.effect.happiness || 0)),
            energy: Math.min(100, s.energy + (item.effect.energy || 0)),
            trust: Math.min(100, s.trust + (item.effect.trust || 0)),
            cleanliness: Math.min(100, s.cleanliness + (item.effect.cleanliness || 0)),
          }
        };
      })
    }));
  };

  const interactWithPet = (petId: string, action: 'pet' | 'brush' | 'play' | 'rest' | 'feed' | 'water' | 'treat') => {
    setGameState(prev => ({
      ...prev,
      pets: (prev?.pets || []).map(pet => {
        if (pet.id !== petId) return pet;
        const s = pet.stats;
        switch (action) {
          case 'pet': return { ...pet, stats: { ...s, happiness: Math.min(100, s.happiness + 5), trust: Math.min(100, s.trust + 2) } };
          case 'brush': return { ...pet, stats: { ...s, cleanliness: Math.min(100, s.cleanliness + 15), trust: Math.min(100, s.trust + 5) } };
          case 'play': return { ...pet, stats: { ...s, happiness: Math.min(100, s.happiness + 20), energy: Math.max(0, s.energy - 15) } };
          case 'rest': return { ...pet, stats: { ...s, energy: Math.min(100, s.energy + 30) } };
          case 'feed': return { ...pet, stats: { ...s, hunger: Math.min(100, s.hunger + 25) } };
          case 'water': return { ...pet, stats: { ...s, hunger: Math.min(100, s.hunger + 10) } };
          case 'treat': return { ...pet, stats: { ...s, happiness: Math.min(100, s.happiness + 15), trust: Math.min(100, s.trust + 10) } };
          default: return pet;
        }
      })
    }));
  };

  const buyPetItem = (itemId: string) => {
    const item = PET_ITEMS.find(i => i.id === itemId);
    if (!item) return;

    if (spendGems(item.cost)) {
      setGameState(prev => ({
        ...prev,
        petInventory: [...prev.petInventory, itemId]
      }));
    }
  };

  const equipCharacter = (characterId: string) => {
    const avatar = { ...gameState.avatar, characterId };
    setGameState(prev => ({ 
      ...prev, 
      avatar,
      profile: prev.profile ? { ...prev.profile, avatar } : null 
    }));
    if (currentProfileId) {
      updateProfile(currentProfileId, { avatar });
    }
  };

  const buyCharacter = (characterId: string) => {
    const char = EMOJI_CHARACTERS.find(c => c.id === characterId);
    if (!char) return;

    if (spendGems(char.price)) {
      setGameState(prev => ({
        ...prev,
        ownedCharacters: Array.from(new Set([...prev.ownedCharacters, characterId]))
      }));
      equipCharacter(characterId);
    }
  };

  const resolveAlert = (alertId: string) => {
    setGameState(prev => ({
      ...prev,
      safetyAlerts: prev.safetyAlerts.map(a => a.id === alertId ? { ...a, resolved: true } : a)
    }));
  };

  const setAdminPin = (pin: string) => {
    setGameState(prev => ({ ...prev, adminPin: pin }));
  };

  const completeTutorial = () => {
    setGameState(prev => ({ ...prev, firstTimeUser: false }));
  };

  const addGems = (amount: number) => {
    setGameState(prev => ({ ...prev, gems: prev.gems + amount }));
  };

  const spendGems = (amount: number) => {
    if (gameState.gems >= amount) {
      setGameState(prev => ({ ...prev, gems: prev.gems - amount }));
      return true;
    }
    return false;
  };

  const [showLevelUp, setShowLevelUp] = useState(false);
  const [lastLevel, setLastLevel] = useState(gameState.level);

  useEffect(() => {
    if (gameState.level > lastLevel) {
      setShowLevelUp(true);
      setLastLevel(gameState.level);
      // Automatically add gems on level up
      addGems(100);
    }
  }, [gameState.level, lastLevel]);

  const addXP = (amount: number) => {
    setGameState(prev => {
      const newXP = prev.xp + amount;
      const xpToNextLevel = prev.level * 500;
      if (newXP >= xpToNextLevel) {
        return {
          ...prev,
          xp: Math.max(0, newXP - xpToNextLevel),
          level: prev.level + 1,
        };
      }
      return { ...prev, xp: newXP };
    });
  };

  const completeZone = (zoneId: string, gemReward: number, xpReward: number) => {
    setGameState(prev => {
      const hasCompletedBefore = prev.progress.includes(zoneId);
      const newProgress = hasCompletedBefore ? prev.progress : [...prev.progress, zoneId];
      
      let newLevel = prev.level;
      let newXP = prev.xp + xpReward;
      let xpToNextLevel = newLevel * 500;
      
      while (newXP >= xpToNextLevel) {
        newXP -= xpToNextLevel;
        newLevel += 1;
        xpToNextLevel = newLevel * 500;
      }

      return {
        ...prev,
        progress: newProgress,
        gems: prev.gems + gemReward,
        xp: newXP,
        level: newLevel,
      };
    });
  };

  const logMood = (mood: MoodLog['mood'], note?: string) => {
    setGameState(prev => ({
      ...prev,
      moodLogs: [{ timestamp: Date.now(), mood, note }, ...prev.moodLogs],
    }));
  };

  const unlockAchievement = (achievement: Achievement) => {
    setGameState(prev => {
      if (prev.achievements.find(a => a.id === achievement.id)) return prev;
      return {
        ...prev,
        achievements: [...prev.achievements, { ...achievement, unlockedAt: Date.now() }],
      };
    });
  };

  const addToInventory = (itemId: string) => {
    setGameState(prev => ({
      ...prev,
      inventory: Array.from(new Set([...prev.inventory, itemId])),
    }));
  };

  const resetProfileProgress = () => {
    setGameState({ ...INITIAL_GAME_STATE, currentProfileId, profiles, playerName: gameState.playerName, avatar: gameState.avatar });
  };

  const setAvatar = (avatar: Avatar) => {
    setGameState(prev => ({ ...prev, avatar }));
    if (currentProfileId) {
      updateProfile(currentProfileId, { avatar });
    }
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        isLoggedIn: !!currentProfileId,
        login,
        logout,
        registerProfile,
        deleteProfile,
        updateProfile,
        setAvatar,
        addGems,
        spendGems,
        addXP,
        completeZone,
        logMood,
        unlockAchievement,
        addToInventory,
        resetProfileProgress,
        sendMessage,
        adoptPet,
        usePetItem,
        setActivePet,
        interactWithPet,
        buyPetItem,
        buyCharacter,
        equipCharacter,
        completeTutorial,
        setAdminPin,
        resolveAlert,
        showLevelUp,
        setShowLevelUp,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
