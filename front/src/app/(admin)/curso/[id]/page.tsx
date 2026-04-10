'use client';

import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { CoordinatorInviteModal } from './_components/CoordinatorInviteModal';
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

import { useLoadingOverlay } from '@/hooks/useLoadingOverlay';
import {
  obterCoordenadorPorCurso,
  deletarCoordenador
} from '@/services/coordinatorService';
import { obterCursoPorId } from '@/services/courseService';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function CourseDetailPage() {
  const params = useParams();
  const cursoId = typeof params.id === 'string' ? params.id : '';
  const { visible, show, hide } = useLoadingOverlay();

  const [courseName, setCourseName] = useState('');
  const [coordinator, setCoordinator] = useState<{
    id: string;
    nome: string;
  } | null>(null);

  const [isCoordModalOpen, setIsCoordModalOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const loadData = useCallback(async () => {
    if (!cursoId) return;
    try {
      show();
      const [curso, coordenador] = await Promise.all([
        obterCursoPorId(cursoId),
        obterCoordenadorPorCurso(cursoId)
      ]);
      setCourseName(curso.nome);
      setCoordinator(
        coordenador ? { id: coordenador.id, nome: coordenador.nome } : null
      );
    } catch {
    } finally {
      hide();
    }
  }, [cursoId, show, hide]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDeleteCoordinator = async () => {
    if (!coordinator) return;
    try {
      show();
      await deletarCoordenador(coordinator.id);
      setCoordinator(null);
      toast.success('Coordenador excluído com sucesso.');
    } catch {
      toast.error('Não foi possível excluir o coordenador.');
    } finally {
      hide();
      setConfirmDeleteOpen(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <LoadingOverlay show={visible} />

      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Deseja realmente excluir o coordenador{' '}
              <strong>{coordinator?.nome}</strong>? O vínculo com o curso será
              removido e ele perderá o acesso ao sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDeleteCoordinator}
            >
              Sim, excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="mb-6">
        <BreadcrumbAuto map={{ [cursoId]: courseName || cursoId }} />
      </div>

      <div>
        <h1 className="text-2xl font-bold">{courseName || 'Curso'}</h1>
        <p className="text-gray-500">Gerenciamento do curso</p>
      </div>

      {/* Coordenador */}
      <div className="rounded-lg border border-gray-200 bg-white py-3 px-4">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
          Coordenador
        </h2>
        {coordinator ? (
          <div className="flex justify-between items-center">
            <span className="text-base font-bold text-gray-800">
              {coordinator.nome}
            </span>
            <button
              onClick={() => setConfirmDeleteOpen(true)}
              className="text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
              title="Excluir coordenador"
            >
              <FontAwesomeIcon icon={faTrash} className="w-6 h-6" />
            </button>
          </div>
        ) : (
          <div className="max-w-xs">
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

      <CoordinatorInviteModal
        isOpen={isCoordModalOpen}
        onClose={() => {
          setIsCoordModalOpen(false);
          loadData();
        }}
        cursoId={cursoId}
      />
    </div>
  );
}
