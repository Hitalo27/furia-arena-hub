
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Trophy, Ticket, ShoppingBag, Gift } from 'lucide-react';

interface Prize {
  id: string;
  name: string;
  description: string;
  image: string;
  requiredPoints: number;
  available: boolean;
  isSweepstakes: boolean;
}

const prizes: Prize[] = [
  {
    id: '1',
    name: 'Ingresso Kings League',
    description: 'Ingressos exclusivos para a próxima partida da Kings League. Inclui área VIP e experiência exclusiva.',
    image: 'https://images.unsplash.com/photo-1531857475897-48f2820fbf58?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    requiredPoints: 0,
    available: true,
    isSweepstakes: true
  },
  {
    id: '2',
    name: 'Camiseta Oficial FURIA',
    description: 'Camiseta oficial da FURIA com seu nome personalizado nas costas. Inclui envio para todo o Brasil.',
    image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    requiredPoints: 500,
    available: true,
    isSweepstakes: false
  },
  {
    id: '3',
    name: 'Meet & Greet Virtual',
    description: 'Conversa exclusiva por vídeo com um jogador da FURIA à sua escolha. Duração: 15 minutos.',
    image: 'https://images.unsplash.com/photo-1530811761207-8d9d22f0a141?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    requiredPoints: 350,
    available: true,
    isSweepstakes: false
  },
  {
    id: '4',
    name: 'Pacote de Produtos FURIA',
    description: 'Kit completo com mousepad, boné, caneca e adesivos exclusivos da FURIA.',
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    requiredPoints: 200,
    available: true,
    isSweepstakes: false
  },
  {
    id: '5',
    name: 'Bastidores de Evento',
    description: 'Acesso exclusivo aos bastidores de um evento da FURIA. Conheça a equipe e veja como funciona a preparação.',
    image: 'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    requiredPoints: 0,
    available: true,
    isSweepstakes: true
  }
];

