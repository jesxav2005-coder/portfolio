import React, { createContext, useState, useEffect } from 'react';
import api, { setAccessToken } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (username, password) => {
    const response = await api.post('/api/auth/login', { username, password });
    const { access_token, user: userData } = response.data.data;
    setAccessToken(access_token);
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (err) {
      console.error('Error logging out on server:', err);
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  // Attempt to restore user session from the HttpOnly refresh token on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await api.post('/api/auth/refresh');
        const { access_token, user: userData } = response.data.data;
        setAccessToken(access_token);
        setUser(userData);
      } catch (err) {
        // Safe to ignore: user is just not logged in
        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  // Watch for token refresh failures from Axios interceptor
  useEffect(() => {
    const handleExpired = () => {
      setUser(null);
      setAccessToken(null);
    };
    window.addEventListener('auth_session_expired', handleExpired);
    return () => {
      window.removeEventListener('auth_session_expired', handleExpired);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
