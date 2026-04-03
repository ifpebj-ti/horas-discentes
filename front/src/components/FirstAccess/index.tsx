'use client';

import Image from 'next/image';
import {
  faEnvelope,
  faUser,
  faIdBadge,
  faKey
} from '@fortawesome/free-solid-svg-icons';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { useFirstAccess } from './hooks/useFirstAccess';

export const FirstAccess = () => {
  const {
    step,
    codigo,
    setCodigo,
    turma,
    form,
    loading,
    handleValidarCodigo,
    handleFinalizarCadastro
  } = useFirstAccess();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = form;

  const senha = watch('senha') || '';

  return (
    <div className="min-h-screen grid md:grid-cols-2 w-full">
      <div className="flex items-start md:items-center justify-center bg-white pt-4 pb-0">
        <Image
          src="/login.svg"
          alt="Primeiro Acesso"
          width={400}
          height={400}
          className="w-auto h-auto max-w-[300px] md:max-w-[400px]"
        />
      </div>

      <div className="flex flex-col justify-center items-center px-6 md:px-12 pb-4 md:pb-0">
        <div className="w-full max-w-md">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-[#1351B4] mb-6">
            Primeiro Acesso
          </h1>

          {step === 1 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleValidarCodigo();
              }}
            >
              <label className="block mb-1 text-sm">Código</label>
              <Input
                placeholder="Código"
                icon={faKey}
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
              />
              <div className="flex items-center gap-2 bg-[#1351B4] text-white text-sm p-2 rounded-md mb-6 mt-0.5">
                <span>Solicite o código ao coordenador ou a Secretária</span>
              </div>

              <Button
                onClick={handleValidarCodigo}
                className="w-full"
                shape="pill"
              >
                Continuar
              </Button>
            </form>
          )}

          {step === 2 && turma && (
            <form onSubmit={handleSubmit(handleFinalizarCadastro)}>
              <p className="text-sm text-gray-700 mb-4 text-center">
                Entrando na turma: <strong>{turma.nome}</strong>
              </p>

              <div className="mb-3">
                <label className="block mb-1 text-sm">Nome:</label>
                <Input
                  placeholder="Nome completo"
                  icon={faUser}
                  {...register('nome')}
                />
                {errors.nome && (
                  <p className="text-xs text-red-500">{errors.nome.message}</p>
                )}
              </div>

              <div className="mb-3">
                <label className="block mb-1 text-sm">Email:</label>
                <Input
                  placeholder="Digite seu email institucional"
                  icon={faEnvelope}
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="mb-3">
                <label className="block mb-1 text-sm">Matrícula:</label>
                <Input
                  placeholder="Matrícula"
                  icon={faIdBadge}
                  {...register('matricula')}
                />
                {errors.matricula && (
                  <p className="text-xs text-red-500">
                    {errors.matricula.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block mb-1 text-sm">Senha:</label>
                <Input
                  isPassword
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
                    • Pelo menos 1 letra maiúscula (A–Z)
                  </li>
                  <li
                    className={`${/[a-z]/.test(senha) ? 'text-green-600' : 'text-gray-500'}`}
                  >
                    • Pelo menos 1 letra minúscula (a–z)
                  </li>
                  <li
                    className={`${/[0-9]/.test(senha) ? 'text-green-600' : 'text-gray-500'}`}
                  >
                    • Pelo menos 1 número (0–9)
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

              <div className="mb-4">
                <label className="block mb-1 text-sm">Confirmar Senha:</label>
                <Input
                  isPassword
                  placeholder="Confirmar Senha"
                  {...register('confirmarSenha')}
                />

                {errors.confirmarSenha && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.confirmarSenha.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading || !isValid}
                className="w-full"
                shape="pill"
              >
                {loading ? 'Finalizando...' : 'Finalizar'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
