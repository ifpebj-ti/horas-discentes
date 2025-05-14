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
      className="relative bg-white shadow-md rounded-md p-6 flex flex-col items-center justify-center w-full h-32 hover:shadow-lg transition cursor-pointer"
    >
      <div className="relative">
        <div className="text-[#1351B4] text-3xl mb-2">{icon}</div>
        {notificationCount !== undefined && notificationCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#0072E3] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {notificationCount}
          </span>
        )}
      </div>
      <p className="text-sm text-[#1351B4] font-medium mt-2">{label}</p>
    </button>
  );
};
