// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

export const authService = {
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}login/`, { email, password });
      if (response.data.access) {
        localStorage.setItem('token', response.data.access);
        localStorage.setItem('user_type', JSON.stringify(response.data.user.user_type));
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_type');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  getUserType: () => {
    const userType = localStorage.getItem('user_type');
    return userType ? JSON.parse(userType) : null;
  },

  isAdmin: () => {
    const userType = authService.getUserType();
    return userType === 'admin';
  },

  isAuthenticated: () => {
    const token = authService.getToken();
    return !!token;
  },

  setAuthHeader: () => {
    const token = authService.getToken();
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  },

  clearAuth: () => {
    authService.logout();
    delete axios.defaults.headers.common['Authorization'];
  },

  // Helper method to handle API requests with authentication
  authenticatedRequest: async (method, url, data = null) => {
    try {
      const token = authService.getToken();
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      let response;
      if (method.toLowerCase() === 'get') {
        response = await axios.get(`${API_URL}${url}`, config);
      } else if (method.toLowerCase() === 'post') {
        response = await axios.post(`${API_URL}${url}`, data, config);
      } else if (method.toLowerCase() === 'put') {
        response = await axios.put(`${API_URL}${url}`, data, config);
      } else if (method.toLowerCase() === 'delete') {
        response = await axios.delete(`${API_URL}${url}`, config);
      }

      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        // Handle unauthorized access
        authService.clearAuth();
        window.location.href = '/login';
      }
      throw error;
    }
  }
};

// Automatically set auth header on service initialization
authService.setAuthHeader();

export default authService;