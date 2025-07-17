import api from './api';

export interface CursoResponse {
  id: string;
  nome: string;
}

export interface CreateCursoRequest {
  nomeCurso: string;
  maximoHorasComplementar: number;
  maximoHorasExtensao?: number;
}
export interface CursoResumoResponse {
  id: string;
  nome: string;
  quantidadeTurmas: number;
  quantidadeAlunos: number;
}
// Criar novo curso
export const criarCurso = async (
  dados: CreateCursoRequest
): Promise<CursoResponse> => {
  const response = await api.post<CursoResponse>('/curso', dados);
  return response.data;
};

// Listar todos os cursos
export const listarCursos = async (): Promise<CursoResponse[]> => {
  const response = await api.get<CursoResponse[]>('/curso');
  return response.data;
};

// Obter curso por ID
export const obterCursoPorId = async (id: string): Promise<CursoResponse> => {
  const response = await api.get<CursoResponse>(`/curso/${id}`);
  return response.data;
};

export const obterResumoCursos = async (): Promise<CursoResumoResponse[]> => {
  const response = await api.get('/curso/resumo');
  return response.data;
};
