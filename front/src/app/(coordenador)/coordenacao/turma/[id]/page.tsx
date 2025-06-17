'use client';
import { useState } from 'react';
import {
  FaCopy,
  FaUsers,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaUser,
  FaHome,
  FaGraduationCap
} from 'react-icons/fa';
import { useParams } from 'react-router-dom';

import BreadCrumb from '@/components/BreadCrumb';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

import Swal from 'sweetalert2';

interface Student {
  id: string;
  name: string;
  horasCompletadas: number;
  horasTotal: number;
  status: 'ativo' | 'inativo';
}

const VisualizarTurma = () => {
  const { id } = useParams();
  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      name: 'Ana Silva Santos',
      horasCompletadas: 120,
      horasTotal: 360,
      status: 'ativo'
    },
    {
      id: '2',
      name: 'Carlos Eduardo Oliveira',
      horasCompletadas: 85,
      horasTotal: 360,
      status: 'ativo'
    },
    {
      id: '3',
      name: 'Mariana Costa Lima',
      horasCompletadas: 200,
      horasTotal: 360,
      status: 'inativo'
    },
    {
      id: '4',
      name: 'Pedro Henrique Souza',
      horasCompletadas: 45,
      horasTotal: 360,
      status: 'ativo'
    }
  ]);

  // Mock turma data
  const turma = {
    codigo: id ?? 'turma-abc123',
    periodo: '2025.1',
    turno: 'Noite'
  };

  const copyCode = async () => {
    navigator.clipboard.writeText(turma.codigo);
    await Swal.fire({
      title: 'Código copiado!',
      text: 'O código da turma foi copiado para a área de transferência.',
      icon: 'success',
      confirmButtonColor: '#3085d6'
    });
  };

  const toggleStudentStatus = async (studentId: string) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId
          ? {
              ...student,
              status: student.status === 'ativo' ? 'inativo' : 'ativo'
            }
          : student
      )
    );

    const oldStudent = students.find((s) => s.id === studentId);
    if (!oldStudent) return;

    const action = oldStudent.status === 'ativo' ? 'desativado' : 'ativado';

    await Swal.fire({
      title: 'Status alterado',
      text: `${oldStudent.name} foi ${action}.`,
      icon: 'info',
      confirmButtonColor: '#3085d6'
    });
  };

  const getProgressPercentage = (completed: number, total: number) => {
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="space-y-8 p-4 md:p-6">
      {/* Breadcrumb */}
      <BreadCrumb
        items={[
          { icon: <FaHome />, label: 'Página Inicial', href: '/coordenacao' },
          {
            icon: <FaGraduationCap />,
            label: 'Turmas',
            href: '/coordenacao/turma'
          },
          {
            icon: <FaUsers />,
            label: `Turma ${turma.codigo}`,
            href: `/coordenacao/turma/${turma.codigo}`
          }
        ]}
      />

      {/* Informações da Turma */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between sm:space-y-0">
            <div className="flex items-center space-x-4">
              {/* <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FaUsers className="w-6 h-6 text-blue-600" />
              </div> */}
              <div>
                <CardTitle className="text-xl">
                  Engenharia de Software
                </CardTitle>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Código da Turma
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {turma.codigo}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={copyCode}
                className="mt-3 sm:mt-0 flex items-center space-x-2"
              >
                <FaCopy className="w-4 h-4" />
                <span>Copiar</span>
              </Button>
            </div>

            <div className="flex flex-col justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-600">Período</p>
                <p className="text-lg font-bold text-gray-900">
                  {turma.periodo}
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-600">Turno</p>
                <p className="text-lg font-bold text-gray-900">{turma.turno}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Alunos */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <FaUser className="w-5 h-5" />
              <CardTitle>Alunos Matriculados</CardTitle>
            </div>
            <Badge variant="secondary" className="text-sm">
              {students.filter((s) => s.status === 'ativo').length} ativos
            </Badge>
          </div>
          <CardDescription>
            {students.length} alunos cadastrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {students.map((student) => (
              <div key={student.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FaUser className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {student.name}
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <FaClock className="w-4 h-4" />
                        <span>
                          {student.horasCompletadas} / {student.horasTotal}{' '}
                          horas
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                    <Badge
                      variant={
                        student.status === 'ativo' ? 'default' : 'secondary'
                      }
                      className="flex items-center space-x-1"
                    >
                      {student.status === 'ativo' ? (
                        <FaCheckCircle className="w-3 h-3" />
                      ) : (
                        <FaTimesCircle className="w-3 h-3" />
                      )}
                      <span>
                        {student.status === 'ativo' ? 'Ativo' : 'Inativo'}
                      </span>
                    </Badge>

                    <Button
                      variant={
                        student.status === 'ativo' ? 'destructive' : 'default'
                      }
                      size="sm"
                      onClick={() => toggleStudentStatus(student.id)}
                    >
                      {student.status === 'ativo' ? 'Desativar' : 'Ativar'}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso da carga horária</span>
                    <span>
                      {getProgressPercentage(
                        student.horasCompletadas,
                        student.horasTotal
                      )}
                      %
                    </span>
                  </div>
                  <Progress
                    value={getProgressPercentage(
                      student.horasCompletadas,
                      student.horasTotal
                    )}
                    className="h-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 rounded-lg p-4 sm:p-6">
        <h3 className="font-semibold text-blue-900 mb-2">Código da Turma</h3>
        <p className="text-blue-700 text-sm mb-3">
          Compartilhe o código <strong>{turma.codigo}</strong> com os alunos
          para que eles possam se inscrever na turma.
        </p>
        <Button
          variant="outline"
          onClick={copyCode}
          className="flex items-center space-x-2 text-blue-700 border-blue-300"
        >
          <FaCopy className="w-4 h-4" />
          <span>Copiar código da turma</span>
        </Button>
      </div>
    </div>
  );
};

export default VisualizarTurma;
