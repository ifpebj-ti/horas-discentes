import {
  listarMeusCertificados,
  listarCertificadosPorCurso,
  obterCertificadoPorId,
  StatusCertificado
} from '@/services/certificateService';
import {
  CertificadoResponse,
  CertificadoDetalhadoResponse
} from '@/services/certificateService';
import { useQuery } from '@tanstack/react-query';

const FIVE_MINUTES_IN_MS = 1000 * 60 * 5;
const ONE_MINUTE_IN_MS = 1000 * 60 * 1;

export function useMeusCertificados() {
  return useQuery<CertificadoResponse[]>({
    queryKey: ['meus-certificados'],
    queryFn: listarMeusCertificados,
    staleTime: ONE_MINUTE_IN_MS
  });
}

export function useCertificadosPendentesPorCurso(cursoId: string | undefined) {
  return useQuery<number>({
    queryKey: ['certificados-pendentes-count', cursoId],
    queryFn: async () => {
      if (!cursoId) return 0;
      const certificados = await listarCertificadosPorCurso(cursoId);
      return certificados.filter((c) => c.status === StatusCertificado.PENDENTE)
        .length;
    },
    enabled: !!cursoId,
    staleTime: ONE_MINUTE_IN_MS
  });
}

export function useCertificadoDetalhes(id: string | undefined) {
  return useQuery<CertificadoDetalhadoResponse>({
    queryKey: ['certificado', id],
    queryFn: () => obterCertificadoPorId(id!),
    enabled: !!id,
    staleTime: FIVE_MINUTES_IN_MS
  });
}
