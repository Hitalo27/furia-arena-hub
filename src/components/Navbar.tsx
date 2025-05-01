
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const isLoggedIn = localStorage.getItem('user') !== null;
  
  const menuItems = isLoggedIn 
    ? [
        { title: 'Dashboard', path: '/dashboard' },
        { title: 'Quiz', path: '/quiz' },
        { title: 'Batalhas', path: '/battles' },
        { title: 'Cards', path: '/cards' },
        { title: 'Prêmios', path: '/prizes' },
        { title: 'Ranking', path: '/ranking' }
      ]
    : [
        { title: 'Entrar', path: '/login' },
      ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-furia-black/80 backdrop-blur-md z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-orbitron font-bold text-gradient">FURIA</span>
            <span className="text-lg font-semibold text-white">Fans</span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <Link
                key={item.title}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-furia-purple
                  ${location.pathname === item.path ? 'text-furia-purple' : 'text-white'}`}
              >
                {item.title}
              </Link>
            ))}
            
            {isLoggedIn && (
              <button
                onClick={() => {
                  localStorage.removeItem('user');
                  window.location.href = '/';
                }}
                className="text-sm font-medium text-white hover:text-furia-orange transition-colors"
              >
                Sair
              </button>
            )}
          </div>
          
          {/* Mobile Menu Toggle */}
          <button 
            onClick={toggleMenu} 
            className="md:hidden text-white hover:text-furia-purple transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-3 border-t border-furia-purple/20 mt-3 animate-fade-in">
            <div className="flex flex-col space-y-3">
              {menuItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.path}
                  className={`text-sm font-medium transition-colors block py-2 px-3 rounded-md
                    ${location.pathname === item.path 
                      ? 'bg-furia-purple/20 text-furia-purple' 
                      : 'text-white hover:bg-furia-purple/10'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.title}
                </Link>
              ))}
              
              {isLoggedIn && (
                <button
                  onClick={() => {
                    localStorage.removeItem('user');
                    window.location.href = '/';
                    setIsMenuOpen(false);
                  }}
                  className="text-sm font-medium text-white hover:text-furia-orange transition-colors 
                            block py-2 px-3 text-left rounded-md hover:bg-furia-orange/10"
                >
                  Sair
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
