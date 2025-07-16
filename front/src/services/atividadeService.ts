import api from './api';

export interface AtividadeResponse {
  id: string;
  nome: string;
  cursoId: string;
  tipo: 'EXTENSAO' | 'COMPLEMENTAR';
  grupo: string;
  categoria: string;
}

export interface CreateAtividadeRequest {
  nome?: string;
  grupo?: string;
  categoria?: string;
  categoriaKey?: string;
  cargaMaximaSemestral: number;
  cargaMaximaCurso: number;
  tipo: 'EXTENSAO' | 'COMPLEMENTAR';
  cursoId: string;
}

export const listarAtividadesPorCurso = async (
  cursoId: string
): Promise<AtividadeResponse[]> => {
  const response = await api.get<AtividadeResponse[]>(
    `/atividade/curso/${cursoId}`
  );
  return response.data;
};

export const criarAtividade = async (
  dados: CreateAtividadeRequest
): Promise<{ atividadeId: string }> => {
  const response = await api.post(`/atividade`, dados);
  return response.data;
};
