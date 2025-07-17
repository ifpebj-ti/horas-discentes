export interface Atividade {
  id?: string;
  nome: string;
  grupo: string;
  categoria: string;
  categoriaKey: string;
  cargaMaximaSemestral: number;
  cargaMaximaCurso: number;
  tipo: 'EXTENSAO' | 'COMPLEMENTAR';
  cursoId?: string;
}

export type TipoAtividade = 'EXTENSAO' | 'COMPLEMENTAR';

export const TIPO_ATIVIDADE_LABELS: Record<TipoAtividade, string> = {
  COMPLEMENTAR: 'Atividades Complementares',
  EXTENSAO: 'Atividades de Extensão'
};
