"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { saveTokens, saveUser, clearTokens, getUser, getRefreshToken } from '../utils/storage';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const clearAuthData = () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      // Expire local cookie variables explicitly
      document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      setUser(null);
      setIsAuthenticated(false);
  };

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = getUser();
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          await api.get('/api/v1/users/me');
          if (storedUser) {
            setUser(storedUser);
            setIsAuthenticated(true);
          }
        } catch (error) {
          if (error && error.message === 'AUTH_EXPIRED') {
            clearAuthData();
          } else {
            if (storedUser) {
              setUser(storedUser);
              setIsAuthenticated(true);
            }
          }
        }
      } else {
        clearAuthData();
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
        setIsAuthenticated(true);
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
    clearAuthData();
    router.push('/login');
  };

  const updateUser = (newUserData) => {
    saveUser(newUserData);
    setUser(newUserData);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, login, register, logout, updateUser, clearAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
