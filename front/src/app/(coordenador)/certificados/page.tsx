'use client';
import React, { useState, useEffect } from 'react';
import {
    FaSearch,
    FaFilePdf,
    FaCheckCircle,
    FaTimesCircle,
    FaHourglassHalf,
    FaRegFileAlt,
    FaHome,
    FaUserGraduate,
    FaInfoCircle,
    FaCalendarAlt,
    FaClock,
    FaWindowClose
} from 'react-icons/fa';
import { CertificateDetailsCard } from '@/components/CertificateDetailsCard';
import { MOCK_COORDENACAO_CERTIFICADOS } from '@/lib/coordenacaoCertificadosMock';
import * as Types from '@/types';
import BreadCrumb from '@/components/BreadCrumb';

const StatusDisplay: React.FC<{ status: Types.StatusCertificado; showText?: boolean }> = ({ status, showText = false }) => {
    switch (status) {
        case 'aprovado':
            return (
                <div className={`flex items-center ${showText ? 'gap-1' : ''}`}>
                    <FaCheckCircle className="text-green-500" title="Aprovado" />
                    {showText && <span className="text-xs text-green-700 font-medium">Aprovado</span>}
                </div>
            );
        case 'rejeitado':
            return (
                <div className={`flex items-center ${showText ? 'gap-1' : ''}`}>
                    <FaTimesCircle className="text-red-500" title="Rejeitado" />
                    {showText && <span className="text-xs text-red-700 font-medium">Rejeitado</span>}
                </div>
            );
        case 'pendente':
            return (
                <div className={`flex items-center ${showText ? 'gap-1' : ''}`}>
                    <FaHourglassHalf className="text-yellow-500" title="Pendente" />
                    {showText && <span className="text-xs text-yellow-700 font-medium">Pendente</span>}
                </div>
            );
        default:
            return null;
    }
};

interface CertificateDetailsModalProps {
    certificado: Types.CertificadoCoordenacao;
    isOpen: boolean;
    onClose: () => void;
    onApprove: () => void;
    onReject: () => void;
    onViewPdf: (url?: string) => void;
    rejectionReason: string;
    onRejectionReasonChange: (value: string) => void;
}

