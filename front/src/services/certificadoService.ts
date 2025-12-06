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
  try {
    const response = await api.post('/Certificado', form, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar certificado:', error);
    throw error;
  }
};

export const listarCertificados = async (
  status?: StatusCertificado,
  alunoId?: string
): Promise<CertificadoResponse[]> => {
  try {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (alunoId) params.append('alunoId', alunoId);

    const response = await api.get<CertificadoResponse[]>(
      `/Certificado?${params}`
    );
    return response.data || [];
  } catch (error) {
    console.error('Erro ao listar certificados:', error);
    return [];
  }
};

export const obterCertificadoPorId = async (
  id: string
): Promise<CertificadoDetalhadoResponse> => {
  if (!id || id.trim() === '') {
    throw new Error('ID do certificado é obrigatório');
  }

  try {
    const response = await api.get<CertificadoDetalhadoResponse>(
      `/Certificado/${id.trim()}`
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao obter certificado por ID:', error);
    throw error;
  }
};

export const aprovarCertificado = async (id: string): Promise<void> => {
  if (!id || id.trim() === '') {
    throw new Error('ID do certificado é obrigatório');
  }

  try {
    await api.patch(`/Certificado/${id.trim()}/aprovar`);
  } catch (error) {
    console.error('Erro ao aprovar certificado:', error);
    throw error;
  }
};

export const reprovarCertificado = async (
  id: string,
  motivoRejeicao?: string
): Promise<void> => {
  if (!id || id.trim() === '') {
    throw new Error('ID do certificado é obrigatório');
  }

  try {
    await api.patch(`/Certificado/${id.trim()}/reprovar`, {
      motivoRejeicao: motivoRejeicao?.trim() || undefined
    });
  } catch (error) {
    console.error('Erro ao reprovar certificado:', error);
    throw error;
  }
};

export const listarMeusCertificados = async (): Promise<
  CertificadoResponse[]
> => {
  try {
    const response = await api.get<CertificadoResponse[]>('/Certificado/me');
    return response.data || [];
  } catch (error) {
    console.error('Erro ao listar meus certificados:', error);
    // Retorna array vazio em caso de erro para não quebrar a UI
    return [];
  }
};

export const listarCertificadosPorCurso = async (
  cursoId: string
): Promise<CertificadoPorCursoResponse[]> => {
  if (!cursoId || cursoId.trim() === '') {
    console.warn('cursoId não fornecido para listarCertificadosPorCurso');
    return [];
  }

  try {
    const response = await api.get<CertificadoPorCursoResponse[]>(
      `/Certificado/por-curso/${cursoId.trim()}`
    );
    return response.data || [];
  } catch (error) {
    console.error('Erro ao listar certificados por curso:', error);
    // Retorna array vazio em caso de erro para não quebrar a UI
    return [];
  }
};

export const baixarAnexoCertificado = async (id: string): Promise<Blob> => {
  if (!id || id.trim() === '') {
    throw new Error('ID do certificado é obrigatório');
  }

  try {
    const response = await api.get(`/Certificado/${id.trim()}/anexo`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao baixar anexo do certificado:', error);
    throw error;
  }
};

export interface UpdateCertificadoRequest {
  tituloAtividade?: string;
  instituicao?: string;
  local?: string;
  categoria?: string;
  grupo?: string;
  periodoLetivo?: string;
  cargaHoraria?: number;
  dataInicio?: string;
  dataFim?: string;
  totalPeriodos?: number;
  descricao?: string;
  anexo?: File;
  atividadeId?: string;
  tipo?: TipoCertificado;
}

// Atualizar certificado por ID (apenas PENDENTE)
export const atualizarCertificado = async (
  id: string,
  form: FormData
): Promise<void> => {
  if (!id || id.trim() === '') {
    throw new Error('ID do certificado é obrigatório');
  }

  try {
    await api.put(`/Certificado/${id.trim()}`, form, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar certificado:', error);
    throw error;
  }
};

// Deletar certificado por ID (apenas ADMIN/COORDENADOR)
export const deletarCertificado = async (id: string): Promise<void> => {
  if (!id) {
    throw new Error('ID do certificado é obrigatório');
  }

  const cleanId = id.trim();
  console.log('Deletando certificado:', cleanId);
  console.log('URL completa:', `/api/Certificado/${cleanId}`);

  try {
    const response = await api.delete(`/Certificado/${cleanId}`);
    console.log('Resposta DELETE certificado:', response.status);
    return;
  } catch (error: unknown) {
    const err = error as {
      response?: { status?: number; data?: unknown };
      config?: { url?: string; method?: string };
    };
    console.error('Erro ao deletar certificado:', error);
    console.error('Status:', err?.response?.status);
    console.error('Data:', err?.response?.data);
    console.error('URL tentada:', err?.config?.url);
    console.error('Método HTTP:', err?.config?.method);
    throw error;
  }
};
