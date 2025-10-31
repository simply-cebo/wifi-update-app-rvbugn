
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  adminName: string;
  username: string;
  isFirstLogin: boolean;
  login: (username: string, password: string) => { success: boolean; requiresPasswordChange: boolean };
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default admin credentials (stored securely in production)
const DEFAULT_USERNAME = 'admin';
const DEFAULT_PASSWORD = 'admin123';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(DEFAULT_PASSWORD);
  const [isFirstLogin, setIsFirstLogin] = useState(true);

  const login = (inputUsername: string, inputPassword: string): { success: boolean; requiresPasswordChange: boolean } => {
    console.log('Login attempt:', inputUsername);
    
    // Check credentials
    if (inputUsername === DEFAULT_USERNAME && inputPassword === password) {
      setIsAuthenticated(true);
      setAdminName('Admin User');
      setUsername(inputUsername);
      console.log('Login successful, first login:', isFirstLogin);
      return { success: true, requiresPasswordChange: isFirstLogin };
    }
    
    console.log('Login failed');
    return { success: false, requiresPasswordChange: false };
  };

  const changePassword = (currentPassword: string, newPassword: string): boolean => {
    console.log('Attempting to change password');
    
    if (currentPassword !== password) {
      console.log('Current password incorrect');
      return false;
    }

    setPassword(newPassword);
    setIsFirstLogin(false);
    console.log('Password changed successfully');
    return true;
  };

  const logout = () => {
    console.log('Logging out');
    setIsAuthenticated(false);
    setAdminName('');
    setUsername('');
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      adminName, 
      username,
      isFirstLogin,
      login, 
      logout,
      changePassword 
    }}>
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
