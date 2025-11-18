import { getSession } from 'next-auth/react';

import axios from 'axios';

const baseURL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ||
  'https://api.horamais.app/api';

const api = axios.create({
  baseURL: 'https://api.horamais.app/api'
});

// Interceptor para adicionar token da sessão se existir
api.interceptors.request.use(
  async (config) => {
    // Garantir que headers existe e está inicializado corretamente
    if (!config.headers) {
      config.headers = {} as any;
    }

    // Obter sessão e token
    const session = await getSession();
    const token = (session as any)?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('[API] Token não encontrado na sessão. Requisição pode falhar por autenticação.');
    }

    // Configurações específicas para requisições DELETE
    if (config.method?.toLowerCase() === 'delete') {
      // Garantir que o método DELETE está definido explicitamente
      config.method = 'DELETE';

      // Não adicionar Content-Type para DELETE (alguns servidores rejeitam)
      // O axios já gerencia isso automaticamente

      // Log detalhado para debug
      console.log('[API] DELETE Request Config:', {
        url: config.url,
        baseURL: config.baseURL,
        fullURL: `${config.baseURL}${config.url}`,
        method: config.method,
        hasToken: !!token,
        headersKeys: Object.keys(config.headers || {}),
        authorizationHeader: config.headers?.Authorization ? 'Bearer ***' : 'NOT SET'
      });
    }

    return config;
  },
  (error) => {
    console.error('[API] Erro no interceptor de requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor de resposta para melhor tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 405) {
      const config = error.config ?? {};
      const baseURL = config.baseURL ?? '';
      const url = config.url ?? '';
      const fullURL = baseURL || url ? `${baseURL}${url}` : 'N/A';

      const payload = {
        url: url || 'N/A',
        method: config.method ?? 'N/A',
        baseURL: baseURL || 'N/A',
        fullURL,
        status: error.response.status,
        statusText: error.response.statusText,
        headers: error.response.headers
      };

      const isServer = typeof window === 'undefined';
      const log =
        isServer || process.env.NODE_ENV !== 'development'
          ? console.error
          : console.warn;
      log('[API] 405 Method Not Allowed:', payload);
    }

    return Promise.reject(error);
  }
);

export default api;
