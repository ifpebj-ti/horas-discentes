'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
// Importa useMemo
import { useEffect, useState, createContext, useContext, useMemo } from 'react';
import { FaHome } from 'react-icons/fa';

import BreadCrumb from '@/components/BreadCrumb';
import StatsSummary from '@/components/Faq';
import LoadingOverlay from '@/components/LoadingOverlay';
import NovoCertificadoButton from '@/components/NovoCertificadoButton';
import ProgressoGeral from '@/components/ProgressoGeral';
import VerCertificado from '@/components/VerCertificado';

import { useLoadingOverlay } from '@/hooks/useLoadingOverlay';
import { obterMeusDadosDetalhados } from '@/services/alunoService';
import {
  listarMeusCertificados,
  obterCertificadoPorId
} from '@/services/certificadoService';
import * as Types from '@/types';
import { mapStatusCertificado, mapTipoCertificado } from '@/types';
import Swal from 'sweetalert2';

const CertificadosContext = createContext<Types.Certificado[]>([]);

function baixarPDFBase64(base64: string, nomeArquivo: string) {
  const link = document.createElement('a');
  link.href = `data:application/pdf;base64,${base64}`;
  link.download = nomeArquivo;
  link.click();
}

function AlunoPageContent({
  user,
  categoriasComplementares,
  categoriasExtensao
}: {
  user: Types.Usuario;
  categoriasComplementares: Types.CategoriaProgresso[];
  categoriasExtensao: Types.CategoriaProgresso[];
}) {
  // ... (código do componente AlunoPageContent)
  const certificados = useContext(CertificadosContext);
  const [categoriaKeySelecionada, setCategoriaKeySelecionada] =
    useState<string>();

  // Decide se deve exibir o bloco de Extensão:
  // - Se o backend informar limites/horas de extensão, usa esses valores;
  // - Caso contrário, usa o indicador legado isNewPPC.
  const hasInfoDeHorasExtensao =
    user.maximoHorasExtensao !== undefined ||
    user.totalHorasExtensao !== undefined;

  const possuiExtensaoPorHoras =
    (user.maximoHorasExtensao ?? 0) > 0 || (user.totalHorasExtensao ?? 0) > 0;

  const mostrarExtensao = hasInfoDeHorasExtensao
    ? possuiExtensaoPorHoras
    : user.isNewPPC === true;

  const handleVerCertificado = async (id: string) => {
    try {
      const detalhes = await obterCertificadoPorId(id);
      if (detalhes.anexoBase64 && detalhes.tituloAtividade) {
        baixarPDFBase64(
          detalhes.anexoBase64,
          `${detalhes.tituloAtividade}.pdf`
        );
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Certificado inválido',
          text: 'Certificado ou nome do arquivo indisponível.'
        });
      }
    } catch (error) {
      console.error('Erro ao baixar certificado:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao visualizar',
        text: 'Não foi possível visualizar o certificado.'
      });
    }
  };

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
            <NovoCertificadoButton user={user} />
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
                totalHoras={user.totalHorasComplementar ?? 0}
                totalNecessarias={user.maximoHorasComplementar ?? 0}
                categoriaKey={categoriaKeySelecionada}
                onCategoriaClick={setCategoriaKeySelecionada}
              />

              {mostrarExtensao && (
                <ProgressoGeral
                  title="Atividades de Extensão"
                  subTitle="Progressão Geral - Atividades de Extensão"
                  categorias={categoriasExtensao}
                  totalHoras={user.totalHorasExtensao ?? 0}
                  totalNecessarias={user.maximoHorasExtensao ?? 0}
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
                        onClick={handleVerCertificado}
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
  const [categoriasComplementares, setCategoriasComplementares] = useState<
    Types.CategoriaProgresso[]
  >([]);
  const [categoriasExtensao, setCategoriasExtensao] = useState<
    Types.CategoriaProgresso[]
  >([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [userData, setUserData] = useState<any>(null);

  const { entidadeId, name, email, role, isNewPPC } =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (session?.user as any) || {};

  const user: Types.Usuario = useMemo(
    () => ({
      id: entidadeId || '',
      name: name || '',
      email: email || '',
      role: role || '',
      isNewPPC: isNewPPC === true,
      totalHorasExtensao: userData?.totalHorasExtensao,
      maximoHorasExtensao: userData?.maximoHorasExtensao,
      totalHorasComplementar: userData?.totalHorasComplementar,
      maximoHorasComplementar: userData?.maximoHorasComplementar
    }),
    [
      entidadeId,
      name,
      email,
      role,
      isNewPPC,
      userData // 'user' depende de 'userData' e dos dados da sessão
    ]
  );

  useEffect(() => {
    if (status !== 'authenticated') return;

    const fetchData = async () => {
      try {
        loadingOverlay.show();

        const [certData, detalhado] = await Promise.all([
          listarMeusCertificados(),
          obterMeusDadosDetalhados()
        ]);

        const mapped: Types.Certificado[] = certData.map((cert) => ({
          id: cert.id,
          title: cert.tituloAtividade,
          local: cert.local,
          description: cert.descricao || '',
          cargaHoraria: cert.cargaHoraria,
          periodoInicio: cert.dataInicio,
          periodoFim: cert.dataFim,
          categoria: cert.categoria,
          grupo: cert.grupo,
          categoriaKey: cert.categoriaKey,
          tipo: mapTipoCertificado(cert.tipo),
          status: mapStatusCertificado(cert.status)
        }));

        const comp = detalhado.atividades.filter((a) => {
          const tipo = String(a.tipo ?? '').toUpperCase();
          // Backend pode retornar "COMPLEMENTAR", "complementar" ou código numérico
          return tipo === 'COMPLEMENTAR' || tipo === '1';
        });

        const ext = detalhado.atividades.filter((a) => {
          const tipo = String(a.tipo ?? '').toUpperCase();
          // Backend pode retornar "EXTENSAO", "extensao" ou código numérico
          return tipo === 'EXTENSAO' || tipo === '0';
        });

        setCategoriasComplementares(
          comp.map((a) => ({
            grupo: a.grupo,
            categoria: a.categoria,
            nome: a.nome,
            horas: a.horasConcluidas,
            total: a.cargaMaximaCurso,
            categoriaKey: a.categoriaKey
          }))
        );

        setCategoriasExtensao(
          ext.map((a) => ({
            grupo: a.grupo,
            categoria: a.categoria,
            nome: a.nome,
            horas: a.horasConcluidas,
            total: a.cargaMaximaCurso,
            categoriaKey: a.categoriaKey
          }))
        );

        setCertificados(mapped);
        setUserData(detalhado);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        loadingOverlay.hide();
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  if (status === 'loading' || loadingOverlay.visible || !userData) {
    return <LoadingOverlay show={true} />;
  }
  if (!session?.user) return null;

  // O 'user' já foi calculado lá em cima pelo useMemo
  return (
    <CertificadosContext.Provider value={certificados}>
      <AlunoPageContent
        user={user}
        categoriasComplementares={categoriasComplementares}
        categoriasExtensao={categoriasExtensao}
      />
    </CertificadosContext.Provider>
  );
}
