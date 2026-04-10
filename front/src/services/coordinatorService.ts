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
  const response = await api.post('/Coordenador/convite', dados);
  return response.data;
};

// Criar coordenador a partir de um convite (token)
export const cadastrarCoordenador = async (
  dados: CadastroCoordenadorRequest
): Promise<CoordenadorResponse> => {
  const response = await api.post<CoordenadorResponse>(
    '/Coordenador/cadastrar',
    dados
  );
  return response.data;
};
// Obter dados do coordenador autenticado
export const obterCoordenadorAutenticado =
  async (): Promise<CoordenadorInfoResponse> => {
    const response = await api.get<CoordenadorInfoResponse>('/Coordenador/me');
    return response.data;
  };

export const obterCoordenadorPorCurso = async (
  cursoId: string
): Promise<CoordenadorResumoResponse | null> => {
  try {
    const response = await api.get<CoordenadorResumoResponse>(
      `/Coordenador/por-curso/${cursoId}`
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      // Nenhum coordenador encontrado para o curso
      return null;
    }

    return null;
  }
};

// Atualizar dados do próprio coordenador autenticado
export const atualizarMeusDados = async (
  dados: Partial<CadastroCoordenadorRequest>
): Promise<void> => {
  await api.put('/Coordenador/me', dados);
};

// Atualizar coordenador por ID (apenas ADMIN)
export const atualizarCoordenador = async (
  id: string,
  dados: Partial<CadastroCoordenadorRequest>
): Promise<void> => {
  await api.put(`/Coordenador/${id}`, dados);
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

  try {
    await api.request({ method: 'DELETE', url: `/Coordenador/${cleanId}` });
  } catch (error: unknown) {
    const err = error as { response?: { status?: number } };
    if (err?.response?.status === 405) {
      throw new Error(
        'Método não permitido. Verifique se o endpoint DELETE está configurado corretamente no backend.'
      );
    }
    throw error;
  }
};
