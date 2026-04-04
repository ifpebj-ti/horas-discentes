'use client';

import { CircleUserRound, LogOut, ShieldCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface UserProfileProps {
  user: {
    name?: string | null;
    role?: string;
  };
  onLogout: () => void;
}

const roleLabel: Record<string, string> = {
  ALUNO: 'Aluno(a)',
  COORDENADOR: 'Coordenador(a)',
  ADMIN: 'Administrador(a)'
};

export default function UserProfile({ user, onLogout }: UserProfileProps) {
  const displayRole = user.role ? (roleLabel[user.role.toUpperCase()] ?? user.role) : '';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="default" className="rounded-full">
          <CircleUserRound className="h-6 w-6" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-xs font-semibold mb-2 text-muted-foreground">Usuário:</p>
            <p className="text-sm font-medium leading-none">{user.name}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <div className="px-2 py-1.5">
          <p className="text-xs font-semibold mb-2 text-muted-foreground">Perfil:</p>
          <div className="flex items-center text-sm text-gray-800">
            <ShieldCheck className="mr-2 h-4 w-4 text-green-600 flex-shrink-0" />
            <span>{displayRole}</span>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={onLogout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
