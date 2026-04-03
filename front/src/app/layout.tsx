import type { Metadata } from 'next';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
import 'react-toastify/dist/ReactToastify.css';
import './globals.css';

import ClientProviders from '@/components/ClientProviders';

export const metadata: Metadata = {
  title: 'Hora+',
  description: 'Sistema de gestão de horas discentes — IFPE Campus Belo Jardim'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className="flex flex-col min-h-screen">
        <ClientProviders>
          <main className="flex-1">{children}</main>
        </ClientProviders>
      </body>
    </html>
  );
}
