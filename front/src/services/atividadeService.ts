import api from './api';

export interface AtividadeResponse {
  id: string;
  nome: string;
  cursoId: string;
  tipo: 'COMPLEMENTAR' | 'EXTENSAO';
  grupo: string;
  categoria: string;
}

export const listarAtividadesPorCurso = async (
  cursoId: string
): Promise<AtividadeResponse[]> => {
  const response = await api.get<AtividadeResponse[]>(
    `/atividade/curso/${cursoId}`
  );
  return response.data;
};
