'use client';

import Link from 'next/link';
import { FaPlusCircle } from 'react-icons/fa';

export default function NewCertificateButton() {
  return (
    <Link
      href="/aluno/certificado/novo"
      className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
    >
      <FaPlusCircle />
      Novo Certificado
    </Link>
  );
}
