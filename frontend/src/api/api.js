import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// Groups API
export const groupsAPI = {
  getAll: () => api.get('/api/groups'),
  getById: (id) => api.get(`/api/groups/${id}`),
  create: (data) => api.post('/api/groups', data),
  update: (id, data) => api.put(`/api/groups/${id}`, data),
  delete: (id) => api.delete(`/api/groups/${id}`),
  addMember: (groupId, data) => api.post(`/api/groups/${groupId}/members`, data),
  removeMember: (groupId, userId) => api.delete(`/api/groups/${groupId}/members/${userId}`),
};

// Expenses API
export const expensesAPI = {
  getAll: () => api.get('/api/expenses'),
  getById: (id) => api.get(`/api/expenses/${id}`),
  getByGroup: (groupId) => api.get(`/api/expenses/group/${groupId}`),
  create: (data) => api.post('/api/expenses', data),
};

// Settlements API
export const settlementsAPI = {
  getAll: () => api.get('/api/settlements'),
  getByGroup: (groupId) => api.get(`/api/settlements/group/${groupId}`),
  getBalances: (groupId) => api.get(`/api/settlements/group/${groupId}/balances`),
  getSuggestions: (groupId) => api.get(`/api/settlements/group/${groupId}/suggestions`),
  getMemberSummary: (groupId) => api.get(`/api/settlements/group/${groupId}/member-summary`),
  create: (data) => api.post('/api/settlements', data),
};

// Analytics API
export const analyticsAPI = {
  getGroupAnalytics: (groupId) => api.get(`/api/analytics/group/${groupId}`),
  getGroupAnalyticsForPeriod: (groupId, start, end) =>
    api.get(`/api/analytics/group/${groupId}/period`, { params: { start, end } }),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/api/categories'),
};

export default api;
