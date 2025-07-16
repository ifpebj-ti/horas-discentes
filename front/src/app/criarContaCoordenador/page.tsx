'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import { CreateCoordinatorAccount } from '@/components/CreateCoordinatorAccount';
import LoadingOverlay from '@/components/LoadingOverlay';
function CreateAccountContent() {
  // O hook useSearchParams automaticamente marca este componente para ser renderizado no cliente.
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  return <CreateCoordinatorAccount emailFromURL={email} tokenFromURL={token} />;
}

function Loading() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <LoadingOverlay show={true} />
    </div>
  );
}

export default function CriarContaCoordenadorPage() {
  return (
    <Suspense fallback={<Loading />}>
      <CreateAccountContent />
    </Suspense>
  );
}
