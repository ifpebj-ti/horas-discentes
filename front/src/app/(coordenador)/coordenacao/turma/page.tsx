'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaHome, FaGraduationCap, FaPlus, FaTimes } from 'react-icons/fa';

import BreadCrumb from '@/components/BreadCrumb';
import LoadingOverlay from '@/components/LoadingOverlay';
import { RoundedButton } from '@/components/RoundedButton';
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
} from '@/services/turmaService';
import Swal from 'sweetalert2';

export default function CourseDetailPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [turmas, setTurmas] = useState<TurmaResponse[]>([]);
  const { visible, show, hide } = useLoadingOverlay();
  const [isTurmaModalOpen, setIsTurmaModalOpen] = useState(false);
  const [isTurmaLoading, setIsTurmaLoading] = useState(false);

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

  const handleTurmaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.periodo ||
      !formData.turno ||
      !formData.cargaHorariaExtensao
    ) {
      Swal.fire('Erro', 'Preencha todos os campos corretamente.', 'error');
      return;
    }

    const confirmation = await Swal.fire({
      title: 'Confirmar criação',
      text: `Deseja criar a turma ${formData.periodo} (${formData.turno})?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim, criar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    });

    if (!confirmation.isConfirmed) return;

    setIsTurmaLoading(true);

    try {
      const novaTurma = await criarTurma({
        periodo: formData.periodo,
        turno: formData.turno,
        possuiExtensao: formData.cargaHorariaExtensao === 'sim',
        cursoId: cursoId
      });

      await Swal.fire({
        title: 'Turma criada!',
        text: `Turma ${novaTurma.periodo} (${novaTurma.turno}) foi criada.`,
        icon: 'success',
        confirmButtonColor: '#3085d6'
      });

      const turmasAtualizadas = await obterTurmasPorCurso(cursoId);
      setTurmas(turmasAtualizadas);

      setIsTurmaModalOpen(false);
      setFormData({ periodo: '', turno: '', cargaHorariaExtensao: '' });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Erro',
        text: 'Não foi possível criar a turma. Tente novamente.',
        icon: 'error',
        confirmButtonColor: '#3085d6'
      });
    } finally {
      setIsTurmaLoading(false);
    }
  };

  const handleAddTurmaClick = () => {
    setIsTurmaModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6 relative">
      <LoadingOverlay show={visible} />

      <BreadCrumb
        items={[
          { icon: <FaHome />, label: 'Página Inicial', href: '/coordenacao' },
          { icon: <FaGraduationCap />, label: 'Turma', href: '' }
        ]}
      />

      <div>
        <h1 className="text-2xl font-bold">
          {turmas[0]?.cursoNome || 'Curso'}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-4 border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Coordenador</h2>
          <ul className="space-y-2">
            <li className="flex justify-between items-center">
              <span>{nomeCoordenador || 'N/A'}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Turmas</h2>
          <div className="max-w-xs">
            <RoundedButton
              text="Criar Nova Turma"
              icon={<FaPlus />}
              onClick={handleAddTurmaClick}
            />
          </div>
        </div>

        {turmas.length === 0 ? (
          <p className="text-gray-600 px-4 py-2">Nenhuma turma cadastrada.</p>
        ) : (
          <table className="w-full text-sm rounded-lg overflow-hidden">
            <thead className="border-b text-gray-600">
              <tr>
                <th className="py-2 text-left px-4">Período</th>
                <th className="text-center">Turno</th>
                <th className="text-center">Alunos</th>
                <th className="text-right px-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {turmas.map((turma) => (
                <tr
                  key={turma.id}
                  className="border-b last:border-none even:bg-white"
                >
                  <td className="py-2 px-4">{turma.periodo}</td>
                  <td className="text-center capitalize">{turma.turno}</td>
                  <td className="text-center">{turma.quantidadeAlunos}</td>
                  <td className="text-right px-4">
                    <button
                      className="text-xs px-2 py-0.5 sm:text-sm sm:px-3 sm:py-1 text-blue-600 border border-blue-600 rounded-full hover:bg-blue-600 hover:text-white cursor-pointer"
                      onClick={() =>
                        router.push(`/coordenacao/turma/${turma.id}`)
                      }
                    >
                      Visualizar turma
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isTurmaModalOpen && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg overflow-auto max-h-full w-full max-w-2xl p-7 relative">
            <button
              className="absolute top-0 mt-1 mb-1 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setIsTurmaModalOpen(false)}
            >
              <FaTimes className="w-6 h-6" />
            </button>

            <div className="max-w-2xl mx-auto space-y-8">
              <Card>
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaGraduationCap className="w-8 h-8 text-purple-600" />
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
                        <>
                          <FaPlus className="w-4 h-4 mr-2" />
                          Criar turma
                        </>
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
