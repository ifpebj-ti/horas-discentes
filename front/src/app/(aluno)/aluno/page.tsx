'use client';
import Link from 'next/link';
import { FaHome, FaPlusCircle } from 'react-icons/fa';
import BreadCrumb from '@/components/BreadCrumb';
import StatsSummary from '@/components/Student/StatsSummary';
import { RoundedButton } from '@/components/RoundedButton';
import ProgressoGeral from '@/components/ProgressoGeral';
import VerCertificado from '@/components/VerCertificado/VerCertificado';
import { MOCK_CERTIFICATES } from '../layout';
import { useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isNewPPC: boolean;
}
interface Certificado {
  id: string | number;
  grupo: string;
  categoria: string;
  categoriaKey: string;
  title: string;
  description: string;
  cargaHoraria: number;
  local: string;
  periodo: string;
  status: 'aprovado' | 'rejeitado' | 'pendente';
  tipo: string;
}

const MOCK_USER: User = {
  id: '1',
  name: 'Silva',
  email: 'silva@example.com',
  role: 'aluno',
  // Mudando o valor para true/false para simular o novo PPC
  isNewPPC: true
};

export default function Aluno() {
  const Certificados = MOCK_CERTIFICATES;
  const user = MOCK_USER;

  const total = Certificados.length;
  const approved = Certificados.filter(c => c.status === 'aprovado').length;
  const pending = Certificados.filter(c => c.status === 'pendente').length;
  const rejected = Certificados.filter(c => c.status === 'rejeitado').length;

  // Filtrar apenas certificados aprovados
  const certificadosAprovados = Certificados.filter(c => c.status === 'aprovado');

  // Separar certificados aprovados por tipo
  const compCertificados = certificadosAprovados.filter(c => c.tipo === 'complementar');
  const extCertificados = certificadosAprovados.filter(c => c.tipo === 'extensao');

  // Categorias de Atividades Complementares (baseado na tabela)
  const categoriasComplementares = [
    // Grupo I
    {
      grupo: 'I',
      nome: 'Disciplinas cursadas em outros cursos de graduação',
      horas: compCertificados
        .filter(c =>
          c.grupo === 'I' &&
          c.categoria === 'Categoria 1'
        )
        .reduce((acc, c) => acc + c.cargaHoraria, 0),
      total: 60,
      categoriaKey: 'Ensino'
    },
    {
      grupo: 'I',
      nome: 'Monitoria',
      horas: compCertificados
        .filter(c =>
          c.grupo === 'I' &&
          c.categoria === 'Categoria 2'
        )
        .reduce((acc, c) => acc + c.cargaHoraria, 0),
      total: 80,
      categoriaKey: 'Ensino'
    },
    {
      grupo: 'I',
      nome: 'Cursos de idiomas realizados durante o curso, comunicação e expressão e informática',
      horas: compCertificados
        .filter(c =>
          c.grupo === 'I' &&
          c.categoria === 'Categoria 3'
        )
        .reduce((acc, c) => acc + c.cargaHoraria, 0),
      total: 80,
      categoriaKey: 'Ensino'
    },
    {
      grupo: 'I',
      nome: 'Participação do programa institucional de bolsas de iniciação à docência',
      horas: compCertificados
        .filter(c =>
          c.grupo === 'I' &&
          c.categoria === 'Categoria 4'
        )
        .reduce((acc, c) => acc + c.cargaHoraria, 0),
      total: 40,
      categoriaKey: 'Ensino'
    },
    // Grupo II
    {
      grupo: 'II',
      nome: 'Visita técnica em área afim ao curso e supervisionada pela instituição, mediante apresentação de relatório.',
      horas: compCertificados
        .filter(c =>
          c.grupo === 'II' &&
          c.categoria === 'Categoria 5')
        .reduce((acc, c) => acc + c.cargaHoraria, 0),
      total: 80,
      categoriaKey: 'Estagio'
    },
    {
      grupo: 'II',
      nome: 'Estágio Profissional não obrigatório',
      horas: compCertificados
        .filter(c =>
          c.grupo === 'II' &&
          c.categoria === 'Categoria 6')
        .reduce((acc, c) => acc + c.cargaHoraria, 0),
      total: 60,
      categoriaKey: 'Estagio'
    },

    // Grupo III
    {
      grupo: 'III',
      nome: 'Participação como ouvinte, participante, palestrante, instrutor, apresentador, expositor ou mediador em eventos científicos, seminários, atividades culturais, esportivas, políticas e sociais, sessões técnicas, exposições, jornadas acadêmicas e científicas, palestras, seminários, congressos, conferências ou similares',
      horas: compCertificados
        .filter(c =>
          c.grupo === 'III' &&
          c.categoria === 'Categoria 7')
        .reduce((acc, c) => acc + c.cargaHoraria, 0),
      total: 80,
      categoriaKey: 'Eventos'
    },

    // Grupo IV
    {
      grupo: 'IV',
      nome: 'Participação em projetos de pesquisa',
      horas: compCertificados
        .filter(c =>
          c.grupo === 'IV' &&
          c.categoria === 'Categoria 8')
        .reduce((acc, c) => acc + c.cargaHoraria, 0),
      total: 80,
      categoriaKey: 'Pesquisa'
    },
    {
      grupo: 'IV',
      nome: 'Publicações de textos acadêmicos',
      horas: compCertificados
        .filter(c =>
          c.grupo === 'IV' &&
          c.categoria === 'Categoria 9')
        .reduce((acc, c) => acc + c.cargaHoraria, 0),
      total: 40,
      categoriaKey: 'Pesquisa'
    },
    {
      grupo: 'IV',
      nome: 'Grupos de estudos com produção intelectual',
      horas: compCertificados
        .filter(c =>
          c.grupo === 'IV' &&
          c.categoria === 'Categoria 10')
        .reduce((acc, c) => acc + c.cargaHoraria, 0),
      total: 20,
      categoriaKey: 'Pesquisa'
    },
    {
      grupo: 'IV',
      nome: 'Trabalhos desenvolvidos sob orientação de docente apresentados em eventos acadêmicos',
      horas: compCertificados
        .filter(c =>
          c.grupo === 'IV' &&
          c.categoria === 'Categoria 11')
        .reduce((acc, c) => acc + c.cargaHoraria, 0),
      total: 40,
      categoriaKey: 'Pesquisa'
    },
    {
      grupo: 'V',
      nome: 'Participação em projetos de extensão',
      horas: compCertificados
        .filter(c =>
          c.grupo === 'V' &&
          c.categoria === 'Categoria 12')
        .reduce((acc, c) => acc + c.cargaHoraria, 0),
      total: 80,
      categoriaKey: 'Curso'
    },
    {
      grupo: 'V',
      nome: 'Participar na organização, coordenação ou realização de cursos em eventos científicos',
      horas: compCertificados
        .filter(c =>
          c.grupo === 'V' &&
          c.categoria === 'Categoria 13')
        .reduce((acc, c) => acc + c.cargaHoraria, 0),
      total: 40,
      categoriaKey: 'Curso'
    },
    {
      grupo: 'V',
      nome: 'Trabalhar na organização de material informativo da Instituição',
      horas: compCertificados
        .filter(c =>
          c.grupo === 'V' &&
          c.categoria === 'Categoria 14')
        .reduce((acc, c) => acc + c.cargaHoraria, 0),
      total: 20,
      categoriaKey: 'Curso'
    },
    {
      grupo: 'V',
      nome: 'Trabalhar na organização ou participação em campanhas de voluntariado ou programas de ação social',
      horas: compCertificados
        .filter(c =>
          c.grupo === 'V' &&
          c.categoria === 'Categoria 15')
        .reduce((acc, c) => acc + c.cargaHoraria, 0),
      total: 20,
      categoriaKey: 'Curso'
    },
    {
      grupo: 'VI',
      nome: 'Participação, como voluntário, em atividades compatíveis com os objetivos do curso realizadas em instituições filantrópicas e da sociedade civil organizada do terceiro setor',
      horas: compCertificados
        .filter(c =>
          c.grupo === 'VI' &&
          c.categoria === 'Categoria 16')
        .reduce((acc, c) => acc + c.cargaHoraria, 0),
      total: 20,
      categoriaKey: 'Voluntariado'
    }
  ];

  // Categorias de Atividades de Extensão (baseado na tabela)
  const categoriasExtensao = [
    {
      grupo: 'Extensao',
      nome: 'Participação como Bolsista, voluntário ou colaborador, em Projetos/Programas de Extensão coordenado por servidor do IFPE',
      horas: extCertificados
        .filter(c =>
          c.grupo === 'Extensao' &&
          c.categoria === 'Categoria 1' 
        )
        .reduce((acc, c) => acc + c.cargaHoraria, 0),
      total: 160,
      categoriaKey: 'Extensao'
    },
    {
      grupo: 'Extensao',
      nome: 'Participação em Eventos voltados ao público externo como Palestrante, Instrutor, Apresentador, Expositor ou Mediador de Cursos/Palestras/Workshops/Mesas Redondas/Oficinas',
      horas: extCertificados
        .filter(c =>
          c.grupo === 'Extensao' &&
          c.categoria === 'Categoria 2'
        )
        .reduce((acc, c) => acc + c.cargaHoraria, 0),
      total: 80,
      categoriaKey: 'Extensao'
    },
    {
      grupo: 'Extensao',
      nome: 'Participação da Comissão Organizadora ou como Monitor em Eventos para exibição pública de conhecimento ou produto (Cultural, Acadêmico, Científico ou Tecnológico) desenvolvido no IFPE',
      horas: extCertificados
        .filter(c =>
          c.grupo === 'Extensao' &&
          c.categoria === 'Categoria 3'
        )
        .reduce((acc, c) => acc + c.cargaHoraria, 0),
      total: 80,
      categoriaKey: 'Extensao'
    },
    {	
      grupo: 'Extensao',
      nome: 'Prestaçaõ de serviços de caráter extensionista. Prestação de serviços como voluntário/a, bolsista ou colaborador/a, para o desenvolvimento de produtos e/ou processos voltados á resolução de problemas identificados interna ou externamente ao IFPE',
      horas: extCertificados
        .filter(c =>
          c.grupo === 'Extensao' &&
          c.categoria === 'Categoria 4'
        )
        .reduce((acc, c) => acc + c.cargaHoraria, 0),
      total: 160,
      categoriaKey: 'Extensao'
    },
    {
      grupo: 'Extensao',
      nome: 'Atividades desenvolvidas por meio dos Núcleos Institucionais de Extensão',
      horas: extCertificados
        .filter(c =>
          c.grupo === 'Extensao' &&
          c.categoria === 'Categoria 5')
        .reduce((acc, c) => acc + c.cargaHoraria, 0),
      total: 80,
      categoriaKey: 'Extensao'
    },
    {
      grupo: 'Extensao',
      nome: 'Atividades de empreendedorismo, como membro de empresa júnior ou como voluntário/a ou bolsista de incubadoras de empresas ou projetos, prestando assessoria e consultoria',
      horas: extCertificados
        .filter(c =>
          c.grupo === 'Extensao' &&
          c.categoria === 'Categoria 6')
        .reduce((acc, c) => acc + c.cargaHoraria, 0),
      total: 160,
      categoriaKey: 'Extensao'
    }
  ];

  const [categoriaKeySelecionada, setCategoriaKeySelecionada] = useState<string | undefined>(undefined);

  const matchesCategory = (cert: Certificado) => categoriaKeySelecionada === 'all' || cert.categoriaKey === categoriaKeySelecionada;

  return (
    <div className="min-h-screen flex flex-col">
      {/* MAIN ---------------------------------------------------------------- */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl mb-1">
                {user.name}, bem-vindo(a) de volta!
              </h1>
              <p className="text-sm">
                Bem-vindo ao Horas Discentes. Acompanhe seu progresso aqui.
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
                title="Atividades Complementares"
                subTitle="Progressão Geral - Atividades Complementares"
                categorias={categoriasComplementares}
                totalHoras={categoriasComplementares.reduce((acc, cat) => acc + cat.horas, 0)}
                totalNecessarias={280}
                categoriaKey={categoriaKeySelecionada}
                onCategoriaClick={setCategoriaKeySelecionada}
              />
              {/* Progresso Geral - Atividades de Extensão */}
              {/* Renderiza Progresso Geral - Atividades de Extensão somente se isNewPPC for true */}
              {user.isNewPPC && (
                <ProgressoGeral
                  title="Atividades de Extensão"
                  subTitle="Progressão Geral - Atividades de Extensão"
                  categorias={categoriasExtensao}
                  totalHoras={categoriasExtensao.reduce((acc, cat) => acc + cat.horas, 0)}
                  totalNecessarias={320}
                  categoriaKey={categoriaKeySelecionada}
                  onCategoriaClick={setCategoriaKeySelecionada}
                />
              )}

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

                {Certificados.length ? (
                  <div className="space-y-4">
                    {Certificados.slice(0, 3).map(cert => (
                      <VerCertificado
                        key={cert.id}
                        certificate={{
                          id: String(cert.id),
                          title: cert.title,
                          institution: cert.local,
                          description: cert.description,
                          hours: cert.cargaHoraria,
                          date: cert.periodoInicio,
                          dateEnd: cert.periodoFim,
                          category: cert.categoriaKey,
                          status: cert.status,
                        }}
                      />
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
                      <Link
                        key={q}
                        href={`/aluno/certificado?category=${encodeURIComponent(q.split(' ')[0])}`}
                        className={`
                          text-sm
                          ${categoriaKeySelecionada === q.split(' ')[0]
                            ? 'text-blue-600 font-semibold hover:text-blue-700'
                            : 'text-gray-500 hover:text-blue-600'}
                        `}
                      >
                        {q}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
