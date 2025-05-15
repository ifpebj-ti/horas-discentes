'use client';

import { FaHome } from 'react-icons/fa';
import Link from 'next/link';

export default function Breadcrumb() {
  return (
    <nav className="text-gray-600 text-sm mb-6 flex items-center space-x-2">
      <FaHome className="text-blue-600" />
      <span className="mx-1">›</span>
      <span className="text-gray-700">Página inicial</span>
    </nav>
  );
}
