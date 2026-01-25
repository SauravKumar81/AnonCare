import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  anonymousLogin: () => api.post('/auth/anonymous-login')
};

export const aiApi = {
  chat: (text: string) => api.post('/ai/chat', { text })
};

export default api;
