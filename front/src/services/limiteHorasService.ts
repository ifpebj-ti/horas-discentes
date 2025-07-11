import api from './api';

// Types
export interface CreateLimiteHorasAlunoRequest {
  maximoHorasComplementar: number;
  maximoHorasExtensao?: number;
  cursoId: string;
}

// Criar limite de horas por curso
export const criarLimiteHoras = async (
  dados: CreateLimiteHorasAlunoRequest
): Promise<{ id: string }> => {
  const response = await api.post<{ id: string }>('/limitehorasaluno', dados);
  return response.data;
};
