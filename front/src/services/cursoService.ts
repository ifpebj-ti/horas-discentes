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
  try {
    const response = await api.get('/curso/resumo');

    console.log(' Resposta bruta da API:', response);

    const data = response?.data;

    // Caso a API siga o padrão { data: [...] }
    if (Array.isArray(data?.data)) {
      return data.data;
    }

    // Caso a API retorne diretamente um array
    if (Array.isArray(data)) {
      return data;
    }

    // Caso a resposta não seja um array — log e retorna array vazio
    console.warn(' Resposta inesperada do backend em /curso/resumo:', data);
    return [];
  } catch (error) {
    console.error(' Erro ao buscar cursos em /curso/resumo:', error);
    return [];
  }
};

// Deletar curso por ID
export const deletarCurso = async (cursoId: string): Promise<void> => {
  await api.delete(`/curso/${cursoId}`);
};