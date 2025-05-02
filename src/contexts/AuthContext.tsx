
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  login: (cpf: string, password: string) => Promise<boolean>;
  register: (name: string, cpf: string, password: string, favoriteMode: 'Jogos' | 'Futebol') => Promise<boolean>;
  logout: () => Promise<void>;
  updatePoints: (points: number) => Promise<void>;
  setInSweepstakes: (status: boolean) => Promise<void>;
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
    // Checar se existe uma sessão ativa
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Buscar dados do usuário na tabela users
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('cpf', session.user.email)
          .single();
        
        if (data) {
          const userData: User = {
            name: data.nome,
            cpf: data.cpf,
            favoriteMode: data.modalidade as 'Jogos' | 'Futebol',
            points: data.pontos || 0,
            level: getLevelFromPoints(data.pontos || 0),
            inSweepstakes: false
          };
          setUser(userData);
        } else if (error) {
          console.error('Erro ao buscar dados do usuário:', error);
          await supabase.auth.signOut();
        }
      }
    };
    
    fetchSession();
    
    // Configurar o listener para mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Buscar dados do usuário na tabela users
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('cpf', session.user.email)
            .single();
          
          if (data) {
            const userData: User = {
              name: data.nome,
              cpf: data.cpf,
              favoriteMode: data.modalidade as 'Jogos' | 'Futebol',
              points: data.pontos || 0,
              level: getLevelFromPoints(data.pontos || 0),
              inSweepstakes: false
            };
            setUser(userData);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const login = async (cpf: string, password: string): Promise<boolean> => {
    try {
      // Usar o cpf como email para autenticação no Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cpf, // Usando CPF como email para autenticação
        password
      });
      
      if (error) {
        toast.error('CPF ou senha incorretos. Por favor, verifique ou cadastre-se.');
        console.error('Erro ao fazer login:', error);
        return false;
      }
      
      // Buscar dados do usuário na tabela users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('cpf', cpf)
        .single();
      
      if (userError || !userData) {
        toast.error('Erro ao buscar dados do usuário.');
        console.error('Erro ao buscar dados do usuário:', userError);
        return false;
      }
      
      const userObject: User = {
        name: userData.nome,
        cpf: userData.cpf,
        favoriteMode: userData.modalidade as 'Jogos' | 'Futebol',
        points: userData.pontos || 0,
        level: getLevelFromPoints(userData.pontos || 0),
        inSweepstakes: false
      };
      
      setUser(userObject);
      return true;
    } catch (error) {
      console.error('Erro inesperado ao fazer login:', error);
      toast.error('Erro ao fazer login. Tente novamente.');
      return false;
    }
  };
  
  const register = async (name: string, cpf: string, password: string, favoriteMode: 'Jogos' | 'Futebol'): Promise<boolean> => {
    try {
      // Verificar se já existe um usuário com este CPF
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('cpf', cpf)
        .single();
      
      if (existingUser) {
        toast.error('Este CPF já está cadastrado.');
        return false;
      }
      
      // Criar usuário no auth do Supabase
      const { data, error } = await supabase.auth.signUp({
        email: cpf, // Usando CPF como email para autenticação
        password,
        options: {
          data: {
            name,
            cpf,
            favoriteMode
          }
        }
      });
      
      if (error) {
        console.error('Erro ao cadastrar usuário:', error);
        toast.error('Erro ao cadastrar. Tente novamente.');
        return false;
      }
      
      // Criar registro na tabela users
      const { error: insertError } = await supabase
        .from('users')
        .insert([
          {
            nome: name,
            cpf: cpf,
            senha: password, // Nota: normalmente não armazenaríamos a senha em texto claro, mas estamos mantendo compatibilidade com o sistema existente
            modalidade: favoriteMode,
            pontos: 0,
            criado_em: new Date()
          }
        ]);
      
      if (insertError) {
        console.error('Erro ao inserir dados na tabela users:', insertError);
        // Tentar remover o usuário criado na auth se falhou ao inserir na tabela
        await supabase.auth.admin.deleteUser(data.user?.id || '');
        toast.error('Erro ao cadastrar. Tente novamente.');
        return false;
      }
      
      const newUser: User = {
        name,
        cpf,
        favoriteMode,
        points: 0,
        level: 'FURIOSO Iniciante',
        inSweepstakes: false
      };
      
      setUser(newUser);
      return true;
    } catch (error) {
      console.error('Erro inesperado ao cadastrar:', error);
      toast.error('Erro ao cadastrar. Tente novamente.');
      return false;
    }
  };
  
  const logout = async (): Promise<void> => {
    await supabase.auth.signOut();
    setUser(null);
  };
  
  const updatePoints = async (points: number): Promise<void> => {
    if (user) {
      try {
        const newPoints = user.points + points;
        const newLevel = getLevelFromPoints(newPoints);
        
        // Atualizar na tabela users
        const { error } = await supabase
          .from('users')
          .update({ pontos: newPoints })
          .eq('cpf', user.cpf);
        
        if (error) {
          console.error('Erro ao atualizar pontos:', error);
          toast.error('Erro ao atualizar pontos.');
          return;
        }
        
        // Atualizar estado local
        setUser({
          ...user,
          points: newPoints,
          level: newLevel
        });
      } catch (error) {
        console.error('Erro inesperado ao atualizar pontos:', error);
        toast.error('Erro ao atualizar pontos.');
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
