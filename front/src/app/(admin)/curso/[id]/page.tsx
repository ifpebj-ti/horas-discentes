'use client';

import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { CoordinatorInviteModal } from './_components/CoordinatorInviteModal';
import { EditCourseModal } from './_components/EditCourseModal';
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
import { CursoDetalhadoResponse, obterCursoPorId } from '@/services/courseService';
import { faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function CourseDetailPage() {
  const params = useParams();
  const cursoId = typeof params.id === 'string' ? params.id : '';
  const { visible, show, hide } = useLoadingOverlay();

  const [curso, setCurso] = useState<CursoDetalhadoResponse | null>(null);
  const [coordinator, setCoordinator] = useState<{
    id: string;
    nome: string;
  } | null>(null);

  const [isCoordModalOpen, setIsCoordModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const loadData = useCallback(async () => {
    if (!cursoId) return;
    try {
      show();
      const [cursoData, coordenador] = await Promise.all([
        obterCursoPorId(cursoId),
        obterCoordenadorPorCurso(cursoId)
      ]);
      setCurso(cursoData);
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
        <BreadcrumbAuto map={{ [cursoId]: curso?.nome || cursoId }} />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{curso?.nome || 'Curso'}</h1>
          <p className="text-gray-500">Gerenciamento do curso</p>
        </div>
        {curso && (
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-400 px-3 py-1.5 rounded-md transition-colors"
            title="Editar curso"
          >
            <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
            Editar curso
          </button>
        )}
      </div>

      {/* Limites de horas */}
      {curso && (
        <div className="rounded-lg border border-gray-200 bg-white py-3 px-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
            Limites de Horas
          </h2>
          <div className="flex gap-8">
            <div>
              <p className="text-xs text-gray-500">Complementares</p>
              <p className="text-base font-bold text-gray-800">
                {curso.maximoHorasComplementar > 0
                  ? `${curso.maximoHorasComplementar}h`
                  : <span className="text-yellow-600">Não configurado</span>}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Extensão</p>
              <p className="text-base font-bold text-gray-800">
                {curso.maximoHorasExtensao > 0
                  ? `${curso.maximoHorasExtensao}h`
                  : <span className="text-gray-400">—</span>}
              </p>
            </div>
          </div>
        </div>
      )}

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

      {curso && (
        <EditCourseModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={loadData}
          curso={curso}
        />
      )}
    </div>
  );
}
