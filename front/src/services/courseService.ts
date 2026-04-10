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
  const response = await api.post<CursoResponse>('/Curso', dados);
  return response.data;
};

// Listar todos os cursos
export const listarCursos = async (): Promise<CursoResponse[]> => {
  const response = await api.get<CursoResponse[]>('/Curso');
  return response.data;
};

// Obter curso por ID
export const obterCursoPorId = async (id: string): Promise<CursoResponse> => {
  const response = await api.get<CursoResponse>(`/Curso/${id}`);
  return response.data;
};

export const obterResumoCursos = async (): Promise<CursoResumoResponse[]> => {
  try {
    const response = await api.get('/Curso/resumo');

    const data = response?.data;

    if (Array.isArray(data?.data)) {
      return data.data;
    }

    if (Array.isArray(data)) {
      return data;
    }

    return [];
  } catch {
    return [];
  }
};

// Atualizar curso por ID
export const atualizarCurso = async (
  id: string,
  dados: Partial<CreateCursoRequest>
): Promise<void> => {
  await api.put(`/Curso/${id}`, dados);
};

// Deletar curso por ID
export const deletarCurso = async (cursoId: string): Promise<void> => {
  if (!cursoId) {
    throw new Error('ID do curso é obrigatório');
  }

  const cleanId = cursoId.trim().replace(/^\/+|\/+$/g, '');
  const guidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (!guidRegex.test(cleanId)) {
    throw new Error(
      'ID do curso inválido. Formato esperado: GUID (ex: 00000000-0000-0000-0000-000000000000).'
    );
  }

  try {
    await api.request({ method: 'DELETE', url: `/Curso/${cleanId}` });
  } catch (error: unknown) {
    const err = error as { response?: { status?: number } };
    if (err?.response?.status === 405) {
      throw new Error('Método não permitido. Verifique se o endpoint DELETE está habilitado no backend.');
    }
    throw error;
  }
};
