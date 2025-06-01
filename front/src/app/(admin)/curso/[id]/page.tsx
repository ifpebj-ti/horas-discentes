'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

import { RoundedButton } from '@/components/RoundedButton';

import Swal from 'sweetalert2';

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

  const [courseData, setCourseData] = useState<CourseDetails | null>(null);

  useEffect(() => {
    const mockData: CourseDetails = {
      id: '1',
      name: 'Engenharia de Software',
      coordinator: { id: 'c1', name: 'Ana Lima' },
      secretaries: [
        { id: 's1', name: 'Carlos Mendes' },
        { id: 's2', name: 'Joana Ribeiro' }
      ],
      classes: [
        {
          id: '2025.1',
          period: '2025.1',
          shift: 'Noturno',
          students: 40
        },
        {
          id: '2025.2',
          period: '2025.2',
          shift: 'Noturno',
          students: 35
        },
        {
          id: '2025.3',
          period: '2025.3',
          shift: 'Noturno',
          students: 38
        }
      ]
    };
    setCourseData(mockData);
  }, []);

  const confirmDelete = async (name: string, type: string) => {
    const result = await Swal.fire({
      title: 'Tem certeza?',
      text: `Deseja excluir ${type} "${name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    });
    return result.isConfirmed;
  };

  if (!courseData) return <p className="p-6">Carregando...</p>;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{courseData.name}</h1>
        <p className="text-gray-500">Gerenciamento do curso</p>
      </div>

      {/* Coordenador */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Coordenador</h2>
        {courseData.coordinator ? (
          <div className="flex justify-between items-center">
            <span>{courseData.coordinator.name}</span>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 rounded text-sm bg-blue-100 text-blue-800 hover:bg-blue-200"
                onClick={() =>
                  router.push(`/curso/${courseData.id}/coordenador/editar`)
                }
              >
                <FaEdit />
              </button>
              <button
                className="px-3 py-1 rounded text-sm bg-red-100 text-red-800 hover:bg-red-200"
                onClick={async () => {
                  const confirmed = await confirmDelete(
                    courseData.coordinator!.name,
                    'o coordenador'
                  );
                  if (confirmed) {
                    setCourseData({ ...courseData, coordinator: null });
                    Swal.fire({
                      title: 'Removido!',
                      text: 'Coordenador excluído com sucesso.',
                      icon: 'success',
                      confirmButtonColor: '#3085d6'
                    });
                  }
                }}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-xs mt-4">
            <RoundedButton
              text="Adicionar Coordenador"
              icon={<FaPlus />}
              onClick={() => alert('Adicionar coordenador')}
            />
          </div>
        )}
      </div>

      {/* Secretarias */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Secretaria</h2>
        <ul className="space-y-2">
          {courseData.secretaries.map((sec) => (
            <li key={sec.id} className="flex justify-between items-center">
              <span>{sec.name}</span>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded text-sm bg-blue-100 text-blue-800 hover:bg-blue-200"
                  onClick={() =>
                    router.push(
                      `/curso/${courseData.id}/secretaria/${sec.id}/editar`
                    )
                  }
                >
                  <FaEdit />
                </button>
                <button
                  className="px-3 py-1 rounded text-sm bg-red-100 text-red-800 hover:bg-red-200"
                  onClick={async () => {
                    const confirmed = await confirmDelete(
                      sec.name,
                      'a secretaria'
                    );
                    if (confirmed) {
                      setCourseData({
                        ...courseData,
                        secretaries: courseData.secretaries.filter(
                          (s) => s.id !== sec.id
                        )
                      });
                      Swal.fire({
                        title: 'Removido!',
                        text: 'Secretaria excluída com sucesso.',
                        icon: 'success',
                        confirmButtonColor: '#3085d6'
                      });
                    }
                  }}
                >
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4 max-w-xs">
          <RoundedButton
            text="Adicionar Secretaria"
            icon={<FaPlus />}
            onClick={() => alert('Adicionar secretaria')}
          />
        </div>
      </div>

      {/* Turmas */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Turmas</h2>
          <div className="max-w-xs">
            <RoundedButton
              text="Criar Nova Turma"
              icon={<FaPlus />}
              onClick={() => alert('Criar nova turma')}
            />
          </div>
        </div>

        <table className="w-full table-auto text-sm">
          <thead className="text-left text-gray-600 border-b">
            <tr>
              <th className="py-2">Período</th>
              <th>Turno</th>
              <th>Alunos</th>
              <th className="text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {courseData.classes.map((cls) => (
              <tr key={cls.id} className="border-b last:border-none">
                <td className="py-2">{cls.period}</td>
                <td>{cls.shift}</td>
                <td>{cls.students}</td>
                <td className="text-right">
                  <button
                    className="text-sm text-blue-600 border border-blue-600 px-3 py-1 rounded-full hover:bg-blue-50"
                    onClick={() =>
                      router.push(`/curso/${courseData.id}/${cls.id}`)
                    }
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
