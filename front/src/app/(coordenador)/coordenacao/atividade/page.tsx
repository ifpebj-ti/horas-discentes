'use client';

import { useSession } from 'next-auth/react';

import { ActivityRegistration } from '@/components/ActivityRegistration';
export default function AtividadesPage() {
  const { data: session } = useSession();
  const cursoId = session?.user?.cursoId || '';

  return <ActivityRegistration cursoId={cursoId} />;
}
