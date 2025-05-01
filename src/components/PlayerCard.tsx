
import { useState } from 'react';

interface PlayerCardProps {
  id: string;
  name: string;
  nickname: string;
  game: string;
  image: string;
  bio: string;
  rarity: 'common' | 'rare' | 'legendary';
  isLocked?: boolean;
}

const PlayerCard = ({ name, nickname, game, image, bio, rarity, isLocked = false }: PlayerCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  const rarityStyles = {
    common: "from-gray-700 to-gray-900 border-gray-500",
    rare: "from-blue-700 to-blue-900 border-blue-500",
    legendary: "from-furia-purple to-furia-purple-dark border-furia-purple"
  };
  
  const handleFlip = () => {
    if (!isLocked) {
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <div 
      className={`relative w-full max-w-[280px] aspect-[3/4] rounded-lg overflow-hidden cursor-pointer
                  transition-transform duration-700 transform-gpu perspective-1000 
                  ${isLocked ? 'opacity-70 grayscale' : 'hover:shadow-lg hover:shadow-furia-purple/30'}`}
      style={{
        transformStyle: 'preserve-3d',
        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
      }}
      onClick={handleFlip}
    >
      {/* Front side */}
      <div 
        className={`absolute inset-0 bg-gradient-to-b ${rarityStyles[rarity]}
                    border-2 rounded-lg overflow-hidden
                    backface-hidden flex flex-col justify-between`}
      >
        <div className="p-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold px-2 py-1 rounded bg-black/50 text-white">
              {game}
            </span>
            <div className="w-2 h-2 rounded-full bg-furia-orange animate-pulse"></div>
          </div>
          
          <div className="mt-2 text-center">
            <h4 className="text-lg font-orbitron font-bold text-white">{nickname}</h4>
            <p className="text-xs text-white/70">{name}</p>
          </div>
        </div>
        
        <div className="relative h-full overflow-hidden">
          <img 
            src={image} 
            alt={nickname}
            className="w-full h-full object-cover object-center"
          />
          {isLocked && (
            <div className="absolute inset-0 bg-furia-black/70 flex items-center justify-center">
              <div className="bg-furia-black/80 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-black/70 p-3 text-center">
          <span className="text-xs uppercase tracking-wider text-white/70">
            {rarity === 'legendary' ? 'Lendário' : rarity === 'rare' ? 'Raro' : 'Comum'}
          </span>
          {!isLocked && (
            <p className="text-xs italic text-white/50 mt-1">Toque para ver detalhes</p>
          )}
        </div>
      </div>
      
      {/* Back side */}
      <div 
        className={`absolute inset-0 bg-gradient-to-b ${rarityStyles[rarity]}
                    border-2 rounded-lg p-4 overflow-y-auto
                    backface-hidden`}
        style={{ transform: 'rotateY(180deg)' }}
      >
        <div className="flex flex-col h-full justify-between">
          <div>
            <h4 className="text-lg font-orbitron font-bold text-white text-center mb-2">{nickname}</h4>
            <h5 className="text-sm text-white/70 text-center mb-4">{name}</h5>
            
            <div className="space-y-2 mt-4">
              <p className="text-xs text-white/90 leading-relaxed">
                {bio}
              </p>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <span className="text-xs uppercase tracking-wider text-white/70">
              {rarity === 'legendary' ? 'Lendário' : rarity === 'rare' ? 'Raro' : 'Comum'}
            </span>
            <p className="text-xs italic text-white/50 mt-1">Toque para voltar</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
