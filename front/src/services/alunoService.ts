import api from './api';

export interface CreateAlunoRequest {
  nome: string;
  email: string;
  matricula: string;
  senha: string;
  turmaId: string;
}

export interface CreateAlunoResponse {
  id: string;
  nome: string;
  email: string;
}

export interface AlunoResponse {
  id: string;
  nome: string;
  email: string;
  matricula: string;
  role: string;
}

export interface AtividadeAlunoResumo {
  atividadeId: string;
  nome: string;
  grupo: string;
  categoria: string;
  categoriaKey: string;
  cargaMaximaSemestral: number;
  cargaMaximaCurso: number;
  horasConcluidas: number;
}

export interface AlunoDetalhadoResponse {
  id: string;
  nome: string;
  email: string;
  matricula: string;
  isAtivo: boolean;
  turmaId: string;
  atividades: AtividadeAlunoResumo[];
  totalHorasExtensao: number;
  maximoHorasExtensao: number;
  totalHorasComplementar: number;
  maximoHorasComplementar: number;
}

export interface AlunoResumoHorasResponse {
  id: string;
  nome: string;
  email: string;
  totalHorasExtensao: number;
  maximoHorasExtensao: number;
  totalHorasComplementar: number;
  maximoHorasComplementar: number;
  isAtivo: boolean;
}

// ========== Requisições à API ==========

// Criar novo aluno
export const criarAluno = async (
  dados: CreateAlunoRequest
): Promise<CreateAlunoResponse> => {
  const response = await api.post<CreateAlunoResponse>('/aluno', dados);
  return response.data;
};

// Obter aluno por ID
export const obterAlunoPorId = async (id: string): Promise<AlunoResponse> => {
  const response = await api.get<AlunoResponse>(`/aluno/${id}`);
  return response.data;
};

// Deletar aluno
export const deletarAluno = async (id: string): Promise<void> => {
  await api.delete(`/aluno/${id}`);
};

// Ativar ou desativar aluno
export const toggleStatusAluno = async (id: string): Promise<void> => {
  await api.patch(`/aluno/${id}/toggle-status`);
};

// Obter aluno detalhado por ID
export const obterAlunoDetalhado = async (
  id: string
): Promise<AlunoDetalhadoResponse> => {
  const response = await api.get<AlunoDetalhadoResponse>(
    `/aluno/${id}/detalhado`
  );
  return response.data;
};

// Obter aluno autenticado (meus dados)
export const obterMeusDadosDetalhados =
  async (): Promise<AlunoDetalhadoResponse> => {
    const response = await api.get<AlunoDetalhadoResponse>(
      '/aluno/meu-detalhado'
    );
    return response.data;
  };

// Listar resumo de horas de todos os alunos
export const listarResumoHoras = async (): Promise<
  AlunoResumoHorasResponse[]
> => {
  const response = await api.get<AlunoResumoHorasResponse[]>(
    '/aluno/resumo-horas'
  );
  return response.data;
};
