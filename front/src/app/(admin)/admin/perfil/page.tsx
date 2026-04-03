'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { CONSTANTS } from '@/config/constants';
import {
  forgotPassword,
  validateResetCode,
  resetPassword
} from '@/services/authRecovery';
import { toast } from 'react-toastify';

export default function PerfilAdminPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [email] = useState(session?.user?.email ?? '');

  // Estados para reset de senha via código
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [codigoEnviado, setCodigoEnviado] = useState(false);
  const [codigoValidado, setCodigoValidado] = useState(false);
  const [codigoReset, setCodigoReset] = useState('');
  const [novaSenhaReset, setNovaSenhaReset] = useState('');
  const [confirmarSenhaReset, setConfirmarSenhaReset] = useState('');
  const [loadingReset, setLoadingReset] = useState(false);

  return (
    <main className="flex flex-col items-center justify-start min-h-[60vh] py-8 px-2">
      <h1 className="text-2xl font-bold mb-6 text-primary">Meus Dados</h1>

      {/* Informações do perfil */}
      <div className="bg-white border rounded-lg shadow-md max-w-md w-full p-6 space-y-5 mb-6">
        <div>
          <label
            htmlFor="email"
            className="block text-gray-700 font-semibold mb-1"
          >
            E-mail
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            readOnly
            disabled
            className="bg-gray-100 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">
            O e-mail não pode ser alterado por questões de segurança.
          </p>
        </div>
      </div>

      {/* Seção de Reset de Senha via Código */}
      <div className="mt-8 w-full max-w-md">
        <div className="bg-white border rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Resetar Senha via Código
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Se você deseja redefinir sua senha, pode solicitar um código de
            redefinição por e-mail.
          </p>

          {!showResetPassword ? (
            <Button
              type="button"
              onClick={handleSolicitarCodigo}
              disabled={loadingReset}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white"
            >
              {loadingReset ? 'Enviando...' : 'Solicitar Código de Redefinição'}
            </Button>
          ) : (
            <div className="space-y-4">
              {/* Passo 2: Validar código */}
              {codigoEnviado && !codigoValidado && (
                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor="codigo-reset"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Código de 6 dígitos
                    </label>
                    <Input
                      id="codigo-reset"
                      type="text"
                      maxLength={6}
                      value={codigoReset}
                      onChange={(e) =>
                        setCodigoReset(e.target.value.replace(/\D/g, ''))
                      }
                      placeholder="000000"
                      disabled={loadingReset}
                      className="text-center text-lg tracking-widest"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Digite o código de 6 dígitos enviado para seu e-mail
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={handleValidarCodigo}
                    disabled={loadingReset || codigoReset.length !== 6}
                    className="w-full"
                  >
                    {loadingReset ? 'Validando...' : 'Validar Código'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSolicitarCodigo}
                    disabled={loadingReset}
                    className="w-full"
                  >
                    {loadingReset ? 'Enviando...' : 'Reenviar Código'}
                  </Button>
                </div>
              )}

              {/* Passo 3: Redefinir senha */}
              {codigoValidado && (
                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor="nova-senha-reset"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Nova Senha
                    </label>
                    <Input
                      id="nova-senha-reset"
                      type="password"
                      value={novaSenhaReset}
                      onChange={(e) => setNovaSenhaReset(e.target.value)}
                      disabled={loadingReset}
                      placeholder="Digite sua nova senha"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="confirmar-senha-reset"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Confirmar Nova Senha
                    </label>
                    <Input
                      id="confirmar-senha-reset"
                      type="password"
                      value={confirmarSenhaReset}
                      onChange={(e) => setConfirmarSenhaReset(e.target.value)}
                      disabled={loadingReset}
                      placeholder="Confirme sua nova senha"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleRedefinirSenha}
                    disabled={
                      loadingReset ||
                      !novaSenhaReset ||
                      novaSenhaReset !== confirmarSenhaReset ||
                      novaSenhaReset.length < 6
                    }
                    className="w-full"
                  >
                    {loadingReset ? 'Redefinindo...' : 'Redefinir Senha'}
                  </Button>
                </div>
              )}

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowResetPassword(false);
                  setCodigoEnviado(false);
                  setCodigoValidado(false);
                  setCodigoReset('');
                  setNovaSenhaReset('');
                  setConfirmarSenhaReset('');
                }}
                className="w-full mt-2"
              >
                Cancelar
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );

  // Função para solicitar código
  async function handleSolicitarCodigo() {
    if (!email) {
      toast.error('É necessário ter um e-mail cadastrado para solicitar o código.');
      return;
    }

    setLoadingReset(true);
    try {
      await forgotPassword({ email });
      setShowResetPassword(true);
      setCodigoEnviado(true);
      toast.success('Código enviado! Verifique seu e-mail e digite o código de 6 dígitos recebido.');
    } catch (error: unknown) {
      console.error('Erro ao solicitar código:', error);
      const err = error as {
        response?: {
          status?: number;
          data?: { message?: string; detail?: string };
        };
        message?: string;
      };

      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.message ||
        'Não foi possível enviar o código. Tente novamente.';

      toast.error(errorMessage);
    } finally {
      setLoadingReset(false);
    }
  }

  // Função para validar código
  async function handleValidarCodigo() {
    if (codigoReset.length !== 6) {
      toast.error('O código deve ter exatamente 6 dígitos.');
      return;
    }

    setLoadingReset(true);
    try {
      const response = await validateResetCode({
        email,
        code: codigoReset
      });

      if (response.valid) {
        setCodigoValidado(true);
        toast.success('Código válido! Agora você pode definir sua nova senha.');
      } else {
        toast.error(response.message || 'O código informado não é válido.');
      }
    } catch (error: unknown) {
      console.error('Erro ao validar código:', error);
      const err = error as {
        response?: {
          status?: number;
          data?: { message?: string; detail?: string };
        };
        message?: string;
      };

      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.message ||
        'Não foi possível validar o código. Tente novamente.';

      toast.error(errorMessage);
    } finally {
      setLoadingReset(false);
    }
  }

  // Função para redefinir senha
  async function handleRedefinirSenha() {
    if (novaSenhaReset !== confirmarSenhaReset) {
      toast.error('As senhas informadas não são iguais.');
      return;
    }

    if (novaSenhaReset.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setLoadingReset(true);
    try {
      await resetPassword({
        email,
        code: codigoReset,
        newPassword: novaSenhaReset
      });

      toast.success('Senha redefinida com sucesso! Faça login novamente com sua nova senha.');

      setTimeout(() => {
        signOut();
        router.push('/');
      }, CONSTANTS.REDIRECT_DELAY);
    } catch (error: unknown) {
      console.error('Erro ao redefinir senha:', error);
      const err = error as {
        response?: {
          status?: number;
          data?: { message?: string; detail?: string };
        };
        message?: string;
      };

      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.message ||
        'Não foi possível redefinir a senha. Tente novamente.';

      toast.error(errorMessage);
    } finally {
      setLoadingReset(false);
    }
  }
}
