
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth';
import { getLevelFromPoints } from '@/utils/authUtils';
import { toast } from 'sonner';

export const login = async (cpf: string, password: string): Promise<User | null> => {
  try {
    // Usar o cpf como email para autenticação no Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cpf, // Usando CPF como email para autenticação
      password
    });
    
    if (error) {
      toast.error('CPF ou senha incorretos. Por favor, verifique ou cadastre-se.');
      console.error('Erro ao fazer login:', error);
      return null;
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
      return null;
    }
    
    const userObject: User = {
      name: userData.nome,
      cpf: userData.cpf,
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

export const register = async (name: string, cpf: string, password: string, favoriteMode: 'Jogos' | 'Futebol'): Promise<User | null> => {
  try {
    // Verificar se já existe um usuário com este CPF
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('cpf', cpf)
      .single();
    
    if (existingUser) {
      toast.error('Este CPF já está cadastrado.');
      return null;
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
      return null;
    }
    
    // Criar registro na tabela users
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        nome: name,
        cpf: cpf,
        senha: password,
        modalidade: favoriteMode,
        pontos: 0,
        criado_em: new Date().toISOString()
      });
    
    if (insertError) {
      console.error('Erro ao inserir dados na tabela users:', insertError);
      // Tentar remover o usuário criado na auth se falhou ao inserir na tabela
      await supabase.auth.admin.deleteUser(data.user?.id || '');
      toast.error('Erro ao cadastrar. Tente novamente.');
      return null;
    }
    
    const newUser: User = {
      name,
      cpf,
      favoriteMode,
      points: 0,
      level: 'FURIOSO Iniciante',
      inSweepstakes: false
    };
    
    return newUser;
  } catch (error) {
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
      .eq('cpf', user.cpf);
    
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
