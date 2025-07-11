import * as Types from '@/types';

// Supondo que MOCK_CERTIFICATES está no mesmo arquivo ou importado
import { MOCK_CERTIFICATES } from './alunoMock'; // Ajuste o caminho conforme necessário

// --- Dados dos Alunos para o Mock ---
const AlunosMock = [
  {
    nome: 'João Silva',
    email: 'joao.silva@example.com',
    matricula: '20221ESOFT0001',
    telefone: '(81) 99999-9999',
    turma: 2024,
    periodo: 1
  },
  {
    nome: 'Maria Santos',
    email: 'maria.santos@example.com',
    matricula: '20221ESOFT0002',
    telefone: '(81) 98888-8888',
    turma: 2024,
    periodo: 1
  },
  {
    nome: 'Carlos Lima',
    email: 'carlos.lima@example.com',
    matricula: '20212ESOFT0099',
    telefone: '(81) 97777-7777',
    turma: 2023,
    periodo: 2
  },
  {
    nome: 'Ana Pereira',
    email: 'ana.pereira@example.com',
    matricula: '20231ESOFT0005',
    telefone: '(81) 96666-6666',
    turma: 2023,
    periodo: 2
  }
];

// --- Função Helper para formatar a data ---
const formatarData = (inicio: string, fim: string): string => {
  const dataInicio = new Date(inicio + 'T00:00:00'); // Adiciona T00:00:00 para evitar problemas de fuso horário
  const dataFim = new Date(fim + 'T00:00:00');

  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  };
  const inicioFmt = dataInicio.toLocaleDateString('pt-BR', options);
  const fimFmt = dataFim.toLocaleDateString('pt-BR', options);

  return inicioFmt === fimFmt ? inicioFmt : `${inicioFmt} a ${fimFmt}`;
};

// --- Mock da Coordenação Vinculado ---
export const MOCK_COORDENACAO_CERTIFICADOS: Types.CertificadoCoordenacao[] =
  MOCK_CERTIFICATES.map((cert, index) => {
    // Distribui os certificados entre os alunos de forma circular
    const aluno = AlunosMock[index % AlunosMock.length];

    return {
      id: `coord-cert-${cert.id}`, // Cria um ID único para a visão da coordenação
      certificadoId: Number(cert.id), // Mantém o ID original como referência e garante que seja number

      // Dados do Certificado (herdados do mock de aluno)
      grupo: cert.grupo,
      categoria: cert.categoria,
      title: cert.title,
      description: cert.description,
      cargaHoraria: cert.cargaHoraria,
      local: cert.local,
      periodoInicio: cert.periodoInicio,
      periodoFim: cert.periodoFim,
      status: cert.status,
      tipo: cert.tipo,
      anexoComprovanteURL: `/mocks/certificado_aluno_${cert.id}.pdf`, // URL mock

      // Dados do Aluno
      alunoNome: aluno.nome,
      alunoEmail: aluno.email,
      alunoMatricula: aluno.matricula,
      alunoTelefone: aluno.telefone,

      // Dados da Coordenação
      turma: aluno.turma,
      periodo: aluno.periodo,
      dataAtividade: formatarData(cert.periodoInicio, cert.periodoFim),
      motivoRejeicao:
        cert.status === 'rejeitado'
          ? 'Carga horária ou documento inválido.'
          : undefined
    };
  });
