'use client';
import Link from 'next/link';
import { useState, useContext, createContext } from 'react';
import { FaHome } from 'react-icons/fa';

import BreadCrumb from '@/components/BreadCrumb';
import NovoCertificadoButton from '@/components/NovoCertificadoButton';
import ProgressoGeral from '@/components/ProgressoGeral';
import StatsSummary from '@/components/Faq';
import VerCertificado from '@/components/VerCertificado';

import {
  MOCK_CERTIFICATES,
  MOCK_USER,
  MOCK_CATEGORIAS_COMPLEMENTARES,
  MOCK_CATEGORIAS_EXTENSAO
} from '@/lib/alunoMock';
import * as Types from '@/types';

// Definir o contexto localmente
const CertificadosContext = createContext<Types.Certificado[]>([]);

// Componente AlunoPageContent para usar o contexto
function AlunoPageContent() {
  const certificados = useContext(CertificadosContext);
  const user: Types.Usuario = MOCK_USER;

  const total = certificados.length;
  const approved = certificados.filter(
    (c: Types.Certificado) => c.status === 'aprovado'
  ).length;
  const pending = certificados.filter(
    (c: Types.Certificado) => c.status === 'pendente'
  ).length;
  const rejected = certificados.filter(
    (c: Types.Certificado) => c.status === 'rejeitado'
  ).length;

  // Filtrar apenas certificados aprovados
  const certificadosAprovados = certificados.filter(
    (c: Types.Certificado) => c.status === 'aprovado'
  );

  // Separar certificados aprovados por tipo
  const compCertificados = certificadosAprovados.filter(
    (c: Types.Certificado) => c.tipo === 'complementar'
  );
  const extCertificados = certificadosAprovados.filter(
    (c: Types.Certificado) => c.tipo === 'extensao'
  );

  // Calcular total de horas para atividades complementares
  const totalHorasComplementares = compCertificados.reduce(
    (acc: number, c: Types.Certificado) => acc + c.cargaHoraria,
    0
  );

  // Calcular total de horas para atividades de extensão
  const totalHorasExtensao = extCertificados.reduce(
    (acc: number, c: Types.Certificado) => acc + c.cargaHoraria,
    0
  );

  // Usar os mocks importados para categorias
  const categoriasComplementares: Types.CategoriaProgresso[] =
    MOCK_CATEGORIAS_COMPLEMENTARES.map((cat) => ({
      ...cat,
      horas:
        compCertificados
          .filter(
            (c: Types.Certificado) =>
              c.grupo === cat.grupo &&
              c.categoria === cat.categoria
          )
          .reduce(
            (acc: number, c: Types.Certificado) => acc + c.cargaHoraria,
            0
          ) || 0,
      total: cat.total || 0
    }));

  const categoriasExtensao: Types.CategoriaProgresso[] =
    MOCK_CATEGORIAS_EXTENSAO.map((cat) => ({
      ...cat,
      horas:
        extCertificados
          .filter(
            (c: Types.Certificado) =>
              c.grupo === cat.grupo &&
              c.categoriaKey === cat.categoriaKey &&
              c.title === cat.nome
          )
          .reduce(
            (acc: number, c: Types.Certificado) => acc + c.cargaHoraria,
            0
          ) || 0,
      total: cat.total || 0
    }));

  const [categoriaKeySelecionada, setCategoriaKeySelecionada] = useState<
    string | undefined
  >(undefined);

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

            <NovoCertificadoButton />
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

          <div className="grid gap-10 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            {/* COLUNA PRINCIPAL ------------------------------------------------ */}
            <section className="space-y-8">
              {/* Progresso Geral - Atividades Complementares */}
              <ProgressoGeral
                title="Atividades Complementares"
                subTitle="Progressão Geral - Atividades Complementares"
                categorias={categoriasComplementares}
                totalHoras={totalHorasComplementares}
                totalNecessarias={280}
                categoriaKey={categoriaKeySelecionada}
                onCategoriaClick={setCategoriaKeySelecionada}
              />
              {/* Progresso Geral - Atividades de Extensão */}
              {user.isNewPPC && (
                <ProgressoGeral
                  title="Atividades de Extensão"
                  subTitle="Progressão Geral - Atividades de Extensão"
                  categorias={categoriasExtensao}
                  totalHoras={totalHorasExtensao}
                  totalNecessarias={320}
                  categoriaKey={categoriaKeySelecionada}
                  onCategoriaClick={setCategoriaKeySelecionada}
                />
              )}

              {/* Certificados recentes ------------------------------------- */}
              <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[#071D41]">
                    Certificados Recentes
                  </h2>
                  <Link
                    href="/aluno/certificado"
                    className="text-sm font-medium text-[#0F4AA9] hover:underline hover:text-[#0D3F8E] transition-colors"
                  >
                    Ver todos
                  </Link>
                </div>

                {certificados.length > 0 ? (
                  <div className="space-y-4">
                    {certificados.slice(0, 3).map((cert: Types.Certificado) => (
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
                          status: cert.status
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
            {/* Resumo de Certificados ------------------------------------------ */}
            <aside className="space-y-8">
              <StatsSummary
                total={total}
                approved={approved}
                pending={pending}
                rejected={rejected}
              />

              {/* Dúvidas Frequentes ------------------------------------------ */}
              <div className="bg-blue-50/60 border border-blue-100 rounded-2xl shadow-sm p-6">
                <h2 className="text-md font-semibold text-[#071D41] mb-4">
                  Dúvidas Frequentes
                </h2>
                <ul className="space-y-3 text-sm leading-relaxed">
                  {[
                    { question: 'Como são contabilizadas as horas?', id: 'contabilizacao-horas' },
                    { question: 'Quais atividades são aceitas?', id: 'atividades-aceitas' },
                    { question: 'Qual o prazo para envio de certificados?', id: 'prazo-envio-certificados' },
                    { question: 'Como saber se meu certificado foi aprovado?', id: 'status-certificado-aprovado' }
                  ].map((q) => (
                    <li key={q.id}>
                      <Link
                        href={`/aluno/perguntas?id=${q.id}`}
                        className={`
                          text-sm
                          text-gray-500 hover:text-blue-600 hover:underline
                        `}
                      >
                        {q.question}
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

// Componente Aluno que provê o contexto
export default function Aluno() {
  return (
    <CertificadosContext.Provider value={MOCK_CERTIFICATES}>
      <AlunoPageContent />
    </CertificadosContext.Provider>
  );
}
