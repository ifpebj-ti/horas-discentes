import {
  FaFileAlt,
  FaEnvelope,
  FaHome,
  FaClipboard,
  FaGraduationCap,
  FaBookOpen,
  FaUserAlt
} from 'react-icons/fa';

export const ROUTES = {
  admin: [
    {
      href: '/admin/perfil',
      label: 'Meu Perfil',
      icon: FaUserAlt
    },
    {
      href: '/curso',
      label: 'Início',
      icon: FaHome
    }
  ],
  coordenador: [
    {
      href: '/coordenacao',
      label: 'Início',
      icon: FaHome
    },
    {
      href: '/coordenacao/turma',
      label: 'Turma',
      icon: FaGraduationCap
    },
    {
      href: '/coordenacao/certificados',
      label: 'Validação de Certificados',
      icon: FaFileAlt
    },
    {
      href: '/coordenacao/contabilizarHoras',
      label: 'Secretaria',
      icon: FaEnvelope
    },
    {
      href: '/coordenacao/atividade',
      label: 'Atividade',
      icon: FaBookOpen
    }
  ],
  aluno: [
    {
      href: '/aluno',
      label: 'Início',
      icon: FaHome
    },
    {
      href: '/aluno/certificado',
      label: 'Certificados',
      icon: FaClipboard
    }
  ]
};
