/** @format */

import axios from 'axios';

// ============================================
// API CONFIGURATION
// ============================================
const API_BASE_URL = 'http://localhost:3000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// ============================================
// REQUEST INTERCEPTOR
// ============================================
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================
// RESPONSE INTERCEPTOR
// ============================================
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('currentUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============================================
// AUTHENTICATION API
// ============================================
export const authAPI = {
  async register(userData) {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  async login(credentials) {
    const response = await apiClient.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response.data;
  },

  async logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
  },
};

// ============================================
// PRODUCTS API
// ============================================
export const productsAPI = {
  async getAll(params = {}) {
    const response = await apiClient.get('/products', { params });
    return response.data;
  },

  async getById(id) {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  async search(searchTerm) {
    const response = await apiClient.get('/products', {
      params: { search: searchTerm },
    });
    return response.data;
  },

  async create(productData) {
    const response = await apiClient.post('/products', productData);
    return response.data;
  },

  async update(id, productData) {
    const response = await apiClient.patch(`/products/${id}`, productData);
    return response.data;
  },

  async delete(id) {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  },
};

// ============================================
// ORDERS API
// ============================================
export const ordersAPI = {
  async create(orderData) {
    const response = await apiClient.post('/orders', orderData);
    return response.data;
  },

  async getMyOrders() {
    const response = await apiClient.get('/orders/my-orders');
    return response.data;
  },

  async getAll(params = {}) {
    const response = await apiClient.get('/orders', { params });
    return response.data;
  },

  async getById(id) {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },

  async updateStatus(id, status) {
    const response = await apiClient.patch(`/orders/${id}/status`, { status });
    return response.data;
  },
};

// ============================================
// COMMENTS/REVIEWS API
// ============================================
export const commentsAPI = {
  async create(commentData) {
    const response = await apiClient.post('/comments', commentData);
    return response.data;
  },

  async getByProduct(productId) {
    const response = await apiClient.get(`/comments/product/${productId}`);
    return response.data;
  },

  async update(id, commentData) {
    const response = await apiClient.patch(`/comments/${id}`, commentData);
    return response.data;
  },

  async delete(id) {
    const response = await apiClient.delete(`/comments/${id}`);
    return response.data;
  },
};

// ============================================
// UPLOADS API
// ============================================
export const uploadsAPI = {
  async uploadSingle(file) {
    const formData = new FormData();
    formData.append('image', file);
    const response = await apiClient.post('/uploads/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async uploadMultiple(files) {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    const response = await apiClient.post('/uploads/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async getImage(id) {
    const response = await apiClient.get(`/uploads/${id}`);
    return response.data;
  },

  async getAll() {
    const response = await apiClient.get('/uploads');
    return response.data;
  },

  async delete(id) {
    const response = await apiClient.delete(`/uploads/${id}`);
    return response.data;
  },
};

// ============================================
// SYSTEM API
// ============================================
export const systemAPI = {
  async healthCheck() {
    const response = await apiClient.get('/health');
    return response.data;
  },

  async getApiInfo() {
    const response = await apiClient.get('/');
    return response.data;
  },
};

// Export default API client
export default apiClient;
