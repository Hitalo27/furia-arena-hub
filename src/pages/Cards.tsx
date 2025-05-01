
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PlayerCard from '../components/PlayerCard';

interface Card {
  id: string;
  name: string;
  nickname: string;
  game: string;
  image: string;
  bio: string;
  rarity: 'common' | 'rare' | 'legendary';
  pointsToUnlock: number;
}

const sampleCards: Card[] = [
  {
    id: '1',
    name: 'Andrei Piovezan',
    nickname: 'arT',
    game: 'CS:GO',
    image: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?q=80&w=2224&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    bio: 'Andrei "arT" Piovezan é um jogador profissional de CS:GO brasileiro e capitão do time da FURIA. Conhecido pelo seu estilo agressivo e liderança determinada, arT tem sido fundamental no sucesso da equipe.',
    rarity: 'legendary',
    pointsToUnlock: 0
  },
  {
    id: '2',
    name: 'Kaike Cerato',
    nickname: 'KSCERATO',
    game: 'CS:GO',
    image: 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    bio: 'Kaike "KSCERATO" Cerato é um jogador profissional brasileiro de CS:GO que compete pela FURIA. Reconhecido por sua incrível precisão e consistência, é considerado um dos melhores jogadores do Brasil.',
    rarity: 'legendary',
    pointsToUnlock: 100
  },
  {
    id: '3',
    name: 'Vinicius Figueiredo',
    nickname: 'VINI',
    game: 'CS:GO',
    image: 'https://images.unsplash.com/photo-1530819568329-97653eafbbfa?q=80&w=1793&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    bio: 'Vinicius "VINI" Figueiredo é um jogador profissional brasileiro de CS:GO da FURIA. Conhecido por seu papel de suporte e trabalho em equipe, VINI é uma parte essencial do sucesso do time.',
    rarity: 'rare',
    pointsToUnlock: 50
  },
  {
    id: '4',
    name: 'Rafael Costa',
    nickname: 'saffee',
    game: 'CS:GO',
    image: 'https://images.unsplash.com/photo-1640079421264-61f3ba0abde8?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    bio: 'Rafael "saffee" Costa é um jogador profissional brasileiro de CS:GO que atua como AWPer pela FURIA. Com sua mira precisa e reflexos rápidos, ele é conhecido por mudar o rumo de partidas importantes.',
    rarity: 'rare',
    pointsToUnlock: 200
  },
  {
    id: '5',
    name: 'Gabriel Toledo',
    nickname: 'FalleN',
    game: 'CS:GO',
    image: 'https://images.unsplash.com/photo-1542779283-429940ce8336?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    bio: 'Gabriel "FalleN" Toledo é um jogador e líder lendário do cenário brasileiro de CS:GO. Com anos de experiência e títulos, FalleN é reconhecido mundialmente como o "Godfather" do CS brasileiro.',
    rarity: 'legendary',
    pointsToUnlock: 300
  },
  {
    id: '6',
    name: 'André Abreu',
    nickname: 'honda',
    game: 'Valorant',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    bio: 'André "honda" Abreu é um jogador profissional de Valorant que representa a FURIA. Com sua excelente pontaria e conhecimento do jogo, honda tem demonstrado grande potencial na cena competitiva.',
    rarity: 'common',
    pointsToUnlock: 75
  }
];

