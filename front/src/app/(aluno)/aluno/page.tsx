'use client';

import { useSession } from 'next-auth/react';
import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { RecentCertificates } from './_components/RecentCertificates';
import StatsSummary from '@/components/Faq';
import GeneralProgress from '@/components/GeneralProgress';
import LoadingOverlay from '@/components/LoadingOverlay';
import NewCertificateButton from '@/components/NewCertificateButton';
import { BreadcrumbAuto } from '@/components/ui/breadcrumb';

import { useMeusCertificados } from '@/hooks/useCertificates';
import { useMeusDadosDetalhados } from '@/hooks/useStudent';
import { baixarAnexoCertificado } from '@/services/certificateService';
import * as Types from '@/types';
import {
  mapStatusCertificado,
  mapTipoCertificado,
  StatusCertificado
} from '@/types';

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
      const blob = await baixarAnexoCertificado(id);
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      toast.error('Não foi possível visualizar o certificado.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl mb-1">
                Olá, {user.name?.split(' ')[0]}!
              </h1>
              <p className="text-sm">
                Acompanhe o progresso das suas horas no Hora Mais.
              </p>
            </div>
            <NewCertificateButton user={user} />
          </div>

          <BreadcrumbAuto />

          <div className="grid gap-10 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <section className="space-y-8">
              <GeneralProgress
                title="Atividades Complementares"
                subTitle="Progressão Geral - Atividades Complementares"
                categorias={categoriasComplementares}
                totalHoras={user.totalHorasComplementar ?? 0}
                totalNecessarias={user.maximoHorasComplementar ?? 0}
                onCategoriaClick={setCategoriaKeySelecionada}
                {...(categoriaKeySelecionada
                  ? { categoriaKey: categoriaKeySelecionada }
                  : {})}
              />

              {mostrarExtensao && (
                <GeneralProgress
                  title="Atividades de Extensão"
                  subTitle="Progressão Geral - Atividades de Extensão"
                  categorias={categoriasExtensao}
                  totalHoras={user.totalHorasExtensao ?? 0}
                  totalNecessarias={user.maximoHorasExtensao ?? 0}
                  onCategoriaClick={setCategoriaKeySelecionada}
                  {...(categoriaKeySelecionada
                    ? { categoriaKey: categoriaKeySelecionada }
                    : {})}
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
                  certificados.filter(
                    (c) => c.status === StatusCertificado.APROVADO
                  ).length
                }
                pending={
                  certificados.filter(
                    (c) => c.status === StatusCertificado.PENDENTE
                  ).length
                }
                rejected={
                  certificados.filter(
                    (c) => c.status === StatusCertificado.REPROVADO
                  ).length
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
    (session?.user as any) || {};

  const user: Types.Usuario = useMemo(
    () => ({
      id: entidadeId || '',
      name: name || '',
      email: email || '',
      role: role || '',
      isNewPPC: isNewPPC === true,
      ...(userData?.totalHorasExtensao !== undefined && {
        totalHorasExtensao: userData.totalHorasExtensao
      }),
      ...(userData?.maximoHorasExtensao !== undefined && {
        maximoHorasExtensao: userData.maximoHorasExtensao
      }),
      ...(userData?.totalHorasComplementar !== undefined && {
        totalHorasComplementar: userData.totalHorasComplementar
      }),
      ...(userData?.maximoHorasComplementar !== undefined && {
        maximoHorasComplementar: userData.maximoHorasComplementar
      })
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
      status: mapStatusCertificado(cert.status),
      justificativaRejeicao: cert.justificativaRejeicao
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
