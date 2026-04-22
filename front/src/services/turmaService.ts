import api from './api';

export const listarPeriodosLetivos = async (): Promise<string[]> => {
  const response = await api.get<string[]>('/Atividade/periodos');
  return response.data;
};
