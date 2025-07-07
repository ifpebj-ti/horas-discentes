// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      name: string;
      email: string;
      role: 'admin' | 'coordenador' | 'aluno';
    };
    token: string;
  }

  interface User {
    name: string;
    email: string;
    role: 'admin' | 'coordenador' | 'aluno';
    token: string;
  }
}
