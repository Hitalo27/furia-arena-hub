
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Trophy, Star, Gift, Flag } from 'lucide-react';

const Dashboard = () => {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);
  
  if (!user) {
    return null; // Will redirect via the useEffect
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-furia-black to-furia-purple-dark/70">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Header */}
          <div className="bg-furia-black/60 backdrop-blur-md rounded-xl p-6 border border-furia-purple/20 mb-8 animate-fade-in">
            <h1 className="text-2xl md:text-3xl font-orbitron font-bold text-white">
              Olá, <span className="text-gradient">{user.name}</span>!
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-furia-purple/10 p-4 rounded-lg border border-furia-purple/20">
                <h3 className="text-sm text-white/70">Modalidade Favorita</h3>
                <p className="text-lg font-medium text-white">{user.favoriteMode}</p>
              </div>
              <div className="bg-furia-purple/10 p-4 rounded-lg border border-furia-purple/20">
                <h3 className="text-sm text-white/70">Status de Sorteio</h3>
                <p className="text-lg font-medium text-white">{user.inSweepstakes ? 'Participando' : 'Não Participando'}</p>
              </div>
              <div className="bg-furia-purple/10 p-4 rounded-lg border border-furia-purple/20">
                <h3 className="text-sm text-white/70">Pontuação</h3>
                <p className="text-lg font-medium text-white">{user.points} pontos <span className="text-xs text-furia-purple ml-1">({user.level})</span></p>
              </div>
            </div>
          </div>
          
          {/* Actions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <Link to="/quiz" className="bg-furia-black/60 backdrop-blur-md rounded-xl p-6 border border-furia-purple/20
                                      hover:border-furia-purple transition-all group animation-delay-100 animate-fade-in">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-orbitron font-bold text-white mb-2">Quiz Diário</h2>
                  <p className="text-sm text-white/70">Responda perguntas e ganhe pontos</p>
                </div>
                <Calendar className="text-furia-purple group-hover:text-furia-orange transition-colors" size={28} />
              </div>
            </Link>
            
            <Link to="/battles" className="bg-furia-black/60 backdrop-blur-md rounded-xl p-6 border border-furia-purple/20
                                        hover:border-furia-purple transition-all group animation-delay-200 animate-fade-in">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-orbitron font-bold text-white mb-2">Batalhas</h2>
                  <p className="text-sm text-white/70">Participe dos desafios entre torcidas</p>
                </div>
                <Flag className="text-furia-purple group-hover:text-furia-orange transition-colors" size={28} />
              </div>
            </Link>
            
            <Link to="/ranking" className="bg-furia-black/60 backdrop-blur-md rounded-xl p-6 border border-furia-purple/20
                                        hover:border-furia-purple transition-all group animation-delay-300 animate-fade-in">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-orbitron font-bold text-white mb-2">Ranking</h2>
                  <p className="text-sm text-white/70">Veja sua posição entre os torcedores</p>
                </div>
                <Trophy className="text-furia-purple group-hover:text-furia-orange transition-colors" size={28} />
              </div>
            </Link>
            
            <Link to="/cards" className="bg-furia-black/60 backdrop-blur-md rounded-xl p-6 border border-furia-purple/20
                                      hover:border-furia-purple transition-all group animation-delay-100 animate-fade-in">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-orbitron font-bold text-white mb-2">Cards</h2>
                  <p className="text-sm text-white/70">Confira sua coleção de cards dos jogadores</p>
                </div>
                <Star className="text-furia-purple group-hover:text-furia-orange transition-colors" size={28} />
              </div>
            </Link>
            
            <Link to="/prizes" className="bg-furia-black/60 backdrop-blur-md rounded-xl p-6 border border-furia-purple/20
                                      hover:border-furia-purple transition-all group animation-delay-200 animate-fade-in">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-orbitron font-bold text-white mb-2">Prêmios</h2>
                  <p className="text-sm text-white/70">Veja prêmios disponíveis para resgate</p>
                </div>
                <Gift className="text-furia-purple group-hover:text-furia-orange transition-colors" size={28} />
              </div>
            </Link>
            
            <Link to="/lives" className="bg-furia-black/60 backdrop-blur-md rounded-xl p-6 border border-furia-purple/20
                                      hover:border-furia-purple transition-all group animation-delay-200 animate-fade-in">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-orbitron font-bold text-white mb-2">Lives</h2>
                  <p className="text-sm text-white/70">Veja ao vivo os jogos da Fúria</p>
                </div>
                <Gift className="text-furia-purple group-hover:text-furia-orange transition-colors" size={28} />
              </div>
            </Link>

          </div>
          
          {/* Activity Feed */}
          <div className="bg-furia-black/60 backdrop-blur-md rounded-xl p-6 border border-furia-purple/20 animation-delay-300 animate-fade-in">
            <h2 className="text-xl font-orbitron font-bold text-white mb-4">Atividades Recentes</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 border-b border-furia-purple/10">
                <div className="w-2 h-2 rounded-full bg-furia-orange"></div>
                <p className="text-sm text-white/80">Quiz semanal liberado! Responda para ganhar 50 pontos</p>
              </div>
              <div className="flex items-center space-x-3 p-3 border-b border-furia-purple/10">
                <div className="w-2 h-2 rounded-full bg-furia-purple"></div>
                <p className="text-sm text-white/80">Nova batalha de torcida: CS vs LoL - Participe!</p>
              </div>
              <div className="flex items-center space-x-3 p-3 border-b border-furia-purple/10">
                <div className="w-2 h-2 rounded-full bg-furia-orange"></div>
                <p className="text-sm text-white/80">Novos cards desbloqueados para jogadores ativos</p>
              </div>
              <div className="flex items-center space-x-3 p-3">
                <div className="w-2 h-2 rounded-full bg-furia-purple"></div>
                <p className="text-sm text-white/80">Sorteio da semana: Ingressos para Kings League!</p>
              </div>
            </div>
            
            <div className="mt-6">
              <Link to="/quiz" className="inline-block w-full sm:w-auto text-center btn-secondary">
                Responder Quiz do Dia
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
