import type { Metadata } from 'next';

import '@fortawesome/fontawesome-svg-core/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import './globals.css';

import ClientProviders from '@/components/ClientProviders';
import VersionDisplay from '@/components/VersionDisplay';

import { config } from '@fortawesome/fontawesome-svg-core';

config.autoAddCss = false;

export const metadata: Metadata = {
  title: 'Hora Mais',
  description: 'Sistema de gestão de Hora Mais — IFPE Campus Belo Jardim'
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
        <VersionDisplay />
      </body>
    </html>
  );
}
