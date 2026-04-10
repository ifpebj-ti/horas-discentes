'use client';

import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { CONSTANTS } from '@/config/constants';
import { atualizarMeusDados } from '@/services/coordinatorService';
import { faLock } from '@fortawesome/free-solid-svg-icons';

export default function PerfilCoordenadorPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState(session?.user.email ?? '');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (novaSenha && novaSenha !== confirmarSenha) {
      toast.error('As senhas não coincidem!');
      return;
    }

    setLoading(true);
    try {
      await atualizarMeusDados({
        email,
        ...(novaSenha ? { senha: novaSenha } : {})
      });
      toast.success(
        'Dados atualizados com sucesso! Faça login novamente para sua segurança.'
      );
      setTimeout(() => {
        signOut();
        router.push('/');
      }, CONSTANTS.REDIRECT_DELAY);
    } catch (error) {
      toast.error(
        'Erro ao atualizar dados! Tente novamente ou procure o suporte.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-start min-h-[60vh] py-8 px-2">
      <h1 className="text-2xl font-bold mb-6 text-primary">Meus Dados</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-lg shadow-md max-w-md w-full p-6 space-y-5"
      >
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
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>
        <div>
          <label
            htmlFor="senha-atual"
            className="block text-gray-700 font-semibold mb-1"
          >
            Senha atual{' '}
            <span className="font-normal text-xs text-gray-500">
              (necessária para autenticação)
            </span>
          </label>
          <Input
            id="senha-atual"
            isPassword
            icon={faLock}
            autoComplete="current-password"
            value={senhaAtual}
            onChange={(e) => setSenhaAtual(e.target.value)}
            disabled={loading}
          />
        </div>
        <div>
          <label
            htmlFor="nova-senha"
            className="block text-gray-700 font-semibold mb-1"
          >
            Nova Senha
          </label>
          <Input
            id="nova-senha"
            isPassword
            icon={faLock}
            autoComplete="new-password"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            disabled={loading}
          />
        </div>
        <div>
          <label
            htmlFor="confirmar-senha"
            className="block text-gray-700 font-semibold mb-1"
          >
            Confirmar Nova Senha
          </label>
          <Input
            id="confirmar-senha"
            isPassword
            icon={faLock}
            autoComplete="new-password"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            disabled={loading}
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full mt-4">
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </form>
    </main>
  );
}
