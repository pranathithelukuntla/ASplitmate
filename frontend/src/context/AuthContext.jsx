import React, { createContext, useState, useContext, useEffect } from 'react';
import api, { authAPI } from '../api/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wake up the backend on app load (especially for Render free tier cold starts)
    const wakeUpServer = async () => {
      try {
        // Hit the root endpoint just to trigger a spin-up
        await api.get('/');
      } catch (e) {
        // Ignore error - we just want the request to reach the server
        console.log('Sending wake-up signal to server...');
      }
    };
    
    wakeUpServer();

    // Always clear any previous session on app start — user must log in fresh each time
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { token, userId, email: userEmail, name, role } = response.data;
      
      const userData = { userId, email: userEmail, name, role };
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed';
      
      if (error.response) {
        if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else {
          errorMessage = `Server error: ${error.response.status} ${error.response.statusText}`;
        }
      } else if (error.request) {
        errorMessage = 'Cannot connect to server. Make sure backend is running on http://localhost:8080';
      } else {
        errorMessage = error.message || 'Login failed';
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await authAPI.register({ name, email, password });
      const { token, userId, email: userEmail, name: userName, role } = response.data;
      
      const userData = { userId, email: userEmail, name: userName, role };
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Registration failed';
      let fieldErrors = {};
      
      if (error.response) {
        // Server responded with error
        if (error.response.data?.errors) {
          // Validation errors - return field-specific errors
          fieldErrors = error.response.data.errors;
          const errorList = Object.entries(error.response.data.errors)
            .map(([field, msg]) => `${field}: ${msg}`)
            .join(', ');
          errorMessage = errorList || 'Validation failed';
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else {
          errorMessage = `Server error: ${error.response.status} ${error.response.statusText}`;
        }
      } else if (error.request) {
        // Request made but no response
        errorMessage = 'Cannot connect to server. Make sure backend is running on http://localhost:8080';
      } else {
        errorMessage = error.message || 'Registration failed';
      }
      
      return {
        success: false,
        error: errorMessage,
        fieldErrors: fieldErrors,
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
