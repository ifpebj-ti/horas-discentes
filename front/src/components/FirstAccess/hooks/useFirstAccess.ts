import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import Swal from 'sweetalert2';

import { firstAccessSchema, FirstAccessSchema } from '../schemas/schema';
export const useFirstAccess = () => {
  const [step, setStep] = useState(1);
  const [codigo, setCodigo] = useState('');
  const [turma, setTurma] = useState<{ id: string; nome: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<FirstAccessSchema>({
    resolver: zodResolver(firstAccessSchema),
    mode: 'onChange'
  });

  const handleValidarCodigo = () => {
    if (codigo.trim() === 'ABC123') {
      setTurma({ id: '1', nome: 'Turma de Engenharia 2024' });
      setStep(2);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Código inválido',
        text: 'Solicite ao coordenador ou a Secretária.',
        confirmButtonColor: '#f87171'
      });
    }
  };

  const handleFinalizarCadastro = async (data: FirstAccessSchema) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulação

      console.log('Dados enviados:', { ...data, turmaId: turma?.id });
      Swal.fire({
        icon: 'success',
        title: 'Cadastro realizado com sucesso!',
        text: 'Você pode acessar o sistema agora.',
        confirmButtonColor: '#1351B4'
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Erro ao cadastrar',
        text: String(err),
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
