'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import Swal from 'sweetalert2';

import { loginSchema, type LoginSchemaType } from '../schemas/schema';

export function useCardLogin() {
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

      await Swal.fire({
        icon: 'success',
        title: 'Login efetuado com sucesso!',
        confirmButtonColor: '#1351B4'
      });

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
      Swal.fire({
        icon: 'error',
        title: 'Credenciais inválidas',
        text: 'Verifique seu e-mail e senha.',
        confirmButtonColor: '#f87171'
      });
    }
  };

  return {
    form,
    submitForm
  };
}
