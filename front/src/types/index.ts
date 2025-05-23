/**
 * Status possíveis para um certificado.
 */
export type StatusCertificado = 'aprovado' | 'rejeitado' | 'pendente';

/**
 * Tipos de atividades/certificados (complementar ou extensão).
 */
export type TipoCertificado = 'complementar' | 'extensao';

/**
 * Interface para representar um Certificado.
 */
export interface Certificado {
  id: number;
  grupo: string;
  categoria: string;
  categoriaKey: string;
  title: string;
  description: string;
  cargaHoraria: number;
  local: string;
  periodoInicio: string;
  periodoFim: string;
  status: StatusCertificado;
  tipo: TipoCertificado;
  anexoComprovanteURL?: string;
}

/**
 * Interface para representar um Usuário.
 */
export interface Usuario {
  id: string;
  name: string | null | undefined;
  email: string | null | undefined;
  role: string;
  isNewPPC?: boolean;
  image?: string | null | undefined;
}

/**
 * Interface para opções de filtros (usado em selects).
 */
export interface OpcaoFiltro {
  value: string;
  label: string;
}

/**
 * Interface para representar uma categoria na visualização de progresso do aluno.
 */
export interface CategoriaProgresso {
  grupo: string;
  nome: string;
  horas: number;
  total: number;
  categoriaKey: string;
}

/**
 * Interface para as opções de categoria que serão usadas nos selects de formulários.
 */
export interface CategoriaSelecaoForm {
  nome: string;
}