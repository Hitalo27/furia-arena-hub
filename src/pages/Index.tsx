
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Trophy, Users, Star } from 'lucide-react';

const Index = () => {
  const { isLoggedIn } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero section */}
      <section className="hero-gradient min-h-screen pt-24 pb-16 flex flex-col justify-center">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-6 animate-slide-in">
              Viva a emoção de ser FURIOSO!
            </h1>
            <p className="text-lg text-white/80 mb-10 animation-delay-100 animate-slide-in">
              Participe de quizzes, batalhas de torcida e colecione cards digitais
              exclusivos do seu time favorito. Junte-se à comunidade FURIA Fans!
            </p>
            <div className="animation-delay-200 animate-slide-in">
              <Link 
                to={isLoggedIn ? "/dashboard" : "/login"} 
                className="btn-primary inline-block text-lg"
              >
                {isLoggedIn ? 'Acessar Dashboard' : 'Entrar no FURIA Fans'}
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features section */}
      <section className="py-20 bg-gradient-to-b from-furia-black to-furia-purple-dark">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">
            Experiência <span className="text-furia-purple">completa</span> para torcedores
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-furia-black/50 backdrop-blur-sm p-6 rounded-xl border border-furia-purple/20
                          hover:border-furia-purple/50 transition-all duration-300 group">
              <div className="w-12 h-12 bg-furia-purple/20 rounded-full flex items-center justify-center mb-4
                           group-hover:bg-furia-purple/30 transition-colors">
                <Calendar className="text-furia-purple" />
              </div>
              <h3 className="text-xl font-orbitron font-bold text-white mb-2">Quizzes Diários</h3>
              <p className="text-white/70 text-sm">
                Teste seus conhecimentos sobre a FURIA com nossos quizzes diários e ganhe pontos.
              </p>
            </div>
            
            <div className="bg-furia-black/50 backdrop-blur-sm p-6 rounded-xl border border-furia-purple/20
                          hover:border-furia-purple/50 transition-all duration-300 group">
              <div className="w-12 h-12 bg-furia-purple/20 rounded-full flex items-center justify-center mb-4
                           group-hover:bg-furia-purple/30 transition-colors">
                <Users className="text-furia-purple" />
              </div>
              <h3 className="text-xl font-orbitron font-bold text-white mb-2">Batalhas de Torcida</h3>
              <p className="text-white/70 text-sm">
                Represente sua modalidade favorita em desafios semanais contra outros torcedores.
              </p>
            </div>
            
            <div className="bg-furia-black/50 backdrop-blur-sm p-6 rounded-xl border border-furia-purple/20
                          hover:border-furia-purple/50 transition-all duration-300 group">
              <div className="w-12 h-12 bg-furia-purple/20 rounded-full flex items-center justify-center mb-4
                           group-hover:bg-furia-purple/30 transition-colors">
                <Star className="text-furia-purple" />
              </div>
              <h3 className="text-xl font-orbitron font-bold text-white mb-2">Cards Exclusivos</h3>
              <p className="text-white/70 text-sm">
                Colecione cards digitais dos seus jogadores favoritos da FURIA e desbloqueie conteúdo exclusivo.
              </p>
            </div>
            
            <div className="bg-furia-black/50 backdrop-blur-sm p-6 rounded-xl border border-furia-purple/20
                          hover:border-furia-purple/50 transition-all duration-300 group">
              <div className="w-12 h-12 bg-furia-purple/20 rounded-full flex items-center justify-center mb-4
                           group-hover:bg-furia-purple/30 transition-colors">
                <Trophy className="text-furia-purple" />
              </div>
              <h3 className="text-xl font-orbitron font-bold text-white mb-2">Prêmios Incríveis</h3>
              <p className="text-white/70 text-sm">
                Concorra a ingressos para a Kings League, produtos oficiais da FURIA e muito mais.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-furia-purple-dark to-furia-black relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Pronto para ser parte desta <span className="text-furia-purple">comunidade</span>?
            </h2>
            <p className="text-lg text-white/80 mb-10">
              Cadastre-se gratuitamente e comece a participar agora mesmo de todas as atividades exclusivas.
            </p>
            <Link 
              to={isLoggedIn ? "/dashboard" : "/login"} 
              className="btn-secondary inline-block text-lg"
            >
              {isLoggedIn ? 'Voltar ao Dashboard' : 'Começar Agora'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
