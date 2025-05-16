'use client';
import { usePathname } from 'next/navigation';
import BreadCrumb from '@/components/BreadCrumb';
import { FaHome } from 'react-icons/fa';
import Header from '@/components/Header';
import ProgressoGeral from '@/components/ProgressoGeral';
import ResumoAluno from '@/components/ResumoAluno';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Aluno() {
  const pathname = usePathname();
  const user: User = {
    id: '1',
    name: 'Silva',
    email: 'silva@example.com',
    role: 'aluno',
  };

  const getTitleFromPath = (path: string): string => {
    const lastSegment = path.split('/').filter(Boolean).pop() ?? '';

    if (lastSegment === 'aluno') return 'Aluno';
    if (lastSegment === 'certificados') return 'Visualizar Certificados';
    return 'Início';
  }
  const breadcrumbTitle = getTitleFromPath(pathname);

  return (
    <div className="min-h-screen bg-white">
      <header className="shadow-md bg-gray-100 z-20 relative">
        <Header menuTitle={breadcrumbTitle} user={user} />
      </header>
      <main>
        <div className="p-6 max-w-5xl mx-auto mt-4 z-10 relative">
          <BreadCrumb
            breadcrumbInicio="aluno"
            breadcrumbTitle="Aluno"
            breadcrumbIcon={<FaHome />}
          />

          
        </div>
      </main>
    </div>
  );
}
