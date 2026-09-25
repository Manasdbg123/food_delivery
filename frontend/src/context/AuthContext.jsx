import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { readToken } from '../lib/api';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const read = (key) => {
  try { return localStorage.getItem(key); } catch { return null; }
};

const validToken = () => {
  const token = read('token');
  const claims = token && readToken(token);
  // Treat an expired token as signed out rather than waiting for the first 401.
  if (!claims || (claims.exp && claims.exp * 1000 < Date.now())) return null;
  return token;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(validToken);
  const [profile, setProfile] = useState(() => {
    try { return JSON.parse(read('user')) || null; } catch { return null; }
  });

  const login = useCallback((newToken, details = {}) => {
    const claims = readToken(newToken) || {};
    const user = { id: claims.id, email: claims.email || details.email, role: claims.role, ...details };
    try {
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(user));
    } catch { /* storage blocked: session lasts for this tab */ }
    setToken(newToken);
    setProfile(user);
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch { /* ignore */ }
    setToken(null);
    setProfile(null);
  }, []);

  const updateProfile = useCallback((changes) => {
    setProfile((prev) => {
      const next = { ...prev, ...changes };
      try { localStorage.setItem('user', JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('auth:expired', logout);
    return () => window.removeEventListener('auth:expired', logout);
  }, [logout]);

  const value = useMemo(() => ({
    token,
    user: token ? profile : null,
    isAuthenticated: Boolean(token),
    login,
    logout,
    updateProfile,
  }), [token, profile, login, logout, updateProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
