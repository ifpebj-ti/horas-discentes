import api from './api';

export interface AtividadeResponse {
  id: string;
  nome: string;
  cursoId: string;
  tipo: 'EXTENSAO' | 'COMPLEMENTAR';
  grupo: string;
  categoria: string;
  categoriaKey: string;
  cargaMaximaSemestral: number;
  cargaMaximaCurso: number;
}

export interface CreateAtividadeRequest {
  nome?: string;
  grupo?: string;
  categoria?: string;
  categoriaKey?: string;
  cargaMaximaSemestral: number;
  cargaMaximaCurso: number;
  tipo: number; // 0 for EXTENSAO, 1 for COMPLEMENTAR
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
  try {
    const response = await api.post('/atividade', dados);
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(
      'Erro ao criar atividade:',
      error.response?.data || error.message
    );
    throw error;
  }
};
