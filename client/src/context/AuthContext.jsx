"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { saveTokens, saveUser, clearTokens, getUser, getRefreshToken } from '../utils/storage';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = () => {
      const storedUser = getUser();
      if (storedUser) {
        setUser(storedUser);
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authService.login(email, password);
      if (res.success) {
        const { accessToken, refreshToken, user: userData } = res.data;
        saveTokens(accessToken, refreshToken);
        saveUser(userData);
        setUser(userData);
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const res = await authService.register(userData);
      if (res.success) {
        toast.success(res.message);
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const logout = async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        await authService.logout(refreshToken);
      } catch (error) {
        console.error('Logout API failed', error);
      }
    }
    clearTokens();
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
