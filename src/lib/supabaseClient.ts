import { createClient } from '@supabase/supabase-js';
import { login, register } from '@/services/authService'; // Substitua pelo caminho correto da sua classe AuthService


// Configurações do Supabase
const supabaseUrl = 'https://uoelpjllkzkfayqptcxz.supabase.co';  // URL do seu projeto Supabase
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvZWxwamxsa3prZmF5cXB0Y3h6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxNTc4MjUsImV4cCI6MjA2MTczMzgyNX0.pjRFD_pP1_idKdWxaBCdqLr2TY3ZSm4ohSZm3wt8F2c';  // Chave de API do Supabase

// Criação do cliente do Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);

// Função de teste de conexão
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('users').select('*').limit(1);
    if (error) {
      console.error('Erro ao conectar com o Supabase:', error);
      return;
    }
    console.log('Conexão bem-sucedida com o Supabase!', data);
  } catch (err) {
    console.error('Erro inesperado:', err);
  }
};

// Executa o teste de conexão
testConnection();


export const testLogin = async () => {
  const email = 'usuario@example.com';
  const password = 'senha123'; // Coloque a senha correta do usuário para o teste
  
  const user = await login(email, password);
  
  if (user) {
    console.log('Login bem-sucedido:', user);
  } else {
    console.log('Falha no login.');
  }
};

testLogin();

export const testRegister = async () => {
  const name = 'Novo Usuário';
  const email = 'novo@usuario.com';
  const password = 'novaSenha123';
  const favoriteMode = 'Jogos'; // Ou 'Futebol', dependendo do teste
  
  const user = await register(name, email, password, favoriteMode);
  
  if (user) {
    console.log('Cadastro bem-sucedido:', user);
  } else {
    console.log('Falha no cadastro.');
  }
};

testRegister();