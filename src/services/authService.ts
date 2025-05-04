import { createClient } from '@supabase/supabase-js';
import { User } from '@/types/auth';
import { getLevelFromPoints } from '@/utils/authUtils';
import { toast } from 'sonner';

const supabaseUrl = 'https://uoelpjllkzkfayqptcxz.supabase.co';  // URL do seu projeto Supabase
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvZWxwamxsa3prZmF5cXB0Y3h6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxNTc4MjUsImV4cCI6MjA2MTczMzgyNX0.pjRFD_pP1_idKdWxaBCdqLr2TY3ZSm4ohSZm3wt8F2c';  // Chave de API do Supabase

export const supabase = createClient(supabaseUrl, supabaseKey);

export const login = async (email: string, password: string): Promise<User | null> => {
  
  try {
    await supabase.auth.signOut();
    await supabase.auth.getSession(); 
    const { data: userData, error: userCheckError } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .maybeSingle();

      if (userCheckError) {
        toast.error(`Erro ao buscar o usuário: ${userCheckError.message}`);
        return null;
      }

      if (!userData) {
        toast.error('Email não encontrado. Por favor, verifique ou cadastre-se.');
        return null;
      }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      toast.error('Senha incorreta. Por favor, tente novamente.');
      console.error('Erro ao fazer login:', error);
      return null;
    }
    
    const userObject: User = {
      id: userData.id,
      name: userData.nome, 
      email: userData.email,
      favoriteMode: userData.modalidade as 'League of Legends' | 'Counter-Strike' | 'Valorant' | 'Fortnite' | 'Kings League',
      points: userData.pontos || 0,
      level: getLevelFromPoints(userData.pontos || 0),
      inSweepstakes: false,
      lastQuizDate: userData.lastQuizDate,
    };

    return userObject;
  } catch (error) {
    console.error('Erro inesperado ao fazer login:', error);
    toast.error('Erro ao fazer login. Tente novamente.');
    return null;
  }
};

export const register = async (name: string, email: string, password: string, favoriteMode: 'League of Legends' | 'Counter-Strike' | 'Valorant' | 'Fortnite' | 'Kings League'): Promise<User | null> => {
  try {
    await supabase.auth.signOut(); 
    await supabase.auth.getSession(); 
    const { data: existingUser} = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (existingUser) {
      toast.error('Este email já está cadastrado.');
      return null;
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      console.error('Erro ao criar autenticação:', authError);
      toast.error('Erro ao cadastrar. Tente novamente.');
      return null;
    }

    if (!authData.user) {
      toast.error('Erro ao criar conta. Tente novamente.');
      return null;
    }

    const { data, error } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        nome: name,
        email: email,
        senha: password,
        modalidade: favoriteMode,
        pontos: 0,
        criado_em: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao inserir dados na tabela users:', error);
      toast.error('Erro ao cadastrar. Tente novamente.');
      return null;
    }
    
    toast.success('Cadastro realizado com sucesso!');
    
    const newUser: User = {
      name,
      email,
      favoriteMode,
      points: 0,
      level: 'FURIOSO Iniciante',
      inSweepstakes: false,
      id: authData.user.id,
      lastQuizDate: null
    };
    
    // Auto-login após o cadastro
    const loginResult = await login(email, password);
    if (!loginResult) {
      toast.error('Cadastro realizado, mas falha ao efetuar login automático. Por favor faça login manualmente.');
    }
    
    return newUser;
  } catch (error: any) {
    console.error('Erro inesperado ao cadastrar:', error);
    toast.error('Erro ao cadastrar. Tente novamente.');
    return null;
  }
};

export const logout = async (): Promise<void> => {
  await supabase.auth.signOut();
};

export const updatePoints = async (user: User, points: number): Promise<User | null> => {
  if (!user) return null;
  
  try {
    const newPoints = user.points + points;
    const newLevel = getLevelFromPoints(newPoints);
    
    // Atualizar na tabela users
    const { error } = await supabase
      .from('users')
      .update({ pontos: newPoints })
      .eq('email', user.email);
    
    if (error) {
      console.error('Erro ao atualizar pontos:', error);
      toast.error('Erro ao atualizar pontos.');
      return null;
    }
    
    // Retornar usuário atualizado
    return {
      ...user,
      points: newPoints,
      level: newLevel
    };
  } catch (error) {
    console.error('Erro inesperado ao atualizar pontos:', error);
    toast.error('Erro ao atualizar pontos.');
    return null;
  }
};
