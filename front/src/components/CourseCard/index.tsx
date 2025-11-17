import React from 'react';
import { FaUsers, FaCalendarAlt, FaTrash } from 'react-icons/fa';

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
    <div className="rounded-lg shadow-md p-4 w-full max-w-sm mx-auto hover:shadow-lg transition-shadow bg-white relative">
      {onDeleteCourse && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDeleteCourse();
          }}
          className="absolute top-2 right-2 text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors"
          title="Excluir curso"
        >
          <FaTrash className="w-4 h-4" />
        </button>
      )}
      <h2 className="text-lg font-semibold text-gray-800 mb-2 pr-8">
        {courseName}
      </h2>

      <div className="text-gray-600 flex items-center mb-1">
        <FaUsers className="mr-2" />
        {alunos} Aluno{alunos !== 1 ? 's' : ''}
      </div>
      <div className="text-gray-600 flex items-center mb-4">
        <FaCalendarAlt className="mr-2" />
        {classes} turma{classes !== 1 ? 's' : ''}
      </div>
      <button
        onClick={onManageCourse}
        className="w-full border border-blue-600 text-blue-600 py-2 rounded hover:bg-blue-50 font-medium cursor-pointer"
      >
        Gerenciar Curso
      </button>
    </div>
  );
};

export default CourseCard;
