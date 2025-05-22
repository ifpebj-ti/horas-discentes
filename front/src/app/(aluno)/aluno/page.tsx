'use client';
import Link from 'next/link';
import { FaHome, FaPlusCircle } from 'react-icons/fa';
import BreadCrumb from '@/components/BreadCrumb';
import ProgressSummary from '@/components/Student/ProgressSummary';
import StatsSummary from '@/components/Student/StatsSummary';
import { SOFTWARE_ENGINEERING_REQUIREMENTS, CATEGORY_INFO } from '@/types';
import { RoundedButton } from '@/components/RoundedButton';
import ProgressoGeral from '@/components/ProgressoGeral';

const MOCK_CERTIFICATES = [
  { id: '1', status: 'aprovado', hours: 10, category: 'extension' },
  { id: '2', status: 'pendente', hours: 5, category: 'research' },
  { id: '3', status: 'aprovado', hours: 8, category: 'academic' },
  { id: '4', status: 'rejeitado', hours: 12, category: 'extension' }
];

export default function Aluno() {
  const certificates = MOCK_CERTIFICATES;

  const total = certificates.length;
  const approved = certificates.filter(c => c.status === 'aprovado').length;
  const pending = certificates.filter(c => c.status === 'pendente').length;
  const rejected = certificates.filter(c => c.status === 'rejeitado').length;

  // Filtrar apenas certificados aprovados
  const approvedCertificates = certificates.filter(c => c.status === 'aprovado');

  // Mapear categorias para ProgressoGeral
  const categorias = SOFTWARE_ENGINEERING_REQUIREMENTS.categories.map(cat => ({
    nome: cat.label,
    horas: approvedCertificates
      .filter(c => c.category === cat.category)
      .reduce((acc, c) => acc + c.hours, 0),
    total: cat.maxHours,
    categoriaKey: cat.category // chave para montar o link
  }));


  // total de horas aprovadas somadas
  const totalHoras = categorias.reduce((acc, cat) => acc + cat.horas, 0);

  // total horas exigidas no curso
  const totalNecessarias = SOFTWARE_ENGINEERING_REQUIREMENTS.totalHoursRequired;

  return (
    <div className="min-h-screen flex flex-col">
      {/* MAIN ---------------------------------------------------------------- */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl mb-1">
                Olá, Aluno!
              </h1>
              <p className="text-sm">
                Bem-vindo ao Horas Discentes. Acompanhe suas atividades complementares.
              </p>
            </div>

            <Link
              href="/aluno/certificado/novo"
            >
              <RoundedButton text="Novo Certificado" icon={<FaPlusCircle />} />
            </Link>
          </div>

          <BreadCrumb
            items={[
              {
                icon: <FaHome className="text-base" />,
                label: 'Início',
                href: '/aluno'
              }
            ]}
          />

          <div
            className="grid gap-10 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"
          >
            {/* COLUNA PRINCIPAL ------------------------------------------------ */}
            <section className="space-y-8">
              {/* Progresso Geral ---------------------------------------------- */}
              <ProgressoGeral
                categorias={categorias}
                totalHoras={totalHoras}
                totalNecessarias={totalNecessarias}
              />

              {/* Certificados recentes ------------------------------------- */}
              <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[#071D41]">Certificados Recentes</h2>
                  <Link
                    href="/aluno/certificado"
                    className="text-sm font-medium text-[#0F4AA9] hover:underline hover:text-[#0D3F8E] transition-colors"
                  >
                    Ver todos
                  </Link>
                </div>

                {certificates.length ? (
                  <ul className="divide-y divide-gray-100">
                    {certificates.slice(0, 1).map(cert => (
                      <li key={cert.id} className="py-4 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 rounded-full bg-[#0F4AA9]"></div>
                          <span className="text-gray-900 font-medium">{CATEGORY_INFO[cert.category].label}</span>
                        </div>
                        <span className="font-semibold text-[#0F4AA9] bg-blue-50 px-3 py-1 rounded-full text-sm">
                          {cert.hours} h
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="py-8 text-center bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-sm">
                      Ainda não há certificados enviados.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* COLUNA LATERAL -------------------------------------------------- */}
            {/* <aside className="space-y-8">
              <StatsSummary
                total={total}
                approved={approved}
                pending={pending}
                rejected={rejected}
              />

              <div className="bg-blue-50/60 border border-blue-100 rounded-2xl shadow-sm p-6">
                <h2 className="text-md font-semibold text-[#071D41] mb-4">
                  Dúvidas Frequentes
                </h2>
                <ul className="space-y-3 text-sm leading-relaxed">
                  {[
                    'Como são contabilizadas as horas?',
                    'Quais atividades são aceitas?',
                    'Qual o prazo para envio de certificados?',
                    'Como saber se meu certificado foi aprovado?',
                  ].map(q => (
                    <li key={q}>
                      <button
                        type="button"
                        className="text-[#0F4AA9] hover:underline transition-colors bg-transparent border-none p-0 cursor-pointer"
                      >
                        {q}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </aside> */}
          </div>
        </div>
      </main>

      {/* FOOTER -------------------------------------------------------------- */}
      <footer className="bg-white border-t py-4 text-center text-xs text-gray-500">
        © 2024 Sua Empresa. Todos os direitos reservados.
      </footer>
    </div>
  );
}
