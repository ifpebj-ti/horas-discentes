'use client';

import { useRouter, usePathname } from 'next/navigation';
import { FaHome } from 'react-icons/fa';
import { FaUsers, FaGraduationCap, FaIdCard } from 'react-icons/fa6';

import BreadCrumb from '@/components/BreadCrumb';
import { DashboardCard } from '@/components/DashboardCard';
import Header from '@/components/Header';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Coordenacao() {
  const pathname = usePathname();
  const router = useRouter();
  const user: User = {
    id: '1',
    name: 'Maria',
    email: 'coordenador@example.com',
    role: 'coordenador'
  };

  const getTitleFromPath = (path: string): string => {
    const lastSegment = path.split('/').filter(Boolean).pop() ?? '';

    if (lastSegment === 'coordenacao') return 'Coordenação';
    if (lastSegment === 'certificados') return 'Validação de Certificados';
    if (lastSegment === 'turmas') return 'Turmas';
    if (lastSegment === 'alunos') return 'Alunos';
    if (lastSegment === 'secretaria') return 'Secretaria';
    if (lastSegment === 'campus') return 'Campus';
    if (lastSegment === 'configuracoes') return 'Configurações';
    return 'Início';
  };

  const breadcrumbTitle = getTitleFromPath(pathname);

  return (
    <div className="min-h-screen bg-white">
      <header className="shadow-md bg-gray-100 z-20 relative">
        <Header menuTitle={breadcrumbTitle} user={user.name} role={user.role} />
      </header>
      <main>
        <div className="p-6 max-w-5xl mx-auto mt-4 z-10 relative">
          <BreadCrumb
            breadcrumbInicio="coordenacao"
            breadcrumbTitle={breadcrumbTitle}
            breadcrumbIcon={<FaHome />}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DashboardCard
              icon={<FaUsers className="text-blue-600 text-3xl" />}
              label="Alunos"
              notificationCount={5}
              onClick={() => router.push('/coordenacao/alunos')}
            />

            <DashboardCard
              icon={<FaGraduationCap className="text-blue-600 text-3xl" />}
              label="Cursos"
              onClick={() => router.push('/coordenacao/cursos')}
            />

            <DashboardCard
              icon={<FaIdCard className="text-blue-600 text-3xl" />}
              label="Certificados"
              onClick={() => router.push('/coordenacao/certificados')}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
