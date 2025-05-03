import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const Login = () => {
  const [loginCpf, setLoginCpf] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerCpf, setRegisterCpf] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [favoriteMode, setFavoriteMode] = useState<'Jogos' | 'Futebol'>('Jogos');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();
  
  const validateCpf = (cpf: string): boolean => {
    // Basic validation - only numbers and proper length
    const cleanedCpf = cpf.replace(/[^\d]/g, '');
    return cleanedCpf.length === 11;
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoginLoading(true);
    
    if (loginCpf.trim() === '') {
      toast.error('Por favor, informe seu CPF');
      setIsLoginLoading(false);
      return;
    }
    
    if (!validateCpf(loginCpf)) {
      toast.error('CPF inválido. Deve conter 11 dígitos numéricos.');
      setIsLoginLoading(false);
      return;
    }
    
    if (loginPassword.trim() === '') {
      toast.error('Por favor, informe sua senha');
      setIsLoginLoading(false);
      return;
    }
    
    try {
      const formattedCpf = loginCpf.replace(/[^\d]/g, ''); // Remove non-numeric characters
      const success = await login(formattedCpf, loginPassword);
      
      if (success) {
        toast.success('Login realizado com sucesso!');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      toast.error('Ocorreu um erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoginLoading(false);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegisterLoading(true);
    
    if (registerName.trim() === '') {
      toast.error('Por favor, informe seu nome');
      setIsRegisterLoading(false);
      return;
    }
    
    if (registerCpf.trim() === '') {
      toast.error('Por favor, informe seu CPF');
      setIsRegisterLoading(false);
      return;
    }
    
    if (!validateCpf(registerCpf)) {
      toast.error('CPF inválido. Deve conter 11 dígitos numéricos.');
      setIsRegisterLoading(false);
      return;
    }
    
    if (registerPassword.trim() === '') {
      toast.error('Por favor, defina uma senha');
      setIsRegisterLoading(false);
      return;
    }
    
    if (registerPassword.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      setIsRegisterLoading(false);
      return;
    }
    
    if (!termsAccepted) {
      toast.error('Você precisa aceitar os termos de uso');
      setIsRegisterLoading(false);
      return;
    }
    
    try {
      const formattedCpf = registerCpf.replace(/[^\d]/g, ''); // Remove non-numeric characters
      const success = await register(registerName, formattedCpf, registerPassword, favoriteMode);
      
      if (success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Erro ao registrar:', error);
      toast.error('Ocorreu um erro ao cadastrar. Tente novamente.');
    } finally {
      setIsRegisterLoading(false);
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
            <TabsTrigger id="login-tab" value="login">Login</TabsTrigger>
            <TabsTrigger id="register-tab" value="register">Cadastro</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="cpf" className="text-white mb-1">
                  CPF
                </Label>
                <Input
                  type="text"
                  id="cpf"
                  value={loginCpf}
                  onChange={(e) => setLoginCpf(e.target.value)}
                  className="bg-furia-black border border-furia-purple/30 focus:ring-furia-purple text-white"
                  placeholder="Digite seu CPF (apenas números)"
                  disabled={isLoginLoading}
                  maxLength={11}
                />
              </div>
              
              <div>
                <Label htmlFor="password" className="text-white mb-1">
                  Senha
                </Label>
                <Input
                  type="password"
                  id="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="bg-furia-black border border-furia-purple/30 focus:ring-furia-purple text-white"
                  placeholder="Digite sua senha"
                  disabled={isLoginLoading}
                />
              </div>
              
              <Button
                type="submit"
                className="w-full btn-primary"
                disabled={isLoginLoading}
              >
                {isLoginLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
              
              <p className="text-sm text-center text-white/70 mt-4">
                Não tem uma conta?{' '}
                <button
                  type="button" 
                  onClick={() => document.getElementById('register-tab')?.click()}
                  className="text-furia-purple hover:underline focus:outline-none"
                  disabled={isLoginLoading}
                >
                  Cadastre-se
                </button>
              </p>
            </form>
          </TabsContent>
          
          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-white mb-1">
                  Nome
                </Label>
                <Input
                  type="text"
                  id="name"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  className="bg-furia-black border border-furia-purple/30 focus:ring-furia-purple text-white"
                  placeholder="Digite seu nome"
                  disabled={isRegisterLoading}
                />
              </div>
              
              <div>
                <Label htmlFor="register-cpf" className="text-white mb-1">
                  CPF
                </Label>
                <Input
                  type="text"
                  id="register-cpf"
                  value={registerCpf}
                  onChange={(e) => setRegisterCpf(e.target.value)}
                  className="bg-furia-black border border-furia-purple/30 focus:ring-furia-purple text-white"
                  placeholder="Digite seu CPF (apenas números)"
                  disabled={isRegisterLoading}
                  maxLength={11}
                />
              </div>
              
              <div>
                <Label htmlFor="register-password" className="text-white mb-1">
                  Senha
                </Label>
                <Input
                  type="password"
                  id="register-password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className="bg-furia-black border border-furia-purple/30 focus:ring-furia-purple text-white"
                  placeholder="Defina uma senha (min. 6 caracteres)"
                  disabled={isRegisterLoading}
                  minLength={6}
                />
              </div>
              
              <div>
                <Label className="text-white mb-2">
                  Modalidade Favorita
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFavoriteMode('Jogos')}
                    className={`py-2 rounded-md border text-center transition-colors
                              ${favoriteMode === 'Jogos' 
                                ? 'bg-furia-purple/20 border-furia-purple text-white' 
                                : 'border-furia-purple/30 text-white/70 hover:bg-furia-purple/10'}`}
                    disabled={isRegisterLoading}
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
                    disabled={isRegisterLoading}
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
                  disabled={isRegisterLoading}
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-white/70">
                  Aceito os termos de uso e a política de privacidade
                </label>
              </div>
              
              <Button
                type="submit"
                className="w-full btn-primary"
                disabled={isRegisterLoading || !termsAccepted}
              >
                {isRegisterLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cadastrando...
                  </>
                ) : (
                  'Cadastrar'
                )}
              </Button>
              
              <p className="text-sm text-center text-white/70 mt-4">
                Já tem uma conta?{' '}
                <button
                  type="button"
                  onClick={() => document.getElementById('login-tab')?.click()}
                  className="text-furia-purple hover:underline focus:outline-none"
                  disabled={isRegisterLoading}
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
