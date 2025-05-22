'use client';
import { useState, useEffect, useContext } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaHome, FaPlusCircle, FaSearch, FaFileAlt } from 'react-icons/fa';
import BreadCrumb from '@/components/BreadCrumb';
import { CATEGORY_INFO } from '@/types';
import { RoundedButton } from '@/components/RoundedButton';
import VerCertificado from '@/components/VerCertificado/VerCertificado';
import { CertificadosContext } from '../../layout'; // ajuste o caminho se necessário

interface Certificado {
  id: string;
  title: string;
  institution: string;
  description: string;
  cargaHoraria: number;
  local: string;
  periodoInicio: string;
  periodoFim: string;
  status: string;
  tipo: string;
  categoriaKey: string;
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'Todos os status' },
  { value: 'aprovado', label: 'Aprovado' },
  { value: 'pendente', label: 'Pendente' },
  { value: 'rejeitado', label: 'Rejeitado' },
];

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'Todas as categorias' },
  { value: 'Ensino', label: 'Ensino' },
  { value: 'Estagio', label: 'Estagio' },
  { value: 'Eventos', label: 'Eventos' },
  { value: 'Pesquisa', label: 'Pesquisa' },
  { value: 'Extensao', label: 'Extensao' },
  { value: 'Curso', label: 'Curso' },
  { value: 'Voluntariado', label: 'Voluntariado' }
];

const breadcrumbItems = [
  {
    icon: <FaHome className="text-base" />,
    label: 'Início',
    href: '/aluno'
  },
  {
    icon: <FaFileAlt className="text-base" />,
    label: 'Certificados',
    href: '/aluno/certificado'
  }
];

export default function Certificados() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const certificados = useContext(CertificadosContext) as Certificado[];

  useEffect(() => {
    const category = searchParams.get('category');
    const status = searchParams.get('status');

    if (category) {
      setSelectedCategory(category);
    }

    if (status && ['aprovado', 'pendente', 'rejeitado'].includes(status)) {
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

    const query = params.toString();
    const newPath = `/aluno/certificado${query ? `?${query}` : ''}`;
    router.push(newPath);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    updateFilters(status, selectedCategory);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    updateFilters(selectedStatus, category);
  };

  const filteredCertificates = certificados.filter(cert => {
    const matchesSearch = cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.institution.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || cert.status === selectedStatus;
    const matchesCategory = selectedCategory === 'all' || cert.categoriaKey === selectedCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Aprovado';
      case 'pending':
        return 'Pendente';
      case 'rejected':
        return 'Rejeitado';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F6FA]">
      <main className="flex-1 w-full">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold lg:text-3xl mb-1 text-gray-900">
                  Meus Certificados
                </h1>
                <p className="text-sm text-gray-600">
                  Gerencie seus certificados e acompanhe o status de cada um.
                </p>
              </div>

              <Link
                href="/aluno/certificado/novo"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0F4AA9] px-4 py-2 text-sm font-medium text-white shadow hover:bg-[#0D3F8E] transition-colors w-full sm:w-auto"
              >
                <FaPlusCircle className="text-base" />
                Novo Certificado
              </Link>
            </div>

            <BreadCrumb items={breadcrumbItems} />
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 mt-4 border border-gray-200">
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar certificados..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F4AA9]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select
                  value={selectedStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F4AA9] bg-white text-gray-900"
                >
                  {STATUS_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F4AA9] bg-white text-gray-900"
                >
                  {CATEGORY_OPTIONS.map(option => (
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
                  <VerCertificado
                    key={cert.id}
                    certificate={{
                      id: cert.id,
                      title: cert.title,
                      institution: cert.local,
                      description: cert.description,
                      hours: cert.cargaHoraria,
                      date: cert.periodoInicio,
                      dateEnd: cert.periodoFim,
                      category: cert.categoriaKey,
                      status: cert.status,
                    }}
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
