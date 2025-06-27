'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaHome, FaGraduationCap } from 'react-icons/fa';

import BreadCrumb from '@/components/BreadCrumb';

// Tipagens
interface Coordinator {
  id: string;
  name: string;
}

interface Secretary {
  id: string;
  name: string;
}

interface ClassGroup {
  id: string;
  period: string;
  shift: string;
  students: number;
}

interface CourseDetails {
  id: string;
  name: string;
  coordinator: Coordinator | null;
  secretaries: Secretary[];
  classes: ClassGroup[];
}

export default function CourseDetailPage() {
  const router = useRouter();
  const { id: courseId } = useParams();
  const [courseData, setCourseData] = useState<CourseDetails | null>(null);

  /* mock de dados */
  useEffect(() => {
    setCourseData({
      id: courseId as string,
      name: 'Engenharia de Software',
      coordinator: { id: 'c1', name: 'Ana Lima' },
      secretaries: [
        { id: 's1', name: 'Carlos Mendes' },
        { id: 's2', name: 'Joana Ribeiro' }
      ],
      classes: [
        { id: '2025.1', period: '2025.1', shift: 'Noturno', students: 40 },
        { id: '2025.2', period: '2025.2', shift: 'Noturno', students: 35 },
        { id: '2025.3', period: '2025.3', shift: 'Noturno', students: 38 }
      ]
    });
  }, [courseId]);

  if (!courseData) return <p className="p-6">Carregando...</p>;

  return (
    <div className="p-6 space-y-6">
      <BreadCrumb
        items={[
          { icon: <FaHome />, label: 'Página Inicial', href: '/coordenacao' },
          { icon: <FaGraduationCap />, label: 'Turma', href: '' }
        ]}
      />
      <div>
        <h1 className="text-2xl font-bold">{courseData.name}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Coordenador */}
        <div className="bg-white shadow rounded-lg p-4 border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Coordenador</h2>
          <ul className="space-y-2">
            {courseData.coordinator ? (
              <li
                key={courseData.coordinator.id}
                className="flex justify-between items-center"
              >
                <span>{courseData.coordinator.name}</span>
              </li>
            ) : (
              <li className="flex justify-between items-center">
                <span>N/A</span>
              </li>
            )}
          </ul>
        </div>

        {/* Secretarias */}
        <div className="bg-white shadow rounded-lg p-4 border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Secretaria</h2>
          <ul className="space-y-2">
            {courseData.secretaries.map((sec) => (
              <li key={sec.id} className="flex justify-between items-center">
                <span>{sec.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Turmas */}
      <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200 overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Turmas</h2>
        </div>

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
            {courseData.classes.map((cls) => (
              <tr
                key={cls.id}
                className="border-b last:border-none odd:bg-gray-50 even:bg-white hover:bg-gray-100"
              >
                <td className="py-2 px-4">{cls.period}</td>
                <td className="text-center">{cls.shift}</td>
                <td className="text-center">{cls.students}</td>
                <td className="text-right px-4">
                  <button
                    className="text-xs px-2 py-0.5 sm:text-sm sm:px-3 sm:py-1 text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50"
                    onClick={() => router.push(`/coordenacao/turma/${cls.id}`)}
                  >
                    Visualizar turma
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
