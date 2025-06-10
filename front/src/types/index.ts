/**
 * Status possíveis para um certificado.
 */
export type StatusCertificado = 'aprovado' | 'rejeitado' | 'pendente';

/**
 * Tipos de atividades/certificados (complementar ou extensão).
 */
export type TipoCertificado = 'complementar' | 'extensao';

/**
 * Interface base para representar um Certificado do Aluno.
 */
export interface Certificado {
  id: number; // ID numérico original do certificado do aluno
  grupo: string;
  categoria: string;
  categoriaKey: string;
  title: string;
  description: string;
  cargaHoraria: number;
  local: string;
  periodoInicio: string; // Formato YYYY-MM-DD
  periodoFim: string; // Formato YYYY-MM-DD
  status: StatusCertificado;
  tipo: TipoCertificado;
  anexoComprovanteURL?: string;
}

/**
 * Interface para representar um Certificado na visão da Coordenação.
 * Ela combina os dados do Certificado com as informações do Aluno.
 */
export interface CertificadoCoordenacao {
  id: string; // ID único para a submissão da coordenação (ex: 'cert1')
  certificadoId: number; // ID do certificado original para referência
  turma: number;
  periodo: number;
  grupo: string;
  categoria: string;
  title: string;
  description: string;
  cargaHoraria: number;
  local: string;
  // Mantém os períodos originais para lógica e formata a data para exibição
  periodoInicio: string;
  periodoFim: string;
  dataAtividade: string; // String formatada para exibição (ex: "10/03/2024 a 12/03/2024")
  status: StatusCertificado;
  tipo: TipoCertificado;
  alunoNome: string;
  alunoEmail: string;
  alunoMatricula: string;
  alunoTelefone: string;
  anexoComprovanteURL?: string;
  motivoRejeicao?: string;
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
  image?: string | null;
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
  image?: string | null;
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
  categoria: string;
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

/**
 * Interface Coordenador
 */
export interface Coordenador {
  id: number;
  nome: string;
  role: string;
  email: string;
  telefone: string;
  createdAt: string;
  updatedAt: string;
}
