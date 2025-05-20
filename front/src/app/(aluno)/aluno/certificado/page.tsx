'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaPlusCircle, FaSearch } from 'react-icons/fa';
import Header from '@/components/Header';
import BreadCrumb from '@/components/BreadCrumb';
import { CATEGORY_INFO } from '@/types';
import { RoundedButton } from '@/components/RoundedButton';

interface Certificate {
  id: string;
  status: 'approved' | 'pending' | 'rejected';
  hours: number;
  category: string;
  title: string;
  date: string;
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'Todos os status' },
  { value: 'approved', label: 'Aprovado' },
  { value: 'pending', label: 'Pendente' },
  { value: 'rejected', label: 'Rejeitado' },
];

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'Todas as categorias' },
  ...Object.entries(CATEGORY_INFO).map(([value, { label }]) => ({
    value,
    label,
  })),
];

const MOCK_CERTIFICATES: Certificate[] = [
  {
    id: '1',
    status: 'approved',
    hours: 10,
    category: 'extension',
    title: 'Workshop de Desenvolvimento Web',
    date: '2024-03-15'
  },
  {
    id: '2',
    status: 'pending',
    hours: 5,
    category: 'research',
    title: 'Semana Acadêmica de Computação',
    date: '2024-03-10'
  },
  {
    id: '3',
    status: 'approved',
    hours: 8,
    category: 'academic',
    title: 'Monitoria em Programação',
    date: '2024-03-05'
  },
];

export default function Certificados() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [certificates] = useState<Certificate[]>(MOCK_CERTIFICATES);

  useEffect(() => {
    const category = searchParams.get('category');
    const status = searchParams.get('status');

    if (category && Object.keys(CATEGORY_INFO).includes(category)) {
      setSelectedCategory(category);
    }

    if (status && ['approved', 'pending', 'rejected'].includes(status)) {
      setSelectedStatus(status);
    }
  }, [searchParams]);

  const updateFilters = (status: string, category: string) => {
    const params = new URLSearchParams();
    if (status !== 'all') params.set('status', status);
    if (category !== 'all') params.set('category', category);

    const query = params.toString();
    const newPath = `/aluno/certificado${query ? `?${query}` : ''}`;
    router.push(newPath, { scroll: false });
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    updateFilters(status, selectedCategory);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    updateFilters(selectedStatus, category);
  };

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      CATEGORY_INFO[cert.category]?.label.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || cert.status === selectedStatus;
    const matchesCategory = selectedCategory === 'all' || cert.category === selectedCategory;

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
      {/* MAIN ---------------------------------------------------------------- */}
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
              >
                <RoundedButton text="Novo Certificado" icon={<FaPlusCircle />} />
              </Link>
            </div>

            <BreadCrumb
              breadcrumbInicio="aluno"
              breadcrumbTitle="Certificados"
              breadcrumbIcon={<FaSearch />}
            />
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

            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden border border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-900 sm:pl-6">
                          Título
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-900 hidden sm:table-cell">
                          Categoria
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-900">
                          Horas
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-900 hidden sm:table-cell">
                          Data
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-900">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {filteredCertificates.map((cert) => (
                        <tr key={cert.id} className="hover:bg-gray-50 cursor-pointer">
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {cert.title}
                            <dl className="font-normal sm:hidden">
                              <dt className="sr-only">Categoria</dt>
                              <dd className="mt-1 truncate text-gray-700">
                                {CATEGORY_INFO[cert.category].label}
                              </dd>
                            </dl>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 hidden sm:table-cell">
                            {CATEGORY_INFO[cert.category].label}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                            {cert.hours}h
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 hidden sm:table-cell">
                            {new Date(cert.date).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(cert.status)}`}>
                              {getStatusText(cert.status)}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {filteredCertificates.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                            Nenhum certificado encontrado com os filtros selecionados.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t py-4 text-center text-xs text-gray-500">
        © 2024 Sua Empresa. Todos os direitos reservados.
      </footer>
    </div>
  );
}
