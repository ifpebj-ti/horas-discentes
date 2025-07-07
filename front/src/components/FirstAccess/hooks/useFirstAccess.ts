import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { criarAluno } from '@/services/alunoService';
import { verificarTurmaExiste, obterTurmaPorId } from '@/services/turmaService';
import { zodResolver } from '@hookform/resolvers/zod';
import Swal from 'sweetalert2';

import { firstAccessSchema, FirstAccessSchema } from '../schemas/schema';

export const useFirstAccess = () => {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [codigo, setCodigo] = useState('');
  const [turma, setTurma] = useState<{ id: string; nome: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<FirstAccessSchema>({
    resolver: zodResolver(firstAccessSchema),
    mode: 'onChange'
  });

  const handleValidarCodigo = async () => {
    try {
      setLoading(true);
      const exists = await verificarTurmaExiste(codigo.trim());

      if (!exists) {
        Swal.fire({
          icon: 'error',
          title: 'Código inválido',
          text: 'Solicite ao coordenador ou à secretaria.',
          confirmButtonColor: '#f87171'
        });
        return;
      }

      const turmaData = await obterTurmaPorId(codigo.trim());

      const nomeTurma = `Turma de ${turmaData.cursoNome} ${turmaData.periodo}`;
      setTurma({ id: turmaData.id, nome: nomeTurma });
      setStep(2);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erro ao validar código',
        text: 'Tente novamente mais tarde.',
        confirmButtonColor: '#f87171'
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalizarCadastro = async (data: FirstAccessSchema) => {
    if (!turma) return;

    setLoading(true);
    try {
      await criarAluno({
        ...data,
        turmaId: turma.id
      });

      Swal.fire({
        icon: 'success',
        title: 'Cadastro realizado com sucesso!',
        text: 'Você pode acessar o sistema agora.',
        confirmButtonColor: '#1351B4'
      }).then(() => {
        router.push('/');
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Erro ao cadastrar',
        text: 'Tente novamente.',
        confirmButtonColor: '#f87171'
      });
      console.error('Erro ao cadastrar:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    step,
    setStep,
    codigo,
    setCodigo,
    turma,
    form,
    loading,
    handleValidarCodigo,
    handleFinalizarCadastro
  };
};
