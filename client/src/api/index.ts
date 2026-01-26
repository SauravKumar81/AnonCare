import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api'
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
  chat: (text: string) => api.post('/ai/chat', { text }),
  createAgent: (description: string) => api.post('/ai/create-agent', { description })
};

export default api;
