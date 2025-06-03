'use client';
import React, { useState, useEffect } from 'react';
import {
  FaSearch,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaRegFileAlt,
  FaHome
} from 'react-icons/fa';

import BreadCrumb from '@/components/BreadCrumb';
import { CertificateDetailsCard } from '@/components/CertificateDetailsCard';

import { MOCK_COORDENACAO_CERTIFICADOS } from '@/lib/coordenacaoCertificadosMock';
import * as Types from '@/types';

/* ---------- hook para detectar < 768 px ---------- */
const useIsMobile = () => {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const resize = () => setMobile(window.innerWidth < 768);
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return mobile;
};

/* ---------- ícone de status ---------- */
const StatusIcon: React.FC<{ status: Types.StatusCertificado }> = ({
  status
}) => {
  switch (status) {
    case 'aprovado':
      return <FaCheckCircle className="text-green-500" title="Aprovado" />;
    case 'rejeitado':
      return <FaTimesCircle className="text-red-500" title="Rejeitado" />;
    case 'pendente':
      return <FaHourglassHalf className="text-yellow-500" title="Pendente" />;
    default:
      return null;
  }
};

export default function ValidacaoCertificadosPage() {
  const isMobile = useIsMobile();

  const [certificados, setCertificados] = useState<
    Types.CertificadoCoordenacao[]
  >(MOCK_COORDENACAO_CERTIFICADOS);
  const [filtroStatus, setFiltroStatus] = useState<
    Types.StatusCertificado | 'todos'
  >('pendente');
  const [termoBusca, setTermoBusca] = useState('');
  const [certificadoSelecionado, setCertificadoSelecionado] =
    useState<Types.CertificadoCoordenacao | null>(null);
  const [motivoRejeicaoInput, setMotivoRejeicaoInput] = useState('');

  /* ---------- sincroniza motivo de rejeição ---------- */
  useEffect(() => {
    setMotivoRejeicaoInput(certificadoSelecionado?.motivoRejeicao ?? '');
  }, [certificadoSelecionado]);

  /* ---------- filtros ---------- */
  const certificadosFiltrados = certificados
    .filter((c) => filtroStatus === 'todos' || c.status === filtroStatus)
    .filter(
      (c) =>
        c.alunoNome.toLowerCase().includes(termoBusca.toLowerCase()) ||
        c.descricaoAtividade.toLowerCase().includes(termoBusca.toLowerCase()) ||
        c.categoriaNome.toLowerCase().includes(termoBusca.toLowerCase())
    );

  /* ---------- handlers principais ---------- */
  const handleSelectCertificado = (c: Types.CertificadoCoordenacao) =>
    setCertificadoSelecionado(c);

  const handleApprove = () => {
    if (!certificadoSelecionado) return;
    const id = certificadoSelecionado.id;
    setCertificados((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: 'aprovado', motivoRejeicao: '' } : c
      )
    );
    setCertificadoSelecionado({
      ...certificadoSelecionado,
      status: 'aprovado',
      motivoRejeicao: ''
    });
  };

  const handleReject = () => {
    if (!certificadoSelecionado || !motivoRejeicaoInput.trim()) {
      alert('Por favor, forneça um motivo para a rejeição.');
      return;
    }
    const id = certificadoSelecionado.id;
    setCertificados((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: 'rejeitado', motivoRejeicao: motivoRejeicaoInput }
          : c
      )
    );
    setCertificadoSelecionado({
      ...certificadoSelecionado,
      status: 'rejeitado',
      motivoRejeicao: motivoRejeicaoInput
    });
  };

  const handleViewPdf = (url?: string) =>
    url ? window.open(url, '_blank') : alert('Link do PDF não disponível.');

  /* ---------- flags para esconder/mostrar ---------- */
  const showDetailMobile = isMobile && certificadoSelecionado;

  return (
    <div className="flex flex-col h-screen">
      {/* ---------- cabeçalho ---------- */}
      <div className="p-6 bg-gray-50">
        <BreadCrumb
          items={[
            { icon: <FaHome />, label: 'Página Inicial', href: '/coordenacao' },
            { icon: null, label: 'Validar Certificados', href: '' }
          ]}
        />
        <div className="mt-4 flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-grow w-full sm:w-auto">
            <input
              type="text"
              placeholder="Buscar por aluno, atividade, categoria..."
              className="w-full p-3 pl-10 border text-black border-black rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <div className="w-full sm:w-auto">
            {/* … cabeçalho omitido para focar no ponto alterado … */}
            <select
              className="w-full p-2 rounded-lg border border-black text-black shadow-sm bg-white
             focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filtroStatus}
              onChange={(e) =>
                setFiltroStatus(
                  e.target.value as Types.StatusCertificado | 'todos'
                )
              }
            >
              <option value="todos">Todos Status</option>
              <option value="pendente">Pendentes</option>
              <option value="aprovado">Aprovados</option>
              <option value="rejeitado">Rejeitados</option>
            </select>
          </div>
        </div>
      </div>

      {/* ---------- conteúdo ---------- */}
      <div className="flex-grow flex overflow-hidden">
        {/* LISTA  (esconde se um item estiver aberto no mobile) */}
        <div
          className={`w-full md:w-3/5 lg:w-2/3 p-6 overflow-y-auto ${
            showDetailMobile ? 'hidden' : ''
          }`}
        >
          {certificadosFiltrados.length ? (
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    {[
                      'ANO',
                      'PERÍODO',
                      'CATEGORIA',
                      'DESCRIÇÃO',
                      'HORAS',
                      'ALUNO',
                      'STATUS'
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {certificadosFiltrados.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => handleSelectCertificado(c)}
                      className={`hover:bg-gray-100 cursor-pointer ${
                        certificadoSelecionado?.id === c.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {c.ano}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {c.periodo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {c.categoriaNome}
                        </span>
                      </td>
                      <td
                        className="px-6 py-4 max-w-xs text-sm text-gray-700 truncate"
                        title={c.descricaoAtividade}
                      >
                        {c.descricaoAtividade}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {c.horas}h
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {c.alunoNome}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <StatusIcon status={c.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">
                Nenhum certificado encontrado para os filtros aplicados.
              </p>
            </div>
          )}
        </div>

        {/* DETALHES  (desktop ➜ lateral | mobile ➜ overlay) */}
        {(certificadoSelecionado || !isMobile) && (
          <aside
            className={
              isMobile
                ? 'fixed inset-0 z-40 bg-gray-50 p-6 overflow-y-auto'
                : 'w-full md:w-2/5 lg:w-1/3 p-6 bg-gray-50 border-l border-gray-200 overflow-y-auto'
            }
          >
            {certificadoSelecionado ? (
              <CertificateDetailsCard
                name={certificadoSelecionado.alunoNome}
                registration={certificadoSelecionado.alunoMatricula}
                phone={certificadoSelecionado.alunoTelefone}
                email={certificadoSelecionado.alunoEmail}
                activity={certificadoSelecionado.descricaoAtividade}
                category={certificadoSelecionado.categoriaNome}
                description={certificadoSelecionado.descricaoAtividade}
                location={certificadoSelecionado.localAtividade}
                date={certificadoSelecionado.dataAtividade}
                workload={`${certificadoSelecionado.horas} horas`}
                rejectionReason={motivoRejeicaoInput}
                onRejectionReasonChange={setMotivoRejeicaoInput}
                onApprove={handleApprove}
                onReject={handleReject}
                onViewPdf={() =>
                  handleViewPdf(certificadoSelecionado.anexoComprovanteURL)
                }
                onBack={
                  isMobile ? () => setCertificadoSelecionado(null) : undefined
                }
              />
            ) : (
              /* Só mostra aviso quando desktop */
              !isMobile && (
                <div className="flex flex-col items-center justify-center text-center text-gray-500 p-8 h-full">
                  <FaRegFileAlt className="text-5xl mb-4 text-gray-400" />
                  <p className="font-semibold text-lg">
                    Nenhum certificado selecionado
                  </p>
                  <p className="text-sm mt-1">
                    Clique em um certificado na lista para visualizar os
                    detalhes e realizar ações.
                  </p>
                </div>
              )
            )}
          </aside>
        )}
      </div>
    </div>
  );
}
