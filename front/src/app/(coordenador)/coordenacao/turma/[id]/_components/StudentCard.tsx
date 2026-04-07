import { FaCheckCircle, FaClock, FaDownload, FaTimesCircle, FaUser } from 'react-icons/fa';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

import {
  AlunoPorTurmaDetalhadoResponse,
  TurmaResponse
} from '@/services/classService';

interface StudentCardProps {
  student: AlunoPorTurmaDetalhadoResponse;
  turma: TurmaResponse;
  onToggleStatus: (studentId: string) => void;
  onDownload: (studentId: string, categoria: 'complementar' | 'extensao') => void;
  isDownloading?: boolean;
}

export const StudentCard = ({
  student,
  turma,
  onToggleStatus,
  onDownload,
  isDownloading = false
}: StudentCardProps) => {
  const complementarConcluido =
    student.maximoHorasComplementar > 0 &&
    student.totalHorasComplementar >= student.maximoHorasComplementar;

  const extensaoConcluida =
    turma.possuiExtensao &&
    student.maximoHorasExtensao > 0 &&
    student.totalHorasExtensao >= student.maximoHorasExtensao;

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <FaUser className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">{student.nome}</p>
            {turma.possuiExtensao && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <FaClock className="w-4 h-4" />
                <span>
                  {student.totalHorasExtensao} / {student.maximoHorasExtensao}{' '}
                  horas extensão
                </span>
              </div>
            )}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FaClock className="w-4 h-4" />
              <span>
                {student.totalHorasComplementar} /{' '}
                {student.maximoHorasComplementar} horas comp.
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          {complementarConcluido && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDownload(student.id, 'complementar')}
              disabled={isDownloading}
              className="text-green-700 border-green-300 hover:bg-green-50 cursor-pointer"
            >
              <FaDownload className="w-3 h-3 mr-1" />
              Complementar
            </Button>
          )}
          {extensaoConcluida && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDownload(student.id, 'extensao')}
              disabled={isDownloading}
              className="text-blue-700 border-blue-300 hover:bg-blue-50 cursor-pointer"
            >
              <FaDownload className="w-3 h-3 mr-1" />
              Extensão
            </Button>
          )}
          <Badge
            variant={student.isAtivo ? 'default' : 'secondary'}
            className="flex items-center space-x-1"
          >
            {student.isAtivo ? (
              <FaCheckCircle className="w-3 h-3" />
            ) : (
              <FaTimesCircle className="w-3 h-3" />
            )}
            <span>{student.isAtivo ? 'Ativo' : 'Inativo'}</span>
          </Badge>
          <Button
            variant={student.isAtivo ? 'destructive' : 'default'}
            size="sm"
            onClick={() => onToggleStatus(student.id)}
            className="cursor-pointer"
          >
            {student.isAtivo ? 'Desativar' : 'Ativar'}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progresso da carga horária</span>
          <span>{student.porcentagemConclusao.toFixed(0)}%</span>
        </div>
        <Progress value={student.porcentagemConclusao} className="h-2" />
      </div>
    </div>
  );
};
