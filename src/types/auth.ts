
export interface User {
  name: string;
  cpf: string;
  favoriteMode: 'Jogos' | 'Futebol';
  points: number;
  level: string;
  inSweepstakes: boolean;
}

export interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (cpf: string, password: string) => Promise<boolean>;
  register: (name: string, cpf: string, password: string, favoriteMode: 'Jogos' | 'Futebol') => Promise<boolean>;
  logout: () => Promise<void>;
  updatePoints: (points: number) => Promise<void>;
  setInSweepstakes: (status: boolean) => Promise<void>;
}
