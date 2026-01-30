import {
  listarMeusCertificados,
  obterCertificadoPorId
} from '@/services/certificadoService';
import {
  CertificadoResponse,
  CertificadoDetalhadoResponse
} from '@/services/certificadoService';
import { useQuery } from '@tanstack/react-query';

export function useMeusCertificados() {
  return useQuery<CertificadoResponse[]>({
    queryKey: ['meus-certificados'],
    queryFn: listarMeusCertificados,
    staleTime: 1000 * 60 * 1 // 1 minute
  });
}

export function useCertificadoDetalhes(id: string | undefined) {
  return useQuery<CertificadoDetalhadoResponse>({
    queryKey: ['certificado', id],
    queryFn: () => obterCertificadoPorId(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
}
