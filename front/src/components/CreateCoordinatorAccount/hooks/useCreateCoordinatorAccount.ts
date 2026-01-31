'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { COLORS } from '@/config/colors';
import { cadastrarCoordenador } from '@/services/coordinatorService';
import { zodResolver } from '@hookform/resolvers/zod';
import Swal from 'sweetalert2';

import {
  createCoordinatorSchema,
  type CreateCoordinatorSchema
} from '../schemas/schema';

export const useCreateCoordinatorAccount = (
  emailFromURL: string,
  tokenFromURL: string
) => {
  const [loading, setLoading] = useState(false);
  const [prefilledEmail, setPrefilledEmail] = useState('');
  const [token, setToken] = useState('');
  const router = useRouter();

  const form = useForm<CreateCoordinatorSchema>({
    resolver: zodResolver(createCoordinatorSchema),
    mode: 'onChange'
  });

  useEffect(() => {
    setPrefilledEmail(decodeURIComponent(emailFromURL || ''));
    setToken(tokenFromURL || '');
  }, [emailFromURL, tokenFromURL]);

  const handleCreateCoordinator = async (data: CreateCoordinatorSchema) => {
    setLoading(true);
    try {
      await cadastrarCoordenador({
        nome: data.nome,
        numeroPortaria: data.portaria,
        dou: data.dou,
        email: prefilledEmail,
        senha: data.senha,
        token
      });

      await Swal.fire({
        icon: 'success',
        title: 'Conta criada com sucesso!',
        text: 'Agora você pode acessar o sistema.',
        confirmButtonColor: COLORS.primary
      });

      router.push('/');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      await Swal.fire({
        icon: 'error',
        title: 'Erro ao criar conta',
        text: err?.response?.data?.message || 'Tente novamente.',
        confirmButtonColor: COLORS.danger
      });
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
