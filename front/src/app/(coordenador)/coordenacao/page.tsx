'use client';

import { useRouter } from 'next/navigation';
import { FaHome } from 'react-icons/fa';
import { FaUsers, FaGraduationCap, FaIdCard } from 'react-icons/fa6';

import BreadCrumb from '@/components/BreadCrumb';
import { DashboardCard } from '@/components/DashboardCard';

export default function CoordenacaoPage() {
  const router = useRouter();

  return (
    <div className="p-6 max-w-5xl mx-auto mt-4 z-10 relative">
      <BreadCrumb
        items={[
          {
            icon: <FaHome />,
            label: 'Início',
            href: '/coordenacao'
          }
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          icon={<FaGraduationCap className="text-blue-600 text-3xl" />}
          label="Turma"
          onClick={() => router.push('/coordenacao/turma')}
        />

        <DashboardCard
          icon={<FaIdCard className="text-blue-600 text-3xl" />}
          label="Validação de Certificados"
          onClick={() => router.push('/coordenacao/certificados')}
        />

        <DashboardCard
          icon={<FaUsers className="text-blue-600 text-3xl" />}
          label="Secretaria"
          notificationCount={5}
          onClick={() => router.push('/coordenacao/contabilizarHoras')}
        />
      </div>
    </div>
  );
}
