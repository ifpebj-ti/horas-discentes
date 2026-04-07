'use client';

import { useRouter } from 'next/navigation';

import {
  faBookOpen,
  faGraduationCap,
  faIdCard
} from '@fortawesome/free-solid-svg-icons';

import { CardHome } from '@/components/CardHome';
import { BreadcrumbAuto } from '@/components/ui/breadcrumb';

export default function CoordenacaoPage() {
  const router = useRouter();

  return (
    <div className="p-6 max-w-5xl mx-auto">
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
          icon={faBookOpen}
          title="Atividades"
          onClick={() => router.push('/coordenacao/atividade')}
        />
      </div>
    </div>
  );
}
