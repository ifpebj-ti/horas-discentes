'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  FaPlus,
  FaEnvelope,
  FaPaperPlane,
  FaTimes,
  FaGraduationCap,
  FaHome
} from 'react-icons/fa';

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
  enviarConviteCoordenador,
  obterCoordenadorPorCurso
} from '@/services/coordenadorService';
import { obterTurmasPorCurso, criarTurma } from '@/services/turmaService';
import Swal from 'sweetalert2';

export default function CourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const cursoId = typeof params.id === 'string' ? params.id : '';
  const { visible, show, hide } = useLoadingOverlay();

  const [courseName, setCourseName] = useState('');
  const [coordinator, setCoordinator] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [classes, setClasses] = useState<any[]>([]);

  const [isCoordModalOpen, setIsCoordModalOpen] = useState(false);
  const [coordEmail, setCoordEmail] = useState('');
  const [isCoordLoading, setIsCoordLoading] = useState(false);

  const [isTurmaModalOpen, setIsTurmaModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    periodo: '',
    cargaHorariaExtensao: '',
    turno: ''
  });
  const [isTurmaLoading, setIsTurmaLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!cursoId) return;
      try {
        show();
        const [coordenador, turmas] = await Promise.all([
          obterCoordenadorPorCurso(cursoId),
          obterTurmasPorCurso(cursoId)
        ]);

        setCoordinator(coordenador?.nome || null);
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
    setCoordEmail('');
    setIsCoordLoading(false);
    setIsCoordModalOpen(true);
  };

  const handleCoordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const confirmation = await Swal.fire({
      title: 'Confirmar envio',
      text: `Deseja enviar convite para ${coordEmail}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim, enviar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    });

    if (!confirmation.isConfirmed) return;

    try {
      setIsCoordLoading(true);
      await enviarConviteCoordenador({ email: coordEmail, cursoId });
      await Swal.fire({
        title: 'Convite enviado!',
        text: `Um e-mail foi enviado para ${coordEmail} com instruções para criar a conta.`,
        icon: 'success',
        confirmButtonColor: '#3085d6'
      });
      setIsCoordModalOpen(false);
    } catch (error) {
      console.error(error);
      Swal.fire('Erro', 'Não foi possível enviar o convite.', 'error');
    } finally {
      setIsCoordLoading(false);
    }
  };

  const handleAddTurmaClick = () => {
    setFormData({ periodo: '', cargaHorariaExtensao: '', turno: '' });
    setIsTurmaModalOpen(true);
  };

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

    try {
      setIsTurmaLoading(true);
      await criarTurma({
        periodo: formData.periodo,
        turno: formData.turno,
        possuiExtensao: formData.cargaHorariaExtensao === 'sim',
        cursoId
      });

      await Swal.fire({
        title: 'Turma criada!',
        text: `Turma ${formData.periodo} (${formData.turno}) foi criada.`,
        icon: 'success',
        confirmButtonColor: '#3085d6'
      });

      const turmasAtualizadas = await obterTurmasPorCurso(cursoId);
      setClasses(
        turmasAtualizadas.map((t) => ({
          id: t.id,
          period: t.periodo,
          shift: t.turno,
          students: t.quantidadeAlunos
        }))
      );
      setIsTurmaModalOpen(false);
    } catch (error) {
      console.error(error);
      Swal.fire('Erro', 'Não foi possível criar a turma.', 'error');
    } finally {
      setIsTurmaLoading(false);
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
            <span>{coordinator}</span>
          </div>
        ) : (
          <div className="max-w-xs mt-4 cursor-pointer">
            <RoundedButton
              text="Adicionar Coordenador"
              icon={<FaPlus />}
              onClick={handleAddCoordinatorClick}
            />
          </div>
        )}
      </div>

      {/* Turmas */}
      <div className="bg-white shadow rounded-lg p-4">
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
                  <button
                    className="text-sm text-blue-600 border border-blue-600 px-3 py-1 rounded-full hover:bg-blue-50"
                    onClick={() => router.push(`/curso/${cursoId}/${cls.id}`)}
                  >
                    Visualizar turma
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Convite por E-mail - Coordenador */}
      {isCoordModalOpen && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg overflow-auto max-h-full w-full max-w-2xl p-7 relative">
            {/* Botão de fechar */}
            <button
              className="absolute top-0 mt-1 mb-1 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setIsCoordModalOpen(false)}
            >
              <FaTimes className="w-6 h-6" />
            </button>

            <div className="max-w-2xl mx-auto space-y-8">
              <Card>
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaEnvelope className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle>Convite por E-mail</CardTitle>
                  <CardDescription>
                    O coordenador receberá um e-mail com um link para criar a
                    conta.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCoordSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="coord-email">Email do coordenador</Label>
                      <Input
                        id="coord-email"
                        type="email"
                        placeholder="coordenador@docente.ifpe.edu.br"
                        value={coordEmail}
                        onChange={(e) => setCoordEmail(e.target.value)}
                        required
                        className="text-lg"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isCoordLoading}
                    >
                      {isCoordLoading ? (
                        <>Enviando...</>
                      ) : (
                        <>
                          <FaPaperPlane className="w-4 h-4 mr-2" />
                          Enviar convite
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-2">
                  O que acontece depois?
                </h3>
                <ul className="text-blue-700 space-y-1 text-sm">
                  <li>
                    • O coordenador receberá um e-mail com link de ativação
                  </li>
                  <li>• Ele poderá criar sua conta com dados completos</li>
                  <li>• Após ativação, terá acesso ao sistema</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Cadastro de Turma */}
      {isTurmaModalOpen && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg overflow-auto max-h-full w-full max-w-2xl p-7 relative">
            {/* Botão de fechar */}
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
