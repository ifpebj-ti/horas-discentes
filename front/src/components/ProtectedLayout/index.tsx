'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { Atom } from 'react-loading-indicators';

interface ProtectedLayoutProps {
  children: ReactNode;
  allowedRoles: string[];
}

export default function ProtectedLayout({
  children,
  allowedRoles
}: ProtectedLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Se carregou e está autenticado
    if (status === 'authenticated') {
      const role = session?.user.role;
      // Se a role NÃO for permitida, redireciona
      if (role && !allowedRoles.includes(role)) {
        router.replace('/unauthorized');
      }
    }

    // Se carregou e NÃO está autenticado, manda pro login
    if (status === 'unauthenticated') {
      router.replace('/');
    }
  }, [status, session, allowedRoles, router]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <Atom
          color="#32cd32"
          size="medium"
          text="Verificando acesso..."
          textColor="#555"
        />
      </div>
    );
  }

  if (status === 'authenticated' && allowedRoles.includes(session?.user.role)) {
    return <>{children}</>;
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <Atom
        color="#32cd32"
        size="medium"
        text="Verificando acesso..."
        textColor="#555"
      />
    </div>
  );
}
