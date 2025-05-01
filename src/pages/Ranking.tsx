import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Star, Trophy, Clock } from 'lucide-react';

interface RankingUser {
  id: string;
  name: string;
  favoriteMode: 'Jogos' | 'Futebol';
  points: number;
  level: string;
}

// Sample ranking data (in real app would come from API)
const sampleRanking: RankingUser[] = [
  { id: '1', name: 'Pedro Gomes', favoriteMode: 'Jogos', points: 547, level: 'FURIOSO Lendário' },
  { id: '2', name: 'Marina Silva', favoriteMode: 'Futebol', points: 421, level: 'FURIOSO Lendário' },
  { id: '3', name: 'João Paulo', favoriteMode: 'Jogos', points: 398, level: 'FURIOSO Lendário' },
  { id: '4', name: 'Hitalo Cerqueira', favoriteMode: 'Jogos', points: 325, level: 'FURIOSO Lendário' },
  { id: '5', name: 'Ana Clara', favoriteMode: 'Futebol', points: 287, level: 'FURIOSO Veterano' },
  { id: '6', name: 'Carlos Eduardo', favoriteMode: 'Jogos', points: 245, level: 'FURIOSO Veterano' },
  { id: '7', name: 'Juliana Mendes', favoriteMode: 'Jogos', points: 223, level: 'FURIOSO Veterano' },
  { id: '8', name: 'Ricardo Alves', favoriteMode: 'Futebol', points: 198, level: 'FURIOSO Veterano' },
  { id: '9', name: 'Fernanda Costa', favoriteMode: 'Jogos', points: 165, level: 'FURIOSO Veterano' },
  { id: '10', name: 'Bruno Martins', favoriteMode: 'Futebol', points: 132, level: 'FURIOSO Veterano' },
  { id: '11', name: 'Camila Santos', favoriteMode: 'Jogos', points: 98, level: 'FURIOSO Iniciante' },
  { id: '12', name: 'Daniel Oliveira', favoriteMode: 'Jogos', points: 87, level: 'FURIOSO Iniciante' },
  { id: '13', name: 'Leandro Souza', favoriteMode: 'Futebol', points: 75, level: 'FURIOSO Iniciante' },
  { id: '14', name: 'Amanda Ferreira', favoriteMode: 'Jogos', points: 62, level: 'FURIOSO Iniciante' },
  { id: '15', name: 'Gabriel Ribeiro', favoriteMode: 'Futebol', points: 54, level: 'FURIOSO Iniciante' }
];

