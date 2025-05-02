
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth';
import { getLevelFromPoints } from '@/utils/authUtils';

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Checar se existe uma sessão ativa
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Extract CPF from the email (removing the @furianfans.com part)
        const cpf = session.user.email?.split('@')[0] || '';
        
        // Buscar dados do usuário na tabela users usando o CPF
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('cpf', cpf)
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
          // Extract CPF from the email (removing the @furianfans.com part)
          const cpf = session.user.email?.split('@')[0] || '';
          
          // Buscar dados do usuário na tabela users usando o CPF
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('cpf', cpf)
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

  return { user };
};
