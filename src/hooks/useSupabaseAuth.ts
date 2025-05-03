
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
          const email = session.user.email || '';
          
          if (email) {
            // Buscar dados do usuário na tabela users usando o email
            const { data, error } = await supabase
              .from('users')
              .select('*')
              .eq('email', email)
              .single();
            
            if (data) {
              const userData: User = {
                name: data.nome,
                email: data.email,
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
          const email = session.user.email || '';
          
          if (email) {
            // Buscar dados do usuário na tabela users usando o email
            const { data, error } = await supabase
              .from('users')
              .select('*')
              .eq('email', email)
              .single();
            
            if (data) {
              const userData: User = {
                name: data.nome,
                email: data.email,
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
