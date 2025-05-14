import React from 'react';
import { FaUserCheck, FaUserTimes } from 'react-icons/fa';

interface UserCardProps {
  name: string;
  registration: string;
  totalHours: number;
  status: 'concluido' | 'em progresso';
  onViewDetails: () => void;
}

export const UserCard: React.FC<UserCardProps> = ({
  name,
  registration,
  totalHours,
  status,
  onViewDetails
}) => {
  const initial = name.charAt(0).toUpperCase();

  const statusConfig = {
    'em progresso': {
      text: 'Em Progresso',
      color: 'text-yellow-600',
      icon: <FaUserTimes className="text-yellow-600" />
    },
    concluido: {
      text: 'Concluído',
      color: 'text-green-600',
      icon: <FaUserCheck className="text-green-600" />
    }
  };

  const { text, color, icon } = statusConfig[status];

  return (
    <div className="bg-white shadow-sm rounded-lg p-4 w-full max-w-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 text-blue-800 rounded-full w-10 h-10 flex items-center justify-center font-bold">
            {initial}
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-800 leading-tight">
              {name}
            </p>
            <p className="text-xs text-gray-500 leading-none">{registration}</p>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-700 mb-2">
        Total de Horas: {totalHours}h
      </p>

      <div
        className={`flex items-center gap-2 text-sm font-medium ${color} mb-4`}
      >
        {icon} <span>{text}</span>
      </div>

      <button
        onClick={onViewDetails}
        className="w-full border border-[#1351B4] text-[#1351B4] py-2 rounded hover:bg-blue-50 text-sm font-semibold"
      >
        Ver Detalhes
      </button>
    </div>
  );
};
