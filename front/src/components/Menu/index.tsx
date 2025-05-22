'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import {
  FaFileAlt,
  FaUserGraduate,
  FaUsers,
  FaEnvelope,
  FaBuilding,
  FaCog,
  FaHome,
  FaSignOutAlt,
  FaClipboard
} from 'react-icons/fa';

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
    <nav className="absolute w-full bg-white shadow-md z-30">
      <div className="flex flex-col">
        {/* MENU DO COORDENADOR */}
        {(role === 'coordenador' || role === 'admin') && (
          <>
            <CustomNavLink href="/coordenacao" onClick={closeMenu}>
              <IconText icon={FaHome} text="Início" />
            </CustomNavLink>
            <CustomNavLink href="/coordenacao/certificados" onClick={closeMenu}>
              <IconText icon={FaFileAlt} text="Validação de Certificados" />
            </CustomNavLink>
            <CustomNavLink href="/coordenacao/turmas" onClick={closeMenu}>
              <IconText icon={FaUserGraduate} text="Turmas" />
            </CustomNavLink>
            <CustomNavLink href="/coordenacao/alunos" onClick={closeMenu}>
              <IconText icon={FaUsers} text="Alunos" />
            </CustomNavLink>
            <CustomNavLink href="/coordenacao/secretaria" onClick={closeMenu}>
              <IconText icon={FaEnvelope} text="Secretaria" />
            </CustomNavLink>
            <CustomNavLink href="/coordenacao/campus" onClick={closeMenu}>
              <IconText icon={FaBuilding} text="Campus" />
            </CustomNavLink>
            <CustomNavLink
              href="/coordenacao/configuracoes"
              onClick={closeMenu}
            >
              <IconText icon={FaCog} text="Configurações" />
            </CustomNavLink>
          </>
        )}

        {/* MENU DO ALUNO */}
        {role === 'aluno' && (
          <>
            <CustomNavLink href="/aluno" onClick={closeMenu}>
              <IconText icon={FaHome} text="Início" />
            </CustomNavLink>
            <CustomNavLink href="/aluno/certificado/novo" onClick={closeMenu}>
              <IconText icon={FaFileAlt} text="Enviar Certificados" />
            </CustomNavLink>
            <CustomNavLink href="/aluno/certificado" onClick={closeMenu}>
              <IconText icon={FaClipboard} text="Certificados" />
            </CustomNavLink>
          </>
        )}

        <button
          onClick={closeMenu}
          className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
        >
          <FaSignOutAlt className="mr-2 text-blue-600" />
          <span className="text-black">Sair</span>
        </button>
      </div>
    </nav>
  );
};

export default MobileMenu;
