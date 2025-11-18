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

  // Remove barras extras e valida formato GUID
  const cleanId = turmaId.trim().replaceAll(/(^\/+|\/+$)/g, '');

  // Validação básica de GUID
  const guidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!guidRegex.test(cleanId)) {
    throw new Error(
      `ID da turma inválido. Formato esperado: GUID (ex: 00000000-0000-0000-0000-000000000000)`
    );
  }

  console.log('Deletando turma:', cleanId);
  console.log('Rota relativa:', `/turma/${cleanId}`);
  console.log(
    'URL completa esperada:',
    `https://api.horamais.app/api/turma/${cleanId}`
  );

  try {
    // Requisição DELETE conforme rota do backend: DELETE /api/turma/{id:guid}
    // Usando axios.request com método explícito para garantir que funcione
    const response = await api.request({
      method: 'DELETE',
      url: `/turma/${cleanId}`
    });

    // Verificar se a resposta é 204 (No Content) conforme esperado pelo backend
    if (response.status === 204 || response.status === 200) {
      console.log('Turma deletada com sucesso. Status:', response.status);
      return;
    }

    console.log('Resposta DELETE turma:', response.status);
    return;
  } catch (error: unknown) {
    const err = error as {
      response?: {
        status?: number;
        statusText?: string;
        data?: unknown;
      };
      config?: {
        url?: string;
        method?: string;
        baseURL?: string;
      };
      message?: string;
    };
    console.error('Erro ao deletar turma:', error);
    console.error('Status:', err?.response?.status);
    console.error('Status Text:', err?.response?.statusText);
    console.error('Data:', err?.response?.data);
    console.error(
      'URL completa:',
      `${err?.config?.baseURL ?? ''}${err?.config?.url ?? ''}`
    );
    console.error('Método HTTP:', err?.config?.method);

    if (err?.response?.status === 405) {
      throw new Error(
        'Método não permitido. Verifique se o endpoint DELETE está configurado corretamente no backend.'
      );
    }

    throw error;
  }
};
