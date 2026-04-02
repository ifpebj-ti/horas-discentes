import Header from '@/components/Header';
import ProtectedLayout from '@/components/ProtectedLayout';

export default function CoordenacaoLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedLayout allowedRoles={['coordenador']}>
      <div className="min-h-screen bg-white">
        <Header />
        <main className="mt-6 px-5 md:px-10 pb-5">{children}</main>
      </div>
    </ProtectedLayout>
  );
}
