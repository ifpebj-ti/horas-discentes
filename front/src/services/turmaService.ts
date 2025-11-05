import api from './api';

export interface CreateTurmaRequest {
  periodo: string;
  turno: string;
  possuiExtensao: boolean;
  cursoId: string;
}

export interface TurmaResponse {
  id: string;
  periodo: string;
  turno: string;
  possuiExtensao: boolean;
  cursoId: string;
  cursoNome: string;
  quantidadeAlunos: number;
}

export interface TurmaAlunoResponse {
  id: string;
  nome: string;
  email: string;
  matricula: string;
  isAtivo: boolean;
}

export interface AlunoPorTurmaResponse {
  id: string;
  nome: string;
  email: string;
  matricula: string;
}

export interface AlunoPorTurmaDetalhadoResponse {
  id: string;
  nome: string;
  email: string;
  matricula: string;
  isAtivo: boolean;
  totalHorasExtensao: number;
  totalHorasComplementar: number;
  maximoHorasExtensao: number;
  maximoHorasComplementar: number;
  porcentagemConclusao: number;
}

// Cria nova turma
export const criarTurma = async (
  dados: CreateTurmaRequest
): Promise<TurmaResponse> => {
  const response = await api.post<TurmaResponse>('/turma', dados);
  return response.data;
};

// Lista todas as turmas
export const listarTodasTurmas = async (): Promise<TurmaResponse[]> => {
  const response = await api.get<TurmaResponse[]>('/turma');
  return response.data;
};

// Busca turma por ID
export const obterTurmaPorId = async (id: string): Promise<TurmaResponse> => {
  const response = await api.get<TurmaResponse>(`/turma/${id}`);
  return response.data;
};

// Verifica se a turma existe
export const verificarTurmaExiste = async (id: string): Promise<boolean> => {
  const response = await api.get<{ turmaExiste: boolean }>(
    `/turma/verificar/${id}`
  );
  return response.data.turmaExiste;
};

// Lista alunos da turma
export const listarAlunosPorTurma = async (
  id: string
): Promise<AlunoPorTurmaDetalhadoResponse[]> => {
  const response = await api.get<AlunoPorTurmaDetalhadoResponse[]>(
    `/turma/${id}/alunos`
  );
  return response.data;
};

// Lista turmas por curso
export const obterTurmasPorCurso = async (
  cursoId: string
): Promise<TurmaResponse[]> => {
  const response = await api.get<TurmaResponse[]>(`/turma/curso/${cursoId}`);
  return response.data;
};

// Atualizar turma por ID
export const atualizarTurma = async (
  id: string,
  dados: Partial<CreateTurmaRequest>
): Promise<TurmaResponse> => {
  const response = await api.put<TurmaResponse>(`/turma/${id}`, dados);
  return response.data;
};

// Deletar turma por ID
export const deletarTurma = async (turmaId: string): Promise<void> => {
  if (!turmaId) {
    throw new Error('ID da turma é obrigatório');
  }

  // Remove espaços e garante formato correto
  const cleanId = turmaId.trim();

  // Log para debug
  console.log('Deletando turma:', cleanId);
  console.log('URL completa:', `/api/turma/${cleanId}`);

  try {
    const response = await api.delete(`/turma/${cleanId}`);
    console.log('Resposta DELETE turma:', response.status);
    return;
  } catch (error: any) {
    console.error('Erro ao deletar turma:', error);
    console.error('Status:', error?.response?.status);
    console.error('Data:', error?.response?.data);
    console.error('URL tentada:', error?.config?.url);
    throw error;
  }
};