'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { CardHome } from '@/components/CardHome';
import { BreadcrumbAuto } from '@/components/ui/breadcrumb';

import { useCertificadosPendentesPorCurso } from '@/hooks/useCertificates';
import {
  faBookOpen,
  faGraduationCap,
  faIdCard,
  faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';

export default function CoordenacaoPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const cursoId = session?.user?.cursoId;
  const { data: pendingCount } = useCertificadosPendentesPorCurso(cursoId);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <BreadcrumbAuto />

      <h1 className="md:text-4xl text-3xl font-semibold md:font-normal text-gray-800 mb-10">
        Coordenação
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <CardHome
          icon={faGraduationCap}
          title="Turma"
          onClick={() => router.push('/coordenacao/turma')}
        />

        <CardHome
          icon={faIdCard}
          title="Validação de Certificados"
          indicatorNumber={pendingCount || undefined}
          onClick={() => router.push('/coordenacao/certificados')}
        />

        <CardHome
          icon={faBookOpen}
          title="Atividades"
          onClick={() => router.push('/coordenacao/atividade')}
        />

        <CardHome
          icon={faTriangleExclamation}
          title="Alunos em Risco"
          onClick={() => router.push('/coordenacao/alunos-em-risco')}
        />
      </div>
    </div>
  );
}
