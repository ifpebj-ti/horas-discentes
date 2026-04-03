import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { criarAluno } from '@/services/studentService';
import { verificarTurmaExiste, obterTurmaPorId } from '@/services/classService';
import { zodResolver } from '@hookform/resolvers/zod';

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
        toast.error('Código inválido. Solicite ao coordenador ou à secretaria.');
        return;
      }

      const turmaData = await obterTurmaPorId(codigo.trim());
      const nomeTurma = `Turma de ${turmaData.cursoNome} ${turmaData.periodo}`;
      setTurma({ id: turmaData.id, nome: nomeTurma });
      setStep(2);
    } catch (error) {
      toast.error('Erro ao validar código. Tente novamente mais tarde.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalizarCadastro = async (data: FirstAccessSchema) => {
    if (!turma) return;

    setLoading(true);
    try {
      await criarAluno({ ...data, turmaId: turma.id });
      toast.success('Cadastro realizado com sucesso! Você pode acessar o sistema agora.');
      router.push('/');
    } catch (err) {
      toast.error('Erro ao cadastrar. Tente novamente.');
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
