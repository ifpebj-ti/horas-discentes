'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  FaCopy,
  FaUsers,
  FaUser
} from 'react-icons/fa';

import { StudentCard } from './_components/StudentCard';
import { BreadcrumbAuto } from '@/components/ui/breadcrumb';
import LoadingOverlay from '@/components/LoadingOverlay';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

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
  const { id } = useParams();
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
    navigator.clipboard.writeText(turma.id);
    toast.success('O código da turma foi copiado para a área de transferência.');
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
    <div className="space-y-8 p-4 md:p-6">
      <LoadingOverlay show={visible} />

      <BreadcrumbAuto />

      {turma && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{turma.cursoNome}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-600">
                  Código da Turma
                </p>
                <p className="text-lg font-bold text-gray-900">{turma.id}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyCode}
                  className="mt-3 flex items-center space-x-2 cursor-pointer"
                >
                  <FaCopy className="w-4 h-4" />
                  <span>Copiar</span>
                </Button>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Período</p>
                <p className="text-lg font-bold text-gray-900">
                  {turma.periodo}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Turno</p>
                <p className="text-lg font-bold text-gray-900">{turma.turno}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <FaUser className="w-5 h-5" />
                  <CardTitle>Alunos Matriculados</CardTitle>
                </div>
                <Badge variant="secondary" className="text-sm">
                  {students.filter((s) => s.isAtivo).length} ativos
                </Badge>
              </div>
              <CardDescription>
                {students.length} alunos cadastrados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {students.map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  turma={turma}
                  onToggleStatus={toggleStudentStatus}
                />
              ))}
            </CardContent>
          </Card>

          <div className="bg-blue-50 rounded-lg p-4 sm:p-6">
            <h3 className="font-semibold text-blue-900 mb-2">
              Código da Turma
            </h3>
            <p className="text-blue-700 text-sm mb-3">
              Compartilhe o código <strong>{turma.id}</strong> com os alunos
              para que eles possam se inscrever na turma.
            </p>
            <Button
              variant="outline"
              onClick={copyCode}
              className="flex items-center space-x-2 text-blue-700 border-blue-300 cursor-pointer"
            >
              <FaCopy className="w-4 h-4" />
              <span>Copiar código da turma</span>
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default VisualizarTurma;
