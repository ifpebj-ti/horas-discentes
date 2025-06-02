'use client';
import React from 'react';
import {
  FaEnvelope,
  FaPhoneAlt,
  FaCalendarAlt,
  FaEye,
  FaMapMarkerAlt,
  FaRegFileAlt
} from 'react-icons/fa';

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
  /** ➊ Chamado quando o usuário quer voltar para a lista (só usado no mobile) */
  onBack?: () => void;
}

export const CertificateDetailsCard: React.FC<CertificateDetailsProps | null> = (
  props
) => {
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
    onViewPdf,
    onBack // ➋
  } = props;

  return (
    <div className="rounded-lg bg-white w-full">
      <div className="space-y-4">
        {/* ➌ Botão ← Voltar visível só em telas < md */}
        {onBack && (
          <button
            onClick={onBack}
            className="md:hidden text-blue-600 mb-2 flex items-center gap-2"
          >
            ← Voltar
          </button>
        )}

        <div className="mb-4">
          <p className="font-semibold text-sm">Aluno</p>
          <p className="text-sm text-gray-700 font-medium">{name}</p>
          <p className="text-sm">
            Matrícula: <span className="text-gray-700">{registration}</span>
          </p>
        </div>

        <div className="flex flex-col gap-1 text-sm">
          <div className="flex items-center gap-2 text-gray-700">
            <FaPhoneAlt className="text-gray-500" />
            <span className="text-gray-700">{phone}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <FaEnvelope className="text-gray-500" />
            <span className="text-gray-700">{email}</span>
          </div>
        </div>

        <hr className="my-4 border-t border-gray-200" />

        <div className="space-y-3">
          <div>
            <span className="font-semibold text-sm">Atividade</span>
            <p className="text-sm text-gray-700 mt-1">{activity}</p>
          </div>

          <div>
            <span className="font-semibold text-sm">Categoria</span>
            <p className="text-sm text-gray-700 mt-1">{category}</p>
          </div>

          <div>
            <span className="font-semibold text-sm">Descrição</span>
            <p className="text-sm text-gray-700 mt-1">{description}</p>
          </div>

          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-gray-500" />
            <span className="text-sm text-gray-700">{location}</span>
          </div>

          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-gray-500" />
            <span className="text-sm text-gray-700">{date}</span>
          </div>

          <div>
            <span className="font-semibold text-sm">Carga Horária</span>
            <p className="text-sm text-gray-700 mt-1">{workload}</p>
          </div>
        </div>

        <button
          onClick={onViewPdf}
          className="w-full mt-4 border border-[#1351B4] text-[#1351B4] flex items-center justify-center gap-2 py-2 rounded hover:bg-blue-50 transition"
        >
          <FaEye /> Visualizar PDF
        </button>

        <textarea
          placeholder="Motivo da rejeição (obrigatório para rejeitar)"
          value={rejectionReason}
          onChange={(e) => onRejectionReasonChange(e.target.value)}
          className="w-full mt-4 border border-gray-300 rounded-md p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 h-24"
        />

        <div className="flex flex-col gap-2 mt-4">
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
    </div>
  );
};
