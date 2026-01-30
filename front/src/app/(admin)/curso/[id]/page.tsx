'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaPlus, FaHome, FaTrash, FaGraduationCap } from 'react-icons/fa';

import { CoordinatorInviteModal } from './_components/CoordinatorInviteModal';
import { CreateTurmaModal } from './_components/CreateTurmaModal';
import BreadCrumb from '@/components/BreadCrumb';
import LoadingOverlay from '@/components/LoadingOverlay';
import { Button } from '@/components/ui/button';

import { COLORS } from '@/config/colors';
import { useLoadingOverlay } from '@/hooks/useLoadingOverlay';
import {
  obterCoordenadorPorCurso,
  deletarCoordenador
} from '@/services/coordenadorService';
import { obterTurmasPorCurso, deletarTurma } from '@/services/turmaService';
import Swal from 'sweetalert2';

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

  // Modals state
  const [isCoordModalOpen, setIsCoordModalOpen] = useState(false);
  const [isTurmaModalOpen, setIsTurmaModalOpen] = useState(false);

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

  const handleAddCoordinatorClick = () => {
    setIsCoordModalOpen(true);
  };

  const handleAddTurmaClick = () => {
    setIsTurmaModalOpen(true);
  };

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

  const handleDeleteCoordinator = async () => {
    if (!coordinator?.id) {
      Swal.fire('Erro', 'Coordenador não encontrado ou ID inválido.', 'error');
      return;
    }

    const confirmation = await Swal.fire({
      title: 'Confirmar exclusão',
      text: `Deseja realmente excluir o coordenador ${coordinator.nome}?`,
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
      await deletarCoordenador(coordinator.id);
      setCoordinator(null);
      await Swal.fire({
        title: 'Coordenador excluído!',
        text: 'O coordenador foi excluído com sucesso.',
        icon: 'success',
        confirmButtonColor: COLORS.primary
      });
    } catch (error: unknown) {
      console.error('Erro ao excluir coordenador:', error);
      const err = error as {
        response?: {
          status?: number;
          data?: { erro?: string; mensagem?: string };
        };
        message?: string;
      };

      let errorMessage = 'Não foi possível excluir o coordenador.';

      // Mensagem específica para erro 405
      if (err?.response?.status === 405) {
        errorMessage =
          'Método não permitido. O servidor não aceita requisições DELETE para este endpoint. Verifique a configuração do backend.';
      } else if (err?.response?.status === 404) {
        errorMessage = 'Coordenador não encontrado.';
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

  const handleDeleteTurma = async (turmaId: string, periodo: string) => {
    if (!turmaId) {
      Swal.fire('Erro', 'ID da turma inválido.', 'error');
      return;
    }

    const confirmation = await Swal.fire({
      title: 'Confirmar exclusão',
      text: `Deseja realmente excluir a turma ${periodo}? Esta ação é permanente e irá remover todos os alunos e dados associados.`,
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
      await deletarTurma(turmaId);
      const turmasAtualizadas = await obterTurmasPorCurso(cursoId);
      setClasses(
        turmasAtualizadas.map((t) => ({
          id: t.id,
          period: t.periodo,
          shift: t.turno,
          students: t.quantidadeAlunos
        }))
      );
      await Swal.fire({
        title: 'Turma excluída!',
        text: 'A turma foi excluída com sucesso.',
        icon: 'success',
        confirmButtonColor: COLORS.primary
      });
    } catch (error: unknown) {
      console.error('Erro ao excluir turma:', error);
      const err = error as {
        response?: {
          status?: number;
          data?: { erro?: string; mensagem?: string };
        };
        message?: string;
      };
      console.error('Status do erro:', err?.response?.status);
      console.error('Dados do erro:', err?.response?.data);
      console.error('ID da turma:', turmaId);

      let errorMessage;

      if (err?.response?.status === 405) {
        errorMessage =
          'Erro 405: Método não permitido. A rota de exclusão pode não estar configurada corretamente no servidor.';
      } else if (err?.response?.status === 404) {
        errorMessage = 'Turma não encontrada.';
      } else if (err?.response?.status === 401) {
        errorMessage = 'Você não tem permissão para excluir esta turma.';
      } else if (err?.response?.status === 403) {
        errorMessage =
          'Acesso negado. Você precisa ter permissão de ADMIN ou COORDENADOR.';
      } else {
        errorMessage =
          err?.response?.data?.erro ||
          err?.response?.data?.mensagem ||
          err?.message ||
          'Não foi possível excluir a turma.';
      }

      Swal.fire('Erro', errorMessage, 'error');
    } finally {
      hide();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <LoadingOverlay show={visible} />
      <div className="mb-6">
        <BreadCrumb
          items={[
            {
              icon: <FaHome />,
              label: 'Início',
              href: '/curso'
            },
            {
              icon: <FaGraduationCap />,
              label: 'Turmas',
              href: `/curso/${cursoId}`
            }
          ]}
        />
      </div>
      <div>
        <h1 className="text-2xl font-bold">{courseName}</h1>
        <p className="text-gray-500">Gerenciamento do curso</p>
      </div>

      {/* Coordenador */}
      {/* Coordenador */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Coordenador</h2>
        {coordinator ? (
          <div className="flex justify-between items-center">
            <span>{coordinator.nome}</span>
            <button
              onClick={handleDeleteCoordinator}
              className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors"
              title="Excluir coordenador"
            >
              <FaTrash className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="max-w-xs mt-4 cursor-pointer">
            <Button
              onClick={handleAddCoordinatorClick}
              shape="pill"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white"
            >
              <FaPlus className="mr-2" /> Adicionar Coordenador
            </Button>
          </div>
        )}
      </div>

      {/* Turmas */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Turmas</h2>
          <div className="max-w-xs">
            <Button
              onClick={handleAddTurmaClick}
              shape="pill"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white"
            >
              <FaPlus className="mr-2" /> Criar Nova Turma
            </Button>
          </div>
        </div>

        <table className="w-full table-auto text-sm">
          <thead className="text-left text-gray-600 border-b">
            <tr>
              <th className="py-2">Período</th>
              <th>Turno</th>
              <th>Alunos</th>
              <th className="text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls) => (
              <tr key={cls.id} className="border-b last:border-none">
                <td className="py-2">{cls.period}</td>
                <td>{cls.shift}</td>
                <td>{cls.students}</td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      className="text-sm text-blue-600 border border-blue-600 px-3 py-1 rounded-full hover:bg-blue-50"
                      onClick={() => router.push(`/curso/${cursoId}/${cls.id}`)}
                    >
                      Visualizar turma
                    </button>
                    <button
                      onClick={() => handleDeleteTurma(cls.id, cls.period)}
                      className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors"
                      title="Excluir turma"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Convite por E-mail - Coordenador */}
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
