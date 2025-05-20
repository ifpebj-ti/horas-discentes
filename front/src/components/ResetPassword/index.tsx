'use client';

import Image from 'next/image';
import { FaEnvelope, FaKey } from 'react-icons/fa';

import { Input } from '../Input';
import { InputPassword } from '../InputPassword';
import { RoundedButton } from '../RoundedButton';
import { useResetPassword } from './hooks/useResetPassword';

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
    codeValidated
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
    <div className="min-h-screen grid md:grid-cols-2 w-full">
      <div className="flex items-start md:items-center justify-center bg-white pt-4 pb-0">
        <Image
          src="/login.svg"
          alt="Redefinir Senha"
          width={400}
          height={400}
          className="w-auto h-auto max-w-[300px] md:max-w-[400px]"
        />
      </div>

      <div className="flex flex-col justify-center items-center px-6 md:px-12 pb-4 md:pb-0">
        <div className="w-full max-w-md">
          <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">
            Redefinir Senha
          </h1>

          {step === 1 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendCode();
              }}
            >
              <label className="block mb-1 text-sm">Email:</label>
              <Input
                placeholder="Digite seu email institucional"
                icon={FaEnvelope}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="mt-2" />
              <RoundedButton
                text={loading ? 'Enviando...' : 'Enviar Código'}
                type="submit"
                disabled={loading || !email}
                bgColor="bg-[#1351B4]"
                textColor="text-white"
              />
            </form>
          )}

          {step === 2 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleValidateCode();
              }}
            >
              <p className="text-sm text-gray-600 mb-2 text-center">
                Enviamos um código para: <strong>{submittedEmail}</strong>
              </p>
              <label className="block mb-1 text-sm">Código:</label>
              <Input
                placeholder="Digite o código"
                icon={FaKey}
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <p className="mt-2" />
              <RoundedButton
                text={loading ? 'Validando...' : 'Continuar'}
                type="submit"
                disabled={loading || !code}
                bgColor="bg-[#1351B4]"
                textColor="text-white"
              />
            </form>
          )}

          {step === 3 && codeValidated && (
            <form onSubmit={handleSubmit(handleResetPassword)}>
              <div className="mb-4">
                <label className="block mb-1 text-sm">Nova Senha:</label>
                <InputPassword
                  placeholder="Nova senha"
                  {...register('senha')}
                />
                <ul className="mt-2 space-y-1 text-sm">
                  <li
                    className={`${senha.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}
                  >
                    • Mínimo de 8 caracteres
                  </li>
                  <li
                    className={`${/[A-Z]/.test(senha) ? 'text-green-600' : 'text-gray-500'}`}
                  >
                    • Pelo menos 1 letra maiúscula
                  </li>
                  <li
                    className={`${/[a-z]/.test(senha) ? 'text-green-600' : 'text-gray-500'}`}
                  >
                    • Pelo menos 1 letra minúscula
                  </li>
                  <li
                    className={`${/[0-9]/.test(senha) ? 'text-green-600' : 'text-gray-500'}`}
                  >
                    • Pelo menos 1 número
                  </li>
                  <li
                    className={`${/[!@#$%^&*(),.?":{}|<>]/.test(senha) ? 'text-green-600' : 'text-gray-500'}`}
                  >
                    • Pelo menos 1 caractere especial
                  </li>
                </ul>
                {errors.senha && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.senha.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block mb-1 text-sm">Confirmar Senha:</label>
                <InputPassword
                  placeholder="Confirmar Senha"
                  {...register('confirmarSenha')}
                />

                {errors.confirmarSenha && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.confirmarSenha.message}
                  </p>
                )}
              </div>

              <RoundedButton
                type="submit"
                text={loading ? 'Salvando...' : 'Finalizar'}
                disabled={loading || !isValid || !senhasIguais}
                bgColor="bg-[#1351B4]"
                textColor="text-white"
              />
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
