
export interface User {
  name: string;
  email: string;
  favoriteMode: 'Jogos' | 'Futebol';
  points: number;
  level: string;
  inSweepstakes: boolean;
}

export interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, favoriteMode: 'Jogos' | 'Futebol') => Promise<boolean>;
  logout: () => Promise<void>;
  updatePoints: (points: number) => Promise<void>;
  setInSweepstakes: (status: boolean) => Promise<void>;
}
