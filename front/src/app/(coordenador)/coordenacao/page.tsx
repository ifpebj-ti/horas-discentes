'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaHome } from 'react-icons/fa';
import {
  FaUsers,
  FaGraduationCap,
  FaIdCard,
  FaBookOpen
} from 'react-icons/fa6';

import BreadCrumb from '@/components/BreadCrumb';
import { DashboardCard } from '@/components/DashboardCard';
import LoadingOverlay from '@/components/LoadingOverlay';

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

      <div className="mb-4">
        <BreadCrumb
          items={[{ icon: <FaHome />, label: 'Início', href: '/coordenacao' }]}
        />
      </div>

      <h1 className="md:text-4xl text-3xl font-semibold md:font-normal text-gray-800 mb-10">
        Coordenação
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          icon={<FaGraduationCap />}
          label="Turma"
          onClick={() => router.push('/coordenacao/turma')}
        />

        <DashboardCard
          icon={<FaIdCard />}
          label="Validação de Certificados"
          onClick={() => router.push('/coordenacao/certificados')}
        />

        <DashboardCard
          icon={<FaUsers />}
          label="Secretaria"
          notificationCount={pendenciasCount}
          onClick={() => router.push('/coordenacao/contabilizarHoras')}
        />

        <DashboardCard
          icon={<FaBookOpen />}
          label="Atividades"
          onClick={() => router.push('/coordenacao/atividade')}
        />
      </div>
    </div>
  );
}
