export type View = 'landing' | 'arena' | 'leaderboard' | 'missions' | 'profile';

export interface UserStats {
  walletAddress: string;
  xp: number;
  points: number;
  streak: number;
  level: number;
  puzzlesSolved: number;
  lastLogin: string;
}

export interface ScoreEntry {
  id?: string;
  walletAddress: string;
  score: number;
  difficulty: string;
  timestamp: string;
}

export type Difficulty = 3 | 4 | 5;