const Cards = () => {
  const [filter, setFilter] = useState<string>('all');
  const [cards, setCards] = useState<Card[]>([]);
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      // In a real app, fetch user's cards from an API
      setCards(sampleCards);
    }
  }, [isLoggedIn, navigate]);
  
  if (!user) {
    return null;
  }
  
  const filteredCards = filter === 'all' 
    ? cards 
    : cards.filter(card => card.game.toLowerCase() === filter.toLowerCase());

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-furia-black to-furia-purple-dark/70">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-2xl md:text-3xl font-orbitron font-bold text-white mb-2">
              Seus Cards <span className="text-gradient">Digitais</span>
            </h1>
            <p className="text-white/70">
              Colete cards de jogadores da FURIA para desbloquear conteúdo exclusivo!
            </p>
          </div>
          
          {/* Filters */}
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-full text-sm transition-colors
                          ${filter === 'all' 
                            ? 'bg-furia-purple text-white' 
                            : 'bg-furia-black/40 text-white/70 hover:bg-furia-purple/20'}`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilter('CS:GO')}
                className={`px-4 py-2 rounded-full text-sm transition-colors
                          ${filter === 'CS:GO' 
                            ? 'bg-furia-purple text-white' 
                            : 'bg-furia-black/40 text-white/70 hover:bg-furia-purple/20'}`}
              >
                CS:GO
              </button>
              <button
                onClick={() => setFilter('Valorant')}
                className={`px-4 py-2 rounded-full text-sm transition-colors
                          ${filter === 'Valorant' 
                            ? 'bg-furia-purple text-white' 
                            : 'bg-furia-black/40 text-white/70 hover:bg-furia-purple/20'}`}
              >
                Valorant
              </button>
              <button
                onClick={() => setFilter('LoL')}
                className={`px-4 py-2 rounded-full text-sm transition-colors
                          ${filter === 'LoL' 
                            ? 'bg-furia-purple text-white' 
                            : 'bg-furia-black/40 text-white/70 hover:bg-furia-purple/20'}`}
              >
                LoL
              </button>
              <button
                onClick={() => setFilter('Futebol')}
                className={`px-4 py-2 rounded-full text-sm transition-colors
                          ${filter === 'Futebol' 
                            ? 'bg-furia-purple text-white' 
                            : 'bg-furia-black/40 text-white/70 hover:bg-furia-purple/20'}`}
              >
                Futebol
              </button>
            </div>
            
            <div className="flex items-center justify-between bg-furia-black/50 backdrop-blur-sm p-4 rounded-lg">
              <div>
                <p className="text-white">
                  <span className="font-medium">{filteredCards.length}</span> cards encontrados
                </p>
              </div>
              <div className="text-white/70">
                <p className="text-sm">
                  Seus pontos: <span className="text-furia-purple font-medium">{user.points}</span>
                </p>
              </div>
            </div>
          </div>
          
          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCards.map(card => (
              <div key={card.id} className="animate-fade-in">
                <PlayerCard
                  id={card.id}
                  name={card.name}
                  nickname={card.nickname}
                  game={card.game}
                  image={card.image}
                  bio={card.bio}
                  rarity={card.rarity}
                  isLocked={user.points < card.pointsToUnlock}
                />
                
                {user.points < card.pointsToUnlock && (
                  <div className="mt-2 text-center text-sm text-white/70">
                    <span className="text-furia-orange">{card.pointsToUnlock - user.points}</span> pontos para desbloquear
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {filteredCards.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white/70">Nenhum card encontrado para esta modalidade.</p>
            </div>
          )}
          
          {/* Card Collection Info */}
          <div className="mt-12 bg-furia-black/60 backdrop-blur-md rounded-xl p-6 border border-furia-purple/20">
            <h2 className="text-xl font-orbitron font-bold text-white mb-4">Sobre sua Coleção</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-furia-purple/10 p-4 rounded-lg border border-furia-purple/20">
                <h3 className="text-sm text-white/70 mb-1">Cards Desbloqueados</h3>
                <p className="text-2xl font-medium text-white">
                  {cards.filter(card => user.points >= card.pointsToUnlock).length}/{cards.length}
                </p>
              </div>
              <div className="bg-furia-purple/10 p-4 rounded-lg border border-furia-purple/20">
                <h3 className="text-sm text-white/70 mb-1">Cards Lendários</h3>
                <p className="text-2xl font-medium text-white">
                  {cards.filter(card => card.rarity === 'legendary' && user.points >= card.pointsToUnlock).length}/{cards.filter(card => card.rarity === 'legendary').length}
                </p>
              </div>
              <div className="bg-furia-purple/10 p-4 rounded-lg border border-furia-purple/20">
                <h3 className="text-sm text-white/70 mb-1">Próximo Desbloqueio</h3>
                <p className="text-2xl font-medium text-white">
                  {Math.min(...cards.filter(card => user.points < card.pointsToUnlock).map(card => card.pointsToUnlock - user.points) || 0)} pontos
                </p>
              </div>
            </div>
            
            <p className="text-center text-white/70">
              Novos cards são adicionados regularmente. Ganhe mais pontos para completar sua coleção!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cards;
