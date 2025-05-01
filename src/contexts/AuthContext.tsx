
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  name: string;
  cpf: string;
  favoriteMode: 'Jogos' | 'Futebol';
  points: number;
  level: string;
  inSweepstakes: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (cpf: string) => boolean;
  register: (name: string, cpf: string, favoriteMode: 'Jogos' | 'Futebol') => boolean;
  logout: () => void;
  updatePoints: (points: number) => void;
  setInSweepstakes: (status: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getLevelFromPoints = (points: number): string => {
  if (points >= 300) return 'FURIOSO Lendário';
  if (points >= 100) return 'FURIOSO Veterano';
  return 'FURIOSO Iniciante';
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Update level based on current points
      parsedUser.level = getLevelFromPoints(parsedUser.points);
      setUser(parsedUser);
    }
  }, []);
  
  const login = (cpf: string): boolean => {
    // In a real app, this would validate against a backend
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      
      if (parsedUser.cpf === cpf) {
        parsedUser.level = getLevelFromPoints(parsedUser.points);
        setUser(parsedUser);
        return true;
      }
    }
    return false;
  };
  
  const register = (name: string, cpf: string, favoriteMode: 'Jogos' | 'Futebol'): boolean => {
    // In a real app, this would register with a backend
    const newUser = {
      name,
      cpf,
      favoriteMode,
      points: 0,
      level: 'FURIOSO Iniciante',
      inSweepstakes: false
    };
    
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
    return true;
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  
  const updatePoints = (points: number) => {
    if (user) {
      const updatedUser = { ...user, points: user.points + points };
      updatedUser.level = getLevelFromPoints(updatedUser.points);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };
  
  const setInSweepstakes = (status: boolean) => {
    if (user) {
      const updatedUser = { ...user, inSweepstakes: status };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoggedIn: !!user, 
      login, 
      register, 
      logout,
      updatePoints,
      setInSweepstakes
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
