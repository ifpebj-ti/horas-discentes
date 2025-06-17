'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  FaHome,
  FaGraduationCap,
  FaPlus,
  FaEnvelope,
  FaPaperPlane,
  FaTimes
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
import BreadCrumb from '@/components/BreadCrumb';

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
      <BreadCrumb
                items={[
                  { icon: <FaHome />, label: 'Página Inicial', href: '/coordenacao' },
                  { icon: <FaGraduationCap />, label: 'Turma', href: '' }
                ]}
              />
      <div>
        <h1 className="text-2xl font-bold">{courseData.name}</h1>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Coordenador */}
        <div className="bg-white shadow rounded-lg p-4 border border-gray-200">
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
        <div className="bg-white shadow rounded-lg p-4 border border-gray-200">
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
      <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200 overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Turmas</h2>
        </div>

        <table className="w-full text-sm rounded-lg overflow-hidden">
          <thead className="border-b text-gray-600 bg-gray-50">
            <tr>
              <th className="py-2 text-left px-4">Período</th>
              <th className="text-center">Turno</th>
              <th className="text-center">Alunos</th>
              <th className="text-right px-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {courseData.classes.map(cls => (
              <tr key={cls.id} className="border-b last:border-none odd:bg-gray-50 even:bg-white hover:bg-gray-100">
                <td className="py-2 px-4">{cls.period}</td>
                <td className="text-center">{cls.shift}</td>
                <td className="text-center">{cls.students}</td>
                <td className="text-right px-4">
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
    </div>
  );
}
