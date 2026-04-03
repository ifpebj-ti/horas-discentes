'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { faEnvelope, faKey } from '@fortawesome/free-solid-svg-icons';

import { Input } from '@/components/ui/input';
import { Button } from '../ui/button';
import { useResetPassword } from './hooks/useResetPassword';
import { StepsDots } from './StepsDots';

export const ResetPassword = () => {
  const {
    step,
    email,
    setEmail,
    code,
    setCode,
    loading,
    submittedEmail,
    form,
    handleSendCode,
    handleValidateCode,
    handleResetPassword,
    codeValidated,
    setStep
  } = useResetPassword();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = form;

  const senha = watch('senha') || '';
  const confirmarSenha = watch('confirmarSenha') || '';
  const senhasIguais = senha === confirmarSenha && confirmarSenha.length > 0;

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 w-full">
      <div className="flex flex-col items-center justify-center  p-8">
        <div className="max-w-[460px] w-full">
          <Image
            src="/login.svg"
            alt="Recuperação Segura"
            width={420}
            height={420}
            className="mx-auto mb-6"
          />
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 text-center">
            Recuperação Segura
          </h2>
          <p className="text-slate-500 text-center mt-2">
            Siga os passos para redefinir sua senha de forma segura e rápida no
            sistema HoraMais.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 md:p-10 bg-white">
        <div className="w-full max-w-xl">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-extrabold text-primary">HoraMais</h1>
            <p className="text-slate-500 -mt-1">Sistema de Gestão de Tempo</p>
          </div>

          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-[0_20px_60px_rgba(2,6,23,0.12)] p-6 md:p-8">
            {step === 1 && (
              <>
                <h2 className="text-xl font-bold text-center text-slate-800 mb-1">
                  Recuperar Senha
                </h2>
                <p className="text-slate-500 text-center">
                  Digite seu e-mail institucional para receber o código de
                  recuperação
                </p>
                <StepsDots active={1} />

                <form
                  className="mt-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendCode();
                  }}
                >
                  <label className="block mb-1 text-sm text-slate-600">
                    E-mail
                  </label>
                  <Input
                    placeholder="seuemail@discente.ifpe.edu.br"
                    icon={faEnvelope}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="mt-6">
                    <Button
                      type="submit"
                      disabled={loading || !email}
                      className="w-full"
                      shape="pill"
                    >
                      {loading ? 'Enviando...' : 'Enviar Código'}
                    </Button>
                  </div>
                </form>

                <p className="text-center text-sm text-slate-500 mt-6">
                  Lembrou da senha?{' '}
                  <Link href="/" className="text-primary font-semibold">
                    Fazer login
                  </Link>
                </p>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-xl font-bold text-center text-slate-800 mb-1">
                  Validar Código
                </h2>
                <p className="text-slate-500 text-center">
                  Digite o código de 6 dígitos enviado para seu e-mail
                </p>
                <StepsDots active={2} />

                <form
                  className="mt-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleValidateCode();
                  }}
                >
                  <p className="text-sm text-slate-600 mb-2 text-center">
                    Código enviado para{' '}
                    <span className="font-semibold">{submittedEmail}</span>
                  </p>
                  <label className="block mb-1 text-sm text-slate-600">
                    Código
                  </label>
                  <Input
                    placeholder="000000"
                    icon={faKey}
                    value={code}
                    onChange={(e) =>
                      setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                    }
                  />
                  <div className="flex items-center gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
                    >
                      <FaArrowLeft /> Voltar
                    </button>
                    <div className="flex-1">
                      <Button
                        type="submit"
                        disabled={loading || code.length !== 6}
                        className="w-full"
                        shape="pill"
                      >
                        {loading ? 'Validando...' : 'Validar Código'}
                      </Button>
                    </div>
                  </div>
                </form>
              </>
            )}

            {step === 3 && codeValidated && (
              <>
                <h2 className="text-xl font-bold text-center text-slate-800 mb-1">
                  Nova Senha
                </h2>
                <p className="text-slate-500 text-center">
                  Crie uma nova senha segura para sua conta
                </p>
                <StepsDots active={3} />

                <form
                  className="mt-4"
                  onSubmit={handleSubmit(handleResetPassword)}
                >
                  <div className="mb-4">
                    <label className="block mb-1 text-sm text-slate-600">
                      Nova senha
                    </label>
                    <Input
                      isPassword
                      placeholder="Nova senha"
                      {...register('senha')}
                    />
                    <ul className="mt-2 space-y-1 text-sm">
                      <li
                        className={`${senha.length >= 8 ? 'text-green-600' : 'text-slate-500'}`}
                      >
                        • Mínimo de 8 caracteres
                      </li>
                      <li
                        className={`${/[A-Z]/.test(senha) ? 'text-green-600' : 'text-slate-500'}`}
                      >
                        • Pelo menos uma letra maiúscula
                      </li>
                      <li
                        className={`${/[a-z]/.test(senha) ? 'text-green-600' : 'text-slate-500'}`}
                      >
                        • Pelo menos uma letra minúscula
                      </li>
                      <li
                        className={`${/[0-9]/.test(senha) ? 'text-green-600' : 'text-slate-500'}`}
                      >
                        • Pelo menos um número
                      </li>
                      <li
                        className={`${/[!@#$%^&*(),.?":{}|<>]/.test(senha) ? 'text-green-600' : 'text-slate-500'}`}
                      >
                        • Pelo menos um caractere especial
                      </li>
                    </ul>
                    {errors.senha && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.senha.message}
                      </p>
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="block mb-1 text-sm text-slate-600">
                      Confirmar senha
                    </label>
                    <Input
                      isPassword
                      placeholder="Confirmar senha"
                      {...register('confirmarSenha')}
                    />
                    {errors.confirmarSenha && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.confirmarSenha.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
                    >
                      <FaArrowLeft /> Voltar
                    </button>
                    <div className="flex-1">
                      <Button
                        type="submit"
                        disabled={loading || !isValid || !senhasIguais}
                        className="w-full"
                        shape="pill"
                      >
                        {loading ? 'Salvando...' : 'Salvar Nova Senha'}
                      </Button>
                    </div>
                  </div>
                </form>
              </>
            )}

            {step === 4 && (
              <div className="text-center py-8">
                <h2 className="text-2xl font-extrabold text-emerald-600">
                  Sucesso!
                </h2>
                <p className="text-slate-500 mt-2">
                  Sua senha foi redefinida com sucesso!
                </p>
                <div className="mt-8">
                  <Link
                    href="/"
                    className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-xl shadow hover:bg-primary/90"
                  >
                    Ir para Login
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
