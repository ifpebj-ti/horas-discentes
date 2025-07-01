'use client';

import { FaBuilding, FaClock, FaCalendarAlt, FaDownload } from 'react-icons/fa';

interface Certificate {
  id: string;
  title: string;
  local: string;
  description: string;
  hours: number;
  date: string;
  dateEnd: string;
  category: string;
  status: string;
}

interface VerCertificadoProps {
  certificate: Certificate;
}

export default function VerCertificado({ certificate }: VerCertificadoProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovado':
        return 'bg-green-100 text-green-800';
      case 'rejeitado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-4">
        {/* Cabeçalho com título e status */}
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900">
            {certificate.title}
          </h3>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(certificate.status)}`}
          >
            {certificate.status}
          </span>
        </div>

        {/* Descrição */}
        <p className="text-sm text-gray-600">{certificate.description}</p>

        {/* Informações do certificado */}
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <FaBuilding className="text-blue-600" />
            <span>{certificate.local}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <FaClock className="text-blue-600" />
            <span>{certificate.hours} horas</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <FaCalendarAlt className="text-blue-600" />
            <span>
              {formatDate(certificate.date)} - {formatDate(certificate.dateEnd)}
            </span>
          </div>
        </div>

        {/* Tag da categoria */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
            {certificate.category}
          </span>
        </div>

        {/* Botão Ver certificado */}
        <button className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
          <FaDownload />
          Ver certificado
        </button>
      </div>
    </div>
  );
}
