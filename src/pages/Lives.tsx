import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface LiveGame {
  id: string;
  title: string;
  streamUrl: string; // URL do Twitch, YouTube, etc.
  gameName: string;
  startTime: string;
}

export default function LiveGames() {
  const [liveGames, setLiveGames] = useState<LiveGame[]>([]);

  useEffect(() => {
    // Aqui simula buscar transmissões ao vivo (pode virar API depois)
    const fetchLiveGames = async () => {
      const games = [
        {
          id: "1",
          title: "FURIA vs G2 - ESL Pro League",
          streamUrl: "https://twitch.tv/furiagg", 
          gameName: "CS:GO",
          startTime: "2025-05-03T18:00:00Z",
        },
        {
          id: "2",
          title: "FURIA vs T1 - CBLOL",
          streamUrl: "https://youtube.com/watch?v=XXXXX",
          gameName: "League of Legends",
          startTime: "2025-05-03T20:00:00Z",
        },
      ];
      setLiveGames(games);
    };

    fetchLiveGames();
  }, []);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Jogos da FURIA ao Vivo 🎮</h1>
      {liveGames.length === 0 ? (
        <p className="text-gray-500">Nenhuma transmissão ao vivo agora.</p>
      ) : (
        liveGames.map(game => (
          <Card key={game.id}>
            <CardContent className="p-4 space-y-2">
              <h2 className="text-xl font-semibold">{game.title}</h2>
              <p className="text-gray-600">Jogo: {game.gameName}</p>
              <p className="text-gray-500">Início: {new Date(game.startTime).toLocaleString()}</p>
              <Button
                className="mt-2"
                onClick={() => window.open(game.streamUrl, "_blank")}
              >
                Assistir Ao Vivo
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
