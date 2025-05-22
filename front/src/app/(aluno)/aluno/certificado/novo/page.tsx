'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaUpload, FaHome, FaFileAlt } from 'react-icons/fa';
import Header from '@/components/Header';
import BreadCrumb from '@/components/BreadCrumb';

const CATEGORIES = [
  'Ensino',
  'Pesquisa',
  'Extensão',
  'Gestão',
  'Monitoria',
  'Iniciação Científica',
];

export default function NovoCertificado() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    institution: '',
    category: '',
    hours: '',
    date: '',
    description: '',
    file: null as File | null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        file: e.target.files![0]
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar envio do formulário
    console.log('Form data:', formData);
    router.push('/aluno/certificado');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F6FA]">

      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-2 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl mb-1">
                Novo Certificado
              </h1>
              <p className="text-gray-600 text-sm">
                Preencha os dados do seu certificado para solicitar a validação.
              </p>
            </div>

            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <FaArrowLeft className="text-base" />
              Voltar
            </button>
          </div>

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

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* INFORMAÇÕES DO CERTIFICADO */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-6 text-[#071D41]">Informações do Certificado</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Título da Atividade <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0F4AA9] focus:ring-[#0F4AA9] sm:text-sm"
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-1">Instituição <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="institution"
                    id="institution"
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0F4AA9] focus:ring-[#0F4AA9] sm:text-sm"
                    value={formData.institution}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea
                  name="description"
                  id="description"
                  rows={2}
                  required
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0F4AA9] focus:ring-[#0F4AA9] sm:text-sm"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Categoria <span className="text-red-500">*</span></label>
                  <select
                    name="category"
                    id="category"
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0F4AA9] focus:ring-[#0F4AA9] sm:text-sm"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="">Selecione uma categoria</option>
                    {CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="hours" className="block text-sm font-medium text-gray-700 mb-1">Carga Horária <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    name="hours"
                    id="hours"
                    required
                    min="1"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0F4AA9] focus:ring-[#0F4AA9] sm:text-sm"
                    value={formData.hours}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            {/* ANEXO DO CERTIFICADO */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-6 text-[#071D41]">Anexo do Certificado</h2>
              <label htmlFor="file" className="flex flex-col items-center justify-center border-2 border-dashed border-[#0F4AA9] rounded-xl py-8 cursor-pointer hover:bg-blue-50 transition mb-2">
                <FaUpload className="text-3xl text-[#0F4AA9] mb-2" />
                <span className="text-gray-700 font-medium">Clique para fazer upload</span>
                <span className="text-xs text-gray-500 mt-1">Apenas arquivos PDF (máx. 5MB)</span>
                <input
                  type="file"
                  name="file"
                  id="file"
                  accept=".pdf"
                  required
                  className="hidden"
                  onChange={handleFileChange}
                />
                {formData.file && (
                  <span className="mt-2 text-xs text-green-600">{formData.file.name}</span>
                )}
              </label>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#0F4AA9] hover:bg-[#0D3F8E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0F4AA9]"
              >
                Enviar Certificado
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="bg-white border-t py-4 text-center text-xs text-gray-500">
        © 2024 Sua Empresa. Todos os direitos reservados.
      </footer>
    </div>
  );
}
