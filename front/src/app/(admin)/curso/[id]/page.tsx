'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { CoordinatorInviteModal } from './_components/CoordinatorInviteModal';
import { CreateTurmaModal } from './_components/CreateTurmaModal';
import { BreadcrumbAuto } from '@/components/ui/breadcrumb';
import LoadingOverlay from '@/components/LoadingOverlay';
import { Button } from '@/components/ui/button';
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

import { useLoadingOverlay } from '@/hooks/useLoadingOverlay';
import {
  obterCoordenadorPorCurso,
  deletarCoordenador
} from '@/services/coordinatorService';
import { obterTurmasPorCurso, deletarTurma } from '@/services/classService';
import { toast } from 'react-toastify';

type DeleteTarget =
  | { type: 'coordinator'; id: string; label: string }
  | { type: 'turma'; id: string; label: string };

export default function CourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const cursoId = typeof params.id === 'string' ? params.id : '';
  const { visible, show, hide } = useLoadingOverlay();

  const [courseName, setCourseName] = useState('');
  const [coordinator, setCoordinator] = useState<{
    id: string;
    nome: string;
  } | null>(null);
  const [classes, setClasses] = useState<
    { id: string; period: string; shift: string; students: number }[]
  >([]);

  const [isCoordModalOpen, setIsCoordModalOpen] = useState(false);
  const [isTurmaModalOpen, setIsTurmaModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!cursoId) return;
      try {
        show();
        const [coordenador, turmas] = await Promise.all([
          obterCoordenadorPorCurso(cursoId),
          obterTurmasPorCurso(cursoId)
        ]);

        setCoordinator(
          coordenador ? { id: coordenador.id, nome: coordenador.nome } : null
        );
        setClasses(
          turmas.map((t) => ({
            id: t.id,
            period: t.periodo,
            shift: t.turno,
            students: t.quantidadeAlunos
          }))
        );
        setCourseName(turmas[0]?.cursoNome || 'Curso');
      } catch (error) {
        console.error('Erro ao carregar dados do curso:', error);
      } finally {
        hide();
      }
    };
    loadData();
  }, [cursoId, show, hide]);

  const refreshTurmas = async () => {
    const turmasAtualizadas = await obterTurmasPorCurso(cursoId);
    setClasses(
      turmasAtualizadas.map((t) => ({
        id: t.id,
        period: t.periodo,
        shift: t.turno,
        students: t.quantidadeAlunos
      }))
    );
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      show();
      if (deleteTarget.type === 'coordinator') {
        await deletarCoordenador(deleteTarget.id);
        setCoordinator(null);
        toast.success('O coordenador foi excluído com sucesso.');
      } else {
        await deletarTurma(deleteTarget.id);
        const turmasAtualizadas = await obterTurmasPorCurso(cursoId);
        setClasses(
          turmasAtualizadas.map((t) => ({
            id: t.id,
            period: t.periodo,
            shift: t.turno,
            students: t.quantidadeAlunos
          }))
        );
        toast.success('A turma foi excluída com sucesso.');
      }
    } catch (error: unknown) {
      console.error('Erro ao excluir:', error);
      const err = error as {
        response?: {
          status?: number;
          data?: { erro?: string; mensagem?: string };
        };
        message?: string;
      };

      let errorMessage =
        deleteTarget.type === 'coordinator'
          ? 'Não foi possível excluir o coordenador.'
          : 'Não foi possível excluir a turma.';

      if (err?.response?.status === 405) {
        errorMessage =
          'Método não permitido. O servidor não aceita requisições DELETE para este endpoint. Verifique a configuração do backend.';
      } else if (err?.response?.status === 404) {
        errorMessage =
          deleteTarget.type === 'coordinator'
            ? 'Coordenador não encontrado.'
            : 'Turma não encontrada.';
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
    <div className="p-6 space-y-6">
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
              {deleteTarget?.type === 'coordinator'
                ? `Deseja realmente excluir o coordenador ${deleteTarget.label}?`
                : `Deseja realmente excluir a turma ${deleteTarget?.label}? Esta ação é permanente e irá remover todos os alunos e dados associados.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmDelete}>
              Sim, excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="mb-6">
        <BreadcrumbAuto map={{ [cursoId]: courseName || cursoId }} />
      </div>
      <div>
        <h1 className="text-2xl font-bold">{courseName}</h1>
        <p className="text-gray-500">Gerenciamento do curso</p>
      </div>

      {/* Coordenador */}
      <div className="rounded-lg border border-gray-200 bg-white py-3 px-4">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Coordenador</h2>
        {coordinator ? (
          <div className="flex justify-between items-center">
            <span className="text-base font-bold text-gray-800">{coordinator.nome}</span>
            <button
              onClick={() =>
                setDeleteTarget({
                  type: 'coordinator',
                  id: coordinator.id,
                  label: coordinator.nome
                })
              }
              className="text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
              title="Excluir coordenador"
            >
              <FontAwesomeIcon icon={faTrash} className="w-6 h-6" />
            </button>
          </div>
        ) : (
          <div className="max-w-xs cursor-pointer">
            <Button
              icon={faPlus}
              onClick={() => setIsCoordModalOpen(true)}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white"
            >
              Adicionar Coordenador
            </Button>
          </div>
        )}
      </div>

      {/* Turmas */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Turmas</h2>
          <div className="max-w-xs">
            <Button
              icon={faPlus}
              onClick={() => setIsTurmaModalOpen(true)}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white"
            >
              Criar Nova Turma
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <table className="w-full table-auto text-sm">
            <thead className="text-left text-gray-700 text-xs uppercase tracking-wide" style={{ backgroundColor: '#F2F2F2', borderBottom: '1px solid #D1D1D1' }}>
              <tr>
                <th className="px-4 py-3">Período</th>
                <th className="px-4 py-3">Turno</th>
                <th className="px-4 py-3">Alunos</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cls) => (
                <tr key={cls.id} className="border-b last:border-none hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">{cls.period}</td>
                  <td className="px-4 py-3">{cls.shift}</td>
                  <td className="px-4 py-3">{cls.students}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="text-sm bg-gray-100 hover:bg-gray-200 text-blue-700 font-medium px-3 py-1.5 rounded-lg transition-colors"
                        onClick={() => router.push(`/curso/${cursoId}/${cls.id}`)}
                      >
                        Visualizar turma
                      </button>
                      <button
                        onClick={() =>
                          setDeleteTarget({
                            type: 'turma',
                            id: cls.id,
                            label: cls.period
                          })
                        }
                        className="text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                        title="Excluir turma"
                      >
                        <FontAwesomeIcon icon={faTrash} className="w-6 h-6" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CoordinatorInviteModal
        isOpen={isCoordModalOpen}
        onClose={() => setIsCoordModalOpen(false)}
        cursoId={cursoId}
      />

      <CreateTurmaModal
        isOpen={isTurmaModalOpen}
        onClose={() => setIsTurmaModalOpen(false)}
        onSuccess={refreshTurmas}
        cursoId={cursoId}
      />
    </div>
  );
}
