'use client';

import Image from 'next/image';
import { FaUser, FaIdCard, FaRegNewspaper } from 'react-icons/fa';

import { Input } from '@/components/Input';
import { InputPassword } from '@/components/InputPassword';
import { RoundedButton } from '@/components/RoundedButton';

import { useCreateCoordinatorAccount } from './hooks/useCreateCoordinatorAccount';

interface Props {
  emailFromURL: string;
  tokenFromURL: string;
}

export const CreateCoordinatorAccount = ({
  emailFromURL,
  tokenFromURL
}: Props) => {
  const {
    form: { register, handleSubmit, watch, formState },
    loading,
    handleCreateCoordinator,
    prefilledEmail
  } = useCreateCoordinatorAccount(emailFromURL, tokenFromURL);

  const { errors, isValid } = formState;
  const senha = watch('senha') || '';

  return (
    <div className="min-h-screen grid md:grid-cols-2 w-full">
      {/* Imagem à esquerda */}
      <div className="flex items-start md:items-center justify-center bg-white pt-4 pb-0">
        <Image
          src="/login.svg"
          alt="Criar Conta Coordenador"
          width={400}
          height={400}
          className="w-auto h-auto max-w-[300px] md:max-w-[400px]"
        />
      </div>

      {/* Formulário à direita */}
      <div className="flex flex-col justify-center items-center px-6 md:px-12 pb-4 md:pb-0">
        <form
          onSubmit={handleSubmit(handleCreateCoordinator)}
          className="w-full max-w-md"
        >
          <h1 className="text-3xl md:text-4xl font-extrabold text-center text-[#1351B4] pb-2 mb-8 tracking-wide drop-shadow-sm">
            Criar Conta de Coordenador
          </h1>

          {/* Nome Completo */}
          <div className="mb-4">
            <label className="block mb-1 text-sm">Nome completo:</label>
            <Input
              placeholder="Nome completo"
              icon={FaUser}
              {...register('nome')}
            />
            {errors.nome && (
              <p className="text-xs text-red-500 mt-1">{errors.nome.message}</p>
            )}
          </div>

          {/* Número da Portaria */}
          <div className="mb-4">
            <label className="block mb-1 text-sm">Número da Portaria:</label>
            <Input
              placeholder="Ex: 1234/2025"
              icon={FaIdCard}
              {...register('portaria')}
            />
            {errors.portaria && (
              <p className="text-xs text-red-500 mt-1">
                {errors.portaria.message}
              </p>
            )}
          </div>

          {/* Diário Oficial da União (DOU) */}
          <div className="mb-4">
            <label className="block mb-1 text-sm">
              Diário Oficial da União (DOU):
            </label>
            <Input
              placeholder="Data ou referência do DOU"
              icon={FaRegNewspaper}
              {...register('dou')}
            />
            {errors.dou && (
              <p className="text-xs text-red-500 mt-1">{errors.dou.message}</p>
            )}
          </div>

          {/* Email (readonly) */}
          <div className="mb-4">
            <label className="block mb-1 text-sm">Email:</label>
            <Input
              placeholder="Email"
              icon={FaUser}
              value={prefilledEmail}
              readOnly
            />
          </div>

          {/* Senha */}
          <div className="mb-4">
            <label className="block mb-1 text-sm">Senha:</label>
            <InputPassword
              placeholder="Digite sua senha"
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
                className={`${/[!@#$%^&*(),.?":{}|<>_\-\]]/.test(senha) ? 'text-green-600' : 'text-gray-500'}`}
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

          {/* Confirmar Senha */}
          <div className="mb-6">
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

          <div className="mb-4">
            <RoundedButton
              type="submit"
              text={loading ? 'Criando...' : 'Criar Conta'}
              disabled={loading || !isValid}
              bgColor="bg-[#1351B4]"
              textColor="text-white"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCoordinatorAccount;
