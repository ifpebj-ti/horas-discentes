'use client';

import Image from 'next/image';
import { FaEnvelope, FaCircleNotch } from 'react-icons/fa';

import { useRedirectIfAuthenticated } from '../../hooks/useRedirectIfAuthenticateduseRedirectIfAuthenticated';
import { Input } from '../Input';
import { InputPassword } from '../InputPassword';
import { RoundedButton } from '../RoundedButton';
import { useCardLogin } from './hooks/useCardLogin';

export const CardLogin = () => {
  useRedirectIfAuthenticated();
  const {
    form: { register, handleSubmit, formState },
    submitForm
  } = useCardLogin();

  const { errors } = formState;

  return (
    <div className="min-h-screen grid md:grid-cols-2 w-full">
      <div className="flex items-start md:items-center justify-center pt-4 pb-0">
        <Image
          src="/login.svg"
          alt="Login"
          width={400}
          height={400}
          className="w-auto h-auto max-w-[300px] md:max-w-[400px]"
        />
      </div>

      <div className="flex flex-col justify-center items-center px-6 md:px-12 pb-4 md:pb-0">
        <form onSubmit={handleSubmit(submitForm)} className="w-full max-w-md">
          <h1 className="text-3xl md:text-6xl font-extrabold text-center text-[#1351B4] pb-2 mb-8 tracking-wide drop-shadow-sm">
            HoraMais
          </h1>

          <div className="mb-4">
            <label htmlFor="email" className="block mb-1 text-sm">
              Email:
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Digite seu email institucional."
              icon={FaEnvelope}
              {...register('email')}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="mb-1">
            <label htmlFor="password" className="block mb-1 text-sm">
              Senha:
            </label>
            <InputPassword
              id="password"
              placeholder="Digite sua senha de segurança."
              {...register('password')}
            />

            {errors.password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <p className="text-sm text-gray-600 mb-2">
            Digite sua senha de segurança.
          </p>

          <div className="text-right mb-4">
            <button
              type="button"
              className="text-sm text-[#0a0b0b] hover:underline"
            >
              Esqueceu a senha?
            </button>
          </div>

          <div className="flex items-center mb-6">
            <input type="checkbox" id="keepConnected" className="mr-2" />
            <label htmlFor="keepConnected" className="text-sm">
              Manter-me conectado
            </label>
          </div>

          <div className="w-full">
            <RoundedButton
              type="submit"
              text={formState.isSubmitting ? 'Entrando...' : 'Entrar'}
              bgColor="bg-[#1351B4]"
              textColor="text-white"
              disabled={formState.isSubmitting}
              icon={
                formState.isSubmitting ? (
                  <FaCircleNotch className="animate-spin" />
                ) : undefined
              }
            />
          </div>

          <hr className="my-6 border-t-2 border-gray-300 rounded-2xl" />

          <div className="text-center">
            <a
              href="primeiroAcesso"
              className="text-[#1351B4] font-medium hover:underline"
            >
              Primeiro Acesso?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};
