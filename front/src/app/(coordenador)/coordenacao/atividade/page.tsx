'use client';

import { useSession } from 'next-auth/react';

import { CadastroAtividades } from '@/components/CadastroAtividades';
export default function AtividadesPage() {
  const { data: session } = useSession();
  const cursoId = session?.user?.cursoId || '';

  return <CadastroAtividades cursoId={cursoId} />;
}
