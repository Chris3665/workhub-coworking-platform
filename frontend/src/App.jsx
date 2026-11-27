import { useState, useEffect } from 'react';
import api from './api/axios';

export default function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);
  const [view, setView] = useState('catalog'); // 'catalog' | 'login' | 'register'
  const [spaces, setSpaces] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [authForm, setAuthForm] = useState({ fullName: '', email: '', password: '', roleName: 'CLIENT' });
  const [error, setError] = useState('');

  const fetchSpaces = async (page = 1) => {
    try {
      const { data } = await api.get(`/spaces?page=${page}&limit=4`);
      setSpaces(data.data);
      setPagination(data.pagination);
    } catch (err) {
      console.error('Error cargando espacios', err);
    }
  };

  useEffect(() => {
    fetchSpaces(1);
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const endpoint = view === 'login' ? '/auth/login' : '/auth/register';
      const { data } = await api.post(endpoint, authForm);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      setView('catalog');
    } catch (err) {
      setError(err.response?.data?.message || 'Error en autenticación');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#f8fafc', minHeight: '100vh', color: '#0f172a' }}>
      {/* Navbar */}
      <header style={{ background: '#0f172a', color: '#fff', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, cursor: 'pointer' }} onClick={() => setView('catalog')}>🏢 WorkHub Coworking</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {user ? (
            <>
              <span>Hola, <strong>{user.fullName}</strong> ({user.role})</span>
              <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cerrar Sesión</button>
            </>
          ) : (
            <>
              <button onClick={() => setView('login')} style={{ padding: '0.5rem 1rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Iniciar Sesión</button>
              <button onClick={() => setView('register')} style={{ padding: '0.5rem 1rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Registrarse</button>
            </>
          )}
        </div>
      </header>

      <main style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem' }}>
        {view !== 'catalog' ? (
          <form onSubmit={handleAuth} style={{ maxWidth: '400px', margin: '3rem auto', background: '#fff', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <h3 style={{ marginTop: 0 }}>{view === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}</h3>
            {error && <p style={{ color: '#ef4444', background: '#fee2e2', padding: '0.5rem', borderRadius: '6px' }}>{error}</p>}
            {view === 'register' && (
              <>
                <input
                  type="text"
                  placeholder="Nombre completo"
                  required
                  value={authForm.fullName}
                  onChange={(e) => setAuthForm({ ...authForm, fullName: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', marginBottom: '1rem', boxSizing: 'border-box' }}
                />
                <select
                  value={authForm.roleName}
                  onChange={(e) => setAuthForm({ ...authForm, roleName: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', marginBottom: '1rem' }}
                >
                  <option value="CLIENT">Cliente (Reservar espacios)</option>
                  <option value="OWNER">Propietario (Publicar espacios)</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </>
            )}
            <input
              type="email"
              placeholder="Correo electrónico"
              required
              value={authForm.email}
              onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
              style={{ width: '100%', padding: '0.6rem', marginBottom: '1rem', boxSizing: 'border-box' }}
            />
            <input
              type="password"
              placeholder="Contraseña"
              required
              value={authForm.password}
              onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
              style={{ width: '100%', padding: '0.6rem', marginBottom: '1rem', boxSizing: 'border-box' }}
            />
            <button type="submit" style={{ width: '100%', padding: '0.75rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
              {view === 'login' ? 'Entrar' : 'Registrarse'}
            </button>
          </form>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h1 style={{ margin: 0 }}>Catálogo de Espacios Disponibles</h1>
              <span>Total: <strong>{pagination.total}</strong> espacios</span>
            </div>

            {/* Grid de tarjetas */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
              {spaces.map((space) => (
                <div key={space.id} style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
                  <img
                    src={space.images?.[0]?.url || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80'}
                    alt={space.name}
                    style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '1rem' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0' }}>{space.name}</h3>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>📍 {space.address}</p>
                    <p style={{ fontSize: '0.9rem', margin: '0 0 1rem 0' }}>{space.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                      <span style={{ fontWeight: 'bold', color: '#0f172a' }}>${space.hourlyRate}/hr · ${space.dailyRate}/día</span>
                      <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '0.25rem 0.6rem', borderRadius: '999px', fontSize: '0.8rem' }}>
                        👥 Cap: {space.capacity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Controles de Paginación */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2.5rem' }}>
              <button
                disabled={pagination.page <= 1}
                onClick={() => fetchSpaces(pagination.page - 1)}
                style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer' }}
              >
                ⬅ Anterior
              </button>
              <span>Página <strong>{pagination.page}</strong> de <strong>{pagination.totalPages || 1}</strong></span>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchSpaces(pagination.page + 1)}
                style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: pagination.page >= pagination.totalPages ? 'not-allowed' : 'pointer' }}
              >
                Siguiente ➡
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}