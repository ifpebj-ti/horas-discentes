'use client';

import { useSession } from 'next-auth/react';
import { useMemo, useState } from 'react';
import { FaHome } from 'react-icons/fa';

import { RecentCertificates } from './_components/RecentCertificates';
import BreadCrumb from '@/components/BreadCrumb';
import StatsSummary from '@/components/Faq';
import LoadingOverlay from '@/components/LoadingOverlay';
import NovoCertificadoButton from '@/components/NovoCertificadoButton';
import ProgressoGeral from '@/components/ProgressoGeral';

import { useMeusDadosDetalhados } from '@/hooks/useAluno';
import { useMeusCertificados } from '@/hooks/useCertificados';
import { obterCertificadoPorId } from '@/services/certificadoService';
import * as Types from '@/types';
import { mapStatusCertificado, mapTipoCertificado } from '@/types';
import Swal from 'sweetalert2';

function baixarPDFBase64(base64: string, nomeArquivo: string) {
  const link = document.createElement('a');
  link.href = `data:application/pdf;base64,${base64}`;
  link.download = nomeArquivo;
  link.click();
}

function AlunoPageContent({
  user,
  categoriasComplementares,
  categoriasExtensao,
  certificados
}: {
  user: Types.Usuario;
  categoriasComplementares: Types.CategoriaProgresso[];
  categoriasExtensao: Types.CategoriaProgresso[];
  certificados: Types.Certificado[];
}) {
  const [categoriaKeySelecionada, setCategoriaKeySelecionada] =
    useState<string>();

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

              <RecentCertificates
                certificados={certificados}
                onView={handleVerCertificado}
              />
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

  const { data: userData, isLoading: isLoadingUser } = useMeusDadosDetalhados();

  const { data: certificadosData, isLoading: isLoadingCertificados } =
    useMeusCertificados();

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
    [entidadeId, name, email, role, isNewPPC, userData]
  );

  const certificados: Types.Certificado[] = useMemo(() => {
    if (!certificadosData) return [];

    return certificadosData.map((cert) => ({
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
  }, [certificadosData]);

  const categoriasComplementares = useMemo(() => {
    if (!userData) return [];

    const comp = userData.atividades.filter((a) => {
      const tipo = String(a.tipo ?? '').toUpperCase();
      return tipo === 'COMPLEMENTAR' || tipo === '1';
    });

    return comp.map((a) => ({
      grupo: a.grupo,
      categoria: a.categoria,
      nome: a.nome,
      horas: a.horasConcluidas,
      total: a.cargaMaximaCurso,
      categoriaKey: a.categoriaKey
    }));
  }, [userData]);

  const categoriasExtensao = useMemo(() => {
    if (!userData) return [];

    const ext = userData.atividades.filter((a) => {
      const tipo = String(a.tipo ?? '').toUpperCase();
      return tipo === 'EXTENSAO' || tipo === '0';
    });

    return ext.map((a) => ({
      grupo: a.grupo,
      categoria: a.categoria,
      nome: a.nome,
      horas: a.horasConcluidas,
      total: a.cargaMaximaCurso,
      categoriaKey: a.categoriaKey
    }));
  }, [userData]);

  if (status === 'loading' || isLoadingUser || isLoadingCertificados) {
    return <LoadingOverlay show={true} />;
  }

  if (!session?.user) return null;

  return (
    <AlunoPageContent
      user={user}
      categoriasComplementares={categoriasComplementares}
      categoriasExtensao={categoriasExtensao}
      certificados={certificados}
    />
  );
}
