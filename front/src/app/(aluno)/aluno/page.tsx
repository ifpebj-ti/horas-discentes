'use client';

import { FaHome } from 'react-icons/fa';

import BreadCrumb from '@/components/BreadCrumb';

export default function AlunoPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto mt-4 z-10 relative">
      <BreadCrumb
        breadcrumbInicio="aluno"
        breadcrumbTitle="Aluno"
        breadcrumbIcon={<FaHome />}
      />
    </div>
  );
}
