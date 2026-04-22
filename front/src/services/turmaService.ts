import api from './api';

export const listarPeriodosLetivos = async (): Promise<string[]> => {
  const response = await api.get<string[]>('/Turma/periodos');
  return response.data;
};
