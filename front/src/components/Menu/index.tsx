'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import {
  FaFileAlt,
  FaEnvelope,
  FaHome,
  FaSignOutAlt,
  FaClipboard,
  FaGraduationCap,
  FaBookOpen,
  FaUserAlt
} from 'react-icons/fa';

import Version from '@/components/Version/Version';

type Props = {
  user: {
    name: string;
    role: string;
  };
  closeMenu: () => void;
};

const CustomNavLink = ({
  href,
  children,
  onClick
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  const baseClass =
    'flex items-center px-4 py-2 text-sm hover:bg-gray-100 transition-colors';
  const activeClass = isActive ? 'bg-gray-200 font-semibold' : '';
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`${baseClass} ${activeClass}`}
    >
      {children}
    </Link>
  );
};

const IconText = ({
  icon: Icon,
  text
}: {
  icon: React.ElementType;
  text: string;
}) => (
  <>
    <Icon className="mr-2 text-blue-600" />
    <span className="text-black">{text}</span>
  </>
);

const MobileMenu: React.FC<Props> = ({ user, closeMenu }) => {
  const role = user?.role;

  return (
    <nav className="absolute top-full left-0 w-64 max-w-[80vw] bg-white shadow-lg z-30 border-r border-gray-200 max-h-[calc(100vh-80px)] flex flex-col">
      {/* Conteúdo do menu com scroll */}
      <div className="flex-1 overflow-y-auto">
        {/* MENU DO ADMINISTRADOR */}
        {role === 'admin' && (
          <>
            <CustomNavLink href="/admin/perfil" onClick={closeMenu}>
              <IconText icon={FaUserAlt} text="Meu Perfil" />
            </CustomNavLink>
            <CustomNavLink href="/curso" onClick={closeMenu}>
              <IconText icon={FaHome} text="Início" />
            </CustomNavLink>
          </>
        )}

        {/* MENU DO COORDENADOR */}
        {role === 'coordenador' && (
          <>
            <CustomNavLink href="/coordenacao" onClick={closeMenu}>
              <IconText icon={FaHome} text="Início" />
            </CustomNavLink>
            <CustomNavLink href="/coordenacao/turma" onClick={closeMenu}>
              <IconText icon={FaGraduationCap} text="Turma" />
            </CustomNavLink>
            <CustomNavLink href="/coordenacao/certificados" onClick={closeMenu}>
              <IconText icon={FaFileAlt} text="Validação de Certificados" />
            </CustomNavLink>
            {/* <CustomNavLink href="/coordenacao/alunos" onClick={closeMenu}>
              <IconText icon={FaUsers} text="Alunos" />
            </CustomNavLink> */}
            <CustomNavLink
              href="/coordenacao/contabilizarHoras"
              onClick={closeMenu}
            >
              <IconText icon={FaEnvelope} text="Secretaria" />
            </CustomNavLink>
            <CustomNavLink href="/coordenacao/atividade" onClick={closeMenu}>
              <IconText icon={FaBookOpen} text="Atividade" />
            </CustomNavLink>
            {/* <CustomNavLink
              href="/coordenacao/configuracoes"
              onClick={closeMenu}
            >
              <IconText icon={FaCog} text="Configurações" />
            </CustomNavLink> */}
          </>
        )}

        {/* MENU DO ALUNO */}
        {role === 'aluno' && (
          <>
            <CustomNavLink href="/aluno" onClick={closeMenu}>
              <IconText icon={FaHome} text="Início" />
            </CustomNavLink>
            <CustomNavLink href="/aluno/certificado" onClick={closeMenu}>
              <IconText icon={FaClipboard} text="Certificados" />
            </CustomNavLink>
          </>
        )}

        <button
          onClick={closeMenu}
          className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer w-full"
        >
          <FaSignOutAlt className="mr-2 text-blue-600" />
          <span className="text-black">Sair</span>
        </button>
      </div>

      {/* Versão fixa no rodapé do menu */}
      <div className="border-t border-gray-200 px-4 py-2 bg-gray-50">
        <Version />
      </div>
    </nav>
  );
};

export default MobileMenu;
