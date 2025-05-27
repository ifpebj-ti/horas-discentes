import React from 'react';
import { FaUsers, FaCalendarAlt } from 'react-icons/fa';

interface CourseCardProps {
  courseName: string;
  coordinators: number;
  classes: number;
  onManageCourse: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  courseName,
  coordinators,
  classes,
  onManageCourse
}) => {
  return (
    <div className="rounded-lg shadow-md p-4 w-full max-w-sm mx-auto hover:shadow-lg transition-shadow bg-white">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">{courseName}</h2>

      <div className="text-gray-600 flex items-center mb-1">
        <FaUsers className="mr-2" />
        {coordinators} coordenador{coordinators !== 1 ? 'es' : ''}
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
