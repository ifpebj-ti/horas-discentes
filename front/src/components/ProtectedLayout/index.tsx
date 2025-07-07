'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
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
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      const role = session?.user.role;
      if (allowedRoles.includes(role)) {
        setIsAuthorized(true);
      } else {
        router.replace('/unauthorized');
      }
    }
  }, [status, session, allowedRoles, router]);

  if (status === 'loading' || !isAuthorized) {
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

  return <>{children}</>;
}
