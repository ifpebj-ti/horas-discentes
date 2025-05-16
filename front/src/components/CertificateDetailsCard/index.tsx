import React from 'react';
import {
  FaEnvelope,
  FaPhoneAlt,
  FaCalendarAlt,
  FaEye,
  FaMapMarkerAlt,
  FaRegFileAlt
} from 'react-icons/fa';

import { ParticipationOrigin } from '@/components/ParticipationOrigin';

interface CertificateDetailsProps {
  name: string;
  registration: string;
  phone: string;
  email: string;
  activity: string;
  category: string;
  description: string;
  location: string;
  date: string;
  workload: string;
  rejectionReason: string;
  onRejectionReasonChange: (value: string) => void;
  onApprove: () => void;
  onReject: () => void;
  onViewPdf: () => void;
}

export const CertificateDetailsCard: React.FC<
  CertificateDetailsProps | null
> = (props) => {
  if (!props) {
    return (
      <div className="flex flex-col items-center justify-center text-center text-gray-500 p-8">
        <FaRegFileAlt className="text-4xl mb-2" />
        <p className="font-semibold">Nenhum certificado selecionado</p>
        <p className="text-sm">
          Selecione um certificado para visualizar os detalhes
        </p>
      </div>
    );
  }

  const {
    name,
    registration,
    phone,
    email,
    activity,
    category,
    description,
    location,
    date,
    workload,
    rejectionReason,
    onRejectionReasonChange,
    onApprove,
    onReject,
    onViewPdf
  } = props;

  return (
    <div className="rounded-lg p-6 bg-white shadow-md max-w-2xl md:min-w-xl w-full mx-auto">
      <h2 className="text-lg font-semibold mb-4">Detalhes do Certificado</h2>

      <div className="mb-4">
        <p className="font-semibold text-sm">Aluno</p>
        <p className="text-sm text-gray-700 font-medium">{name}</p>
        <p className="text-sm">
          Matrícula: <span className="text-gray-700">{registration}</span>
        </p>
      </div>

      <div className="flex flex-col gap-1 text-sm mb-4">
        <div className="flex items-center gap-2 text-gray-700">
          <FaPhoneAlt className="text-gray-500" />{' '}
          <span className="text-gray-700">{phone}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <FaEnvelope className="text-gray-500" />{' '}
          <span className="text-gray-700">{email}</span>
        </div>
      </div>

      <hr className="my-6 border-t border-gray-200" />

      <div className="text-sm mb-4">
        <p>
          <span className="font-semibold">Atividade</span>
          <br />
          <span className="text-gray-700">{activity}</span>
        </p>
        <p className="mt-2">
          <span className="font-semibold">Categoria</span>
          <br />
          <span className="text-gray-700">{category}</span>
        </p>
        <p className="mt-2">
          <span className="font-semibold">Descrição</span>
          <br />
          <span className="text-gray-700">{description}</span>
        </p>
        <div className="mt-2">
          <ParticipationOrigin
            origin={location}
            icon={<FaMapMarkerAlt className="text-gray-500" />}
          />
        </div>
        <div className="mt-1">
          <ParticipationOrigin
            origin={date}
            icon={<FaCalendarAlt className="text-gray-500" />}
          />
        </div>
        <p className="mt-2">
          <span className="font-semibold">Carga Horária</span>
          <br />
          <span className="text-gray-700">{workload}</span>
        </p>
      </div>

      <button
        onClick={onViewPdf}
        className="w-full border border-[#1351B4] text-[#1351B4] flex items-center justify-center gap-2 py-2 rounded mb-4 hover:bg-blue-50 transition"
      >
        <FaEye /> Visualizar PDF
      </button>

      <textarea
        placeholder="Motivo da rejeição (obrigatório para rejeitar)"
        value={rejectionReason}
        onChange={(e) => onRejectionReasonChange(e.target.value)}
        className="w-full border border-gray-300 rounded-md p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 mb-4"
      />

      <div className="flex flex-col md:flex-row justify-between gap-4">
        <button
          onClick={onReject}
          className="bg-white text-red-600 border border-red-600 px-4 py-2 rounded flex items-center justify-center gap-2 hover:bg-red-50 transition w-full"
        >
          <span className="text-lg">&#10006;</span> Rejeitar
        </button>

        <button
          onClick={onApprove}
          className="bg-green-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2 hover:bg-green-700 transition w-full"
        >
          <span className="text-lg">&#10004;</span> Aprovar
        </button>
      </div>
    </div>
  );
};
