import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '@features/auth';
import { useAuth } from '@providers';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div
      style={{
        padding: '40px',
        maxWidth: '800px',
        margin: '0 auto',
        fontFamily: 'var(--fonte-principal)',
      }}
    >
      <div
        style={{
          background: 'white',
          padding: '32px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        }}
      >
        <h1
          style={{
            fontSize: '28px',
            color: 'var(--cor-primaria)',
            marginBottom: '8px',
          }}
        >
          🎉 Bem-vindo, {user?.nome}!
        </h1>
        <p style={{ color: 'var(--texto-secundario)', marginBottom: '16px' }}>
          Você está logado como <strong>{user?.role}</strong>
        </p>
        <div
          style={{
            padding: '16px',
            background: 'var(--bg-primario)',
            borderRadius: '8px',
            marginBottom: '24px',
          }}
        >
          <p style={{ fontSize: '14px' }}>
            📌 <strong>Dashboard temporário</strong> - Em breve será substituído
            pelo layout completo
          </p>
        </div>
        <button
          onClick={logout}
          style={{
            padding: '10px 24px',
            background: 'var(--perigo)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#c53030')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--perigo)')}
        >
          Sair
        </button>
      </div>
    </div>
  );
};

export const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '3px solid var(--bordas-cor)',
              borderTopColor: 'var(--cor-primaria)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 16px',
            }}
          />
          <p style={{ color: 'var(--texto-secundario)' }}>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />
        }
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="*"
        element={
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <h1 style={{ fontSize: '72px', color: 'var(--texto-secundario)' }}>
              404
            </h1>
            <p
              style={{
                fontSize: '20px',
                color: 'var(--texto-secundario)',
              }}
            >
              Página não encontrada
            </p>
            <a href="/" style={{ color: 'var(--foco-cor)', textDecoration: 'underline' }}>
              Voltar para o início
            </a>
          </div>
        }
      />
    </Routes>
  );
};
