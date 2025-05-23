'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { FaChevronRight } from 'react-icons/fa';

interface BreadcrumbItem {
  icon: ReactNode;
  label: string;
  href: string;
}

interface BreadCrumbProps {
  items: BreadcrumbItem[];
}

export default function BreadCrumb({ items }: Readonly<BreadCrumbProps>) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && (
              <FaChevronRight className="flex-shrink-0 h-4 w-4 text-gray-400 mx-2" />
            )}

            <Link
              href={item.href}
              className={`flex items-center gap-2 text-sm font-medium ${
                index === items.length - 1
                  ? 'text-gray-700 cursor-default'
                  : 'text-[#0F4AA9] hover:text-[#0D3F8E] transition-colors'
              }`}
            >
              <span
                className={`${
                  index === items.length - 1
                    ? 'text-gray-500'
                    : 'text-[#0F4AA9]'
                }`}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
