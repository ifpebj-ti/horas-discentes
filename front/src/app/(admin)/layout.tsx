import Header from '@/components/Header';
import ProtectedLayout from '@/components/ProtectedLayout';

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedLayout allowedRoles={['admin']}>
      <div className="min-h-screen bg-white">
        <Header />
        <main>{children}</main>
      </div>
    </ProtectedLayout>
  );
}
