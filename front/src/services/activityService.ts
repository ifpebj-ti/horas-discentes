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
  const response = await api.post('/Atividade', dados);
  return response.data;
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

  await api.delete(`/Atividade/${cleanId}`);
};
