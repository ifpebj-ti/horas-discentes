// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      name: string;
      email: string;
      role: 'admin' | 'coordenador' | 'aluno';
      sub: string;
      isNewPpc?: boolean;
      entidadeId?: string; // opcional
      cursoId?: string; // opcional
      turmaId?: string; // opcional
    };
    token: string;
  }

  interface User {
    name: string;
    email: string;
    role: 'admin' | 'coordenador' | 'aluno';
    sub: string;
    isNewPpc?: boolean; // opcional
  }
}
