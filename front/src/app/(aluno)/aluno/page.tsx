'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState, createContext, useContext } from 'react';
import { FaHome } from 'react-icons/fa';

import BreadCrumb from '@/components/BreadCrumb';
import StatsSummary from '@/components/Faq';
import LoadingOverlay from '@/components/LoadingOverlay';
import NovoCertificadoButton from '@/components/NovoCertificadoButton';
import ProgressoGeral from '@/components/ProgressoGeral';
import VerCertificado from '@/components/VerCertificado';

import { useLoadingOverlay } from '@/hooks/useLoadingOverlay';
import {
  MOCK_CATEGORIAS_COMPLEMENTARES,
  MOCK_CATEGORIAS_EXTENSAO
} from '@/lib/alunoMock';
import {
  listarMeusCertificados,
  TipoCertificado
} from '@/services/certificadoService';
import * as Types from '@/types';
import { mapStatusCertificado, mapTipoCertificado } from '@/types';
const CertificadosContext = createContext<Types.Certificado[]>([]);

function AlunoPageContent({ user }: { user: Types.Usuario }) {
  const certificados = useContext(CertificadosContext);
  const [categoriaKeySelecionada, setCategoriaKeySelecionada] =
    useState<string>();

  const certificadosAprovados = certificados.filter(
    (c) => c.status === 'aprovado'
  );
  const compCertificados = certificadosAprovados.filter(
    (c) => c.tipo === 'complementar'
  );
  const extCertificados = certificadosAprovados.filter(
    (c) => c.tipo === 'extensao'
  );

  const totalHorasComplementares = compCertificados.reduce(
    (acc, c) => acc + c.cargaHoraria,
    0
  );
  const totalHorasExtensao = extCertificados.reduce(
    (acc, c) => acc + c.cargaHoraria,
    0
  );

  const categoriasComplementares = MOCK_CATEGORIAS_COMPLEMENTARES.map(
    (cat) => ({
      ...cat,
      horas: compCertificados
        .filter((c) => c.grupo === cat.grupo && c.categoria === cat.categoria)
        .reduce((acc, c) => acc + c.cargaHoraria, 0),
      total: cat.total || 0
    })
  );

  const categoriasExtensao = MOCK_CATEGORIAS_EXTENSAO.map((cat) => ({
    ...cat,
    horas: extCertificados
      .filter(
        (c) =>
          c.grupo === cat.grupo &&
          c.categoriaKey === cat.categoriaKey &&
          c.title === cat.nome
      )
      .reduce((acc, c) => acc + c.cargaHoraria, 0),
    total: cat.total || 0
  }));

  return (
    <div className="min-h-screen flex flex-col">
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
            <section className="space-y-8">
              <ProgressoGeral
                title="Atividades Complementares"
                subTitle="Progressão Geral - Atividades Complementares"
                categorias={categoriasComplementares}
                totalHoras={totalHorasComplementares}
                totalNecessarias={280}
                categoriaKey={categoriaKeySelecionada}
                onCategoriaClick={setCategoriaKeySelecionada}
              />

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

              <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[#071D41]">
                    Certificados Recentes
                  </h2>
                  <Link
                    href="/aluno/certificado"
                    className="text-sm font-medium text-[#0F4AA9] hover:underline"
                  >
                    Ver todos
                  </Link>
                </div>

                {certificados.length > 0 ? (
                  <div className="space-y-4">
                    {certificados.slice(0, 3).map((cert) => (
                      <VerCertificado
                        key={cert.id}
                        certificate={{
                          id: cert.id,
                          title: cert.title,
                          local: cert.local,
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

            <aside className="space-y-8">
              <StatsSummary
                total={certificados.length}
                approved={
                  certificados.filter((c) => c.status === 'aprovado').length
                }
                pending={
                  certificados.filter((c) => c.status === 'pendente').length
                }
                rejected={
                  certificados.filter((c) => c.status === 'rejeitado').length
                }
              />
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Aluno() {
  const { data: session, status } = useSession();
  const loadingOverlay = useLoadingOverlay(true);
  const [certificados, setCertificados] = useState<Types.Certificado[]>([]);

  useEffect(() => {
    if (status !== 'authenticated') return;

    const fetchCertificados = async () => {
      try {
        loadingOverlay.show();
        const data = await listarMeusCertificados();
        console.log('CERTIFICADOS ORIGINAIS:', data);

        const mapped: Types.Certificado[] = data.map((cert) => ({
          id: cert.id,
          title: cert.tituloAtividade,
          local: cert.local,
          description: cert.descricao || '',
          cargaHoraria: cert.cargaHoraria,
          periodoInicio: cert.dataInicio,
          periodoFim: cert.dataFim,
          categoria: cert.categoria,
          grupo: cert.grupo,
          categoriaKey:
            cert.tipo === TipoCertificado.EXTENSAO
              ? 'Extensao'
              : 'Complementar',
          tipo: mapTipoCertificado(cert.tipo),
          status: mapStatusCertificado(cert.status)
        }));

        console.log('CERTIFICADOS MAPEADOS:', mapped);
        setCertificados(mapped);
      } catch (error) {
        console.error('Erro ao buscar certificados:', error);
      } finally {
        loadingOverlay.hide();
      }
    };

    fetchCertificados();
  }, [status]);

  if (status === 'loading' || loadingOverlay.visible) {
    return <LoadingOverlay show={true} />;
  }

  if (!session?.user) return null;

  const user: Types.Usuario = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    id: (session.user as any).entidadeId,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    name: (session.user as any).nome || session.user.name,
    email: session.user.email,
    role: session.user.role,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isNewPPC: (session.user as any).isNewPpc === true
  };

  console.log('USER FINAL:', user);
  console.log('CERTIFICADOS FINAL:', certificados);
  return (
    <CertificadosContext.Provider value={certificados}>
      <AlunoPageContent user={user} />
    </CertificadosContext.Provider>
  );
}
