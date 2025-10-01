import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Swal from 'sweetalert2';
import { resetPasswordSchema, ResetPasswordSchema } from '../schemas/schema';
import { forgotPassword, validateResetCode, resetPassword as resetPasswordApi } from '@/services/authRecovery';

export const useResetPassword = () => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 4 = sucesso
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
    if (!email) return;
    setLoading(true);
    try {
      await forgotPassword({ email });
      setSubmittedEmail(email);
      setStep(2);
      Swal.fire({
        icon: 'success',
        title: 'Código enviado',
        text: 'Verifique sua caixa de entrada e spam.',
        confirmButtonColor: '#1351B4'
      });
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erro ao enviar código',
        text: err?.response?.data?.message ?? 'Tente novamente mais tarde.',
        confirmButtonColor: '#f87171'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleValidateCode = async () => {
    if (!code || !submittedEmail) return;
    setLoading(true);
    try {
      const res = await validateResetCode({ email: submittedEmail, code });
      if (res.valid) {
        setCodeValidated(true);
        setStep(3);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Código inválido',
          text: res.message ?? 'Verifique o código e tente novamente.',
          confirmButtonColor: '#f87171'
        });
      }
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erro ao validar código',
        text: err?.response?.data?.message ?? 'Tente novamente mais tarde.',
        confirmButtonColor: '#f87171'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (data: ResetPasswordSchema) => {
    if (!codeValidated || !submittedEmail || !code) return;
    setLoading(true);
    try {
      await resetPasswordApi({ email: submittedEmail, code, newPassword: data.senha });
      setStep(4);
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erro ao redefinir senha',
        text: err?.response?.data?.message ?? 'Tente novamente mais tarde.',
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
    codeValidated,
    setStep
  };
};
