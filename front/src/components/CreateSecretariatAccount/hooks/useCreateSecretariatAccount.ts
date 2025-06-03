import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import Swal from 'sweetalert2';

import {
  createSecretariatSchema,
  CreateSecretariatSchema
} from '../schemas/schema';

export const useCreateSecretariatAccount = () => {
  const [loading, setLoading] = useState(false);
  const [prefilledEmail, setPrefilledEmail] = useState('');

  const form = useForm<CreateSecretariatSchema>({
    resolver: zodResolver(createSecretariatSchema),
    mode: 'onChange'
  });

  const handleCreateSecretariat = async (data: CreateSecretariatSchema) => {
    setLoading(true);
    try {
      // Simulação de chamada ao backend:
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log('Dados da secretaria:', {
        nome: data.nome,
        email: prefilledEmail,
        senha: data.senha
      });

      await Swal.fire({
        icon: 'success',
        title: 'Conta criada com sucesso!',
        text: 'Agora você pode acessar o sistema.',
        confirmButtonColor: '#1351B4'
      });

      // Caso queira redirecionar:
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
    handleCreateSecretariat,
    prefilledEmail,
    setPrefilledEmail
  };
};
