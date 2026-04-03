import * as React from 'react';

import { cn } from '@/lib/utils';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface CardHomeProps {
  title: string;
  icon: IconDefinition;
  indicatorNumber?: number;
  indicatorColor?: string;
  className?: string;
  onClick?: () => void;
}

export function CardHome({
  title,
  icon,
  indicatorNumber,
  indicatorColor = 'bg-red-500',
  className = '',
  onClick
}: CardHomeProps) {
  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        'relative p-10 bg-white border-1 border-gray-100 rounded-sm shadow-md flex flex-col items-center hover:shadow-xl transition-shadow duration-300 ease-in-out',
        onClick ? 'cursor-pointer' : '',
        className
      )}
    >
      {indicatorNumber !== undefined && (
        <div
          className={cn(
            'absolute top-2 right-2 flex items-center justify-center text-sm font-semibold text-white rounded-full w-7 h-7',
            indicatorColor
          )}
        >
          {indicatorNumber}
        </div>
      )}

      <FontAwesomeIcon icon={icon} className="text-3xl text-[#1351B4] mb-3" fixedWidth />
      <h3 className="text-lg font-semibold text-[#1351B4]">{title}</h3>
    </div>
  );
}
