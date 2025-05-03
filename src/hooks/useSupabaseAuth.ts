
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth';
import { getLevelFromPoints } from '@/utils/authUtils';

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Checar se existe uma sessão ativa
    const fetchSession = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Get user metadata from session
          const userMetadata = session.user.user_metadata;
          const email = session.user.email || '';
          
          // Extract CPF from email (format: user_CPF@furianfans.com)
          const cpfMatch = email.match(/user_(.+)@furianfans\.com/);
          const cpf = cpfMatch ? cpfMatch[1] : '';
          
          if (cpf) {
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
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSession();
    
    // Configurar o listener para mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Extract CPF from email (format: user_CPF@furianfans.com)
          const email = session.user.email || '';
          const cpfMatch = email.match(/user_(.+)@furianfans\.com/);
          const cpf = cpfMatch ? cpfMatch[1] : '';
          
          if (cpf) {
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
          }
          setLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setLoading(false);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
};
