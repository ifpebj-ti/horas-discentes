import api from './api';

export interface AtividadeResponse {
  id: string;
  nome: string;
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
}

export const listarAtividades = async (): Promise<AtividadeResponse[]> => {
  const response = await api.get<AtividadeResponse[]>('/Atividade');
  return response.data;
};

export const criarAtividade = async (
  dados: CreateAtividadeRequest
): Promise<{ atividadeId: string }> => {
  try {
    const response = await api.post('/Atividade', dados);
    return response.data;
  } catch (error: any) {
    console.error(
      'Erro ao criar atividade:',
      error.response?.data || error.message
    );
    throw error;
  }
};

export interface UpdateAtividadeRequest {
  nome?: string;
  grupo?: string;
  categoria?: string;
  categoriaKey?: string;
  cargaMaximaSemestral?: number;
  cargaMaximaCurso?: number;
  tipo?: number;
}

// Atualizar atividade por ID
export const atualizarAtividade = async (
  id: string,
  dados: UpdateAtividadeRequest
): Promise<void> => {
  await api.put(`/Atividade/${id}`, dados);
};

// Deletar atividade por ID
export const deletarAtividade = async (id: string): Promise<void> => {
  if (!id) {
    throw new Error('ID da atividade é obrigatório');
  }

  const cleanId = id.trim();

  try {
    await api.delete(`/Atividade/${cleanId}`);
    return;
  } catch (error: unknown) {
    const err = error as {
      response?: { status?: number; data?: unknown };
      config?: { url?: string; method?: string };
    };
    console.error('Erro ao deletar atividade:', error);
    console.error('Status:', err?.response?.status);
    console.error('Data:', err?.response?.data);
    throw error;
  }
};
