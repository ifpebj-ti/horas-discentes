import Link from 'next/link';


import ViewCertificate from '@/components/ViewCertificate';

import { Certificado } from '@/types';

interface RecentCertificatesProps {
  certificados: Certificado[];
  onView: (id: string) => void;
}

export const RecentCertificates = ({
  certificados,
  onView
}: RecentCertificatesProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-primary">
          Certificados Recentes
        </h2>
        <Link
          href="/aluno/certificado"
          className="text-sm font-medium text-primary hover:underline"
        >
          Ver todos
        </Link>
      </div>

      {certificados.length > 0 ? (
        <div className="space-y-4">
          {certificados.slice(0, 3).map((cert) => (
            <ViewCertificate
              key={cert.id}
              certificate={{
                id: cert.id,
                title: cert.title,
                local: cert.local,
                description: cert.description,
                hours: cert.cargaHoraria,
                date: cert.periodoInicio,
                dateEnd: cert.periodoFim,
                category: cert.categoriaKey,
                status: cert.status
              }}
              onClick={onView}
            />
          ))}
        </div>
      ) : (
        <div className="py-8 text-center bg-gray-50 rounded-lg space-y-3">
          <p className="text-gray-500 text-sm">
            Ainda não há certificados enviados.
          </p>
          <Link
            href="/aluno/certificado/novo?tipo=horas-complementares"
            className="inline-block text-sm font-medium text-primary hover:underline"
          >
            Enviar primeiro certificado →
          </Link>
        </div>
      )}
    </div>
  );
};
