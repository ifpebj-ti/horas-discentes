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
  const response = await api.post('/coordenador/convite', dados);
  return response.data;
};

// Criar coordenador a partir de um convite (token)
export const cadastrarCoordenador = async (
  dados: CadastroCoordenadorRequest
): Promise<CoordenadorResponse> => {
  const response = await api.post<CoordenadorResponse>(
    '/coordenador/cadastrar',
    dados
  );
  return response.data;
};
// Obter dados do coordenador autenticado
export const obterCoordenadorAutenticado =
  async (): Promise<CoordenadorInfoResponse> => {
    const response = await api.get<CoordenadorInfoResponse>('/coordenador/me');
    return response.data;
  };

export const obterCoordenadorPorCurso = async (
  cursoId: string
): Promise<CoordenadorResumoResponse | null> => {
  try {
    const response = await api.get<CoordenadorResumoResponse>(
      `/coordenador/por-curso/${cursoId}`
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

// Deletar coordenador por ID
export const deletarCoordenador = async (
  coordenadorId: string
): Promise<void> => {
  await api.delete(`/coordenador/${coordenadorId}`);
};