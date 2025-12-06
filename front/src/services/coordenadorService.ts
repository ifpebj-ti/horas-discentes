import api from './api';

export interface ConviteCoordenadorRequest {
  email: string;
  cursoId: string;
}

export interface CadastroCoordenadorRequest {
  nome: string;
  numeroPortaria: string;
  dou: string;
  email: string;
  senha: string;
  token: string;
}

export interface CoordenadorResponse {
  id: string;
  nome: string;
  email: string;
}
export interface CoordenadorInfoResponse {
  nome: string;
  curso: string;
  numeroPortaria: string;
  dou: string;
}

export interface CoordenadorResumoResponse {
  id: string;
  nome: string;
}
// Enviar convite para coordenador (apenas ADMIN)
export const enviarConviteCoordenador = async (
  dados: ConviteCoordenadorRequest
): Promise<{ mensagem: string }> => {
  if (!dados.email || !dados.cursoId) {
    throw new Error('Email e cursoId são obrigatórios');
  }

  try {
    const response = await api.post('/Coordenador/convite', dados);
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar convite para coordenador:', error);
    throw error;
  }
};

// Criar coordenador a partir de um convite (token)
export const cadastrarCoordenador = async (
  dados: CadastroCoordenadorRequest
): Promise<CoordenadorResponse> => {
  if (!dados.token || !dados.email || !dados.senha) {
    throw new Error('Token, email e senha são obrigatórios');
  }

  try {
    const response = await api.post<CoordenadorResponse>(
      '/Coordenador/cadastrar',
      dados
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao cadastrar coordenador:', error);
    throw error;
  }
};
// Obter dados do coordenador autenticado
export const obterCoordenadorAutenticado =
  async (): Promise<CoordenadorInfoResponse | null> => {
    try {
      const response =
        await api.get<CoordenadorInfoResponse>('/Coordenador/me');
      return response.data;
    } catch (error) {
      console.error('Erro ao obter coordenador autenticado:', error);
      // Retorna null em caso de erro para não quebrar a UI
      return null;
    }
  };

export const obterCoordenadorPorCurso = async (
  cursoId: string
): Promise<CoordenadorResumoResponse | null> => {
  try {
    const response = await api.get<CoordenadorResumoResponse>(
      `/Coordenador/por-curso/${cursoId}`
    );
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response?.status === 404) {
      // Nenhum coordenador encontrado para o curso
      return null;
    }

    console.error('Erro ao obter coordenador por curso:', error);
    return null;
  }
};

// Atualizar dados do próprio coordenador autenticado
export const atualizarMeusDados = async (
  dados: Partial<CadastroCoordenadorRequest>
): Promise<void> => {
  try {
    await api.put('/Coordenador/me', dados);
  } catch (error) {
    console.error('Erro ao atualizar dados do coordenador:', error);
    throw error;
  }
};

// Atualizar coordenador por ID (apenas ADMIN)
export const atualizarCoordenador = async (
  id: string,
  dados: Partial<CadastroCoordenadorRequest>
): Promise<void> => {
  if (!id || id.trim() === '') {
    throw new Error('ID do coordenador é obrigatório');
  }

  try {
    await api.put(`/Coordenador/${id.trim()}`, dados);
  } catch (error) {
    console.error('Erro ao atualizar coordenador:', error);
    throw error;
  }
};

// Deletar coordenador por ID
export const deletarCoordenador = async (
  coordenadorId: string
): Promise<void> => {
  if (!coordenadorId) {
    throw new Error('ID do coordenador é obrigatório');
  }

  // Remove barras extras e valida formato GUID
  const cleanId = coordenadorId.trim().replaceAll(/(^\/+|\/+$)/g, '');

  // Validação básica de GUID
  const guidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!guidRegex.test(cleanId)) {
    throw new Error(
      `ID do coordenador inválido. Formato esperado: GUID (ex: 00000000-0000-0000-0000-000000000000)`
    );
  }

  console.log('Deletando coordenador:', cleanId);
  console.log('Rota relativa:', `/Coordenador/${cleanId}`);
  console.log(
    'URL completa esperada:',
    `https://api.horamais.app/api/Coordenador/${cleanId}`
  );

  try {
    // Requisição DELETE conforme rota do backend: DELETE /api/Coordenador/{id:guid}
    // Usando axios.request com método explícito para garantir que funcione
    const response = await api.request({
      method: 'DELETE',
      url: `/Coordenador/${cleanId}`
    });

    // Verificar se a resposta é 204 (No Content) conforme esperado pelo backend
    if (response.status === 204 || response.status === 200) {
      console.log('Coordenador deletado com sucesso. Status:', response.status);
      return;
    }

    console.log('Resposta DELETE coordenador:', response.status);
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
    console.error('Erro ao deletar coordenador:', error);
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
