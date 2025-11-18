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

// Atualizar curso por ID
export const atualizarCurso = async (
  id: string,
  dados: Partial<CreateCursoRequest>
): Promise<void> => {
  await api.put(`/curso/${id}`, dados);
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

  console.log('Deletando curso:', cleanId);
  console.log('Rota relativa:', `/curso/${cleanId}`);

  try {
    // Requisição DELETE conforme rota do backend: DELETE /api/curso/{id:guid}
    // Usando axios.request com método explícito para garantir que funcione
    const response = await api.request({
      method: 'DELETE',
      url: `/curso/${cleanId}`
    });

    // Verificar se a resposta é 204 (No Content) conforme esperado pelo backend
    if (response.status === 204 || response.status === 200) {
      console.log('Curso deletado com sucesso. Status:', response.status);
      return;
    }

    console.log('Resposta DELETE curso:', response.status);
    return;
  } catch (error: unknown) {
    const err = error as {
      response?: {
        status?: number;
        statusText?: string;
        data?: unknown;
        headers?: Record<string, string>;
      };
      config?: {
        url?: string;
        method?: string;
        baseURL?: string;
        headers?: Record<string, string>;
      };
    };
    console.error('Erro ao deletar curso:', error);
    console.error('Status:', err?.response?.status);
    console.error('Status Text:', err?.response?.statusText);
    console.error('Data:', err?.response?.data);
    console.error(
      'URL completa:',
      `${err?.config?.baseURL ?? ''}${err?.config?.url ?? ''}`
    );
    console.error('Método HTTP:', err?.config?.method);
    console.error('Headers:', err?.config?.headers);

    if (err?.response?.status === 405) {
      throw new Error(
        'Método não permitido. Verifique se o endpoint DELETE está habilitado no backend.'
      );
    }

    throw error;
  }
};
