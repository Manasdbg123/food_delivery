import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const readStoredUser = () => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(readStoredUser);

  const login = useCallback((newToken, newUser) => {
    localStorage.setItem('token', newToken);
    if (newUser) localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser || null);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
