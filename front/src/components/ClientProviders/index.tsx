'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';

import ReactQueryProvider from '@/lib/react-query-provider';

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ReactQueryProvider>
        {children}
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </ReactQueryProvider>
    </SessionProvider>
  );
}
