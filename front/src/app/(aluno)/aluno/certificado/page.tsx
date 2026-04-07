'use client';

import { useSession } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  useState,
  useEffect,
  useContext,
  createContext,
  Suspense
} from 'react';
import { FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';

import LoadingOverlay from '@/components/LoadingOverlay';
import NewCertificateButton from '@/components/NewCertificateButton';
import { BreadcrumbAuto } from '@/components/ui/breadcrumb';
import ViewCertificate from '@/components/ViewCertificate';

import { useLoadingOverlay } from '@/hooks/useLoadingOverlay';
import { useMeusDadosDetalhados } from '@/hooks/useStudent';
import { STATUS_OPTIONS, CATEGORY_OPTIONS } from '@/lib/alunoMock';
import {
  listarMeusCertificados,
  baixarAnexoCertificado
} from '@/services/certificateService';
import * as Types from '@/types';
import {
  mapStatusCertificado,
  mapTipoCertificado,
  StatusCertificado
} from '@/types';

const CertificadosContext = createContext<Types.Certificado[]>([]);

function CertificadosPageContent({ user }: { user: Types.Usuario }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const certificados = useContext(CertificadosContext);

  useEffect(() => {
    const category = searchParams.get('category');
    const status = searchParams.get('status');

    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (category) setSelectedCategory(category);
    if (
      status &&
      (Object.values(StatusCertificado) as string[]).includes(status)
    ) {
      setSelectedStatus(status);
    }
  }, [searchParams]);

  const updateFilters = (status: string, category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (status !== 'all') {
      params.set('status', status);
    } else {
      params.delete('status');
    }
    if (category !== 'all') {
      params.set('category', category);
    } else {
      params.delete('category');
    }

    router.push('/aluno/certificado' + (params.toString() ? `?${params}` : ''));
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    updateFilters(status, selectedCategory);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    updateFilters(selectedStatus, category);
  };

  const filteredCertificates = certificados.filter((cert) => {
    const matchesSearch =
      cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.local.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === 'all' || cert.status === selectedStatus;
    const matchesCategory =
      selectedCategory === 'all' ||
      cert.categoriaKey.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleVerCertificado = async (id: string) => {
    try {
      const blob = await baixarAnexoCertificado(id);
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Erro ao baixar certificado:', error);
      toast.error('Não foi possível visualizar o certificado.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 w-full">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <button
                  onClick={() => router.push('/aluno')}
                  className="text-sm text-primary hover:underline mb-2 flex items-center gap-1"
                >
                  ← Início
                </button>
                <h1 className="text-xl sm:text-2xl font-bold lg:text-3xl mb-1 text-gray-900">
                  Meus Certificados
                </h1>
                <p className="text-sm text-gray-600">
                  Gerencie seus certificados e acompanhe o status de cada um.
                </p>
              </div>
              <NewCertificateButton user={user} />
            </div>
            <BreadcrumbAuto />
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 mt-4 border border-gray-200">
            <div className="flex flex-col gap-4 mb-6">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar certificados..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select
                  value={selectedStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900"
                >
                  {CATEGORY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCertificates.length > 0 ? (
                filteredCertificates.map((cert) => (
                  <ViewCertificate
                    key={cert.id}
                    certificate={{
                      id: String(cert.id),
                      title: cert.title,
                      local: cert.local,
                      description: cert.description,
                      hours: cert.cargaHoraria,
                      date: cert.periodoInicio,
                      dateEnd: cert.periodoFim,
                      category: cert.categoriaKey,
                      status: cert.status
                    }}
                    onClick={handleVerCertificado}
                  />
                ))
              ) : (
                <div className="col-span-full p-8 text-center text-gray-500">
                  Nenhum certificado encontrado com os filtros selecionados.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Certificados() {
  const { data: session, status } = useSession();
  const [certificados, setCertificados] = useState<Types.Certificado[]>([]);
  const loadingOverlay = useLoadingOverlay(true);
  const { data: detalhado } = useMeusDadosDetalhados();

  useEffect(() => {
    if (status !== 'authenticated') return;

    const fetchData = async () => {
      try {
        loadingOverlay.show();
        const certData = await listarMeusCertificados();

        const mapped = certData.map((cert) => ({
          id: cert.id,
          title: cert.tituloAtividade,
          local: cert.local,
          description: cert.descricao || '',
          cargaHoraria: cert.cargaHoraria,
          periodoInicio: cert.dataInicio,
          periodoFim: cert.dataFim,
          categoria: cert.categoria,
          grupo: cert.grupo,
          categoriaKey: cert.categoriaKey,
          tipo: mapTipoCertificado(cert.tipo),
          status: mapStatusCertificado(cert.status)
        }));

        setCertificados(mapped);
      } catch (error) {
        console.error('Erro ao buscar certificados:', error);
      } finally {
        loadingOverlay.hide();
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  if (status === 'loading' || loadingOverlay.visible) {
    return <LoadingOverlay show={true} />;
  }
  if (!session?.user) return null;

  const user: Types.Usuario = {
    id: session.user.entidadeId!,
    name: session.user.name,
    email: session.user.email,
    role: session.user.role,
    isNewPPC: session.user.isNewPpc === true,
    totalHorasExtensao: detalhado?.totalHorasExtensao ?? 0,
    maximoHorasExtensao: detalhado?.maximoHorasExtensao ?? 0,
    totalHorasComplementar: detalhado?.totalHorasComplementar ?? 0,
    maximoHorasComplementar: detalhado?.maximoHorasComplementar ?? 0
  };

  return (
    <>
      <LoadingOverlay show={loadingOverlay.visible} />
      <CertificadosContext.Provider value={certificados}>
        <Suspense fallback={<div>Carregando certificados...</div>}>
          <CertificadosPageContent user={user} />
        </Suspense>
      </CertificadosContext.Provider>
    </>
  );
}
