'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaHome, FaGraduationCap } from 'react-icons/fa';

import BreadCrumb from '@/components/BreadCrumb';
import LoadingOverlay from '@/components/LoadingOverlay';

import { useLoadingOverlay } from '@/hooks/useLoadingOverlay';
import { obterTurmasPorCurso, TurmaResponse } from '@/services/turmaService';

export default function CourseDetailPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [turmas, setTurmas] = useState<TurmaResponse[]>([]);
  const { visible, show, hide } = useLoadingOverlay();

  const cursoId = session?.user?.cursoId || '';
  const nomeCoordenador = session?.user?.name || '';
  console.log('Curso ID:', cursoId);
  useEffect(() => {
    const fetchTurmas = async () => {
      try {
        show();
        if (cursoId) {
          const data = await obterTurmasPorCurso(cursoId);
          setTurmas(data);
        }
      } catch (error) {
        console.error('Erro ao buscar turmas:', error);
      } finally {
        hide();
      }
    };

    fetchTurmas();
  }, [cursoId, show, hide]);
  console.log('turmas:', turmas);
  return (
    <div className="p-6 space-y-6 relative">
      <LoadingOverlay show={visible} />

      <BreadCrumb
        items={[
          { icon: <FaHome />, label: 'Página Inicial', href: '/coordenacao' },
          { icon: <FaGraduationCap />, label: 'Turma', href: '' }
        ]}
      />

      <div>
        <h1 className="text-2xl font-bold">
          {turmas[0]?.cursoNome || 'Curso'}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-4 border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Coordenador</h2>
          <ul className="space-y-2">
            <li className="flex justify-between items-center">
              <span>{nomeCoordenador || 'N/A'}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Turmas */}
      <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200 overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Turmas</h2>
        </div>

        {turmas.length === 0 ? (
          <p className="text-gray-600 px-4 py-2">Nenhuma turma cadastrada.</p>
        ) : (
          <table className="w-full text-sm rounded-lg overflow-hidden">
            <thead className="border-b text-gray-600 bg-gray-50">
              <tr>
                <th className="py-2 text-left px-4">Período</th>
                <th className="text-center">Turno</th>
                <th className="text-center">Alunos</th>
                <th className="text-right px-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {turmas.map((turma) => (
                <tr
                  key={turma.id}
                  className="border-b last:border-none odd:bg-gray-50 even:bg-white hover:bg-gray-100"
                >
                  <td className="py-2 px-4">{turma.periodo}</td>
                  <td className="text-center capitalize">{turma.turno}</td>
                  <td className="text-center">{turma.quantidadeAlunos}</td>
                  <td className="text-right px-4">
                    <button
                      className="text-xs px-2 py-0.5 sm:text-sm sm:px-3 sm:py-1 text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50"
                      onClick={() =>
                        router.push(`/coordenacao/turma/${turma.id}`)
                      }
                    >
                      Visualizar turma
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
