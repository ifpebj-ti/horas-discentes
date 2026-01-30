'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

import ReactQueryProvider from '@/lib/react-query-provider';

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </SessionProvider>
  );
}
