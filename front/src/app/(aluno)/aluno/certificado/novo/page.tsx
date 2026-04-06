'use client';

import { useEffect, useState, Suspense } from 'react';
import { toast } from 'react-toastify';
import { BreadcrumbAuto } from '@/components/ui/breadcrumb';
import HoursRegistrationForm from '@/components/HoursRegistrationForm';

import {
  listarAtividades,
  AtividadeResponse
} from '@/services/activityService';

export default function NovoCertificado() {
  const [complementares, setComplementares] = useState<AtividadeResponse[]>([]);
  const [extensao, setExtensao] = useState<AtividadeResponse[]>([]);
  const [loadingAtividades, setLoadingAtividades] = useState(false);

  useEffect(() => {
    const fetchAtividades = async () => {
      setLoadingAtividades(true);
      try {
        const atividades = await listarAtividades();

        setComplementares(atividades.filter((a) => a.tipo === 'COMPLEMENTAR'));
        setExtensao(atividades.filter((a) => a.tipo === 'EXTENSAO'));
      } catch (error) {
        console.error('Erro ao buscar atividades:', error);
        toast.error('Não foi possível carregar as categorias. Tente novamente.');
      } finally {
        setLoadingAtividades(false);
      }
    };

    fetchAtividades();
  }, []);

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

            <BreadcrumbAuto />
          </div>

          {/* Formulário */}
          {loadingAtividades ? (
            <div className="flex items-center justify-center py-12 text-gray-500">
              Carregando categorias...
            </div>
          ) : (
            <Suspense fallback={<div>Carregando formulário...</div>}>
              <HoursRegistrationForm
                categoriasComplementares={complementares}
                categoriasExtensao={extensao}
              />
            </Suspense>
          )}
        </div>
      </main>
    </div>
  );
}
