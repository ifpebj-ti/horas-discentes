'use client';
import Link from 'next/link';
import { FaHome, FaPlusCircle } from 'react-icons/fa';
import BreadCrumb from '@/components/BreadCrumb';
import ProgressSummary from '@/components/Student/ProgressSummary';
import StatsSummary from '@/components/Student/StatsSummary';
import { SOFTWARE_ENGINEERING_REQUIREMENTS, CATEGORY_INFO } from '@/types';
import { RoundedButton } from '@/components/RoundedButton';
import ProgressoGeral from '@/components/ProgressoGeral';
import VerCertificado from '@/components/VerCertificado/VerCertificado';

interface Certificate {
  id: string;
  title: string;
  institution: string;
  description: string;
  hours: number;
  date: string;
  category: string;
  status: 'aprovado' | 'rejeitado' | 'pendente';
  tipo: 'complementar' | 'extensao';
}

const MOCK_CERTIFICATES: Certificate[] = [
  {
    id: '1',
    title: 'Monitoria em Programação',
    description: 'Atuação como monitor na disciplina de Programação',
    institution: 'IFPE - Campus Belo Jardim',
    hours: 30,
    date: '2023-07-19',
    category: 'Monitoria',
    status: 'rejeitado',
    tipo: 'complementar'
  },
  {
    id: '2',
    title: 'Curso de React',
    description: 'Curso online de React com duração de 40 horas',
    institution: 'Udemy',
    hours: 40,
    date: '2023-06-08',
    category: 'Cursos Complementares',
    status: 'pendente',
    tipo: 'complementar'
  },
  {
    id: '3',
    title: 'Semana de Engenharia de Software',
    description: 'Participação na semana de Engenharia de Software do IFPE',
    institution: 'IFPE - Campus Belo Jardim',
    hours: 20,
    date: '2023-05-14',
    category: 'Atividades Acadêmicas',
    status: 'aprovado',
    tipo: 'complementar'
  }
];

