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
