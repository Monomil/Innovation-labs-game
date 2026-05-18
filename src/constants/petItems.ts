import { PetItem } from '../types';

export const PET_ITEMS: PetItem[] = [
  // CAT ITEMS
  {
    id: 'cat-food',
    name: 'Fancy Cat Feast',
    type: 'food',
    category: 'cat',
    cost: 50,
    icon: '🍱',
    effect: { hunger: 30 },
    description: 'A delicious tuna feast for your feline friend.'
  },
  {
    id: 'cat-brush',
    name: 'Golden Brush',
    type: 'grooming',
    category: 'cat',
    cost: 80,
    icon: '🧹',
    effect: { cleanliness: 40, happiness: 10 },
    description: 'Keep that fur shiny and soft.'
  },
  {
    id: 'cat-yarn',
    name: 'Magic Yarn Ball',
    type: 'toy',
    category: 'cat',
    cost: 60,
    icon: '🧶',
    effect: { happiness: 25, energy: -10 },
    description: 'Perfect for pouncing and playing.'
  },
  
  // DOG ITEMS
  {
    id: 'dog-food',
    name: 'Steak & Bone',
    type: 'food',
    category: 'dog',
    cost: 50,
    icon: '🍖',
    effect: { hunger: 30 },
    description: 'Hearty meal for a brave pup.'
  },
  {
    id: 'dog-ball',
    name: 'Bouncey Ball',
    type: 'toy',
    category: 'dog',
    cost: 40,
    icon: '⚽',
    effect: { happiness: 30, energy: -15 },
    description: 'Great for playing fetch in the meadow.'
  },
  {
    id: 'dog-rope',
    name: 'Tuggy Rope',
    type: 'toy',
    category: 'dog',
    cost: 55,
    icon: '🪢',
    effect: { trust: 15, energy: -20 },
    description: 'Build trust with a game of tug-of-war.'
  },

  // RABBIT ITEMS
  {
    id: 'rabbit-food',
    name: 'Crunchy Carrots',
    type: 'food',
    category: 'rabbit',
    cost: 40,
    icon: '🥕',
    effect: { hunger: 35 },
    description: 'Extra crunchy and full of vitamins.'
  },
  {
    id: 'rabbit-bed',
    name: 'Carrot Burrow',
    type: 'bed',
    category: 'rabbit',
    cost: 120,
    icon: '🧺',
    effect: { energy: 50, happiness: 10 },
    description: 'A snuggly spot for a long nap.'
  },
  {
    id: 'rabbit-plush',
    name: 'Companion Plush',
    type: 'toy',
    category: 'rabbit',
    cost: 70,
    icon: '🧸',
    effect: { happiness: 40 },
    description: 'A little friend for your rabbit to snuggle.'
  },

  // ALL PETS
  {
    id: 'water-bowl',
    name: 'Magic Water Bowl',
    type: 'food',
    category: 'all',
    cost: 30,
    icon: '🥣',
    effect: { hunger: 10, energy: 5 },
    description: 'Fresh sparkling water for any pet.'
  },
  {
    id: 'pet-treat',
    name: 'Golden Treat',
    type: 'treat',
    category: 'all',
    cost: 100,
    icon: '🍪',
    effect: { happiness: 50, trust: 20 },
    description: 'The ultimate reward for good behavior.'
  }
];
