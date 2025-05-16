import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  size?: 'sm' | 'md' | 'lg';
  colorClass?: string;
  showPercentage?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  size = 'md',
  colorClass = 'bg-[#1351B4]',
  showPercentage = true,
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  const height = size === 'lg' ? 'h-4' : size === 'sm' ? 'h-2' : 'h-3';

  return (
    <div className="w-full bg-gray-200 rounded-full overflow-hidden">
      <div
        className={`${height} ${colorClass} transition-all duration-300`}
        style={{ width: `${percentage}%` }}
      />
      {showPercentage && (
        <div className="text-right text-sm text-gray-600 mt-1">
          {percentage.toFixed(0)}%
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
