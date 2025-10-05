import { getSession } from 'next-auth/react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.horamais.app/api'
});

// Interceptor para adicionar token da sessão se existir
api.interceptors.request.use(async (config) => {
  const session = await getSession();

  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }

  return config;
});

export default api;
