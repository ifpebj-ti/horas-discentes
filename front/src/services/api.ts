import { getSession } from 'next-auth/react';

import axios, { AxiosHeaders } from 'axios';

const api = axios.create({
  // IMPORTANTE:
  // - Em runtime (browser), variáveis NEXT_PUBLIC_* são "baked" no build.
  //   Se o container mudar env sem rebuild, o bundle não muda.
  // - Para produção, preferimos URL relativa e deixamos o Nginx (ou rewrites) fazer proxy.
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api'
});

api.interceptors.request.use(
  async (config) => {
    const headers = AxiosHeaders.from(config.headers ?? {});
    const session = await getSession();
    const token = session?.token;

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    config.headers = headers;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