const Ranking = () => {
  const [ranking, setRanking] = useState<RankingUser[]>([]);
  const [filter, setFilter] = useState<'all' | 'Jogos' | 'Futebol'>('all');
  const [userRank, setUserRank] = useState<number | null>(null);
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      // In a real app, fetch ranking from API
      setRanking(sampleRanking);
      
      // Find user's rank
      if (user) {
        const index = sampleRanking.findIndex(rankUser => rankUser.name === user.name);
        if (index !== -1) {
          setUserRank(index + 1);
        }
      }
    }
  }, [isLoggedIn, navigate, user]);
  
  if (!user) {
    return null;
  }
  
  const filteredRanking = filter === 'all' 
    ? ranking 
    : ranking.filter(rankUser => rankUser.favoriteMode === filter);
  
  const findUserInFilteredRanking = () => {
    if (!user) return null;
    
    const index = filteredRanking.findIndex(rankUser => rankUser.name === user.name);
    return index !== -1 ? index + 1 : null;
  };
  
  const goToUserPosition = () => {
    const userPosition = document.getElementById(`user-${user.name}`);
    if (userPosition) {
      userPosition.scrollIntoView({ behavior: 'smooth', block: 'center' });
      userPosition.classList.add('bg-furia-purple/20');
      setTimeout(() => {
        userPosition.classList.remove('bg-furia-purple/20');
      }, 2000);
    }
  };
  
  const getLevelBadgeStyle = (level: string) => {
    if (level.includes('Lendário')) {
      return 'bg-gradient-to-r from-furia-orange to-yellow-500 text-white';
    } else if (level.includes('Veterano')) {
      return 'bg-gradient-to-r from-furia-purple to-blue-500 text-white';
    }
    return 'bg-gray-700 text-white';
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-furia-black to-furia-purple-dark/70">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-2xl md:text-3xl font-orbitron font-bold text-white mb-2">
              Ranking de <span className="text-gradient">Torcedores</span>
            </h1>
            <p className="text-white/70">
              Confira a classificação dos torcedores mais ativos da FURIA
            </p>
          </div>
          
          {/* Filter Options */}
          <div className="bg-furia-black/60 backdrop-blur-md rounded-xl p-4 mb-6 flex flex-col sm:flex-row justify-between items-center">
            <div className="flex space-x-2 mb-4 sm:mb-0">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-md text-sm
                          ${filter === 'all' 
                            ? 'bg-furia-purple text-white' 
                            : 'bg-furia-black/40 text-white/70 hover:bg-furia-purple/20'}`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilter('Jogos')}
                className={`px-4 py-2 rounded-md text-sm
                          ${filter === 'Jogos' 
                            ? 'bg-furia-purple text-white' 
                            : 'bg-furia-black/40 text-white/70 hover:bg-furia-purple/20'}`}
              >
                Jogos
              </button>
              <button
                onClick={() => setFilter('Futebol')}
                className={`px-4 py-2 rounded-md text-sm
                          ${filter === 'Futebol' 
                            ? 'bg-furia-purple text-white' 
                            : 'bg-furia-black/40 text-white/70 hover:bg-furia-purple/20'}`}
              >
                Futebol
              </button>
            </div>
            
            <button
              onClick={goToUserPosition}
              className="bg-furia-orange/90 hover:bg-furia-orange text-white px-4 py-2 rounded-md text-sm transition-colors flex items-center"
            >
              <Star size={16} className="mr-2" />
              Ver minha posição
            </button>
          </div>
          
          {/* User's Current Position */}
          <div className="bg-furia-black/60 backdrop-blur-md rounded-xl p-6 border border-furia-purple/20 mb-8 animate-fade-in">
            <div className="flex items-center justify-between flex-wrap">
              <div className="flex items-center mb-4 sm:mb-0">
                <div className="w-12 h-12 rounded-full bg-furia-purple/20 flex items-center justify-center mr-4">
                  <Trophy className="text-furia-purple" size={24} />
                </div>
                <div>
                  <h2 className="text-white/70 text-sm">Sua posição atual</h2>
                  <p className="text-2xl font-orbitron font-bold text-white">
                    {findUserInFilteredRanking() !== null 
                      ? `#${findUserInFilteredRanking()}` 
                      : 'Não classificado para este filtro'}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:items-end">
                <div className="bg-furia-purple/20 px-3 py-1 rounded-full self-start sm:self-auto">
                  <span className="text-xs font-medium text-white">{user.points} pontos</span>
                </div>
                <p className="text-white/70 text-sm mt-2">
                  {user.level}
                </p>
              </div>
            </div>
          </div>
          
          {/* Top 3 Users */}
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <Trophy className="text-furia-orange h-6 w-6 mr-2" />
              <h2 className="text-xl font-orbitron font-bold text-white">Top 3 Torcedores</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredRanking.slice(0, 3).map((rankUser, index) => (
                <div 
                  key={rankUser.id}
                  id={user && rankUser.name === user.name ? `user-${user.name}` : ''}
                  className={`bg-furia-black/60 backdrop-blur-md rounded-xl p-6 border 
                            ${index === 0 
                              ? 'border-yellow-500/50 animate-pulse-glow' 
                              : index === 1 
                                ? 'border-gray-400/50' 
                                : 'border-amber-700/50'} 
                            transition-all duration-300 animate-fade-in 
                            ${index === 0 ? 'md:transform md:scale-110 z-10' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col items-center">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3
                                     ${index === 0 
                                       ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' 
                                       : index === 1 
                                         ? 'bg-gradient-to-r from-gray-300 to-gray-500' 
                                         : 'bg-gradient-to-r from-amber-700 to-amber-900'}`}>
                        <span className="text-2xl font-bold text-white">#{index + 1}</span>
                      </div>
                      <div 
                        className={`px-3 py-1 rounded-full text-xs ${getLevelBadgeStyle(rankUser.level)}`}
                      >
                        {rankUser.level.split(' ')[1]}
                      </div>
                    </div>
                    <div className="text-right">
                      <h3 className="text-lg font-medium text-white mb-1">{rankUser.name}</h3>
                      <p className="text-white/70 text-xs mb-2">{rankUser.favoriteMode}</p>
                      <p className="text-2xl font-orbitron font-bold text-gradient">{rankUser.points}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Rest of the Ranking */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Star className="text-furia-purple h-6 w-6 mr-2" />
                <h2 className="text-xl font-orbitron font-bold text-white">Classificação Geral</h2>
              </div>
              <div className="flex items-center text-white/70">
                <Clock size={16} className="mr-1" />
                <span className="text-xs">Atualizado em tempo real</span>
              </div>
            </div>
            
            <div className="bg-furia-black/60 backdrop-blur-md rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-furia-purple/20">
                  <tr>
                    <th className="py-4 px-2 sm:px-6 text-left text-sm font-medium text-white">Pos.</th>
                    <th className="py-4 px-2 sm:px-6 text-left text-sm font-medium text-white">Torcedor</th>
                    <th className="py-4 px-2 sm:px-6 text-center text-sm font-medium text-white">Modalidade</th>
                    <th className="py-4 px-2 sm:px-6 text-right text-sm font-medium text-white">Pontos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-furia-purple/10">
                  {filteredRanking.slice(3).map((rankUser, index) => (
                    <tr 
                      key={rankUser.id}
                      id={user && rankUser.name === user.name ? `user-${user.name}` : ''}
                      className={`hover:bg-furia-purple/5 transition-colors
                                ${user && rankUser.name === user.name ? 'bg-furia-purple/10' : ''}`}
                    >
                      <td className="py-3 px-2 sm:px-6 text-left text-sm whitespace-nowrap">
                        <span className="font-medium text-white">#{index + 4}</span>
                      </td>
                      <td className="py-3 px-2 sm:px-6 text-left">
                        <div className="flex items-center">
                          <div className="ml-2">
                            <p className="text-sm font-medium text-white">{rankUser.name}</p>
                            <p className="text-xs text-white/50">{rankUser.level}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2 sm:px-6 text-center">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs
                                      ${rankUser.favoriteMode === 'Jogos' 
                                        ? 'bg-furia-purple/20 text-furia-purple' 
                                        : 'bg-furia-orange/20 text-furia-orange'}`}>
                          {rankUser.favoriteMode}
                        </span>
                      </td>
                      <td className="py-3 px-2 sm:px-6 text-right">
                        <span className="font-orbitron font-bold text-white">{rankUser.points}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Ranking System Info */}
          <div className="mt-12 bg-furia-black/60 backdrop-blur-md rounded-xl p-6 border border-furia-purple/20">
            <h2 className="text-xl font-orbitron font-bold text-white mb-4">Sistema de Níveis</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-furia-black p-4 rounded-lg border border-gray-700">
                <h3 className="text-lg font-medium text-white mb-2">FURIOSO Iniciante</h3>
                <p className="text-white/70 text-sm">0-99 pontos</p>
                <div className="w-full bg-gray-800 h-2 rounded-full mt-2">
                  <div className="bg-gray-600 h-full rounded-full" style={{ width: '33%' }}></div>
                </div>
              </div>
              <div className="bg-furia-black p-4 rounded-lg border border-furia-purple">
                <h3 className="text-lg font-medium text-white mb-2">FURIOSO Veterano</h3>
                <p className="text-white/70 text-sm">100-299 pontos</p>
                <div className="w-full bg-gray-800 h-2 rounded-full mt-2">
                  <div className="bg-furia-purple h-full rounded-full" style={{ width: '66%' }}></div>
                </div>
              </div>
              <div className="bg-furia-black p-4 rounded-lg border border-furia-orange">
                <h3 className="text-lg font-medium text-white mb-2">FURIOSO Lendário</h3>
                <p className="text-white/70 text-sm">300+ pontos</p>
                <div className="w-full bg-gray-800 h-2 rounded-full mt-2">
                  <div className="bg-furia-orange h-full rounded-full"></div>
                </div>
              </div>
            </div>
            <p className="text-center text-white/70 text-sm mt-6">
              O ranking é atualizado em tempo real. Ganhe pontos participando das atividades do FURIA Fans!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ranking;
