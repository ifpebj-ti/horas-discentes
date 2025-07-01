import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import Swal from 'sweetalert2';

import {
  createCoordinatorSchema,
  CreateCoordinatorSchema
} from '..//schemas/schema';

export const useCreateCoordinatorAccount = () => {
  const [loading, setLoading] = useState(false);
  const [prefilledEmail, setPrefilledEmail] = useState('');

  const form = useForm<CreateCoordinatorSchema>({
    resolver: zodResolver(createCoordinatorSchema),
    mode: 'onChange'
  });

  const handleCreateCoordinator = async (data: CreateCoordinatorSchema) => {
    setLoading(true);
    try {
      // Simulação de integração com backend:
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log('Dados do coordenador:', {
        ...data,
        email: prefilledEmail
      });

      await Swal.fire({
        icon: 'success',
        title: 'Conta criada com sucesso!',
        text: 'Agora você pode acessar o sistema.',
        confirmButtonColor: '#1351B4'
      });

      // Se quiser redirecionar após sucesso:
      // router.push('/login');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Erro ao criar conta',
        text: err.message || 'Tente novamente.',
        confirmButtonColor: '#f87171'
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    handleCreateCoordinator,
    prefilledEmail,
    setPrefilledEmail
  };
};
