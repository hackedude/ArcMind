import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('arcmind_token');
    if (token) {
      authService
        .me()
        .then((u) => setUser(u))
        .catch(() => localStorage.removeItem('arcmind_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const { token, user } = await authService.login(email, password);
    localStorage.setItem('arcmind_token', token);
    setUser(user);
  };

  const register = async (data) => {
    const { token, user } = await authService.register(data);
    localStorage.setItem('arcmind_token', token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('arcmind_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
