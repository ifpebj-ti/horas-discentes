'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaHome, FaPlus } from 'react-icons/fa';
import { FaGraduationCap, FaTimes } from 'react-icons/fa';

import BreadCrumb from '@/components/BreadCrumb';
import CourseCard from '@/components/CourseCard';
import { RoundedButton } from '@/components/RoundedButton';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';

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
  const [complementaryHours, setComplementaryHours] = useState('');
  const [hasExtension, setHasExtension] = useState(false);
  const [extensionHours, setExtensionHours] = useState('');

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
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg overflow-auto max-h-full w-full max-w-2xl p-7 relative">
            {/* Close Button */}
            <button
              className="absolute top-0 mt-1 mb-1 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setIsModalOpen(false)}
            >
              <FaTimes className="w-6 h-6" />
            </button>

            <div className="max-w-2xl mx-auto space-y-8">
              <Card>
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaGraduationCap className="w-8 h-8 text-purple-600" />
                  </div>
                  <CardTitle>Adicionar Novo Curso</CardTitle>
                  <CardDescription>
                    Preencha todos os campos para criar um novo curso
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddCourse} className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="courseName" className="block font-medium">
                        Nome do curso
                      </label>
                      <input
                        id="courseName"
                        type="text"
                        placeholder="Nome do curso"
                        value={newCourseName}
                        onChange={(e) => setNewCourseName(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="complementaryHours"
                        className="block font-medium"
                      >
                        Total de Horas Complementares
                      </label>
                      <input
                        id="complementaryHours"
                        type="number"
                        placeholder="Horas complementares"
                        value={complementaryHours}
                        onChange={(e) => setComplementaryHours(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>

                    <div className="space-y-2">
                      <p className="font-medium">
                        Este curso tem carga horária de extensão?
                      </p>
                      <div className="flex space-x-6">
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="hasExtension"
                            value="sim"
                            checked={hasExtension === true}
                            onChange={() => setHasExtension(true)}
                            className="accent-purple-600"
                          />
                          <span>Sim</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="hasExtension"
                            value="nao"
                            checked={hasExtension === false}
                            onChange={() => setHasExtension(false)}
                            className="accent-purple-600"
                          />
                          <span>Não</span>
                        </label>
                      </div>
                    </div>

                    {hasExtension && (
                      <div className="space-y-2">
                        <label
                          htmlFor="extensionHours"
                          className="block font-medium"
                        >
                          Horas de Extensão
                        </label>
                        <input
                          id="extensionHours"
                          type="number"
                          placeholder="Horas de extensão"
                          value={extensionHours}
                          onChange={(e) => setExtensionHours(e.target.value)}
                          required
                          className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={
                        !newCourseName.trim() ||
                        !complementaryHours.trim() ||
                        (hasExtension && !extensionHours.trim())
                      }
                      className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 disabled:opacity-50"
                    >
                      Criar Curso
                    </button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
