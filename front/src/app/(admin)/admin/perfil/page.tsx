'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
// IMPORTANTE: necessário criar ou ajustar o service para admin.
// import { atualizarAdmin } from '@/services/adminService';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import Swal from 'sweetalert2';

export default function PerfilAdminPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState(session?.user.email ?? '');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (novaSenha && novaSenha !== confirmarSenha) {
      Swal.fire({ icon: 'error', title: 'As senhas não coincidem!' });
      return;
    }
    setLoading(true);
    try {
      // await atualizarAdmin({
      //   email: email,
      //   senha: novaSenha || undefined,
      // });
      await new Promise((res) => setTimeout(res, 800)); // simulação
      Swal.fire({
        icon: 'success',
        title: 'Dados atualizados com sucesso!',
        text: 'Faça login novamente para sua segurança.',
        timer: 2500,
        showConfirmButton: false
      });
      setTimeout(() => {
        signOut();
        router.push('/');
      }, 2000);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao atualizar dados!',
        text: 'Tente novamente ou procure o suporte.'
      });
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
            type="password"
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
            type="password"
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
            type="password"
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
