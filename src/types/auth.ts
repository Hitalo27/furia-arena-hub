import { UUID } from "crypto";

export interface User {
  id: string;
  name: string;
  email: string;
  favoriteMode: 'League of Legends' | 'Counter-Strike' | 'Valorant' | 'Fortnite' | 'Kings League' ;
  points: number;
  level: string;
  lastQuizDate: Date;
  inSweepstakes: boolean;
}

export interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, favoriteMode: 'League of Legends' | 'Counter-Strike' | 'Valorant' | 'Fortnite' | 'Kings League') => Promise<boolean>;
  logout: () => Promise<void>;
  updatePoints: (points: number) => Promise<void>;
  setInSweepstakes: (status: boolean) => Promise<void>;
}
