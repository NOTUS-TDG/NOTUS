import React, { createContext, useContext, useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:8080/api'; // aqui tem que estar de acordo oque estiver no back 

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('authToken');

    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        console.log('✅ Usuário já estava logado:', parsedUser.nome);
      } catch (e) {
        console.error('❌ Erro ao recuperar usuário do localStorage:', e);
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔄 Tentando fazer login...');
      console.log('📍 URL:', `${API_BASE_URL}/auth/login`);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });

      console.log('📊 Response Status:', response.status);
      console.log('📊 Response Headers:', {
        'Content-Type': response.headers.get('Content-Type'),
        'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
      });

      if (!response.ok) {
        let errorMessage = `Erro ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          errorMessage = response.statusText || errorMessage;
        }

        throw new Error(errorMessage);
      }
      const data = await response.json();
      console.log('✅ Login bem-sucedido:', data);
      if (!data.user || !data.token) {
        throw new Error('Resposta do servidor incompleta. Fale com suporte.');
      }

      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setUser(data.user);
      setError(null);

      console.log('✅ Usuário autenticado:', data.user.nome);
      return { success: true, user: data.user };

    } catch (err) {
      console.error('❌ Erro no login:', err.message);

      let errorMessage = err.message;

      if (err.message.includes('CORS')) {
        errorMessage = '⚠️ Erro de CORS: O backend não está configurado corretamente. Fale com o desenvolvedor backend.';
      } else if (err.message.includes('Failed to fetch')) {
        errorMessage = '⚠️ Servidor não responde. Verifique se o backend está rodando em http://localhost:8080';
      } else if (err.message.includes('401')) {
        errorMessage = 'Credenciais inválidas. Verifique e-mail e senha.';
      } else if (err.message.includes('400')) {
        errorMessage = 'Dados inválidos. Verifique os campos.';
      } else if (err.message.includes('500')) {
        errorMessage = 'Erro no servidor. Tente novamente mais tarde.';
      }

      setError(errorMessage);
      throw new Error(errorMessage);

    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
     
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
    } finally {
      // Limpar localStorage mesmo se houver erro
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setUser(null);
      setError(null);
      console.log('✅ Logout realizado');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
};

export const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('authToken');

  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
    credentials: 'include',
  });

  if (response.status === 401) {
    // Token expirou, limpar localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/login'; // Redirecionar para login
  }

  return response;
};
