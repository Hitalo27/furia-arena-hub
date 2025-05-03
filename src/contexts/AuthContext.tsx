
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
    const { data, error } = await supabase.from('users').select('*').limit(1);
    if (error) {
      console.error('Erro ao testar a conexão com o Supabase:', error);
      return false;  
    }
    
    console.log('Conexão bem-sucedida com o Supabase!', data);

    try {
      const { user, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      if (authError) {
        console.error('Erro ao tentar realizar o login:', authError.message);
        return false;  // Retorna falso se houver erro no login
      }
  
      if (user) {
        console.log('Login bem-sucedido:', user);
        return true;  // Retorna verdadeiro se o login for bem-sucedido
      } else {
        console.log('Falha no login, usuário não encontrado.');
        return false;  // Retorna falso caso o usuário não seja encontrado
      }
    } catch (err) {
      console.error('Erro inesperado ao tentar logar:', err);
      return false;  // Em caso de erro inesperado, retorna falso
    }
  };
  
  //   const loggedInUser = await authService.login(email, password);
  //   if (loggedInUser) {
  //     setUser(loggedInUser);
  //     return true;
  //   }
  //   return false;
  // };
  
  const register = async (name: string, email: string, password: string, favoriteMode: 'Jogos' | 'Futebol'): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
  
      if (error) {
        console.error('Erro ao tentar registrar:', error.message);
        return false;  // Retorna falso se houve erro
      }
  
      if (data.user) {
        console.log('Registro bem-sucedido:', data.user);
        return true;  // Retorna verdadeiro se o cadastro foi feito
      } else {
        console.log('Falha no registro, usuário não criado.');
        return false;
      }
    } catch (err) {
      console.error('Erro inesperado ao tentar registrar:', err);
      return false;
    }
  };
    // const newUser = await authService.register(name, email, password, favoriteMode);
    // if (newUser) {
    //   setUser(newUser);
    //   return true;
    // }
    // return false;
  // };
  
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
