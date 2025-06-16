'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  FaPlus,
  FaEnvelope,
  FaPaperPlane,
  FaTimes,
  FaGraduationCap
} from 'react-icons/fa';

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
import Swal from 'sweetalert2';

// Tipagens
interface Coordinator {
  id: string;
  name: string;
}

interface Secretary {
  id: string;
  name: string;
}

interface ClassGroup {
  id: string;
  period: string;
  shift: string;
  students: number;
}

interface CourseDetails {
  id: string;
  name: string;
  coordinator: Coordinator | null;
  secretaries: Secretary[];
  classes: ClassGroup[];
}

export default function CourseDetailPage() {
  const router = useRouter();
  const { id: courseId } = useParams() as { id: string };

  const [courseData, setCourseData] = useState<CourseDetails | null>(null);

  /* estados dos modais … (sem alterações) */
  const [isCoordModalOpen, setIsCoordModalOpen] = useState(false);
  const [coordEmail, setCoordEmail] = useState('');
  const [isCoordLoading, setIsCoordLoading] = useState(false);

  const [isSecModalOpen, setIsSecModalOpen] = useState(false);
  const [secEmail, setSecEmail] = useState('');
  const [isSecLoading, setIsSecLoading] = useState(false);

  const [isTurmaModalOpen, setIsTurmaModalOpen] = useState(false);
  const [formData, setFormData] = useState({ periodo: '', cargaHorariaExtensao: '', turno: '' });
  const [isTurmaLoading, setIsTurmaLoading] = useState(false);

  /* mock de dados */
  useEffect(() => {
    setCourseData({
      id: courseId,
      name: 'Engenharia de Software',
      coordinator: { id: 'c1', name: 'Ana Lima' },
      secretaries: [
        { id: 's1', name: 'Carlos Mendes' },
        { id: 's2', name: 'Joana Ribeiro' }
      ],
      classes: [
        { id: '2025.1', period: '2025.1', shift: 'Noturno', students: 40 },
        { id: '2025.2', period: '2025.2', shift: 'Noturno', students: 35 },
        { id: '2025.3', period: '2025.3', shift: 'Noturno', students: 38 }
      ]
    });
  }, [courseId]);

  // Handlers Coordenador
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

    setIsCoordLoading(true);

    // Simulate API call
    setTimeout(async () => {
      // Exemplo comentado de integração real:
      // await fetch(`/api/curso/${courseData?.id}/coordenador`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email: coordEmail }),
      // });

      await Swal.fire({
        title: 'Convite enviado!',
        text: `Um e-mail foi enviado para ${coordEmail} com instruções para criar a conta.`,
        icon: 'success',
        confirmButtonColor: '#3085d6'
      });
      setCoordEmail('');
      setIsCoordLoading(false);
      setIsCoordModalOpen(false);
    }, 1000);
  };

  const handleSecSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const confirmation = await Swal.fire({
      title: 'Confirmar envio',
      text: `Deseja enviar convite para ${secEmail}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim, enviar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    });

    if (!confirmation.isConfirmed) return;

    setIsSecLoading(true);

    // Simulate API call
    setTimeout(async () => {
      // Exemplo comentado de integração real:
      // await fetch(`/api/curso/${courseData?.id}/secretaria`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email: secEmail }),
      // });

      await Swal.fire({
        title: 'Convite enviado!',
        text: `Um e-mail foi enviado para ${secEmail} com instruções para criar a conta.`,
        icon: 'success',
        confirmButtonColor: '#3085d6'
      });
      setSecEmail('');
      setIsSecLoading(false);
      setIsSecModalOpen(false);
    }, 1000);
  };

  const handleTurmaChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTurmaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

    // Simulate API call to backend, which returns the new turma ID
    try {
      // Exemplo comentado de integração real:
      // const response = await fetch(`/api/curso/${courseData?.id}/turmas`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     period: formData.periodo,
      //     turno: formData.turno,
      //     cargaHorariaExtensao: formData.cargaHorariaExtensao === 'sim'
      //   })
      // });
      // const data = await response.json();
      // const turmaId = data.id;

      // Enquanto aguarda resposta do backend, apenas simula com timeout
      setTimeout(async () => {
        // Suponha que back retornou algo como: { id: 'turma-123xyz' }
        const turmaId = 'turma-123xyz'; // será substituído pela resposta real

        await Swal.fire({
          title: 'Turma criada!',
          text: `Turma ${formData.periodo} (${formData.turno}) foi criada. Código: ${turmaId}`,
          icon: 'success',
          confirmButtonColor: '#3085d6'
        });

        setIsTurmaLoading(false);
        setIsTurmaModalOpen(false);

        // Redirecionamento desabilitado por enquanto:
        // router.push(`/curso/${courseData?.id}/${turmaId}`);
      }, 1000);
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Erro',
        text: 'Não foi possível criar a turma. Tente novamente.',
        icon: 'error',
        confirmButtonColor: '#3085d6'
      });
      setIsTurmaLoading(false);
    }
  };

  if (!courseData) return <p className="p-6">Carregando...</p>;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{courseData.name}</h1>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Coordenador */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Coordenador</h2>
          {courseData.coordinator ? (
            <div className="flex justify-between items-center">
              <span>{courseData.coordinator.name}</span>
            </div>
          ) : (
            <div className="max-w-xs mt-4">
              <RoundedButton
                text="Adicionar Coordenador"
                icon={<FaPlus />}
                onClick={handleAddCoordinatorClick}
              />
            </div>
          )}
        </div>

        {/* Secretarias */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Secretaria</h2>
          <ul className="space-y-2">
            {courseData.secretaries.map((sec) => (
              <li key={sec.id} className="flex justify-between items-center">
                <span>{sec.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Turmas */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Turmas</h2>
        </div>

        <table className="w-full text-sm">
          <thead className="border-b text-gray-600">
            <tr>
              <th className="py-2 text-left">Período</th>
              <th>Turno</th>
              <th>Alunos</th>
              <th className="text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {courseData.classes.map(cls => (
              <tr key={cls.id} className="border-b last:border-none">
                <td className="py-2">{cls.period}</td>
                <td>{cls.shift}</td>
                <td>{cls.students}</td>
                <td className="text-right">
                  <button
                    className="text-sm text-blue-600 border border-blue-600 px-3 py-1 rounded-full hover:bg-blue-50"
                    onClick={() => router.push(`/coordenacao/turma/${cls.id}`)}
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

      {/* Modal de Convite por E-mail - Secretário */}
      {isSecModalOpen && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg overflow-auto max-h-full w-full max-w-2xl p-7 relative">
            {/* Botão de fechar */}
            <button
              className="absolute top-0 mt-1 mb-1 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setIsSecModalOpen(false)}
            >
              <FaTimes className="w-6 h-6" />
            </button>

            <div className="max-w-2xl mx-auto space-y-8">
              <Card>
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaEnvelope className="w-8 h-8 text-green-600" />
                  </div>
                  <CardTitle>Convite por E-mail</CardTitle>
                  <CardDescription>
                    O secretário receberá um e-mail com um link para criar a
                    conta.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSecSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="sec-email">Email do secretário</Label>
                      <Input
                        id="sec-email"
                        type="email"
                        placeholder="secretario@docente.ifpe.edu.br"
                        value={secEmail}
                        onChange={(e) => setSecEmail(e.target.value)}
                        required
                        className="text-lg"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSecLoading}
                    >
                      {isSecLoading ? (
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

              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="font-semibold text-green-900 mb-2">
                  O que acontece depois?
                </h3>
                <ul className="text-green-700 space-y-1 text-sm">
                  <li>
                    • O secretário receberá um e-mail com link de ativação
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
