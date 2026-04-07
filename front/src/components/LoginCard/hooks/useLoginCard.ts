'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { zodResolver } from '@hookform/resolvers/zod';

import { loginSchema, type LoginSchemaType } from '../schemas/schema';

export function useLoginCard() {
  const router = useRouter();

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const submitForm: SubmitHandler<LoginSchemaType> = async (data) => {
    const res = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false
    });

    if (res?.ok) {
      const session = await fetch('/api/auth/session').then((res) =>
        res.json()
      );
      const role = session?.user?.role;

      toast.success('Login efetuado com sucesso!');

      switch (role) {
        case 'admin':
          router.push('/curso');
          break;
        case 'aluno':
          router.push('/aluno');
          break;
        case 'coordenador':
          router.push('/coordenacao');
          break;
        default:
          router.push('/');
      }
    } else {
      toast.error('Credenciais inválidas. Verifique seu e-mail e senha.');
    }
  };

  return {
    form,
    submitForm
  };
}
