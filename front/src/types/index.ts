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

/**
 * Interface para representar um Certificado na visão da Coordenação.
 */
export interface CertificadoCoordenacao {
  id: string; // Pode ser string ou number, mas string é mais flexível para UUIDs futuros
  ano: number;
  periodo: string;
  categoriaNome: string; // Usar um nome diferente de 'categoria' se já existir com outro significado
  descricaoAtividade: string;
  horas: number;
  alunoNome: string;
  alunoEmail: string;
  alunoMatricula: string;
  alunoTelefone: string;
  localAtividade: string;
  dataAtividade: string; // Ex: "01/03/2024 a 15/03/2024"
  status: StatusCertificado; // Reutilizando o StatusCertificado existente
  // anexoComprovanteURL é importante para "Visualizar PDF"
  anexoComprovanteURL?: string; // Opcional se nem todos tiverem ou se o link for construído de outra forma
  motivoRejeicao?: string; // Opcional, preenchido ao rejeitar
}
