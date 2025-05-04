import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, AuthContextType } from '@/types/auth';
import * as authService from '@/services/authService';
import { toast } from 'sonner';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Carregar o usuário do localStorage ao inicializar
  const storedUser = localStorage.getItem('user');
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;

  const [user, setUser] = useState<User | null>(parsedUser); 
  const [isAuthReady, setIsAuthReady] = useState(true);

  // Salvar no localStorage quando o usuário for atualizado
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user)); // Salva o usuário no localStorage
    } else {
      localStorage.removeItem('user'); // Remove do localStorage quando o usuário sai
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const loggedInUser = await authService.login(email, password);

      if (!loggedInUser) {
        console.error('Login falhou: usuário inválido ou erro de autenticação.');
        toast.error('Email ou senha incorretos. Por favor, tente novamente.');
        return false;
      }

      console.log('Login bem-sucedido:', loggedInUser);
      setUser(loggedInUser); // Atualiza o estado e salva no localStorage
      return true;
    } catch (err) {
      console.error('Erro inesperado ao tentar logar:', err);
      toast.error('Ocorreu um erro ao fazer login. Tente novamente.');
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, favoriteMode: 'League of Legends' | 'Counter-Strike' | 'Valorant' | 'Fortnite' | 'Kings League'): Promise<boolean> => {
    try {
      const newUser = await authService.register(name, email, password, favoriteMode);
      if (newUser) {
        setUser(newUser); // Salva no estado e no localStorage
        return true;
      } else {
        toast.error('Erro ao cadastrar. Verifique suas informações.');
        return false;
      }
    } catch (error) {
      console.error('Erro ao tentar registrar usuário:', error);
      toast.error('Erro inesperado ao cadastrar.');
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    await authService.logout();
    setUser(null); // Limpa o estado e remove do localStorage
  };

  const updatePoints = async (points: number): Promise<void> => {
    if (user) {
      const updatedUser = await authService.updatePoints(user, points);
      if (updatedUser) {
        setUser(updatedUser); // Atualiza o estado e salva no localStorage
      }
    }
  };

  const setInSweepstakes = async (status: boolean): Promise<void> => {
    if (user) {
      setUser({
        ...user,
        inSweepstakes: status,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        loading: !isAuthReady,
        login,
        register,
        logout,
        updatePoints,
        setInSweepstakes,
      }}
    >
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
