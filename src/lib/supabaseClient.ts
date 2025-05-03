
import { createClient } from '@supabase/supabase-js';

// Configurações do Supabase
const supabaseUrl = 'https://uoelpjllkzkfayqptcxz.supabase.co';  // URL do seu projeto Supabase
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvZWxwamxsa3prZmF5cXB0Y3h6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxNTc4MjUsImV4cCI6MjA2MTczMzgyNX0.pjRFD_pP1_idKdWxaBCdqLr2TY3ZSm4ohSZm3wt8F2c';  // Chave de API do Supabase

// Criação do cliente do Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);
export const supabaseClient = supabase; // Add this line to export the client with the name 'supabaseClient'

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

// Função para testar o login
export const testLogin = async () => {
  const email = 'usuario@example.com'; // Email do usuário registrado no Supabase
  const password = 'senha123'; // Senha do usuário

  // Realizando o login
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Erro no login:', error.message);
      return;
    }

    if (data.user) {
      console.log('Login bem-sucedido:', data.user);
    } else {
      console.log('Falha no login, usuário não encontrado.');
    }
  } catch (err) {
    console.error('Erro inesperado ao tentar logar:', err);
  }
};

// Executa a conexão com o Supabase
testConnection();

// Testa o login
testLogin();
