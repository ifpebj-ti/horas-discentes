import { ReactNode } from 'react';

interface DashboardCardProps {
  icon: ReactNode;
  label: string;
  notificationCount?: number;
  onClick: () => void;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  icon,
  label,
  notificationCount,
  onClick
}) => {
  return (
    <button
      onClick={onClick}
      className="relative bg-gradient-to-br from-white to-gray-50 shadow-2xl rounded-2xl p-6 flex flex-col
      items-center justify-center w-full h-32 hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:scale-[1.02] transition-all
      duration-300 ease-in-out border border-gray-200"
    >
      {/* Notificação no canto superior direito */}
      {notificationCount !== undefined && notificationCount > 0 && (
        <span className="absolute top-2 right-2 bg-[#0072E3] text-white text-xs w-5 h-5 rounded-full flex
        items-center justify-center shadow-lg z-10">
          {notificationCount}
        </span>
      )}

      {/* Ícone centralizado */}
      <div className="text-[#1351B4] text-3xl mb-2">{icon}</div>

      {/* Texto */}
      <p className="text-sm text-[#1351B4] font-medium mt-2">{label}</p>
    </button>
  );
};
