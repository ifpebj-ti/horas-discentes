'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaUpload, FaHome, FaFileAlt } from 'react-icons/fa';
import Header from '@/components/Header';
import BreadCrumb from '@/components/BreadCrumb';
import { Form } from 'react-hook-form';
import FormRegistroHoras from '@/components/FormRegistroHoras/FormRegistroHoras';

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
              <button
                onClick={() => router.back()}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FaArrowLeft className="text-base" />
                Voltar
              </button>

              <BreadCrumb
                items={[
                  {
                    icon: <FaHome className="text-base" />,
                    label: 'Início',
                    href: '/aluno',
                  },
                  {
                    icon: <FaFileAlt className="text-base" />,
                    label: 'Certificados',
                    href: '/aluno/certificado',
                  },
                  {
                    icon: <FaUpload className="text-base" />,
                    label: 'Novo Certificado',
                    href: '/aluno/certificado/novo',
                  },
                ]}
              />
            </div>
          </div>

          {/* Formulário */}
          <FormRegistroHoras
            formData={formData}
            onInputChange={handleInputChange}
            onFileChange={handleFileChange}
            onFormSubmit={handleSubmit}
          />
        </div>
      </main>

      <footer className="bg-white border-t py-4 text-center text-xs text-gray-500">
        © 2024 Sua Empresa. Todos os direitos reservados.
      </footer>
    </div>
  );
}
