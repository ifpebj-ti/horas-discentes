'use client';

import { useSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react';
import {
  FaSearch,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaRegFileAlt,
  FaHome,
  FaIdCard
} from 'react-icons/fa';

import BreadCrumb from '@/components/BreadCrumb';
import { CertificateDetailsCard } from '@/components/CertificateDetailsCard';
import LoadingOverlay from '@/components/LoadingOverlay';

import { useLoadingOverlay } from '@/hooks/useLoadingOverlay';
import {
  listarCertificadosPorCurso,
  baixarAnexoCertificado,
  StatusCertificado,
  CertificadoPorCursoResponse,
  aprovarCertificado,
  reprovarCertificado
} from '@/services/certificadoService';
import Swal from 'sweetalert2';
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

const StatusIcon: React.FC<{ status: StatusCertificado }> = ({ status }) => {
  switch (status) {
    case 'APROVADO':
      return <FaCheckCircle className="text-green-500" title="Aprovado" />;
    case 'REPROVADO':
      return <FaTimesCircle className="text-red-500" title="Rejeitado" />;
    case 'PENDENTE':
      return <FaHourglassHalf className="text-yellow-500" title="Pendente" />;
    default:
      return null;
  }
};

const formatarData = (inicio: string, fim: string): string => {
  const dataInicio = new Date(inicio);
  const dataFim = new Date(fim);

  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  };

  const inicioFmt = dataInicio.toLocaleDateString('pt-BR', options);
  const fimFmt = dataFim.toLocaleDateString('pt-BR', options);

  return inicioFmt === fimFmt ? inicioFmt : `${inicioFmt} a ${fimFmt}`;
};

export default function ValidacaoCertificadosPage() {
  const isMobile = useIsMobile();
  const { data: session } = useSession();
  const cursoId = session?.user?.cursoId || '';

  const [certificados, setCertificados] = useState<
    CertificadoPorCursoResponse[]
  >([]);
  const [filtroStatus, setFiltroStatus] = useState<StatusCertificado | 'todos'>(
    StatusCertificado.PENDENTE
  );
  const [termoBusca, setTermoBusca] = useState('');
  const [certificadoSelecionado, setCertificadoSelecionado] =
    useState<CertificadoPorCursoResponse | null>(null);

  const { visible, show, hide } = useLoadingOverlay();

  useEffect(() => {
    const fetchCertificados = async () => {
      try {
        if (!cursoId) return;
        show();
        const result = await listarCertificadosPorCurso(cursoId);
        setCertificados(result);
      } catch (error) {
        console.error('Erro ao buscar certificados:', error);
      } finally {
        hide();
      }
    };
    fetchCertificados();
  }, [cursoId, show, hide]);

  const certificadosFiltrados = certificados
    .filter((c) => filtroStatus === 'todos' || c.status === filtroStatus)
    .filter(
      (c) =>
        c.alunoNome.toLowerCase().includes(termoBusca.toLowerCase()) ||
        c.tituloAtividade.toLowerCase().includes(termoBusca.toLowerCase()) ||
        c.categoria.toLowerCase().includes(termoBusca.toLowerCase())
    );

  const handleSelectCertificado = (c: CertificadoPorCursoResponse) =>
    setCertificadoSelecionado(c);

  const handleApprove = async () => {
    if (!certificadoSelecionado) return;

    try {
      show();
      await aprovarCertificado(certificadoSelecionado.id);

      setCertificados((prev) =>
        prev.map((c) =>
          c.id === certificadoSelecionado.id
            ? { ...c, status: StatusCertificado.APROVADO }
            : c
        )
      );

      setCertificadoSelecionado({
        ...certificadoSelecionado,
        status: StatusCertificado.APROVADO
      });

      Swal.fire({
        icon: 'success',
        title: 'Certificado aprovado com sucesso!',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Erro ao aprovar certificado:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao aprovar certificado!',
        text: 'Tente novamente mais tarde.'
      });
    } finally {
      hide();
    }
  };

  const handleReject = async () => {
    if (!certificadoSelecionado) return;

    try {
      show();
      await reprovarCertificado(certificadoSelecionado.id);

      setCertificados((prev) =>
        prev.map((c) =>
          c.id === certificadoSelecionado.id
            ? {
                ...c,
                status: StatusCertificado.REPROVADO
              }
            : c
        )
      );

      setCertificadoSelecionado({
        ...certificadoSelecionado,
        status: StatusCertificado.REPROVADO
      });

      Swal.fire({
        icon: 'success',
        title: 'Certificado reprovado com sucesso!',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Erro ao reprovar certificado:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao reprovar certificado!',
        text: 'Tente novamente mais tarde.'
      });
    } finally {
      hide();
    }
  };

  const handleViewPdf = async (id: string) => {
    try {
      const blob = await baixarAnexoCertificado(id);
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Erro ao baixar PDF:', error);
      alert('Erro ao visualizar o PDF.');
    }
  };

  const showDetailMobile = isMobile && certificadoSelecionado;

  return (
    <div className="flex flex-col h-screen">
      <LoadingOverlay show={visible} />

      <div className="p-6 bg-gray-50">
        <BreadCrumb
          items={[
            { icon: <FaHome />, label: 'Página Inicial', href: '/coordenacao' },
            { icon: <FaIdCard />, label: 'Validar Certificados', href: '' }
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
            <select
              className="w-full p-2 rounded-lg border border-black text-black shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filtroStatus}
              onChange={(e) =>
                setFiltroStatus(e.target.value as StatusCertificado | 'todos')
              }
            >
              <option value="todos">Todos Status</option>
              <option value={StatusCertificado.PENDENTE}>Pendentes</option>
              <option value={StatusCertificado.APROVADO}>Aprovados</option>
              <option value={StatusCertificado.REPROVADO}>Rejeitados</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex-grow flex overflow-hidden">
        <div
          className={`w-full md:w-3/5 lg:w-2/3 p-6 overflow-y-auto ${showDetailMobile ? 'hidden' : ''}`}
        >
          {certificadosFiltrados.length ? (
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    {[
                      'TURMA',
                      'CATEGORIA',
                      'ATIVIDADE',
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
                      className={`hover:bg-gray-100 cursor-pointer ${certificadoSelecionado?.id === c.id ? 'bg-blue-50' : ''}`}
                    >
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {c.periodoTurma}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-2 inline-flex text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {c.categoria}
                        </span>
                      </td>
                      <td
                        className="px-6 py-4 text-sm text-gray-700 truncate max-w-xs"
                        title={c.tituloAtividade}
                      >
                        {c.tituloAtividade}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {c.cargaHoraria}h
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {c.alunoNome}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <StatusIcon status={c.status as StatusCertificado} />
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
                email={certificadoSelecionado.alunoEmail}
                activity={certificadoSelecionado.tituloAtividade}
                category={certificadoSelecionado.categoria}
                description={certificadoSelecionado.tituloAtividade}
                location={certificadoSelecionado.local}
                date={formatarData(
                  certificadoSelecionado.dataInicio,
                  certificadoSelecionado.dataFim
                )}
                workload={`${certificadoSelecionado.cargaHoraria} horas`}
                onApprove={
                  certificadoSelecionado?.status === StatusCertificado.PENDENTE
                    ? handleApprove
                    : undefined
                }
                onReject={
                  certificadoSelecionado?.status === StatusCertificado.PENDENTE
                    ? handleReject
                    : undefined
                }
                onViewPdf={() => handleViewPdf(certificadoSelecionado.id)}
                onBack={
                  isMobile ? () => setCertificadoSelecionado(null) : undefined
                }
              />
            ) : (
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
