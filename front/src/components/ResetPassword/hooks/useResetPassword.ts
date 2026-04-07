import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import {
  forgotPassword,
  validateResetCode,
  resetPassword as resetPasswordApi
} from '@/services/authRecovery';
import { zodResolver } from '@hookform/resolvers/zod';

import { resetPasswordSchema, ResetPasswordSchema } from '../schemas/schema';

export const useResetPassword = () => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
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
      toast.success('Código enviado! Verifique sua caixa de entrada e spam.');
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ??
          'Erro ao enviar código. Tente novamente mais tarde.'
      );
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
        toast.error(
          res.message ?? 'Código inválido. Verifique e tente novamente.'
        );
      }
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ??
          'Erro ao validar código. Tente novamente mais tarde.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (data: ResetPasswordSchema) => {
    if (!codeValidated || !submittedEmail || !code) return;
    setLoading(true);
    try {
      await resetPasswordApi({
        email: submittedEmail,
        code,
        newPassword: data.senha
      });
      setStep(4);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ??
          'Erro ao redefinir senha. Tente novamente mais tarde.'
      );
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
