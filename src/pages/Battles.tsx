
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Users, Star, Flag } from 'lucide-react';

interface Battle {
  id: string;
  name: string;
  teamA: {
    name: string;
    points: number;
    members: number;
  };
  teamB: {
    name: string;
    points: number;
    members: number;
  };
  endDate: string;
}

const sampleBattles: Battle[] = [
  {
    id: '1',
    name: 'CS:GO vs. Valorant',
    teamA: {
      name: 'Time CS:GO',
      points: 2475,
      members: 153
    },
    teamB: {
      name: 'Time Valorant',
      points: 2320,
      members: 147
    },
    endDate: '2025-05-07'
  },
  {
    id: '2',
    name: 'Jogos vs. Futebol',
    teamA: {
      name: 'Time Jogos',
      points: 3310,
      members: 210
    },
    teamB: {
      name: 'Time Futebol',
      points: 2845,
      members: 175
    },
    endDate: '2025-05-14'
  }
];

const Battles = () => {
  const [activeBattle, setActiveBattle] = useState<Battle | null>(null);
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      // In a real app, fetch active battles from API
      setActiveBattle(sampleBattles[0]);
    }
  }, [isLoggedIn, navigate]);
  
  if (!user) {
    return null;
  }
  
  const formatRemainingTime = (dateString: string) => {
    const endDate = new Date(dateString);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return `${diffDays} dias`;
  };
  
  const calculatePercentage = (a: number, b: number) => {
    const total = a + b;
    return {
      teamA: Math.round((a / total) * 100),
      teamB: Math.round((b / total) * 100)
    };
  };
  
  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-furia-black to-furia-purple-dark/70">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-2xl md:text-3xl font-orbitron font-bold text-white mb-2">
              Batalhas de <span className="text-gradient">Torcida</span>
            </h1>
            <p className="text-white/70">
              Participe das batalhas semanais e ajude sua torcida a vencer!
            </p>
          </div>
          
          {/* Active Battle */}
          {activeBattle && (
            <div className="bg-furia-black/60 backdrop-blur-md rounded-xl p-6 border border-furia-purple/20 mb-8 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-orbitron font-bold text-white">{activeBattle.name}</h2>
                <div className="bg-furia-purple/20 px-3 py-1 rounded-full">
                  <span className="text-xs text-white">Encerra em {formatRemainingTime(activeBattle.endDate)}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Team A */}
                <div className="bg-furia-purple/10 p-4 rounded-lg border border-furia-purple/20">
                  <div className="flex items-center space-x-2 mb-3">
                    <Users size={20} className="text-furia-orange" />
                    <h3 className="text-md font-medium text-white">{activeBattle.teamA.name}</h3>
                  </div>
                  <p className="text-lg font-medium text-white">
                    {activeBattle.teamA.points} <span className="text-white/70 text-sm">pontos</span>
                  </p>
                  <p className="text-sm text-white/70">
                    {activeBattle.teamA.members} <span className="text-white/50">membros</span>
                  </p>
                </div>
                
                {/* VS */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-furia-purple/20 flex items-center justify-center border border-furia-purple/30">
                    <span className="text-xl font-bold text-white">VS</span>
                  </div>
                </div>
                
                {/* Team B */}
                <div className="bg-furia-purple/10 p-4 rounded-lg border border-furia-purple/20">
                  <div className="flex items-center space-x-2 mb-3">
                    <Users size={20} className="text-furia-purple" />
                    <h3 className="text-md font-medium text-white">{activeBattle.teamB.name}</h3>
                  </div>
                  <p className="text-lg font-medium text-white">
                    {activeBattle.teamB.points} <span className="text-white/70 text-sm">pontos</span>
                  </p>
                  <p className="text-sm text-white/70">
                    {activeBattle.teamB.members} <span className="text-white/50">membros</span>
                  </p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="h-3 bg-furia-black rounded-full overflow-hidden flex">
                  {(() => {
                    const percentages = calculatePercentage(activeBattle.teamA.points, activeBattle.teamB.points);
                    return (
                      <>
                        <div 
                          className="h-full bg-furia-orange transition-all" 
                          style={{ width: `${percentages.teamA}%` }}
                        ></div>
                        <div 
                          className="h-full bg-furia-purple transition-all" 
                          style={{ width: `${percentages.teamB}%` }}
                        ></div>
                      </>
                    );
                  })()}
                </div>
                <div className="flex justify-between mt-2 text-sm text-white/70">
                  <span>{calculatePercentage(activeBattle.teamA.points, activeBattle.teamB.points).teamA}%</span>
                  <span>{calculatePercentage(activeBattle.teamA.points, activeBattle.teamB.points).teamB}%</span>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-white/70 mb-4">
                  Sua torcida: <span className="font-medium text-white">{user.favoriteMode === 'Jogos' ? 'Time Jogos' : 'Time Futebol'}</span>
                </p>
                <p className="text-white mb-6">
                  Ganhe pontos respondendo quizzes, enviando curiosidades ou participando das atividades!
                </p>
                <button
                  onClick={() => navigate('/quiz')}
                  className="btn-primary"
                >
                  Responder Quiz para Pontuar
                </button>
              </div>
            </div>
          )}
          
          {/* Upcoming Battles */}
          <div className="bg-furia-black/60 backdrop-blur-md rounded-xl p-6 border border-furia-purple/20 animate-fade-in">
            <h2 className="text-xl font-orbitron font-bold text-white mb-4">Próximas Batalhas</h2>
            
            <div className="space-y-4">
              <div className="p-4 border border-furia-purple/10 rounded-lg flex justify-between items-center">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Flag size={16} className="text-furia-purple" />
                    <h3 className="text-md font-medium text-white">Free Fire vs. LoL</h3>
                  </div>
                  <p className="text-sm text-white/70">Começa em 8 dias</p>
                </div>
                <div className="bg-furia-purple/20 px-3 py-1 rounded-full">
                  <span className="text-xs text-white">Em breve</span>
                </div>
              </div>
              
              <div className="p-4 border border-furia-purple/10 rounded-lg flex justify-between items-center">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Star size={16} className="text-furia-purple" />
                    <h3 className="text-md font-medium text-white">Desafio dos Veteranos</h3>
                  </div>
                  <p className="text-sm text-white/70">Começa em 15 dias</p>
                </div>
                <div className="bg-furia-purple/20 px-3 py-1 rounded-full">
                  <span className="text-xs text-white">Em breve</span>
                </div>
              </div>
              
              <div className="p-4 border border-furia-purple/10 rounded-lg flex justify-between items-center">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Users size={16} className="text-furia-purple" />
                    <h3 className="text-md font-medium text-white">Megabatalha: Todos Modos</h3>
                  </div>
                  <p className="text-sm text-white/70">Começa em 22 dias</p>
                </div>
                <div className="bg-furia-purple/20 px-3 py-1 rounded-full">
                  <span className="text-xs text-white">Em breve</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-furia-purple/10 rounded-lg">
              <p className="text-center text-white">
                As batalhas de torcida são atualizadas semanalmente. <br />
                Vencedores recebem cards exclusivos e pontos adicionais!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Battles;
