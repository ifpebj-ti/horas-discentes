'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaHome, FaPlus } from 'react-icons/fa';

import { CreateCourseModal } from './_components/CreateCourseModal';
import BreadCrumb from '@/components/BreadCrumb';
import CourseCard from '@/components/CourseCard';
import LoadingOverlay from '@/components/LoadingOverlay';
import { Button } from '@/components/ui/button';

import { COLORS } from '@/config/colors';
import { useLoadingOverlay } from '@/hooks/useLoadingOverlay';
import {
  obterResumoCursos,
  CursoResumoResponse,
  deletarCurso
} from '@/services/cursoService';
import Swal from 'sweetalert2';

export default function CursoPage() {
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [courses, setCourses] = useState<CursoResumoResponse[]>(
    [] as CursoResumoResponse[]
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { show, hide, visible } = useLoadingOverlay();

  useEffect(() => {
    const fetchData = async () => {
      try {
        show();
        const data = await obterResumoCursos();
        console.log(' Cursos carregados:', data);
        setCourses(data);
      } catch (error) {
        console.error(' Erro ao buscar cursos:', error);
      } finally {
        hide();
      }
    };

    fetchData();
  }, [show, hide]);

  const filteredCourses = Array.isArray(courses)
    ? courses.filter(
        (course) =>
          typeof course.nome === 'string' &&
          course.nome.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const refreshCourses = async () => {
    const atualizados = await obterResumoCursos();
    setCourses(atualizados);
  };

  const handleDeleteCourse = async (courseId: string, courseName: string) => {
    if (!courseId) {
      Swal.fire('Erro', 'ID do curso inválido.', 'error');
      return;
    }

    const confirmation = await Swal.fire({
      title: 'Confirmar exclusão',
      text: `Deseja realmente excluir o curso "${courseName}"? Esta ação é PERMANENTE e irá remover TODOS os dados associados (turmas, alunos, certificados, atividades e coordenador).`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: COLORS.danger,
      cancelButtonColor: COLORS.primary
    });

    if (!confirmation.isConfirmed) return;

    try {
      show();
      await deletarCurso(courseId);
      const atualizados = await obterResumoCursos();
      setCourses(atualizados);
      await Swal.fire({
        title: 'Curso excluído!',
        text: 'O curso e todos os dados associados foram excluídos com sucesso.',
        icon: 'success',
        confirmButtonColor: COLORS.primary
      });
    } catch (error: unknown) {
      console.error('Erro ao excluir curso:', error);
      const err = error as {
        response?: {
          status?: number;
          data?: { erro?: string; mensagem?: string };
        };
        message?: string;
      };

      let errorMessage = 'Não foi possível excluir o curso.';

      // Mensagem específica para erro 405
      if (err?.response?.status === 405) {
        errorMessage =
          'Método não permitido. O servidor não aceita requisições DELETE para este endpoint. Verifique a configuração do backend.';
      } else if (err?.response?.status === 404) {
        errorMessage = 'Curso não encontrado.';
      } else if (err?.response?.status === 401) {
        errorMessage = 'Não autorizado. Faça login novamente.';
      } else if (err?.response?.status === 403) {
        errorMessage = 'Acesso negado. Você não tem permissão para esta ação.';
      } else {
        errorMessage =
          err?.response?.data?.erro ||
          err?.response?.data?.mensagem ||
          err?.message ||
          errorMessage;
      }

      Swal.fire('Erro', errorMessage, 'error');
    } finally {
      hide();
    }
  };

  return (
    <div className="p-6 w-full">
      <LoadingOverlay show={visible} />

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
          <Button
            onClick={() => setIsModalOpen(true)}
            shape="pill"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white"
          >
            <FaPlus className="mr-2" /> Novo Curso
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCourses.map((course) => (
          <CourseCard
            key={course.id}
            courseName={course.nome}
            alunos={course.quantidadeAlunos} // Substituir quando tiver dado real
            classes={course.quantidadeTurmas}
            onManageCourse={() => router.push(`/curso/${course.id}`)}
            onDeleteCourse={() => handleDeleteCourse(course.id, course.nome)}
          />
        ))}
      </div>

      <CreateCourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refreshCourses}
      />
    </div>
  );
}
