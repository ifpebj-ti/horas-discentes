import React, { ReactNode } from 'react';

interface ParticipationOriginProps {
  origin: string;
  icon: ReactNode;
}

export const ParticipationOrigin: React.FC<ParticipationOriginProps> = ({
  origin,
  icon
}) => {
  return (
    <div className="flex items-center text-sm text-gray-700">
      <span className="mr-2">{icon}</span>
      <span>{origin}</span>
    </div>
  );
};
