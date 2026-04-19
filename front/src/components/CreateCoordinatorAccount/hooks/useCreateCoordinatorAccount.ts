'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { cadastrarCoordenador } from '@/services/coordinatorService';
import { zodResolver } from '@hookform/resolvers/zod';

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

      toast.success(
        'Conta criada com sucesso! Agora você pode acessar o sistema.'
      );
      router.push('/');
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || 'Erro ao criar conta. Tente novamente.'
      );
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