const CertificateDetailsModal: React.FC<CertificateDetailsModalProps> = ({
    certificado,
    isOpen,
    onClose,
    onApprove,
    onReject,
    onViewPdf,
    rejectionReason,
    onRejectionReasonChange
}) => {
    if (!isOpen || !certificado) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end md:items-center z-50 transition-opacity duration-300 ease-in-out" onClick={onClose}>
            <div
                className="bg-white rounded-t-2xl md:rounded-lg shadow-xl w-full md:max-w-md h-[85vh] md:h-auto max-h-[90vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-800">Detalhes do Certificado</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <FaWindowClose size={20} />
                    </button>
                </div>
                <div className="overflow-y-auto flex-grow p-4 overscroll-contain">
                    <CertificateDetailsCard
                        name={certificado.alunoNome}
                        registration={certificado.alunoMatricula}
                        phone={certificado.alunoTelefone}
                        email={certificado.alunoEmail}
                        activity={certificado.descricaoAtividade}
                        category={certificado.categoriaNome}
                        description={certificado.descricaoAtividade}
                        location={certificado.localAtividade}
                        date={certificado.dataAtividade}
                        workload={`${certificado.horas} horas`}
                        rejectionReason={rejectionReason}
                        onRejectionReasonChange={onRejectionReasonChange}
                        onApprove={onApprove}
                        onReject={onReject}
                        onViewPdf={() => onViewPdf(certificado.anexoComprovanteURL)}
                    />
                </div>
            </div>
        </div>
    );
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
    const [isMobileView, setIsMobileView] = useState(
        typeof window !== 'undefined' ? window.innerWidth < 768 : true
    );
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobileView(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (certificadoSelecionado) {
            setMotivoRejeicaoInput(certificadoSelecionado.motivoRejeicao || '');
        } else {
            setMotivoRejeicaoInput('');
            if (isMobileView) setIsDetailsModalOpen(false);
        }
    }, [certificadoSelecionado, isMobileView]);

    const certificadosFiltrados = certificados
        .filter((cert) => filtroStatus === 'todos' || cert.status === filtroStatus)
        .filter(
            (cert) =>
                cert.alunoNome.toLowerCase().includes(termoBusca.toLowerCase()) ||
                (cert.descricaoAtividade && cert.descricaoAtividade.toLowerCase().includes(termoBusca.toLowerCase())) ||
                cert.categoriaNome.toLowerCase().includes(termoBusca.toLowerCase())
        );

    const handleSelectCertificado = (cert: Types.CertificadoCoordenacao) => {
        setCertificadoSelecionado(cert);
        if (isMobileView) {
            setIsDetailsModalOpen(true);
        }
    };

    const closeModal = () => {
        setIsDetailsModalOpen(false);
    };

    const handleApprove = () => {
        if (!certificadoSelecionado) return;
        const id = certificadoSelecionado.id;
        const updatedCertificados = certificados.map((cert) =>
            cert.id === id ? { ...cert, status: 'aprovado' as Types.StatusCertificado, motivoRejeicao: '' } : cert
        );
        setCertificados(updatedCertificados);
        console.log(
            `Certificado ${id} APROVADO. Notificação por email para: ${certificadoSelecionado.alunoEmail}`
        );
        const novoSelecionado = updatedCertificados.find(c => c.id === id);
        setCertificadoSelecionado(novoSelecionado || null);
        if (isMobileView) closeModal();
    };

    const handleReject = () => {
        if (!certificadoSelecionado || !motivoRejeicaoInput.trim()) {
            alert('Por favor, forneça um motivo para a rejeição.');
            return;
        }
        const id = certificadoSelecionado.id;
        const updatedCertificados = certificados.map((cert) =>
            cert.id === id
                ? { ...cert, status: 'rejeitado' as Types.StatusCertificado, motivoRejeicao: motivoRejeicaoInput }
                : cert
        );
        setCertificados(updatedCertificados);
        console.log(
            `Certificado ${id} REJEITADO. Motivo: ${motivoRejeicaoInput}. Notificação por email para: ${certificadoSelecionado.alunoEmail}`
        );
        const novoSelecionado = updatedCertificados.find(c => c.id === id);
        setCertificadoSelecionado(novoSelecionado || null);
        if (isMobileView) closeModal();
    };

    const handleViewPdf = (url?: string) => {
        if (url) {
            window.open(url, '_blank');
        } else {
            alert('Link do PDF não disponível.');
        }
    };

    const breadcrumbItems = [
        { icon: <FaHome className="text-sm" />, label: 'Página Inicial', href: '/coordenador' },
        { icon: <FaRegFileAlt className="text-sm" />, label: 'Validar Certificados', href: '/coordenador/certificados' }
    ];

    const colunasTabelaDesktop = ['ANO', 'PERÍODO', 'CATEGORIA', 'ALUNO', 'HORAS', 'STATUS'];

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <div className="p-4 sm:p-6 bg-white shadow-sm sticky top-0 z-20">
                <BreadCrumb items={breadcrumbItems} />
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mt-2 mb-3 sm:mb-4">Validar Certificados</h1>
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                    <div className="relative flex-grow w-full">
                        <input
                            type="text"
                            placeholder="Buscar por aluno, atividade, categoria..."
                            className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                            value={termoBusca}
                            onChange={(e) => setTermoBusca(e.target.value)}
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    <div className="w-full sm:w-auto sm:min-w-[180px]">
                        <select
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
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

            <div className="flex-grow flex flex-col md:flex-row p-4 sm:p-6 gap-4 sm:gap-6">
                <div className="w-full md:flex-shrink-0 md:w-3/5 lg:w-2/3 md:pr-3">
                    <div className="hidden md:block bg-white shadow-md rounded-lg overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {colunasTabelaDesktop.map((header) => (
                                        <th key={header} className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {certificadosFiltrados.map((cert) => (
                                    <tr
                                        key={cert.id + '-table'}
                                        onClick={() => handleSelectCertificado(cert)}
                                        className={`hover:bg-blue-50 cursor-pointer transition-colors duration-150 ${certificadoSelecionado?.id === cert.id && !isMobileView ? 'bg-blue-100' : ''
                                            }`}
                                    >
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{cert.ano}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{cert.periodo}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                                            <span className="px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {cert.categoriaNome}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 font-medium">{cert.alunoNome}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{cert.horas}h</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                                            <StatusDisplay status={cert.status} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="md:hidden space-y-3">
                        {certificadosFiltrados.map((cert) => (
                            <div
                                key={cert.id + '-card'}
                                onClick={() => handleSelectCertificado(cert)}
                                className={`bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow border-l-4 ${cert.status === 'pendente' ? 'border-l-yellow-400' : cert.status === 'aprovado' ? 'border-l-green-400' : cert.status === 'rejeitado' ? 'border-l-red-400' : 'border-l-gray-300'}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-md font-semibold text-gray-900 truncate pr-2 w-3/4" title={cert.descricaoAtividade}>{cert.descricaoAtividade}</h3>
                                    <StatusDisplay status={cert.status} showText />
                                </div>
                                <div className="text-xs text-gray-700 mb-1 flex items-center">
                                    <FaUserGraduate className="mr-2 text-gray-500 flex-shrink-0" /> {cert.alunoNome}
                                </div>
                                <div className="text-xs text-gray-700 mb-1 flex items-center">
                                    <FaInfoCircle className="mr-2 text-gray-500 flex-shrink-0" /> {cert.categoriaNome} - {cert.horas}h
                                </div>
                                <div className="text-xs text-gray-700 mb-2 flex items-center">
                                    <FaCalendarAlt className="mr-2 text-gray-500 flex-shrink-0" /> {cert.periodo}, {cert.ano}
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleViewPdf(cert.anexoComprovanteURL); }}
                                    className="w-full mt-2 text-sm text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 py-1.5 px-3 rounded-md flex items-center justify-center gap-2 transition-colors"
                                >
                                    <FaFilePdf /> Ver Anexo
                                </button>
                            </div>
                        ))}
                    </div>
                    {certificadosFiltrados.length === 0 && (
                        <div className="text-center py-10 bg-white shadow-md rounded-lg mt-4 md:mt-0">
                            <FaRegFileAlt className="text-4xl text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-900">Nenhum certificado encontrado.</p>
                            <p className="text-sm text-gray-600">Tente ajustar os filtros ou o termo de busca.</p>
                        </div>
                    )}
                </div>

                {!isMobileView && certificadoSelecionado && (
                    <aside id="details-card-desktop" className="w-full md:w-2/5 lg:w-1/3 md:pl-3 md:sticky md:top-28 md:max-h-[calc(100vh-8rem)] md:overflow-y-auto">
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
                            onViewPdf={() => handleViewPdf(certificadoSelecionado.anexoComprovanteURL)}
                        />
                    </aside>
                )}
                {!isMobileView && !certificadoSelecionado && (
                    <aside className="hidden md:flex w-full md:w-2/5 lg:w-1/3 md:pl-3 flex-col items-center justify-center text-center text-gray-500 p-8 h-full bg-white shadow-md rounded-lg">
                        <FaRegFileAlt className="text-5xl mb-4" />
                        <p className="font-semibold text-lg">Nenhum certificado selecionado</p>
                        <p className="text-sm mt-1">Selecione um certificado na lista para ver os detalhes.</p>
                    </aside>
                )}
            </div>

            {isMobileView && certificadoSelecionado && (
                <CertificateDetailsModal
                    certificado={certificadoSelecionado}
                    isOpen={isDetailsModalOpen}
                    onClose={closeModal}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onViewPdf={handleViewPdf}
                    rejectionReason={motivoRejeicaoInput}
                    onRejectionReasonChange={setMotivoRejeicaoInput}
                />
            )}
        </div>
    );
} 