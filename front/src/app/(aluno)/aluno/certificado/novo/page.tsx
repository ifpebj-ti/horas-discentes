'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState, Suspense } from 'react';
import { FaUpload, FaHome, FaFileAlt } from 'react-icons/fa';

import BreadCrumb from '@/components/BreadCrumb';
import FormRegistroHoras from '@/components/FormRegistroHoras';

import {
  listarAtividadesPorCurso,
  AtividadeResponse
} from '@/services/atividadeService';

export default function NovoCertificado() {
  const { data: session, status } = useSession();
  const [complementares, setComplementares] = useState<AtividadeResponse[]>([]);
  const [extensao, setExtensao] = useState<AtividadeResponse[]>([]);

  useEffect(() => {
    const fetchAtividades = async () => {
      if (status !== 'authenticated' || !session?.user?.cursoId) return;

      try {
        const atividades = await listarAtividadesPorCurso(session.user.cursoId);

        const atividadesComplementares = atividades.filter(
          (a) => a.tipo === 'COMPLEMENTAR'
        );

        const atividadesExtensao = atividades.filter(
          (a) => a.tipo === 'EXTENSAO'
        );

        setComplementares(atividadesComplementares);
        setExtensao(atividadesExtensao);
      } catch (error) {
        console.error('Erro ao buscar atividades do curso:', error);
      }
    };

    fetchAtividades();
  }, [session, status]);
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
              categoriasComplementares={complementares}
              categoriasExtensao={extensao}
            />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
