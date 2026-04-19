'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { CreateCourseModal } from './_components/CreateCourseModal';
import CourseCard from '@/components/CourseCard';
import LoadingOverlay from '@/components/LoadingOverlay';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { BreadcrumbAuto } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { useLoadingOverlay } from '@/hooks/useLoadingOverlay';
import {
  obterResumoCursos,
  CursoResumoResponse,
  CampusResponse,
  listarCampuses,
  deletarCurso
} from '@/services/courseService';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function CursoPage() {
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [courses, setCourses] = useState<CursoResumoResponse[]>(
    [] as CursoResumoResponse[]
  );
  const [campuses, setCampuses] = useState<CampusResponse[]>([]);
  const [selectedCampusId, setSelectedCampusId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    nome: string;
  } | null>(null);

  const { show, hide, visible } = useLoadingOverlay();

  useEffect(() => {
    const fetchData = async () => {
      show();
      try {
        const [coursesResult, campusesResult] = await Promise.allSettled([
          obterResumoCursos(),
          listarCampuses()
        ]);

        if (coursesResult.status === 'fulfilled') {
          setCourses(coursesResult.value);
        } else {
          toast.error('Não foi possível carregar os cursos.');
          setCourses([]);
        }

        if (campusesResult.status === 'fulfilled') {
          setCampuses(campusesResult.value);
        } else {
          toast.error('Não foi possível carregar os campi.');
          setCampuses([]);
        }
      } finally {
        hide();
      }
    };

    fetchData();
  }, [show, hide]);

  const filteredCourses = Array.isArray(courses)
    ? courses.filter((course) => {
        const matchesSearch =
          typeof course.nome === 'string' &&
          course.nome.toLowerCase().includes(search.toLowerCase());
        const matchesCampus =
          !selectedCampusId || course.campusId === selectedCampusId;
        return matchesSearch && matchesCampus;
      })
    : [];

  const refreshCourses = async () => {
    const atualizados = await obterResumoCursos();
    setCourses(atualizados);
  };

  const handleDeleteCourse = (courseId: string, courseName: string) => {
    if (!courseId) {
      toast.error('ID do curso inválido.');
      return;
    }
    setDeleteTarget({ id: courseId, nome: courseName });
  };

  const confirmDeleteCourse = async () => {
    if (!deleteTarget) return;

    try {
      show();
      await deletarCurso(deleteTarget.id);
      const atualizados = await obterResumoCursos();
      setCourses(atualizados);
      toast.success(
        'O curso e todos os dados associados foram excluídos com sucesso.'
      );
    } catch (error: unknown) {
      const err = error as {
        response?: {
          status?: number;
          data?: { erro?: string; mensagem?: string };
        };
        message?: string;
      };

      let errorMessage = 'Não foi possível excluir o curso.';

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

      toast.error(errorMessage);
    } finally {
      hide();
      setDeleteTarget(null);
    }
  };

  return (
    <div className="p-6 w-full">
      <LoadingOverlay show={visible} />

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Deseja realmente excluir o curso &quot;{deleteTarget?.nome}&quot;?
              Esta ação é PERMANENTE e irá remover TODOS os dados associados
              (turmas, alunos, certificados, atividades e coordenador).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={confirmDeleteCourse}
            >
              Sim, excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="mb-4">
        <BreadcrumbAuto />
      </div>

      <h1 className="md:text-4xl text-3xl font-semibold md:font-normal text-gray-800 mb-10">
        Cursos
      </h1>

      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
        <Input
          placeholder="Buscar curso..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:max-w-sm"
        />
        <select
          value={selectedCampusId}
          onChange={(e) => setSelectedCampusId(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 md:max-w-xs"
        >
          <option value="">Todos os campi</option>
          {campuses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>
        <Button
          icon={faPlus}
          onClick={() => setIsModalOpen(true)}
          className="md:w-auto w-full"
        >
          Novo Curso
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCourses.map((course) => (
          <CourseCard
            key={course.id}
            courseName={course.nome}
            campus={course.nomeCampus}
            alunos={course.quantidadeAlunos}
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
