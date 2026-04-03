'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import {
  faBookOpen,
  faGraduationCap,
  faIdCard,
  faUsers
} from '@fortawesome/free-solid-svg-icons';

import { CardHome } from '@/components/CardHome';
import LoadingOverlay from '@/components/LoadingOverlay';
import { BreadcrumbAuto } from '@/components/ui/breadcrumb';

import { useLoadingOverlay } from '@/hooks/useLoadingOverlay';
import { contarPendenciasDownload } from '@/services/studentService';

export default function CoordenacaoPage() {
  const router = useRouter();

  const [pendenciasCount, setPendenciasCount] = useState(0);

  const { visible: isLoading, hide: hideLoading } = useLoadingOverlay(true);

  useEffect(() => {
    const fetchPendencias = async () => {
      try {
        const response = await contarPendenciasDownload();
        setPendenciasCount(response.totalPendencias);
      } catch (error) {
        console.error('Erro ao buscar a contagem de pendências:', error);
      } finally {
        hideLoading();
      }
    };

    fetchPendencias();
  }, [hideLoading]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <LoadingOverlay show={isLoading} />

      <BreadcrumbAuto />

      <h1 className="md:text-4xl text-3xl font-semibold md:font-normal text-gray-800 mb-10">
        Coordenação
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CardHome
          icon={faGraduationCap}
          title="Turma"
          onClick={() => router.push('/coordenacao/turma')}
        />

        <CardHome
          icon={faIdCard}
          title="Validação de Certificados"
          onClick={() => router.push('/coordenacao/certificados')}
        />

        <CardHome
          icon={faUsers}
          title="Secretaria"
          indicatorNumber={pendenciasCount > 0 ? pendenciasCount : undefined}
          onClick={() => router.push('/coordenacao/contabilizarHoras')}
        />

        <CardHome
          icon={faBookOpen}
          title="Atividades"
          onClick={() => router.push('/coordenacao/atividade')}
        />
      </div>
    </div>
  );
}
