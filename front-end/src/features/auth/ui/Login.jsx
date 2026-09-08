import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '@shared/ui';
import styles from './Login.module.css';

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Digite um e-mail válido (ex: usuario@email.com)');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (email === 'admin@notus.com' && password === '123456') {
        localStorage.setItem('authToken', 'mock-jwt-token');
        localStorage.setItem(
          'user',
          JSON.stringify({
            id: 1,
            nome: 'Administrador',
            email: 'admin@notus.com',
            role: 'GESTOR',
          })
        );
        navigate('/dashboard');
      } else {
        setError('Credenciais inválidas. Tente: admin@notus.com / 123456');
      }
    } catch {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.logo}>
          <h1>NOTUS</h1>
          <span>Núcleo de Organização de Tarefas e Unificação Escolar</span>
        </div>

        <div className={styles.header}>
          <h2 className={styles.title}>Acesse sua conta</h2>
          <p className={styles.subtitle}>
            Entre com suas credenciais para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            type="email"
            label="E-mail"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            disabled={isLoading}
            required
          />

          <Input
            type="password"
            label="Senha"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(null);
            }}
            disabled={isLoading}
            required
          />

          <div className={styles.optionsRow}>
            <a href="#" className={styles.forgotLink}>
              Esqueci minha senha
            </a>
          </div>

          {error && (
            <div className={styles.generalError}>
              <span>⚠️</span>
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
          >
            Entrar
          </Button>

          <div className={styles.signupRow}>
            Não tem uma conta?{' '}
            <a href="#" className={styles.signupLink}>
              Cadastre-se
            </a>
          </div>

          <div className={styles.demoInfo}>
            <p>
              <strong>Demo:</strong> use <code>admin@notus.com</code> com senha{' '}
              <code>123456</code>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
