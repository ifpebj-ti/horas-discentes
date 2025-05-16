'use client';

import Link from 'next/link';
import { FaHome } from 'react-icons/fa';

interface BreadcrumbProps {
  breadcrumbTitle: string;
  breadcrumbInicio: string;
  breadcrumbIcon: React.ReactNode;
  href?: string;
}

export default function Breadcrumb({ breadcrumbTitle, href, breadcrumbIcon, breadcrumbInicio }: BreadcrumbProps) {
  return (
    <nav className="text-sm text-gray-600 mb-6 flex items-center flex-wrap">
      <Link href={breadcrumbInicio} className="text-blue-600 hover:underline flex items-center space-x-1">
        {breadcrumbIcon}
      </Link>
      <span className="flex items-center space-x-1">
        <span className="mx-1 text-gray-400">›</span>
        <Link
          href={href || '#'}
          className="text-blue-600 hover:underline capitalize"
        >
          {breadcrumbTitle}
        </Link>
      </span>
    </nav>
  );
}
