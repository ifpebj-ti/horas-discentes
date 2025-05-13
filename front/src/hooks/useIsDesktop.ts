'use client';
import { useEffect, useState } from 'react';

const DESKTOP_BREAKPOINT = 1024;

export const useIsDesktop = (): boolean => {
  const [isDesktop, setIsDesktop] = useState<boolean>(false);

  useEffect(() => {
    const updateMedia = () => {
      setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT);
    };

    updateMedia(); // Executa no carregamento

    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  }, []);

  return isDesktop;
};
