'use client';

//import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaHome, FaPlus } from 'react-icons/fa';

import BreadCrumb from '@/components/BreadCrumb';
import CourseCard from '@/components/CourseCard';
import { RoundedButton } from '@/components/RoundedButton';

const mockCourses = [
  { courseName: 'Engenharia Civil', coordinators: 1, classes: 2 },
  { courseName: 'Administração', coordinators: 2, classes: 3 },
  { courseName: 'Direito', coordinators: 1, classes: 1 },
  { courseName: 'Medicina', coordinators: 3, classes: 5 },
  { courseName: 'Psicologia', coordinators: 2, classes: 2 },
  { courseName: 'Engenharia de Produção', coordinators: 1, classes: 2 },
  { courseName: 'Arquitetura', coordinators: 2, classes: 3 },
  { courseName: 'Ciência da Computação', coordinators: 2, classes: 4 }
];

export default function CursoPage() {
  //const router = useRouter();
  const [search, setSearch] = useState('');

  const filteredCourses = mockCourses.filter((course) =>
    course.courseName.toLowerCase().includes(search.toLowerCase())
  );

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
            onClick={() => alert('Adicionar novo curso')}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3          xl:grid-cols-4 gap-6">
        {filteredCourses.map((course, index) => (
          <CourseCard
            key={index}
            courseName={course.courseName}
            coordinators={course.coordinators}
            classes={course.classes}
            onManageCourse={() => alert(`Gerenciar ${course.courseName}`)}
          />
        ))}
      </div>
    </div>
  );
}
