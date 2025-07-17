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
