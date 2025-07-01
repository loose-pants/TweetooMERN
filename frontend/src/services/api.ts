import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (username: string, password: string) =>
    api.post('/auth/register', { username, password }),
  
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
  
  getProfile: () =>
    api.get('/auth/me'),
};

// Tweet API
export const tweetAPI = {
  getTweets: () =>
    api.get('/tweets'),
  
  getTweet: (id: string) =>
    api.get(`/tweets/${id}`),
  
  createTweet: (content: string) =>
    api.post('/tweets', { content }),
  
  updateTweet: (id: string, content: string) =>
    api.put(`/tweets/${id}`, { content }),
  
  deleteTweet: (id: string) =>
    api.delete(`/tweets/${id}`),
};

// User API (Admin only)
export const userAPI = {
  getUsers: () =>
    api.get('/users'),
  
  updateUserRole: (id: string, role: string) =>
    api.put(`/users/${id}/role`, { role }),
  
  deleteUser: (id: string) =>
    api.delete(`/users/${id}`),
};

export default api;