export default function Aluno() {
  const certificates = MOCK_CERTIFICATES;

  const total = certificates.length;
  const approved = certificates.filter(c => c.status === 'aprovado').length;
  const pending = certificates.filter(c => c.status === 'pendente').length;
  const rejected = certificates.filter(c => c.status === 'rejeitado').length;

  // Filtrar apenas certificados aprovados
  const approvedCertificates = certificates.filter(c => c.status === 'aprovado');

  // Separar certificados aprovados por tipo
  const compCertificates = approvedCertificates.filter(c => c.tipo === 'complementar');
  const extCertificates = approvedCertificates.filter(c => c.tipo === 'extensao');

  // Categorias de Atividades Complementares (baseado na tabela)
  const categoriasComplementares = [
    {
      nome: 'Disciplinas cursadas em outros cursos de graduação',
      horas: compCertificates.filter(c => c.category === 'Disciplinas cursadas em outros cursos de graduação').reduce((acc, c) => acc + c.hours, 0),
      total: 60,
      categoriaKey: 'disciplinas_outros_cursos',
      grupo: 'I'
    },
    {
      nome: 'Monitoria',
      horas: compCertificates.filter(c => c.category === 'Monitoria').reduce((acc, c) => acc + c.hours, 0),
      total: 80,
      categoriaKey: 'monitoria',
      grupo: 'I'
    },
    {
      nome: 'Cursos de idiomas realizados durante o curso, comunicação e expressão e informática',
      horas: compCertificates.filter(c => c.category === 'Cursos de idiomas realizados durante o curso, comunicação e expressão e informática').reduce((acc, c) => acc + c.hours, 0),
      total: 80,
      categoriaKey: 'cursos_idiomas_informatica',
      grupo: 'I'
    },
    {
      nome: 'Cursos extras realizados durante o curso',
      horas: compCertificates.filter(c => c.category === 'Cursos extras realizados durante o curso').reduce((acc, c) => acc + c.hours, 0),
      total: 40,
      categoriaKey: 'cursos_extras',
      grupo: 'I'
    },
    {
      nome: 'Visita técnica em área afim ao curso e supervisionada pela instituição, mediante apresentação de relatório.',
      horas: compCertificates.filter(c => c.category === 'Visita técnica em área afim ao curso e supervisionada pela instituição, mediante apresentação de relatório.').reduce((acc, c) => acc + c.hours, 0),
      total: 80,
      categoriaKey: 'visita_tecnica',
      grupo: 'II'
    },
    {
      nome: 'Estágio Profissional não obrigatório',
      horas: compCertificates.filter(c => c.category === 'Estágio Profissional não obrigatório').reduce((acc, c) => acc + c.hours, 0),
      total: 60,
      categoriaKey: 'estagio_nao_obrigatorio',
      grupo: 'II'
    },
    {
      nome: 'Participação como ouvinte, participante, palestrante, instrutor, apresentador, expositor ou mediador em eventos científicos, seminários, atividades culturais, esportivas, políticas e sociais, sessões técnicas, exposições, jornadas acadêmicas e científicas, palestras, seminários, congressos, conferências ou similares',
      horas: compCertificates.filter(c => c.category === 'Participação como ouvinte, participante, palestrante, instrutor, apresentador, expositor ou mediador em eventos científicos, seminários, atividades culturais, esportivas, políticas e sociais, sessões técnicas, exposições, jornadas acadêmicas e científicas, palestras, seminários, congressos, conferências ou similares').reduce((acc, c) => acc + c.hours, 0),
      total: 80,
      categoriaKey: 'participacao_eventos',
      grupo: 'III'
    },
    {
      nome: 'Participação em pesquisa',
      horas: compCertificates.filter(c => c.category === 'Participação em pesquisa').reduce((acc, c) => acc + c.hours, 0),
      total: 80,
      categoriaKey: 'participacao_pesquisa',
      grupo: 'IV'
    },
    {
      nome: 'Publicações de textos acadêmicos',
      horas: compCertificates.filter(c => c.category === 'Publicações de textos acadêmicos').reduce((acc, c) => acc + c.hours, 0),
      total: 40,
      categoriaKey: 'publicacoes_academicas',
      grupo: 'IV'
    },
    {
      nome: 'Grupos de estudos com produção intelectual',
      horas: compCertificates.filter(c => c.category === 'Grupos de estudos com produção intelectual').reduce((acc, c) => acc + c.hours, 0),
      total: 20,
      categoriaKey: 'grupos_estudos',
      grupo: 'IV'
    },
    {
      nome: 'Trabalhos desenvolvidos sob orientação de docente apresentados em eventos acadêmicos',
      horas: compCertificates.filter(c => c.category === 'Trabalhos desenvolvidos sob orientação de docente apresentados em eventos acadêmicos').reduce((acc, c) => acc + c.hours, 0),
      total: 40,
      categoriaKey: 'trabalhos_orientacao',
      grupo: 'IV'
    }
  ];

  // Categorias de Atividades de Extensão (baseado na tabela)
  const categoriasExtensao = [
    {
      nome: 'Participação como Bolsista, voluntário ou colaborador, em Projetos/Programas de Extensão coordenado por servidor do IFPE',
      horas: extCertificates.filter(c => c.category === 'Participação como Bolsista, voluntário ou colaborador, em Projetos/Programas de Extensão coordenado por servidor do IFPE').reduce((acc, c) => acc + c.hours, 0),
      total: 160,
      categoriaKey: 'bolsista_extensao',
      grupo: 'Extensão'
    },
    {
      nome: 'Participação em Eventos voltados ao público externo como Palestrante, Instrutor, Apresentador, Expositor ou Mediador de Cursos/Palestras/Workshops/Mesas Redondas/Oficinas',
      horas: extCertificates.filter(c => c.category === 'Participação em Eventos voltados ao público externo como Palestrante, Instrutor, Apresentador, Expositor ou Mediador de Cursos/Palestras/Workshops/Mesas Redondas/Oficinas').reduce((acc, c) => acc + c.hours, 0),
      total: 80,
      categoriaKey: 'eventos_publico_externo',
      grupo: 'Extensão'
    },
    {
      nome: 'Participação da Comissão Organizadora ou como Monitor em Eventos para exibição pública de conhecimento ou produto (Cultural, Acadêmico, Científico ou Tecnológico) desenvolvido no IFPE',
      horas: extCertificates.filter(c => c.category === 'Participação da Comissão Organizadora ou como Monitor em Eventos para exibição pública de conhecimento ou produto (Cultural, Acadêmico, Científico ou Tecnológico) desenvolvido no IFPE').reduce((acc, c) => acc + c.hours, 0),
      total: 80,
      categoriaKey: 'comissao_organizadora',
      grupo: 'Extensão'
    },
    {
      nome: 'Prestação de serviços de caráter extensionista',
      horas: extCertificates.filter(c => c.category === 'Prestação de serviços de caráter extensionista').reduce((acc, c) => acc + c.hours, 0),
      total: 160,
      categoriaKey: 'servicos_extensionistas',
      grupo: 'Extensão'
    },
    {
      nome: 'Atividades desenvolvidas por meio dos Núcleos Institucionais de Extensão',
      horas: extCertificates.filter(c => c.category === 'Atividades desenvolvidas por meio dos Núcleos Institucionais de Extensão').reduce((acc, c) => acc + c.hours, 0),
      total: 80,
      categoriaKey: 'nucleos_extensao',
      grupo: 'Extensão'
    },
    {
      nome: 'Atividades de empreendedorismo, como membro de empresa júnior ou como voluntário/a ou bolsista de incubadoras de empresas ou projetos, prestando assessoria e consultoria',
      horas: extCertificates.filter(c => c.category === 'Atividades de empreendedorismo, como membro de empresa júnior ou como voluntário/a ou bolsista de incubadoras de empresas ou projetos, prestando assessoria e consultoria').reduce((acc, c) => acc + c.hours, 0),
      total: 160,
      categoriaKey: 'empreendedorismo',
      grupo: 'Extensão'
    }
  ];

  // total de horas aprovadas somadas
  const totalHoras = approvedCertificates.reduce((acc, cert) => acc + cert.hours, 0);

  // total horas exigidas no curso
  const totalNecessarias = 280;

  return (
    <div className="min-h-screen flex flex-col">
      {/* MAIN ---------------------------------------------------------------- */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl mb-1">
                Olá, Aluno!
              </h1>
              <p className="text-sm">
                Bem-vindo ao Horas Discentes. Acompanhe suas atividades complementares.
              </p>
            </div>

            <Link
              href="/aluno/certificado/novo"
            >
              <RoundedButton text="Novo Certificado" icon={<FaPlusCircle />} />
            </Link>
          </div>

          <BreadCrumb
            items={[
              {
                icon: <FaHome className="text-base" />,
                label: 'Início',
                href: '/aluno'
              }
            ]}
          />

          <div
            className="grid gap-10 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"
          >
            {/* COLUNA PRINCIPAL ------------------------------------------------ */}
            <section className="space-y-8">
              {/* Progresso Geral - Atividades Complementares */}
              <ProgressoGeral
                categorias={categoriasComplementares}
                totalHoras={categoriasComplementares.reduce((acc, cat) => acc + cat.horas, 0)}
                totalNecessarias={280}
              />
              {/* Progresso Geral - Atividades de Extensão */}
              <ProgressoGeral
                categorias={categoriasExtensao}
                totalHoras={categoriasExtensao.reduce((acc, cat) => acc + cat.horas, 0)}
                totalNecessarias={320}
              />

              {/* Certificados recentes ------------------------------------- */}
              <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[#071D41]">Certificados Recentes</h2>
                  <Link
                    href="/aluno/certificado"
                    className="text-sm font-medium text-[#0F4AA9] hover:underline hover:text-[#0D3F8E] transition-colors"
                  >
                    Ver todos
                  </Link>
                </div>

                {certificates.length ? (
                  <div className="space-y-4">
                    {certificates.slice(0, 3).map(cert => (
                      <VerCertificado key={cert.id} certificate={cert} />
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-sm">
                      Ainda não há certificados enviados.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* COLUNA LATERAL -------------------------------------------------- */}
            <aside className="space-y-8">
              <StatsSummary
                total={total}
                approved={approved}
                pending={pending}
                rejected={rejected}
              />

              <div className="bg-blue-50/60 border border-blue-100 rounded-2xl shadow-sm p-6">
                <h2 className="text-md font-semibold text-[#071D41] mb-4">
                  Dúvidas Frequentes
                </h2>
                <ul className="space-y-3 text-sm leading-relaxed">
                  {[
                    'Como são contabilizadas as horas?',
                    'Quais atividades são aceitas?',
                    'Qual o prazo para envio de certificados?',
                    'Como saber se meu certificado foi aprovado?',
                  ].map(q => (
                    <li key={q}>
                      <button
                        type="button"
                        className="text-[#0F4AA9] hover:underline transition-colors bg-transparent border-none p-0 cursor-pointer"
                      >
                        {q}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* FOOTER -------------------------------------------------------------- */}
      <footer className="bg-white border-t py-4 text-center text-xs text-gray-500">
        © 2024 Sua Empresa. Todos os direitos reservados.
      </footer>
    </div>
  );
}
