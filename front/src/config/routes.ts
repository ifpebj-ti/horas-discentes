import { IconType } from 'react-icons';
import {
  FaFileAlt,
  FaEnvelope,
  FaHome,
  FaClipboard,
  FaGraduationCap,
  FaBookOpen,
  FaUserAlt
} from 'react-icons/fa';

export interface RouteItem {
  href: string;
  label: string;
  icon: IconType;
}

export const PATHS = {
  ADMIN: {
    PROFILE: '/admin/perfil',
    HOME: '/curso',
  },
  COORDINATION: {
    HOME: '/coordenacao',
    CLASSES: '/coordenacao/turma',
    CERTIFICATES: '/coordenacao/certificados',
    SECRETARY: '/coordenacao/contabilizarHoras',
    ACTIVITIES: '/coordenacao/atividade',
  },
  STUDENT: {
    HOME: '/aluno',
    CERTIFICATES: '/aluno/certificado',
  }
};

export const ROUTES: Record<string, RouteItem[]> = {
  admin: [
    {
      href: PATHS.ADMIN.PROFILE,
      label: 'Meu Perfil',
      icon: FaUserAlt
    },
    {
      href: PATHS.ADMIN.HOME,
      label: 'Início',
      icon: FaHome
    }
  ],
  coordenador: [
    {
      href: PATHS.COORDINATION.HOME,
      label: 'Início',
      icon: FaHome
    },
    {
      href: PATHS.COORDINATION.CLASSES,
      label: 'Turma',
      icon: FaGraduationCap
    },
    {
      href: PATHS.COORDINATION.CERTIFICATES,
      label: 'Validação de Certificados',
      icon: FaFileAlt
    },
    {
      href: PATHS.COORDINATION.SECRETARY,
      label: 'Secretaria',
      icon: FaEnvelope
    },
    {
      href: PATHS.COORDINATION.ACTIVITIES,
      label: 'Atividade',
      icon: FaBookOpen
    }
  ],
  aluno: [
    {
      href: PATHS.STUDENT.HOME,
      label: 'Início',
      icon: FaHome
    },
    {
      href: PATHS.STUDENT.CERTIFICATES,
      label: 'Certificados',
      icon: FaClipboard
    }
  ]
};
