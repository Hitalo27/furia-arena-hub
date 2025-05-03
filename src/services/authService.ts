
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth';
import { getLevelFromPoints } from '@/utils/authUtils';
import { toast } from 'sonner';
import { supabaseClient } from '@/lib/supabaseClient';

export const login = async (email: string, password: string): Promise<User | null> => {
  
  try {
    // First check if the user exists in our users table
    const { data: userData, error: userCheckError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .limit(1); 
      // .single();

      if (userCheckError) {
        toast.error(`Erro ao buscar o usuário: ${userCheckError.message}`);
        return null;
      }

      if (!userData || userData.length === 0) {
        toast.error('Email não encontrado32. Por favor, verifique ou cadastre-se.');
        return null;
      }
    
    // if (userCheckError || !userData) {
    //   toast.error('Email não encontrado. Por favor, verifique ou cadastre-se.');
    //   return null;
    // }
    
    // Authenticate with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      toast.error('Senha incorreta. Por favor, tente novamente.');
      console.error('Erro ao fazer login:', error);
      return null;
    }
    
    // Return user data from our users table
    const userObject: User = {
      name: userData.nome,
      email: userData.email,
      favoriteMode: userData.modalidade as 'Jogos' | 'Futebol',
      points: userData.pontos || 0,
      level: getLevelFromPoints(userData.pontos || 0),
      inSweepstakes: false
    };
    
    return userObject;
  } catch (error) {
    console.error('Erro inesperado ao fazer login:', error);
    toast.error('Erro ao fazer login. Tente novamente.');
    return null;
  }
};

export const register = async (name: string, email: string, password: string, favoriteMode: 'Jogos' | 'Futebol'): Promise<User | null> => {
  try {
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (existingUser) {
      toast.error('Este email já está cadastrado.');
      return null;
    }

    const { dados, errors } = await supabaseClient.auth.signUp({
      email,
      password,
    });

    const { data, error } = await supabase
      .from('users')
      .insert({
        id: dados.user.id,
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
      inSweepstakes: false
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
