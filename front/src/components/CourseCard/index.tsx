import React from 'react';
import { FaUsers, FaCalendarAlt, FaTrash } from 'react-icons/fa';

import { Button } from '@/components/ui/button';

interface CourseCardProps {
  courseName: string;
  alunos: number;
  classes: number;
  onManageCourse: () => void;
  onDeleteCourse?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  courseName,
  alunos,
  classes,
  onManageCourse,
  onDeleteCourse
}) => {
  return (
    <div className="relative bg-white border border-gray-100 rounded-sm shadow-md p-6 flex flex-col hover:shadow-xl transition-shadow duration-300 ease-in-out">
      {onDeleteCourse && (
        <Button
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteCourse();
          }}
          title="Excluir curso"
          className="absolute top-2 right-2 size-9 text-red-600 hover:text-red-800 hover:bg-red-50"
        >
          <FaTrash className="w-4 h-4" />
        </Button>
      )}

      <h2 className="text-lg font-semibold text-gray-800 mb-3 pr-8">
        {courseName}
      </h2>

      <div className="flex flex-col gap-1 text-sm text-gray-600 mb-5">
        <div className="flex items-center gap-2">
          <FaUsers />
          {alunos} Aluno{alunos !== 1 ? 's' : ''}
        </div>
        <div className="flex items-center gap-2">
          <FaCalendarAlt />
          {classes} turma{classes !== 1 ? 's' : ''}
        </div>
      </div>

      <Button variant="outline" onClick={onManageCourse} className="w-full">
        Gerenciar Curso
      </Button>
    </div>
  );
};

export default CourseCard;
