'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaCopy, FaCheck, FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';

import { StudentCard } from './_components/StudentCard';
import LoadingOverlay from '@/components/LoadingOverlay';
import { Badge } from '@/components/ui/badge';
import { BreadcrumbAuto } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import { useLoadingOverlay } from '@/hooks/useLoadingOverlay';
import {
  listarAlunosPorTurma,
  obterTurmaPorId,
  TurmaResponse,
  AlunoPorTurmaDetalhadoResponse
} from '@/services/classService';
import {
  obterCoordenadorAutenticado,
  type CoordenadorInfoResponse
} from '@/services/coordinatorService';
import {
  toggleStatusAluno,
  listarConcluidosComplementar,
  listarConcluidosExtensao,
  marcarDownloadComplementar,
  marcarDownloadExtensao
} from '@/services/studentService';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
import PizZip from 'pizzip';

const VisualizarTurma = () => {
  const { id } = useParams();
  const [turma, setTurma] = useState<TurmaResponse | null>(null);
  const [students, setStudents] = useState<AlunoPorTurmaDetalhadoResponse[]>(
    []
  );
  const [coordenador, setCoordenador] =
    useState<CoordenadorInfoResponse | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { visible, show, hide } = useLoadingOverlay();

  useEffect(() => {
    if (!id) return;
    const carregarDados = async () => {
      try {
        show();
        const [turmaResponse, alunosResponse, coordResponse] =
          await Promise.all([
            obterTurmaPorId(id as string),
            listarAlunosPorTurma(id as string),
            obterCoordenadorAutenticado()
          ]);
        setTurma(turmaResponse);
        setStudents(alunosResponse);
        setCoordenador(coordResponse);
      } catch (error) {
        console.error('Erro ao carregar dados da turma:', error);
        toast.error('Erro ao carregar dados da turma.');
      } finally {
        hide();
      }
    };
    carregarDados();
  }, [id, show, hide]);

  const copyCode = async () => {
    if (!turma) return;
    navigator.clipboard.writeText(turma.codigo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleStudentStatus = async (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;
    try {
      show();
      await toggleStatusAluno(studentId);
      const atualizados = await listarAlunosPorTurma(id as string);
      setStudents(atualizados);
      toast.info(
        `${student.nome} foi ${student.isAtivo ? 'desativado' : 'ativado'}.`
      );
    } catch {
      toast.error('Não foi possível alterar o status.');
    } finally {
      hide();
    }
  };

  const handleDownload = async (
    studentId: string,
    categoria: 'complementar' | 'extensao'
  ) => {
    if (!coordenador) return;

    setIsDownloading(true);
    try {
      const concluidos =
        categoria === 'complementar'
          ? await listarConcluidosComplementar()
          : await listarConcluidosExtensao();

      const aluno = concluidos.find((a) => a.id === studentId);
      if (!aluno) {
        toast.error(
          'Dados do aluno não encontrados para geração do relatório.'
        );
        return;
      }

      const response = await fetch('/docs/Coordenador-Requerimento.docx');
      const templateBuffer = await response.arrayBuffer();

      const safeString = (v: string | null | undefined) => v ?? '';

      const certs = aluno.certificados.map((cert, idx) => ({
        idx: idx + 1,
        tituloAtividade: safeString(cert.titulo),
        titulo: safeString(cert.titulo),
        instituicao: safeString(cert.instituicao) || safeString(cert.local),
        local: safeString(cert.local),
        categoria: safeString(cert.categoria),
        periodoLetivo: safeString(cert.periodoLetivo),
        periodoLetivoFaculdade: safeString(cert.periodoLetivo),
        cargaHoraria: cert.cargaHoraria || 0,
        dataInicioAtividade: safeString(cert.periodoInicio),
        dataFimAtividade: safeString(cert.periodoFim),
        dataInicio: safeString(cert.periodoInicio),
        dataFim: safeString(cert.periodoFim),
        totalPeriodos: cert.totalPeriodos || 1,
        especificacaoAtividade: safeString(cert.descricao),
        especificacao: safeString(cert.descricao),
        title: safeString(cert.titulo),
        periodo:
          cert.periodoInicio && cert.periodoFim
            ? `${safeString(cert.periodoInicio)} a ${safeString(cert.periodoFim)}`
            : safeString(cert.periodoInicio),
        descricao: safeString(cert.descricao)
      }));

      const docxVars = {
        Coordenador: coordenador.nome,
        curso: coordenador.curso,
        Portaria: coordenador.numeroPortaria,
        DOU: coordenador.dou,
        alunos: [
          {
            estudante: aluno.nome,
            matricula: aluno.matricula,
            carga: aluno.cargaHoraria
          }
        ],
        certs
      };

      const zip = new PizZip(templateBuffer);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true
      });
      doc.setData(docxVars);
      doc.render();

      const out = doc.getZip().generate({ type: 'blob' });
      saveAs(out, `contabilizacao_${aluno.nome?.replaceAll(' ', '_')}.docx`);

      if (categoria === 'complementar') {
        await marcarDownloadComplementar(studentId);
      } else {
        await marcarDownloadExtensao(studentId);
      }

      toast.success(`Relatório de ${aluno.nome} gerado com sucesso.`);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast.error('Não foi possível gerar o relatório.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-8 p-4 md:p-6">
      <LoadingOverlay show={visible || isDownloading} />

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
                <p className="text-lg font-bold text-gray-900">
                  {turma.codigo}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyCode}
                  className="mt-3 flex items-center space-x-2 cursor-pointer"
                >
                  {copied ? (
                    <FaCheck className="w-4 h-4 text-green-600" />
                  ) : (
                    <FaCopy className="w-4 h-4" />
                  )}
                  <span>{copied ? 'Copiado!' : 'Copiar'}</span>
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
              {[...students]
                .sort((a, b) => {
                  if (a.isAtivo !== b.isAtivo) return a.isAtivo ? -1 : 1;
                  return a.nome.localeCompare(b.nome, 'pt-BR');
                })
                .map((student) => (
                  <StudentCard
                    key={student.id}
                    student={student}
                    turma={turma}
                    onToggleStatus={toggleStudentStatus}
                    onDownload={handleDownload}
                    isDownloading={isDownloading}
                  />
                ))}
            </CardContent>
          </Card>

          <div className="bg-blue-50 rounded-lg p-4 sm:p-6">
            <h3 className="font-semibold text-blue-900 mb-2">
              Código da Turma
            </h3>
            <p className="text-blue-700 text-sm mb-3">
              Compartilhe o código <strong>{turma.codigo}</strong> com os alunos
              para que eles possam se inscrever na turma.
            </p>
            <Button
              variant="outline"
              onClick={copyCode}
              className="flex items-center space-x-2 text-blue-700 border-blue-300 cursor-pointer"
            >
              {copied ? (
                <FaCheck className="w-4 h-4 text-green-600" />
              ) : (
                <FaCopy className="w-4 h-4" />
              )}
              <span>{copied ? 'Copiado!' : 'Copiar código da turma'}</span>
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default VisualizarTurma;
