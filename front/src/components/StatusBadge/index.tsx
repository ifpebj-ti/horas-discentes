import React from 'react';

export type StatusType = 'aprovado' | 'pendente' | 'rejeitado';

interface StatusBadgeProps {
  status?: StatusType;
  defaultText?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  defaultText
}) => {
  const statusConfig: Record<
    StatusType,
    { label: string; bg: string; text: string }
  > = {
    aprovado: {
      label: 'Aprovado',
      bg: 'bg-green-100',
      text: 'text-green-800'
    },
    pendente: {
      label: 'Pendente',
      bg: 'bg-yellow-100',
      text: 'text-yellow-800'
    },
    rejeitado: {
      label: 'Rejeitado',
      bg: 'bg-red-100',
      text: 'text-red-800'
    }
  };

  if (status) {
    const { label, bg, text } = statusConfig[status];
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-semibold ${bg} ${text}`}
      >
        {label}
      </span>
    );
  }

  // Se não tiver status definido ele vai para o texto que for passado
  return (
    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
      {defaultText}
    </span>
  );
};
