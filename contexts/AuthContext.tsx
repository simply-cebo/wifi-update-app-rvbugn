
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  adminName: string;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminName, setAdminName] = useState('');

  const login = (username: string, password: string): boolean => {
    console.log('Login attempt:', username);
    // Simple authentication - in production, this would call an API
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      setAdminName('Admin User');
      console.log('Login successful');
      return true;
    }
    console.log('Login failed');
    return false;
  };

  const logout = () => {
    console.log('Logging out');
    setIsAuthenticated(false);
    setAdminName('');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, adminName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
