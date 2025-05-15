'use client';
import BreadCrumb from '@/components/BreadCrumb';
import { FaUsers, FaGraduationCap, FaIdCard } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import { DashboardCard } from '@/components/DashboardCard';
import Header from '@/components/Header';

export default function InicioPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="p-6 max-w-5xl mx-auto">
        <BreadCrumb />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard
            icon={<FaUsers className="text-blue-600 text-3xl" />}
            label="Alunos"
            notificationCount={5}
            onClick={() => router.push('/inicio/alunos')}
          />

          <DashboardCard
            icon={<FaGraduationCap className="text-blue-600 text-3xl" />}
            label="Cursos"
            onClick={() => router.push('/inicio/cursos')}
          />

          <DashboardCard
            icon={<FaIdCard className="text-blue-600 text-3xl" />}
            label="Certificados"
            onClick={() => router.push('/inicio/certificados')}
          />
        </div>
      </main>
    </div>
  );
}
