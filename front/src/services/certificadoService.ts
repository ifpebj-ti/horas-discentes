import api from './api';

export enum TipoCertificado {
  EXTENSAO = 'EXTENSAO',
  COMPLEMENTAR = 'COMPLEMENTAR'
}

export enum StatusCertificado {
  PENDENTE = 'PENDENTE',
  APROVADO = 'APROVADO',
  REPROVADO = 'REPROVADO'
}

export interface CertificadoResponse {
  id: string;
  tituloAtividade: string;
  instituicao: string;
  local: string;
  categoria: string;
  grupo: string;
  periodoLetivo: string;
  cargaHoraria: number;
  dataInicio: string;
  dataFim: string;
  totalPeriodos: number;
  descricao?: string;
  tipo: TipoCertificado;
  status: StatusCertificado;
  alunoId: string;
  atividadeId: string;
}

export interface CertificadoDetalhadoResponse extends CertificadoResponse {
  anexoBase64?: string;
}

export interface CreateCertificadoRequest {
  tituloAtividade: string;
  instituicao: string;
  local: string;
  categoria: string;
  grupo: string;
  periodoLetivo: string;
  cargaHoraria: number;
  dataInicio: string;
  dataFim: string;
  totalPeriodos: number;
  descricao?: string;
  anexo: File;
  alunoId: string;
  atividadeId: string;
  tipo: TipoCertificado;
}

export const enviarCertificado = async (
  form: FormData
): Promise<{ certificadoId: string }> => {
  const response = await api.post('/certificado', form, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const listarCertificados = async (
  status?: StatusCertificado,
  alunoId?: string
): Promise<CertificadoResponse[]> => {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  if (alunoId) params.append('alunoId', alunoId);

  const response = await api.get<CertificadoResponse[]>(
    `/certificado?${params}`
  );
  return response.data;
};

export const obterCertificadoPorId = async (
  id: string
): Promise<CertificadoDetalhadoResponse> => {
  const response = await api.get<CertificadoDetalhadoResponse>(
    `/certificado/${id}`
  );
  return response.data;
};

export const aprovarCertificado = async (id: string): Promise<void> => {
  await api.patch(`/certificado/${id}/aprovar`);
};

export const reprovarCertificado = async (id: string): Promise<void> => {
  await api.patch(`/certificado/${id}/reprovar`);
};

export const listarMeusCertificados = async (): Promise<
  CertificadoResponse[]
> => {
  const response = await api.get<CertificadoResponse[]>('/certificado/me');
  return response.data;
};
