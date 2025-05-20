import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import Swal from 'sweetalert2';

import { resetPasswordSchema, ResetPasswordSchema } from '../schemas/schema';
export const useResetPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [codeValidated, setCodeValidated] = useState(false);

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange'
  });

  const handleSendCode = async () => {
    setLoading(true);
    try {
      // Simula envio de email
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmittedEmail(email);
      setStep(2);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: `Erro ao enviar código ${String(err)}`,
        text: 'Verifique se o email está correto.',
        confirmButtonColor: '#f87171'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleValidateCode = async () => {
    setLoading(true);
    try {
      // Simula validação
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (code === '123456') {
        setCodeValidated(true);
        setStep(3);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Código inválido',
          text: 'Verifique o código enviado para o seu email.',
          confirmButtonColor: '#f87171'
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: `Erro ao validar código ${String(err)}`,
        text: 'Tente novamente mais tarde.',
        confirmButtonColor: '#f87171'
      });
      alert('Erro na validação');
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleResetPassword = async (data: ResetPasswordSchema) => {
    setLoading(true);
    try {
      // Simula envio da nova senha
      await new Promise((resolve) => setTimeout(resolve, 1500));
      Swal.fire({
        icon: 'success',
        title: 'Senha redefinida com sucesso!',
        text: 'Você pode fazer login agora.',
        confirmButtonColor: '#1351B4'
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: `Erro ao redefinir a senha ${String(err)}`,
        text: 'Tente novamente mais tarde.',
        confirmButtonColor: '#f87171'
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    step,
    email,
    setEmail,
    code,
    setCode,
    submittedEmail,
    loading,
    form,
    handleSendCode,
    handleValidateCode,
    handleResetPassword,
    codeValidated
  };
};
