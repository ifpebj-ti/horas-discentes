'use client';
import { Suspense } from 'react';
import { FaUpload, FaHome, FaFileAlt } from 'react-icons/fa';

import BreadCrumb from '@/components/BreadCrumb';
import FormRegistroHoras from '@/components/FormRegistroHoras';

import {
  MOCK_CATEGORIAS_COMPLEMENTARES,
  MOCK_CATEGORIAS_EXTENSAO
} from '@/lib/alunoMock';

export default function NovoCertificado() {
  const categoriasComplementares = MOCK_CATEGORIAS_COMPLEMENTARES;
  const categoriasExtensao = MOCK_CATEGORIAS_EXTENSAO;

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F6FA]">
      <main className="flex-1 w-full">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          {/* Cabeçalho */}
          <div className="flex flex-col gap-6 mb-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold sm:text-3xl">
                Novo Certificado
              </h1>
              <p className="text-gray-600 text-sm">
                Preencha os dados do seu certificado para solicitar a validação.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <BreadCrumb
                items={[
                  {
                    icon: <FaHome className="text-base" />,
                    label: 'Início',
                    href: '/aluno'
                  },
                  {
                    icon: <FaFileAlt className="text-base" />,
                    label: 'Certificados',
                    href: '/aluno/certificado'
                  },
                  {
                    icon: <FaUpload className="text-base" />,
                    label: 'Novo Certificado',
                    href: '/aluno/certificado/novo'
                  }
                ]}
              />
            </div>
          </div>

          {/* Formulário */}
          <Suspense fallback={<div>Carregando formulário...</div>}>
            <FormRegistroHoras
              categoriasComplementares={categoriasComplementares}
              categoriasExtensao={categoriasExtensao}
            />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
