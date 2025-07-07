'use client';

import { Atom } from 'react-loading-indicators';

interface Props {
  show: boolean;
}

export default function LoadingOverlay({ show }: Props) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70">
      <div className="flex flex-col items-center space-y-3">
        <Atom color="#32cd32" size="medium" />
        <span className="text-[#555] text-sm font-medium">Carregando...</span>
      </div>
    </div>
  );
}
