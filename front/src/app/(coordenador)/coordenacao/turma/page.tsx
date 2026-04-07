'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

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
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';

import { useLoadingOverlay } from '@/hooks/useLoadingOverlay';
import {
  obterTurmasPorCurso,
  TurmaResponse,
  criarTurma
} from '@/services/classService';
import {
  faPlus,
  faTimes,
  faGraduationCap
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function CourseDetailPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [turmas, setTurmas] = useState<TurmaResponse[]>([]);
  const { visible, show, hide } = useLoadingOverlay();
  const [isTurmaModalOpen, setIsTurmaModalOpen] = useState(false);
  const [isTurmaLoading, setIsTurmaLoading] = useState(false);
  const [confirmCreate, setConfirmCreate] = useState(false);

  const cursoId = session?.user?.cursoId || '';
  const nomeCoordenador = session?.user?.name || '';

  const [formData, setFormData] = useState({
    periodo: '',
    turno: '',
    cargaHorariaExtensao: ''
  });

  useEffect(() => {
    const fetchTurmas = async () => {
      try {
        show();
        if (cursoId) {
          const data = await obterTurmasPorCurso(cursoId);
          setTurmas(data);
        }
      } catch (error) {
        console.error('Erro ao buscar turmas:', error);
      } finally {
        hide();
      }
    };

    fetchTurmas();
  }, [cursoId, show, hide]);

  const handleTurmaChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTurmaSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.periodo ||
      !formData.turno ||
      !formData.cargaHorariaExtensao
    ) {
      toast.error('Preencha todos os campos corretamente.');
      return;
    }

    setConfirmCreate(true);
  };

  const executeCreateTurma = async () => {
    setIsTurmaLoading(true);

    try {
      const novaTurma = await criarTurma({
        periodo: formData.periodo,
        turno: formData.turno,
        possuiExtensao: formData.cargaHorariaExtensao === 'sim',
        cursoId: cursoId
      });

      toast.success(
        `Turma ${novaTurma.periodo} (${novaTurma.turno}) foi criada.`
      );

      const turmasAtualizadas = await obterTurmasPorCurso(cursoId);
      setTurmas(turmasAtualizadas);

      setIsTurmaModalOpen(false);
      setFormData({ periodo: '', turno: '', cargaHorariaExtensao: '' });
    } catch (error) {
      console.error(error);
      toast.error('Não foi possível criar a turma. Tente novamente.');
    } finally {
      setIsTurmaLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 relative">
      <LoadingOverlay show={visible} />

      <AlertDialog open={confirmCreate} onOpenChange={setConfirmCreate}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar criação</AlertDialogTitle>
            <AlertDialogDescription>
              Deseja criar a turma {formData.periodo} ({formData.turno})?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={executeCreateTurma}>
              Sim, criar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BreadcrumbAuto />

      <div>
        <h1 className="text-2xl font-bold">
          {turmas[0]?.cursoNome || 'Curso'}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-sm rounded-lg py-2.5 px-3 border border-gray-200">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">
            Coordenador
          </h2>
          <p className="text-base font-bold text-gray-800">
            {nomeCoordenador || 'N/A'}
          </p>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
            Turmas
          </h2>
          <div className="max-w-xs">
            <Button
              icon={faPlus}
              onClick={() => setIsTurmaModalOpen(true)}
              size="sm"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white"
            >
              Criar Nova Turma
            </Button>
          </div>
        </div>

        {turmas.length === 0 ? (
          <p className="text-gray-600 p-8 text-center">
            Nenhuma turma cadastrada.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead
                className="text-left text-gray-700 text-xs uppercase tracking-wide"
                style={{
                  backgroundColor: '#F2F2F2',
                  borderBottom: '1px solid #D1D1D1'
                }}
              >
                <tr>
                  <th className="px-4 py-3">Período</th>
                  <th className="px-4 py-3 text-center">Turno</th>
                  <th className="px-4 py-3 text-center">Alunos</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {turmas.map((turma) => (
                  <tr
                    key={turma.id}
                    className="border-b last:border-none hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {turma.periodo}
                    </td>
                    <td className="px-4 py-3 text-center capitalize text-gray-600">
                      {turma.turno}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600">
                      {turma.quantidadeAlunos}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          router.push(`/coordenacao/turma/${turma.codigo}`)
                        }
                        className="bg-gray-100 hover:bg-gray-200 text-blue-700 font-semibold"
                      >
                        Visualizar turma
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isTurmaModalOpen && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg overflow-auto max-h-full w-full max-w-2xl p-7 relative">
            <button
              className="absolute top-0 mt-1 mb-1 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setIsTurmaModalOpen(false)}
            >
              <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
            </button>

            <div className="max-w-2xl mx-auto space-y-8">
              <Card>
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FontAwesomeIcon
                      icon={faGraduationCap}
                      className="w-8 h-8 text-purple-600"
                    />
                  </div>
                  <CardTitle>Informações da Turma</CardTitle>
                  <CardDescription>
                    Preencha todos os campos para criar uma nova turma
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleTurmaSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="periodo">Período da turma</Label>
                      <Input
                        id="periodo"
                        type="text"
                        placeholder="Ex: 2025.1"
                        value={formData.periodo}
                        onChange={(e) =>
                          handleTurmaChange('periodo', e.target.value)
                        }
                        required
                      />
                      <p className="text-sm text-gray-500">
                        Formato sugerido: AAAA.S (ano.semestre)
                      </p>
                    </div>

                    <div className="space-y-4">
                      <Label>Essa turma tem carga horária de extensão?</Label>
                      <RadioGroup
                        value={formData.cargaHorariaExtensao}
                        onValueChange={(value) =>
                          handleTurmaChange('cargaHorariaExtensao', value)
                        }
                        className="flex space-x-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="sim" id="sim" />
                          <Label htmlFor="sim">Sim</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="nao" id="nao" />
                          <Label htmlFor="nao">Não</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="turno">Turno</Label>
                      <Select
                        value={formData.turno}
                        onValueChange={(value) =>
                          handleTurmaChange('turno', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o turno" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manha">Manhã</SelectItem>
                          <SelectItem value="tarde">Tarde</SelectItem>
                          <SelectItem value="noite">Noite</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={
                        isTurmaLoading ||
                        !formData.periodo ||
                        !formData.cargaHorariaExtensao ||
                        !formData.turno
                      }
                    >
                      {isTurmaLoading ? (
                        <>Criando turma...</>
                      ) : (
                        <>Criar turma</>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <div className="bg-purple-50 rounded-lg p-6">
                <h3 className="font-semibold text-purple-900 mb-2">
                  Próximos passos
                </h3>
                <ul className="text-purple-700 space-y-1 text-sm">
                  <li>• Após criar a turma, você receberá um código único</li>
                  <li>
                    • Use este código para que alunos se inscrevam na turma
                  </li>
                  <li>• Você poderá gerenciar alunos e acompanhar progresso</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
