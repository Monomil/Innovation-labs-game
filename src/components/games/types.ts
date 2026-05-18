/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Zone } from '../../types';

export type GameState = 'intro' | 'tutorial' | 'level1' | 'level2' | 'level3' | 'boss' | 'win' | 'lose' | 'paused';

export interface GameLevelConfig {
  goal: number;
  timeLimit: number;
  difficulty: number;
  [key: string]: any;
}

export interface MiniGameConfig {
  id: string;
  levels: {
    1: GameLevelConfig;
    2: GameLevelConfig;
    3: GameLevelConfig;
    boss: GameLevelConfig;
  };
  introText: string;
  howToPlay: string[];
  winMessage: string;
  loseMessage: string;
}

export interface GameScore {
  gems: number;
  xp: number;
  score: number;
}
