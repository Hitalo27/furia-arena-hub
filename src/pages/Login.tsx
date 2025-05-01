
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const Login = () => {
  const [loginCpf, setLoginCpf] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerCpf, setRegisterCpf] = useState('');
  const [favoriteMode, setFavoriteMode] = useState<'Jogos' | 'Futebol'>('Jogos');
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loginCpf.trim() === '') {
      toast.error('Por favor, informe seu CPF');
      return;
    }
    
    const success = login(loginCpf);
    
    if (success) {
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } else {
      toast.error('CPF não encontrado. Por favor, verifique ou cadastre-se.');
    }
  };
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerName.trim() === '') {
      toast.error('Por favor, informe seu nome');
      return;
    }
    
    if (registerCpf.trim() === '') {
      toast.error('Por favor, informe seu CPF');
      return;
    }
    
    if (!termsAccepted) {
      toast.error('Você precisa aceitar os termos de uso');
      return;
    }
    
    const success = register(registerName, registerCpf, favoriteMode);
    
    if (success) {
      toast.success('Cadastro realizado com sucesso!');
      navigate('/dashboard');
    } else {
      toast.error('Erro ao cadastrar. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16 flex items-center justify-center bg-gradient-to-b from-furia-black to-furia-purple-dark/70">
      <div className="w-full max-w-md p-6 bg-furia-black/60 backdrop-blur-md rounded-xl shadow-xl border border-furia-purple/20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-orbitron font-bold text-gradient">FURIA Fans</h1>
          <p className="text-white/70 mt-2">Entre para começar a sua jornada</p>
        </div>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Cadastro</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="cpf" className="block text-sm font-medium text-white mb-1">
                  CPF
                </label>
                <input
                  type="text"
                  id="cpf"
                  value={loginCpf}
                  onChange={(e) => setLoginCpf(e.target.value)}
                  className="w-full px-4 py-2 bg-furia-black border border-furia-purple/30 rounded-md focus:outline-none focus:ring-2 focus:ring-furia-purple text-white"
                  placeholder="Digite seu CPF"
                />
              </div>
              
              <button
                type="submit"
                className="w-full btn-primary"
              >
                Entrar
              </button>
              
              <p className="text-sm text-center text-white/70 mt-4">
                Não tem uma conta?{' '}
                <button
                  type="button" 
                  onClick={() => document.querySelector('[data-value="register"]')?.click()}
                  className="text-furia-purple hover:underline focus:outline-none"
                >
                  Cadastre-se
                </button>
              </p>
            </form>
          </TabsContent>
          
          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  id="name"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  className="w-full px-4 py-2 bg-furia-black border border-furia-purple/30 rounded-md focus:outline-none focus:ring-2 focus:ring-furia-purple text-white"
                  placeholder="Digite seu nome"
                />
              </div>
              
              <div>
                <label htmlFor="register-cpf" className="block text-sm font-medium text-white mb-1">
                  CPF
                </label>
                <input
                  type="text"
                  id="register-cpf"
                  value={registerCpf}
                  onChange={(e) => setRegisterCpf(e.target.value)}
                  className="w-full px-4 py-2 bg-furia-black border border-furia-purple/30 rounded-md focus:outline-none focus:ring-2 focus:ring-furia-purple text-white"
                  placeholder="Digite seu CPF"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Modalidade Favorita
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFavoriteMode('Jogos')}
                    className={`py-2 rounded-md border text-center transition-colors
                              ${favoriteMode === 'Jogos' 
                                ? 'bg-furia-purple/20 border-furia-purple text-white' 
                                : 'border-furia-purple/30 text-white/70 hover:bg-furia-purple/10'}`}
                  >
                    Jogos
                  </button>
                  <button
                    type="button"
                    onClick={() => setFavoriteMode('Futebol')}
                    className={`py-2 rounded-md border text-center transition-colors
                              ${favoriteMode === 'Futebol' 
                                ? 'bg-furia-purple/20 border-furia-purple text-white' 
                                : 'border-furia-purple/30 text-white/70 hover:bg-furia-purple/10'}`}
                  >
                    Futebol
                  </button>
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-furia-purple focus:ring-furia-purple"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-white/70">
                  Aceito os <Link to="/terms" className="text-furia-purple hover:underline">termos de uso</Link> e a <Link to="/privacy" className="text-furia-purple hover:underline">política de privacidade</Link>
                </label>
              </div>
              
              <button
                type="submit"
                className="w-full btn-primary"
                disabled={!termsAccepted}
              >
                Cadastrar
              </button>
              
              <p className="text-sm text-center text-white/70 mt-4">
                Já tem uma conta?{' '}
                <button
                  type="button"
                  onClick={() => document.querySelector('[data-value="login"]')?.click()}
                  className="text-furia-purple hover:underline focus:outline-none"
                >
                  Faça login
                </button>
              </p>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;
