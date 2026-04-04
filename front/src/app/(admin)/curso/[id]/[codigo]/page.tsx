'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaCopy } from 'react-icons/fa';

import { BreadcrumbAuto } from '@/components/ui/breadcrumb';
import LoadingOverlay from '@/components/LoadingOverlay';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

import { useLoadingOverlay } from '@/hooks/useLoadingOverlay';
import { toggleStatusAluno } from '@/services/studentService';
import {
  listarAlunosPorTurma,
  obterTurmaPorId,
  TurmaResponse,
  AlunoPorTurmaDetalhadoResponse
} from '@/services/classService';
import { toast } from 'react-toastify';

const VisualizarTurma = () => {
  const params = useParams();
  const id = typeof params.codigo === 'string' ? params.codigo : '';
  const cursoId = typeof params.id === 'string' ? params.id : '';
  const [turma, setTurma] = useState<TurmaResponse | null>(null);
  const [students, setStudents] = useState<AlunoPorTurmaDetalhadoResponse[]>(
    []
  );
  const { visible, show, hide } = useLoadingOverlay();

  useEffect(() => {
    const carregarDados = async () => {
      try {
        show();
        const turmaResponse = await obterTurmaPorId(id as string);
        const alunosResponse = await listarAlunosPorTurma(id as string);
        setTurma(turmaResponse);
        setStudents(alunosResponse);
      } catch (error) {
        console.error('Erro ao carregar dados da turma:', error);
        toast.error('Erro ao carregar dados da turma.');
      } finally {
        hide();
      }
    };

    if (id) carregarDados();
  }, [id, show, hide]);

  const copyCode = async () => {
    if (!turma) return;
    navigator.clipboard.writeText(turma.codigo);
    toast.success('Código copiado para a área de transferência.');
  };

  const toggleStudentStatus = async (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    try {
      show();
      await toggleStatusAluno(studentId);
      const atualizados = await listarAlunosPorTurma(id as string);
      setStudents(atualizados);

      const action = student.isAtivo ? 'desativado' : 'ativado';
      toast.info(`${student.nome} foi ${action}.`);
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast.error('Não foi possível alterar o status.');
    } finally {
      hide();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <LoadingOverlay show={visible} />

      <BreadcrumbAuto map={{
        [cursoId]: turma?.cursoNome || cursoId,
        [id]: turma ? `Turma ${turma.periodo}` : id
      }} />

      {turma && (
        <>
          {/* Info cards */}
          <div>
            <h1 className="text-2xl font-bold mb-4">{turma.cursoNome}</h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg py-3 px-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">
                  Período
                </p>
                <p className="text-base font-bold text-gray-800">
                  {turma.periodo}
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg py-3 px-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">
                  Turno
                </p>
                <p className="text-base font-bold text-gray-800 capitalize">
                  {turma.turno}
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg py-3 px-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">
                  Código da Turma
                </p>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-mono font-bold text-[#1351B4] truncate">
                    {turma.codigo}
                  </p>
                  <button
                    onClick={copyCode}
                    className="text-gray-400 hover:text-blue-600 transition-colors shrink-0"
                    title="Copiar código"
                  >
                    <FaCopy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Students table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                Alunos Matriculados
              </h2>
              <Badge variant="secondary">
                {students.filter((s) => s.isAtivo).length} ativos
              </Badge>
            </div>

            {students.length === 0 ? (
              <p className="text-gray-500 text-sm p-8 text-center">
                Nenhum aluno matriculado.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full table-auto text-sm">
                  <thead
                    className="text-left text-gray-700 text-xs uppercase tracking-wide"
                    style={{
                      backgroundColor: '#F2F2F2',
                      borderBottom: '1px solid #D1D1D1'
                    }}
                  >
                    <tr>
                      <th className="px-4 py-3">Aluno</th>
                      {turma.possuiExtensao && (
                        <th className="px-4 py-3 text-center">Extensão</th>
                      )}
                      <th className="px-4 py-3 text-center">Complementar</th>
                      <th className="px-4 py-3 text-center">Progresso</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr
                        key={student.id}
                        className="border-b last:border-none hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {student.nome}
                        </td>
                        {turma.possuiExtensao && (
                          <td className="px-4 py-3 text-center text-gray-600">
                            {student.totalHorasExtensao}/
                            {student.maximoHorasExtensao}h
                          </td>
                        )}
                        <td className="px-4 py-3 text-center text-gray-600">
                          {student.totalHorasComplementar}/
                          {student.maximoHorasComplementar}h
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Progress
                              value={student.porcentagemConclusao}
                              className="h-1.5 flex-1 min-w-[60px]"
                            />
                            <span className="text-xs text-gray-500 w-8 text-right shrink-0">
                              {student.porcentagemConclusao.toFixed(0)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge
                            variant={
                              student.isAtivo ? 'default' : 'secondary'
                            }
                          >
                            {student.isAtivo ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            variant={
                              student.isAtivo ? 'destructive' : 'default'
                            }
                            size="sm"
                            onClick={() => toggleStudentStatus(student.id)}
                            className="cursor-pointer"
                          >
                            {student.isAtivo ? 'Desativar' : 'Ativar'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default VisualizarTurma;
