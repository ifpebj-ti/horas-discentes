'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { cadastrarCoordenador } from '@/services/coordenadorService';
import { zodResolver } from '@hookform/resolvers/zod';
import Swal from 'sweetalert2';

import {
  createCoordinatorSchema,
  CreateCoordinatorSchema
} from '../schemas/schema';

export const useCreateCoordinatorAccount = () => {
  const [loading, setLoading] = useState(false);
  const [prefilledEmail, setPrefilledEmail] = useState('');
  const [token, setToken] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<CreateCoordinatorSchema>({
    resolver: zodResolver(createCoordinatorSchema),
    mode: 'onChange'
  });

  useEffect(() => {
    const email = searchParams.get('email');
    const tokenParam = searchParams.get('token');
    if (email) setPrefilledEmail(decodeURIComponent(email));
    if (tokenParam) setToken(tokenParam);
  }, [searchParams]);

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
        confirmButtonColor: '#1351B4'
      });

      router.push('/');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      await Swal.fire({
        icon: 'error',
        title: 'Erro ao criar conta',
        text: err?.response?.data?.message || 'Tente novamente.',
        confirmButtonColor: '#f87171'
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
