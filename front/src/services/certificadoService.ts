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
  categoriaKey: string; // Chave para identificar a categoria
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
export interface CertificadoPorCursoResponse {
  id: string;
  grupo: string;
  categoria: string;
  tituloAtividade: string;
  cargaHoraria: number;
  local: string;
  dataInicio: string;
  dataFim: string;
  status: string;
  tipo: string;
  alunoId: string;
  alunoNome: string;
  alunoEmail: string;
  alunoMatricula: string;
  periodoTurma: string;
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

export const listarCertificadosPorCurso = async (
  cursoId: string
): Promise<CertificadoPorCursoResponse[]> => {
  const response = await api.get<CertificadoPorCursoResponse[]>(
    `/certificado/por-curso/${cursoId}`
  );
  return response.data;
};

export const baixarAnexoCertificado = async (id: string): Promise<Blob> => {
  const response = await api.get(`/certificado/${id}/anexo`, {
    responseType: 'blob'
  });
  return response.data;
};
