import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '../contexts/AuthContext'; 
import { Trophy } from 'phosphor-react'; 

const supabaseUrl = 'https://uoelpjllkzkfayqptcxz.supabase.co';  // URL do seu projeto Supabase
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvZWxwamxsa3prZmF5cXB0Y3h6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxNTc4MjUsImV4cCI6MjA2MTczMzgyNX0.pjRFD_pP1_idKdWxaBCdqLr2TY3ZSm4ohSZm3wt8F2c';  // Chave de API do Supabase

export const supabase = createClient(supabaseUrl, supabaseKey);

const Ranking = () => {
  const { user } = useAuth(); 
  const [rankingData, setRankingData] = useState<any[]>([]);
  const [isUpdated, setIsUpdated] = useState(false); 
  const updateRanking = async () => {
    try {
      if (user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('pontos')
          .eq('id', user.id)
          .single();

        if (userError) {
          console.error('Erro ao buscar pontos do usuário:', userError.message);
          return;
        }

        const { data, error } = await supabase
          .from('ranking')
          .select('id, pontos')
          .eq('user_id', user.id)

        if (error) {
          console.error('Erro ao buscar o ranking do usuário:', error.message);
          return;
        }

        if (data && data.length > 0) {
          const { error: updateError } = await supabase
            .from('ranking')
            .update({
              pontos: userData.pontos,
              atualizado_em: new Date().toISOString(),
            })
            .eq('user_id', user.id);
          if (updateError) {
            console.error('Erro ao atualizar pontos do usuário:', updateError.message);
          } else {
            console.log('Pontos atualizados com sucesso!');
          }
        } else {
          const { error: insertError } = await supabase
            .from('ranking')
            .insert([{
              user_id: user.id,
              pontos: userData.pontos,
              atualizado_em: new Date().toISOString(),
            }]);
          if (insertError) {
            console.error('Erro ao adicionar o usuário ao ranking:', insertError.message);
          } else {
            console.log('Usuário adicionado ao ranking com sucesso!');
          }
        }
        setIsUpdated(true);  // Marca como atualizado
      }
    } catch (error) {
      console.error('Erro ao atualizar o ranking:', error);
    }
  };

  useEffect(() => {
    updateRanking();
  }, [user]);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const { data, error } = await supabase
          .from('ranking')
          .select('user_id, pontos')
          .order('pontos', { ascending: false }); // Ordenar pela pontuação

        if (error) throw error;

        if (data) {
          const userIds = data.map((player: any) => player.user_id);
          const { data: userNames, error: userNamesError } = await supabase
            .from('users')
            .select('id, nome')
            .in('id', userIds);

          if (userNamesError) throw userNamesError;

          const updatedRankingData = data.map((player: any) => {
            const user = userNames.find((user: any) => user.id === player.user_id);
            return {
              ...player,
              nome: user ? user.nome : 'Nome não disponível',
            };
          });

          setRankingData(updatedRankingData); // Atualiza o estado com os dados do ranking
        }
      } catch (error) {
        console.error('Erro ao buscar dados do ranking:', error);
      }
    };

    fetchRanking();
  }, [isUpdated]);  // Atualiza quando o estado de isUpdated mudar

  return (
    <div className="min-h-screen bg-gradient-to-b from-furia-black to-furia-purple-dark/70 py-16 px-4">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-orbitron font-bold text-white mb-2">
            Ranking de <span className="text-gradient">Torcedores</span>
          </h1>
          <p className="text-white/70">Confira os torcedores com mais pontos!</p>
        </div>

        <div className="bg-furia-black/60 backdrop-blur-md rounded-xl overflow-hidden border border-furia-purple/20">
          <table className="w-full table-auto">
            <thead className="bg-furia-purple/20 text-white">
              <tr>
                <th className="py-4 px-6 text-left text-sm font-medium">Posição</th>
                <th className="py-4 px-6 text-left text-sm font-medium">Usuário</th>
                <th className="py-4 px-6 text-right text-sm font-medium">Pontos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-furia-purple/10">
              {rankingData
                .sort((a, b) => b.pontos - a.pontos)
                .map((player, index) => (
                  <tr
                    key={player.user_id}
                    className={`hover:bg-furia-purple/10 transition-colors ${index === 0 ? 'bg-furia-orange/20' : ''}`}
                  >
                    <td className="py-4 px-6 text-left text-sm font-medium text-white">
                      <div className="flex items-center">
                        <span className={`w-8 h-8 flex items-center justify-center rounded-full text-white mr-2 
                          ${index === 0 ? 'bg-gradient-to-r from-yellow-500 to-yellow-700' : 'bg-furia-purple/30'}`}>
                          {index + 1}
                        </span>
                        {index === 0 && <Trophy size={24} className="text-yellow-500" />}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-left text-sm text-white">{player.nome}</td>
                    <td className="py-4 px-6 text-right text-sm font-bold text-white">{player.pontos}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Ranking;