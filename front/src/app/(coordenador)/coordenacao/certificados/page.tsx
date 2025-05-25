'use client';
import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilePdf, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaRegFileAlt } from 'react-icons/fa';
import { CertificateDetailsCard } from '@/components/CertificateDetailsCard';
import { MOCK_COORDENACAO_CERTIFICADOS } from '@/lib/coordenacaoCertificadosMock';
import * as Types from '@/types';
import BreadCrumb from '@/components/BreadCrumb'; // Supondo que você tenha BreadCrumb
import { FaHome } from 'react-icons/fa'; // Para o BreadCrumb

// Componente para o ícone de status
const StatusIcon: React.FC<{ status: Types.StatusCertificado }> = ({ status }) => {
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
    const [certificados, setCertificados] = useState<Types.CertificadoCoordenacao[]>(
        MOCK_COORDENACAO_CERTIFICADOS
    );
    const [filtroStatus, setFiltroStatus] = useState<Types.StatusCertificado | 'todos'>(
        'pendente'
    );
    const [termoBusca, setTermoBusca] = useState('');
    const [certificadoSelecionado, setCertificadoSelecionado] =
        useState<Types.CertificadoCoordenacao | null>(null);
    const [motivoRejeicaoInput, setMotivoRejeicaoInput] = useState('');

    useEffect(() => {
        // Se um certificado estiver selecionado, atualize o motivoRejeicaoInput com o dele
        if (certificadoSelecionado) {
            setMotivoRejeicaoInput(certificadoSelecionado.motivoRejeicao || '');
        } else {
            setMotivoRejeicaoInput(''); // Limpa se nenhum selecionado
        }
    }, [certificadoSelecionado]);

    const certificadosFiltrados = certificados
        .filter((cert) => filtroStatus === 'todos' || cert.status === filtroStatus)
        .filter(
            (cert) =>
                cert.alunoNome.toLowerCase().includes(termoBusca.toLowerCase()) ||
                cert.descricaoAtividade.toLowerCase().includes(termoBusca.toLowerCase()) ||
                cert.categoriaNome.toLowerCase().includes(termoBusca.toLowerCase())
        );

    const handleSelectCertificado = (cert: Types.CertificadoCoordenacao) => {
        setCertificadoSelecionado(cert);
    };

    const handleApprove = () => {
        if (!certificadoSelecionado) return;
        const id = certificadoSelecionado.id;
        setCertificados((prev) =>
            prev.map((cert) =>
                cert.id === id ? { ...cert, status: 'aprovado', motivoRejeicao: '' } : cert
            )
        );
        console.log(
            `Certificado ${id} APROVADO. Notificação por email para: ${certificadoSelecionado.alunoEmail}`
        );
        setCertificadoSelecionado((prev) => prev ? { ...prev, status: 'aprovado', motivoRejeicao: '' } : null);
        // Idealmente, fecharia o card de detalhes ou atualizaria a lista para remover/mover o aprovado
    };

    const handleReject = () => {
        if (!certificadoSelecionado || !motivoRejeicaoInput.trim()) {
            alert('Por favor, forneça um motivo para a rejeição.');
            return;
        }
        const id = certificadoSelecionado.id;
        setCertificados((prev) =>
            prev.map((cert) =>
                cert.id === id
                    ? { ...cert, status: 'rejeitado', motivoRejeicao: motivoRejeicaoInput }
                    : cert
            )
        );
        console.log(
            `Certificado ${id} REJEITADO. Motivo: ${motivoRejeicaoInput}. Notificação por email para: ${certificadoSelecionado.alunoEmail}`
        );
        setCertificadoSelecionado((prev) => prev ? { ...prev, status: 'rejeitado', motivoRejeicao: motivoRejeicaoInput } : null);
    };

    const handleViewPdf = (url?: string) => {
        if (url) {
            window.open(url, '_blank');
        } else {
            alert('Link do PDF não disponível.');
        }
    };

    return (
        <div className="flex flex-col h-screen">
            <div className="p-6 bg-gray-50">
                <BreadCrumb
                    items={[
                        { icon: <FaHome />, label: 'Página Inicial', href: '/coordenador' },
                        { icon: null, label: 'Validar Certificados', href: '' }
                    ]}
                />
                <h1 className="text-2xl font-semibold text-gray-800 mt-2 mb-6">Validar Certificados</h1>

                <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
                    <div className="relative flex-grow w-full sm:w-auto">
                        <input
                            type="text"
                            placeholder="Buscar por aluno, atividade, categoria..."
                            className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={termoBusca}
                            onChange={(e) => setTermoBusca(e.target.value)}
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    <div className="w-full sm:w-auto">
                        <select
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            value={filtroStatus}
                            onChange={(e) =>
                                setFiltroStatus(e.target.value as Types.StatusCertificado | 'todos')
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

            <div className="flex-grow flex overflow-hidden">
                {/* Coluna da Lista de Certificados */}
                <div className="w-full md:w-3/5 lg:w-2/3 p-6 overflow-y-auto">
                    {certificadosFiltrados.length > 0 ? (
                        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        {['ANO', 'PERÍODO', 'CATEGORIA', 'DESCRIÇÃO', 'HORAS', 'ALUNO', 'STATUS', 'CERTIFICADO'].map((header) => (
                                            <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {certificadosFiltrados.map((cert) => (
                                        <tr
                                            key={cert.id}
                                            onClick={() => handleSelectCertificado(cert)}
                                            className={`hover:bg-gray-100 cursor-pointer ${certificadoSelecionado?.id === cert.id ? 'bg-blue-50' : ''
                                                }`}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{cert.ano}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{cert.periodo}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {cert.categoriaNome}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 max-w-xs text-sm text-gray-700 truncate" title={cert.descricaoAtividade}>{cert.descricaoAtividade}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{cert.horas}h</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{cert.alunoNome}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <StatusIcon status={cert.status} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800">
                                                <button onClick={(e) => { e.stopPropagation(); handleViewPdf(cert.anexoComprovanteURL); }} className="flex items-center gap-1">
                                                    <FaFilePdf /> Ver Certificado
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-gray-500">Nenhum certificado encontrado para os filtros aplicados.</p>
                        </div>
                    )}
                </div>

                {/* Coluna de Detalhes do Certificado */}
                <aside className="w-full md:w-2/5 lg:w-1/3 p-6 bg-gray-50 border-l border-gray-200 overflow-y-auto">
                    {certificadoSelecionado ? (
                        <CertificateDetailsCard
                            name={certificadoSelecionado.alunoNome}
                            registration={certificadoSelecionado.alunoMatricula}
                            phone={certificadoSelecionado.alunoTelefone}
                            email={certificadoSelecionado.alunoEmail}
                            activity={certificadoSelecionado.descricaoAtividade} // Usando descricaoAtividade para activity
                            category={certificadoSelecionado.categoriaNome} // Usando categoriaNome para category
                            description={certificadoSelecionado.descricaoAtividade} // Pode ser um campo mais detalhado se existir
                            location={certificadoSelecionado.localAtividade}
                            date={certificadoSelecionado.dataAtividade}
                            workload={`${certificadoSelecionado.horas} horas`}
                            rejectionReason={motivoRejeicaoInput}
                            onRejectionReasonChange={setMotivoRejeicaoInput}
                            onApprove={handleApprove}
                            onReject={handleReject}
                            onViewPdf={() => handleViewPdf(certificadoSelecionado.anexoComprovanteURL)}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center text-gray-500 p-8 h-full">
                            <FaRegFileAlt className="text-5xl mb-4 text-gray-400" />
                            <p className="font-semibold text-lg">Nenhum certificado selecionado</p>
                            <p className="text-sm mt-1">
                                Clique em um certificado na lista para visualizar os detalhes e realizar ações.
                            </p>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
}
