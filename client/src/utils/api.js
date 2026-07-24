/**
 * API Utility
 * Handles all HTTP requests to the backend, including auth token injection.
 */

import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token from localStorage to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('himalayan_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** Analyze an array of reviews via OpenAI */
export const analyzeReviews = async (reviews) => {
  const response = await api.post('/analyze', { reviews });
  return response.data;
};

/** CRUD — Guest Reviews */
export const fetchAllReviews  = async ()           => api.get('/reviews').then(r => r.data);
export const fetchReviewById  = async (id)         => api.get(`/reviews/${id}`).then(r => r.data);
export const searchGuestReviews = async (query)    => api.get('/reviews/search', { params: { q: query } }).then(r => r.data);
export const createGuestReview = async (data)      => api.post('/reviews', data).then(r => r.data);
export const updateGuestReview = async (id, data)  => api.put(`/reviews/${id}`, data).then(r => r.data);
export const deleteGuestReview = async (id)        => api.delete(`/reviews/${id}`).then(r => r.data);

/** Stats */
export const fetchGuestStats = async () => api.get('/stats').then(r => r.data);

export default api;
