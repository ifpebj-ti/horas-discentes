import {
  obterMeusDadosDetalhados,
  AlunoDetalhadoResponse,
  listarResumoHoras,
  AlunoResumoHorasResponse
} from '@/services/alunoService';
import { useQuery } from '@tanstack/react-query';

export function useMeusDadosDetalhados() {
  return useQuery<AlunoDetalhadoResponse>({
    queryKey: ['meus-dados-detalhados'],
    queryFn: obterMeusDadosDetalhados,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
}

export function useResumoHoras() {
  return useQuery<AlunoResumoHorasResponse[]>({
    queryKey: ['resumo-horas'],
    queryFn: listarResumoHoras,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
}
