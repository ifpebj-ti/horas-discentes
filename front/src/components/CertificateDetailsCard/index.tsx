'use client';
import React from 'react';
import {
  FaEnvelope,
  FaCalendarAlt,
  FaEye,
  FaMapMarkerAlt,
  FaRegFileAlt,
  FaCheck,
  FaTimes
} from 'react-icons/fa';

interface CertificateDetailsProps {
  name: string;
  registration: string;
  email: string;
  activity: string;
  category: string;
  description: string;
  location: string;
  date: string;
  workload: string;
  onApprove?: () => void;
  onReject?: () => void;
  onViewPdf: () => void;
  onBack?: () => void;
}

export const CertificateDetailsCard: React.FC<
  CertificateDetailsProps | undefined
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
    email,
    activity,
    category,
    description,
    location,
    date,
    workload,
    onApprove,
    onReject,
    onViewPdf,
    onBack
  } = props;

  const labelCls = 'text-sm font-semibold !text-black !opacity-100';

  return (
    <div className="rounded-lg w-full">
      <div className="space-y-4">
        {onBack && (
          <button
            onClick={onBack}
            className="md:hidden text-blue-600 mb-2 flex items-center gap-2"
          >
            ← Voltar
          </button>
        )}

        {/* Aluno */}
        <div className="mb-4">
          <div className="flex gap-1">
            <p className={labelCls}>Aluno: </p>
            <p className="text-sm text-gray-700 font-medium">{name}</p>
          </div>

          <p className="text-sm text-black font-semibold">
            Matrícula: <span className="text-gray-700">{registration}</span>
          </p>
        </div>

        <div className="flex flex-col gap-1 text-sm">
          <div className="flex items-center gap-2 text-gray-700">
            <FaEnvelope className="text-gray-500" />
            <span>{email}</span>
          </div>
        </div>

        <hr className="my-4 border-t border-gray-200" />

        {/* Atividade */}
        <div className="space-y-3">
          <div>
            <p className={labelCls}>Atividade</p>
            <p className="text-sm text-gray-900 mt-1">{activity}</p>
          </div>

          <div>
            <p className={labelCls}>Categoria</p>
            <p className="text-sm text-gray-900 mt-1">{category}</p>
          </div>

          <div>
            <p className={labelCls}>Descrição</p>
            <p className="text-sm text-gray-900 mt-1">{description}</p>
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
            <p className={labelCls}>Carga Horária</p>
            <p className="text-sm text-gray-900 mt-1">{workload}</p>
          </div>
        </div>

        {/* Visualizar PDF */}
        <button
          onClick={onViewPdf}
          className="w-full mt-4 border border-[#1351B4] text-[#1351B4]
                   flex items-center justify-center gap-2 py-2 rounded
                   hover:bg-blue-50 transition cursor-pointer"
        >
          <FaEye /> Visualizar PDF
        </button>

        {/* Ações (somente se for pendente) */}
        {(onApprove || onReject) && (
          <>
            <hr className="my-4 border-t border-gray-200" />
            <div className="flex flex-col gap-2 mt-4">
              {onReject && (
                <button
                  onClick={onReject}
                  className="bg-white text-red-600 border border-red-600 px-4 py-2 rounded
                             flex items-center justify-center gap-2 hover:bg-red-50 transition w-full cursor-pointer"
                >
                  <FaTimes /> Rejeitar
                </button>
              )}

              {onApprove && (
                <button
                  onClick={onApprove}
                  className="bg-green-600 text-white px-4 py-2 rounded
                             flex items-center justify-center gap-2 hover:bg-green-700 transition w-full cursor-pointer"
                >
                  <FaCheck /> Aprovar
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CertificateDetailsCard;
