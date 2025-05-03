
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, AuthContextType } from '@/types/auth';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import * as authService from '@/services/authService';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Get initial user state from Supabase session
  const { user: initialUser, loading: authLoading } = useSupabaseAuth();
  const [user, setUser] = useState<User | null>(initialUser);
  const [isAuthReady, setIsAuthReady] = useState(!authLoading);
  
  // Update user state when initialUser changes
  useEffect(() => {
    if (!authLoading) {
      setUser(initialUser);
      setIsAuthReady(true);
    }
  }, [initialUser, authLoading]);
  
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data: { session }, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      if (authError) {
        console.error('Erro ao tentar realizar o login:', authError.message);
        toast.error('Email ou senha incorretos. Por favor, tente novamente.');
        return false;
      }
  
      if (session) {
        console.log('Login bem-sucedido:', session.user);
        const loggedInUser = await authService.login(email, password);
        if (loggedInUser) {
          setUser(loggedInUser);
          return true;
        }
      }
      
      return false;
    } catch (err) {
      console.error('Erro inesperado ao tentar logar:', err);
      toast.error('Ocorreu um erro ao fazer login. Tente novamente.');
      return false;
    }
  };
  
  const register = async (name: string, email: string, password: string, favoriteMode: 'Jogos' | 'Futebol'): Promise<boolean> => {
    try {
      const newUser = await authService.register(name, email, password, favoriteMode);
      if (newUser) {
        setUser(newUser);
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
    setUser(null);
  };
  
  const updatePoints = async (points: number): Promise<void> => {
    if (user) {
      const updatedUser = await authService.updatePoints(user, points);
      if (updatedUser) {
        setUser(updatedUser);
      }
    }
  };
  
  const setInSweepstakes = async (status: boolean): Promise<void> => {
    if (user) {
      setUser({
        ...user,
        inSweepstakes: status
      });
    }
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoggedIn: !!user,
      loading: !isAuthReady,
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
