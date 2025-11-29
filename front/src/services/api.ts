import { getSession } from 'next-auth/react';

import axios, { AxiosHeaders } from 'axios';

const api = axios.create({
  baseURL: 'https://api.horamais.app/api'
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
