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
      className="relative bg-white border border-gray-100 rounded-sm shadow-md p-10 flex flex-col items-center justify-center w-full hover:shadow-xl transition-shadow duration-300 ease-in-out cursor-pointer"
    >
      {notificationCount !== undefined && notificationCount > 0 && (
        <span className="absolute top-2 right-2 flex items-center justify-center text-sm font-semibold text-white rounded-full w-7 h-7 bg-red-500">
          {notificationCount}
        </span>
      )}

      <div className="text-3xl text-[#1351B4] mb-3">{icon}</div>

      <p className="text-lg font-semibold text-[#1351B4]">{label}</p>
    </button>
  );
};
