'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaHome, FaPlus } from 'react-icons/fa';

import BreadCrumb from '@/components/BreadCrumb';
import CourseCard from '@/components/CourseCard';
import { RoundedButton } from '@/components/RoundedButton';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

type Course = {
  id: string;
  courseName: string;
  coordinators: number;
  classes: number;
};

export default function CursoPage() {
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', courseName: 'Engenharia Civil', coordinators: 1, classes: 2 },
    { id: '2', courseName: 'Administração', coordinators: 2, classes: 3 },
    { id: '3', courseName: 'Direito', coordinators: 1, classes: 1 },
    { id: '4', courseName: 'Medicina', coordinators: 3, classes: 5 },
    { id: '5', courseName: 'Psicologia', coordinators: 2, classes: 2 },
    {
      id: '6',
      courseName: 'Engenharia de Produção',
      coordinators: 1,
      classes: 2
    },
    { id: '7', courseName: 'Arquitetura', coordinators: 2, classes: 3 },
    {
      id: '8',
      courseName: 'Ciência da Computação',
      coordinators: 2,
      classes: 4
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCourseName, setNewCourseName] = useState('');

  const filteredCourses = courses.filter((course) =>
    course.courseName.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddCourse = async () => {
    if (!newCourseName.trim()) {
      Swal.fire('Erro', 'O nome do curso é obrigatório.', 'error');
      return;
    }

    const result = await MySwal.fire({
      title: 'Tem certeza?',
      text: `Deseja criar o curso "${newCourseName}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim, criar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6'
    });

    if (result.isConfirmed) {
      const newId = String(Date.now()); // simples ID único
      setCourses((prev) => [
        ...prev,
        {
          id: newId,
          courseName: newCourseName,
          coordinators: 0,
          classes: 0
        }
      ]);

      setIsModalOpen(false);
      setNewCourseName('');

      Swal.fire({
        title: 'Curso criado!',
        text: `O curso "${newCourseName}" foi criado com sucesso.`,
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6'
      });
    } else {
      setIsModalOpen(false);
      setNewCourseName('');
      Swal.fire({
        title: 'Cancelado',
        text: 'A criação do curso foi cancelada.',
        icon: 'info',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6'
      });
    }
  };

  return (
    <div className="p-6 w-full">
      <div className="mb-6">
        <BreadCrumb
          items={[
            {
              icon: <FaHome />,
              label: 'Início',
              href: '/curso'
            }
          ]}
        />
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar curso..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-full px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="w-full md:w-auto text-nowrap min-w-auto">
          <RoundedButton
            text="Novo Curso"
            icon={<FaPlus />}
            onClick={() => setIsModalOpen(true)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCourses.map((course) => (
          <CourseCard
            key={course.id}
            courseName={course.courseName}
            coordinators={course.coordinators}
            classes={course.classes}
            onManageCourse={() => router.push(`/curso/${course.id}`)}
          />
        ))}
      </div>

      {/* Modal Simples */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">Adicionar novo curso</h2>

            <input
              type="text"
              placeholder="Nome do curso"
              value={newCourseName}
              onChange={(e) => setNewCourseName(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setNewCourseName('');
                }}
                className="px-4 py-2 rounded border border-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddCourse}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
