import {
  obterMeusDadosDetalhados,
  AlunoDetalhadoResponse,
  listarResumoHoras,
  AlunoResumoHorasResponse
} from '@/services/studentService';
import { useQuery } from '@tanstack/react-query';

const FIVE_MINUTES_IN_MS = 1000 * 60 * 5;

export function useMeusDadosDetalhados() {
  return useQuery<AlunoDetalhadoResponse>({
    queryKey: ['meus-dados-detalhados'],
    queryFn: obterMeusDadosDetalhados,
    staleTime: FIVE_MINUTES_IN_MS
  });
}

export function useResumoHoras() {
  return useQuery<AlunoResumoHorasResponse[]>({
    queryKey: ['resumo-horas'],
    queryFn: listarResumoHoras,
    staleTime: FIVE_MINUTES_IN_MS
  });
}
