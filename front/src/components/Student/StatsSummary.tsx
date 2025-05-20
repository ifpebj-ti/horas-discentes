'use client';
import Link from 'next/link';
import {
  FaRegFileAlt, FaAward, FaClock, FaTimesCircle
} from 'react-icons/fa';

interface Props {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
}

const CARDS = [
  {
    icon: <FaRegFileAlt />,
    label: 'Total de Certificados',
    bg: 'bg-[#EDF2FF]',
    text: 'text-[#0F4AA9]',
    href: '/aluno/certificado'
  },
  {
    icon: <FaAward />,
    label: 'Certificados Aprovados',
    bg: 'bg-[#E6FFFA]',
    text: 'text-[#047857]',
    href: '/aluno/certificado?status=approved'
  },
  {
    icon: <FaClock />,
    label: 'Pendentes de Aprovação',
    bg: 'bg-[#FFF7ED]',
    text: 'text-[#B45309]',
    href: '/aluno/certificado?status=pending'
  },
  {
    icon: <FaTimesCircle />,
    label: 'Certificados Rejeitados',
    bg: 'bg-[#FEE2E2]',
    text: 'text-[#B91C1C]',
    href: '/aluno/certificado?status=rejected'
  }
];

export default function StatsSummary({ total, approved, pending, rejected }: Props) {
  const values = [total, approved, pending, rejected];

  return (
    <div className="bg-white rounded-3xl shadow border border-[#F0F2F5] overflow-hidden divide-y sm:divide-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-4">
      {CARDS.map((c, i) => (
        <Link
          key={c.label}
          href={c.href}
          className="flex items-center px-6 py-5 gap-4 sm:flex-col sm:py-6 hover:bg-gray-50 transition-colors"
        >
          <div className={`${c.bg} rounded-full p-3 text-xl ${c.text}`}>
            {c.icon}
          </div>

          <div className="text-center sm:text-center">
            <p className="text-sm text-gray-500 mb-1">{c.label}</p>
            <p className="text-2xl font-semibold leading-none text-[#071D41]">
              {values[i]}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
