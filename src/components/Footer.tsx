
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-furia-black py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-orbitron font-bold text-gradient">FURIA</span>
              <span className="text-lg font-semibold text-white">Fans</span>
            </Link>
            <p className="text-gray-400 mt-4 text-sm">
              A plataforma oficial dos torcedores da FURIA. Participe de quizzes, 
              batalhas de torcida e colecione cards digitais.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-400 hover:text-furia-purple transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/quiz" className="text-gray-400 hover:text-furia-purple transition-colors">
                  Quiz
                </Link>
              </li>
              <li>
                <Link to="/battles" className="text-gray-400 hover:text-furia-purple transition-colors">
                  Batalhas de Torcida
                </Link>
              </li>
              <li>
                <Link to="/cards" className="text-gray-400 hover:text-furia-purple transition-colors">
                  Cards Digitais
                </Link>
              </li>
              <li>
                <Link to="/prizes" className="text-gray-400 hover:text-furia-purple transition-colors">
                  Prêmios
                </Link>
              </li>
              <li>
                <Link to="/ranking" className="text-gray-400 hover:text-furia-purple transition-colors">
                  Ranking
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-4">Redes Sociais</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://twitter.com/furia" target="_blank" rel="noopener noreferrer"
                  className="text-gray-400 hover:text-furia-purple transition-colors">
                  Twitter
                </a>
              </li>
              <li>
                <a href="https://instagram.com/furia" target="_blank" rel="noopener noreferrer"
                  className="text-gray-400 hover:text-furia-purple transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://youtube.com/furia" target="_blank" rel="noopener noreferrer"
                  className="text-gray-400 hover:text-furia-purple transition-colors">
                  YouTube
                </a>
              </li>
              <li>
                <a href="https://twitch.tv/furia" target="_blank" rel="noopener noreferrer"
                  className="text-gray-400 hover:text-furia-purple transition-colors">
                  Twitch
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} FURIA Fans. Todos os direitos reservados.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/terms" className="text-gray-500 text-sm hover:text-furia-purple transition-colors">
              Termos de Uso
            </Link>
            <Link to="/privacy" className="text-gray-500 text-sm hover:text-furia-purple transition-colors">
              Política de Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