const Prizes = () => {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);
  
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-furia-black to-furia-purple-dark/70">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-2xl md:text-3xl font-orbitron font-bold text-white mb-2">
              Prêmios <span className="text-gradient">Exclusivos</span>
            </h1>
            <p className="text-white/70">
              Troque seus pontos por prêmios ou participe de sorteios exclusivos
            </p>
          </div>
          
          {/* User Points Status */}
          <div className="bg-furia-black/60 backdrop-blur-md rounded-xl p-6 border border-furia-purple/20 mb-8 flex flex-col md:flex-row items-center justify-between animate-fade-in">
            <div className="flex flex-col md:flex-row items-center mb-4 md:mb-0">
              <div className="bg-furia-purple/20 w-16 h-16 rounded-full flex items-center justify-center mb-3 md:mb-0 md:mr-4">
                <Trophy className="text-furia-purple h-8 w-8" />
              </div>
              <div>
                <p className="text-white/70 text-center md:text-left">Seus pontos</p>
                <h2 className="text-2xl md:text-3xl font-orbitron font-bold text-white text-center md:text-left">
                  {user.points} <span className="text-furia-purple">pts</span>
                </h2>
              </div>
            </div>
            <div>
              <div className="bg-furia-purple/10 px-4 py-2 rounded-lg">
                <p className="text-white text-sm text-center">
                  Status de sorteio: <span className={user.inSweepstakes ? 'text-green-400' : 'text-red-400'}>
                    {user.inSweepstakes ? 'Participando' : 'Não participando'}
                  </span>
                </p>
              </div>
            </div>
          </div>
          
          {/* Sweepstakes Section */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Ticket className="text-furia-orange h-6 w-6 mr-2" />
              <h2 className="text-xl font-orbitron font-bold text-white">Sorteios Ativos</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {prizes.filter(prize => prize.isSweepstakes).map(prize => (
                <div key={prize.id} className="bg-furia-black/60 backdrop-blur-md rounded-xl overflow-hidden border border-furia-purple/20 animate-fade-in">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={prize.image} 
                      alt={prize.name} 
                      className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-orbitron font-bold text-white mb-2">{prize.name}</h3>
                    <p className="text-white/70 text-sm mb-4">{prize.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="bg-furia-orange px-3 py-1 rounded-full">
                        <span className="text-xs font-medium text-white">Sorteio Semanal</span>
                      </div>
                      {user.inSweepstakes ? (
                        <button className="btn-secondary py-2 px-4 text-sm">
                          Já Participando
                        </button>
                      ) : (
                        <button 
                          onClick={() => navigate('/quiz')} 
                          className="bg-furia-black border border-furia-orange/50 text-white py-2 px-4 rounded-md text-sm hover:bg-furia-orange/10 transition-colors"
                        >
                          Responda o Quiz para Participar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Redeemable Prizes */}
          <div>
            <div className="flex items-center mb-6">
              <Gift className="text-furia-purple h-6 w-6 mr-2" />
              <h2 className="text-xl font-orbitron font-bold text-white">Prêmios Resgatáveis</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {prizes.filter(prize => !prize.isSweepstakes).map(prize => {
                const canRedeem = user.points >= prize.requiredPoints;
                
                return (
                  <div 
                    key={prize.id} 
                    className={`bg-furia-black/60 backdrop-blur-md rounded-xl overflow-hidden border border-furia-purple/20 
                              animate-fade-in ${!canRedeem ? 'opacity-80' : ''}`}
                  >
                    <div className="h-36 overflow-hidden relative">
                      <img 
                        src={prize.image} 
                        alt={prize.name} 
                        className={`w-full h-full object-cover object-center transition-transform duration-500 
                                  ${canRedeem ? 'hover:scale-110' : ''}`}
                      />
                      {!canRedeem && (
                        <div className="absolute inset-0 bg-furia-black/60 flex items-center justify-center">
                          <div className="text-center">
                            <ShoppingBag className="mx-auto h-6 w-6 text-furia-orange mb-2" />
                            <p className="text-white text-sm">
                              Faltam <span className="text-furia-orange font-medium">{prize.requiredPoints - user.points}</span> pontos
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-white mb-1">{prize.name}</h3>
                      <p className="text-white/70 text-xs mb-3 line-clamp-2">{prize.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="bg-furia-purple/20 px-3 py-1 rounded-full">
                          <span className="text-xs font-medium text-white">{prize.requiredPoints} pontos</span>
                        </div>
                        <button 
                          disabled={!canRedeem}
                          className={`py-2 px-4 rounded-md text-sm
                                    ${canRedeem 
                                      ? 'bg-furia-purple text-white hover:bg-furia-purple/90 transition-colors' 
                                      : 'bg-furia-black/40 text-white/50 cursor-not-allowed'}`}
                        >
                          {canRedeem ? 'Resgatar' : 'Pontos Insuficientes'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* How to earn more points */}
          <div className="mt-12 bg-furia-black/60 backdrop-blur-md rounded-xl p-6 border border-furia-purple/20 text-center">
            <h2 className="text-xl font-orbitron font-bold text-white mb-2">Ganhe mais pontos!</h2>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto">
              Quanto mais você participar da comunidade FURIA Fans, mais pontos acumulará para trocar por prêmios exclusivos.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-furia-purple/10 p-4 rounded-lg border border-furia-purple/20">
                <p className="text-white font-medium">Responder Quiz</p>
                <p className="text-furia-purple text-sm">+25 pontos por acerto</p>
              </div>
              <div className="bg-furia-purple/10 p-4 rounded-lg border border-furia-purple/20">
                <p className="text-white font-medium">Enviar Curiosidade</p>
                <p className="text-furia-purple text-sm">+15 pontos por envio</p>
              </div>
              <div className="bg-furia-purple/10 p-4 rounded-lg border border-furia-purple/20">
                <p className="text-white font-medium">Vencer Batalhas</p>
                <p className="text-furia-purple text-sm">+100 pontos por vitória</p>
              </div>
              <div className="bg-furia-purple/10 p-4 rounded-lg border border-furia-purple/20">
                <p className="text-white font-medium">Login Diário</p>
                <p className="text-furia-purple text-sm">+5 pontos por dia</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prizes;
