import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '../contexts/AuthContext'; 

const supabaseUrl = 'https://uoelpjllkzkfayqptcxz.supabase.co';  // URL do seu projeto Supabase
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvZWxwamxsa3prZmF5cXB0Y3h6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxNTc4MjUsImV4cCI6MjA2MTczMzgyNX0.pjRFD_pP1_idKdWxaBCdqLr2TY3ZSm4ohSZm3wt8F2c';  // Chave de API do Supabase

export const supabase = createClient(supabaseUrl, supabaseKey);


type Card = {
  id: number;
  nome_jogador: string;
  descricao: string;
  imagem_url: string;
  raridade: 'comum' | 'raro' | 'lendário';
};

const PackOpening = ({ userId }: { userId: number }) => {
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth(); 
  const [myCards, setMyCards] = useState<Card[]>([]);
  const [loadingCards, setLoadingCards] = useState(true);
  
  const fetchMyCards = async () => {
    if (!user) return;

    const { data: userCards, error: userCardsError } = await supabase
      .from('user_cards')
      .select('id, user_id, card_id, adquirido_em')
      .eq('user_id', user.id);

    if (userCardsError) {
      console.error('Erro ao buscar user_cards:', userCardsError.message);
      setLoadingCards(false);
      return;
    }

    const cardIds = userCards.map((uc: any) => uc.card_id);

    if (cardIds.length === 0) {
      setMyCards([]);
      setLoadingCards(false);
      return;
    }

    const { data: cardsData, error: cardsError } = await supabase
      .from('cards')
      .select('id, nome_jogador, descricao, imagem_url, raridade')
      .in('id', cardIds);

    if (cardsError) {
      console.error('Erro ao buscar cards:', cardsError.message);
      setLoadingCards(false);
      return;
    }

    setMyCards(cardsData || []);
    setLoadingCards(false);
  };

  useEffect(() => {
    if (user) {
      fetchMyCards();
    }
  }, [user]);

  const sortearCard = async () => {
    try {
      const { data, error } = await supabase
        .from('cards') 
        .select('id, nome_jogador, descricao, imagem_url, raridade')

      if (error) {
        console.error('Erro ao buscar card aleatório:', error.message);
        return;
      }

      if (data && data.length > 0) {
        const sorteado = data[Math.floor(Math.random() * data.length)]; 
        setCurrentCard(sorteado);

        setIsSaving(true);
        const { error: insertError } = await supabase
                    .from('user_cards')
                    .insert([{
                      user_id: user.id,
                      card_id: sorteado.id,
                      adquirido_em: new Date().toISOString(),
                    }]);

                    if (insertError) {
                      console.error('Erro ao salvar card:', insertError.message);
                    }
        setIsSaving(false);
      }
    } catch (error) {
      console.error('Erro ao sortear o card:', error);
      setIsSaving(false);
    }
  };
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold text-white mb-4">Abra seu pacote!</h2>
      <button
        onClick={sortearCard}
        disabled={isSaving}
        className="btn-primary mb-6"
      >
        {isSaving ? 'Salvando...' : 'Sortear Card'}
      </button>

      {currentCard && (
        <div className="bg-furia-black/70 border border-furia-purple/30 p-4 rounded-xl shadow-lg text-center mb-8">
          <img
            src={currentCard.imagem_url}
            alt={currentCard.nome_jogador}
            className="w-48 h-48 object-cover mx-auto rounded-lg mb-4"
          />
          <h3 className="text-xl text-white">{currentCard.nome_jogador}</h3>
          <p className="text-gray-400">{currentCard.descricao}</p>
          <p
            className={`mt-2 ${
              currentCard.raridade === 'lendário'
                ? 'text-yellow-400'
                : currentCard.raridade === 'raro'
                ? 'text-purple-400'
                : 'text-gray-300'
            }`}
          >
            {currentCard.raridade.toUpperCase()}
          </p>
        </div>
      )}

      <h2 className="text-2xl font-bold text-white mb-4">Seus Cards</h2>
      {loadingCards ? (
        <div className="text-white">Carregando seus cards...</div>
      ) : myCards.length === 0 ? (
        <p className="text-white">Você ainda não possui cards.</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
          {myCards.map((card) => (
            <div key={card.id} className="bg-furia-black/70 border border-furia-purple/30 p-4 rounded-xl shadow-lg text-center w-60">
              <img
                src={card.imagem_url}
                alt={card.nome_jogador}
                className="w-48 h-48 object-cover mx-auto rounded-lg mb-4"
              />
              <h3 className="text-xl text-white">{card.nome_jogador}</h3>
              <p className="text-gray-400">{card.descricao}</p>
              <p
                className={`mt-2 ${
                  card.raridade === 'lendário'
                    ? 'text-yellow-400'
                    : card.raridade === 'raro'
                    ? 'text-purple-400'
                    : 'text-gray-300'
                }`}
              >
                {card.raridade.toUpperCase()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PackOpening;