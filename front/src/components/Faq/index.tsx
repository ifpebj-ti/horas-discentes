'use client';
import Link from 'next/link';
import { FaRegFileAlt, FaAward, FaClock, FaTimesCircle } from 'react-icons/fa';

interface Props {
  readonly total: number;
  readonly approved: number;
  readonly pending: number;
  readonly rejected: number;
}

const CARDS = [
  {
    icon: <FaRegFileAlt />,
    label: 'Certificados',
    bg: 'bg-[#EDF2FF]',
    text: 'text-[#0F4AA9]',
    href: '/aluno/certificado'
  },
  {
    icon: <FaAward />,
    label: 'Aprovados',
    bg: 'bg-[#E6FFFA]',
    text: 'text-[#047857]',
    href: '/aluno/certificado?status=aprovado'
  },
  {
    icon: <FaClock />,
    label: 'Pendentes',
    bg: 'bg-[#FFF7ED]',
    text: 'text-[#B45309]',
    href: '/aluno/certificado?status=pendente'
  },
  {
    icon: <FaTimesCircle />,
    label: 'Rejeitados',
    bg: 'bg-[#FEE2E2]',
    text: 'text-[#B91C1C]',
    href: '/aluno/certificado?status=rejeitado'
  }
];

export default function StatsSummary({
  total,
  approved,
  pending,
  rejected
}: Props) {
  const values = [total, approved, pending, rejected];

  return (
    <div className="bg-white rounded-3xl shadow border border-[#F0F2F5] overflow-hidden divide-y sm:divide-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-4">
      {CARDS.map((c, i) => (
        <Link
          key={c.label}
          href={c.href}
          className="relative flex items-center px-6 py-5 gap-4 sm:flex-col sm:py-6 hover:bg-gray-50 transition-colors"
        >
          {/* Balão de Notificação */}
          {values[i] > 0 && (
            <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full">
              {values[i]}
            </div>
          )}

          <div className={`${c.bg} rounded-full p-3 text-xl ${c.text}`}>
            {c.icon}
          </div>

          <div className="text-center sm:text-center">
            <p className="text-sm text-gray-500 mb-1">{c.label}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
