import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FaChartBar, FaFileAlt, FaUserGraduate, FaUsers,
  FaEnvelope, FaBuilding, FaCog, FaHome, FaSignOutAlt
} from 'react-icons/fa';

type Props = {
  user: { name: string; role: string };
  closeMenu: () => void;
};

const CustomNavLink = ({
  href,
  children,
  onClick,
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
    <Link href={href} onClick={onClick} className={`${baseClass} ${activeClass}`}>
      {children}
    </Link>
  );
};

const IconText = ({ icon: Icon, text }: { icon: React.ElementType; text: string }) => (
  <>
    <Icon className="mr-2 text-blue-600" />
    <span className="text-black">{text}</span>
  </>
);

const MobileMenu: React.FC<Props> = ({ user, closeMenu }) => {
  const isCoordinator = user?.role === 'coordinator';

  return (
    <nav className="absolute w-full bg-white shadow-md z-30">
      <div className="flex flex-col">
        {isCoordinator && (
          <>
            <CustomNavLink href="/coordinator" onClick={closeMenu}>
              <IconText icon={FaChartBar} text="Dashboard" />
            </CustomNavLink>
            <CustomNavLink href="/coordinator/certificates" onClick={closeMenu}>
              <IconText icon={FaFileAlt} text="Validação de Certificados" />
            </CustomNavLink>
            <CustomNavLink href="/coordinator/classes" onClick={closeMenu}>
              <IconText icon={FaUserGraduate} text="Turmas" />
            </CustomNavLink>
            <CustomNavLink href="/coordinator/students" onClick={closeMenu}>
              <IconText icon={FaUsers} text="Alunos" />
            </CustomNavLink>
            <CustomNavLink href="/coordinator/secretary" onClick={closeMenu}>
              <IconText icon={FaEnvelope} text="Secretaria" />
            </CustomNavLink>
            <CustomNavLink href="/coordinator/campus" onClick={closeMenu}>
              <IconText icon={FaBuilding} text="Campus" />
            </CustomNavLink>
            <CustomNavLink href="/coordinator/settings" onClick={closeMenu}>
              <IconText icon={FaCog} text="Configurações" />
            </CustomNavLink>
          </>
        )}
        <CustomNavLink href="/" onClick={closeMenu}>
          <IconText icon={FaHome} text="Início" />
        </CustomNavLink>
        <CustomNavLink href="/certificates" onClick={closeMenu}>
          <IconText icon={FaFileAlt} text="Certificados" />
        </CustomNavLink>
        <button
          onClick={closeMenu}
          className="flex items-center px-4 py-2 text-sm hover:bg-gray-100"
        >
          <FaSignOutAlt className="mr-2 text-blue-600" />
          <span className="text-black">Sair</span>
        </button>
      </div>
    </nav>
  );
};

export default MobileMenu;
