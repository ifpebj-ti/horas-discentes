/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AuthOptions } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

import axios from 'axios';
import jwt_decode from 'jsonwebtoken';

interface BackendUser {
  nome: string;
  email: string;
  role: 'admin' | 'coordenador' | 'aluno';
  token: string;
}

interface DecodedToken {
  entidadeId?: string;
  isNewPpc?: string;
  cursoId?: string;
  turmaId?: string;
  [key: string]: unknown;
}

interface ExtendedToken extends JWT {
  accessToken: string;
  role: string;
  entidadeId?: string;
  isNewPpc?: boolean;
  nome?: string;
  cursoId?: string;
  turmaId?: string;
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Senha', type: 'password' }
      },
      async authorize(credentials) {
        try {
          const response = await axios.post<BackendUser>(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              email: credentials?.email,
              senha: credentials?.password
            }
          );

          const user = response.data;
          const userRole = user.role.toLowerCase();
          return {
            id: user.email,
            sub: user.email,
            name: user.nome,
            email: user.email,
            role: userRole as 'admin' | 'coordenador' | 'aluno',
            accessToken: user.token
          };
        } catch (error) {
          console.error('Erro ao autenticar:', error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/'
  },
  session: {
    strategy: 'jwt',
    maxAge: 4 * 60 * 60
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user && 'accessToken' in user) {
        const decoded = jwt_decode.decode(
          user.accessToken as string
        ) as DecodedToken;

        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.accessToken = user.accessToken as string;
        if (user.role === 'aluno') {
          token.entidadeId = decoded?.entidadeId as string;
          token.isNewPpc = decoded?.isNewPpc === 'true';
          token.cursoId = decoded?.cursoId as string;
          token.turmaId = decoded?.turmaId as string;
        }
        if (user.role === 'coordenador') {
          token.entidadeId = decoded?.entidadeId as string;
          token.cursoId = decoded?.cursoId as string;
        }
      }

      return token as ExtendedToken;
    },

    async session({ session, token }) {
      session.user.name = token.name as string;
      session.user.email = token.email as string;
      session.user.role = token.role as 'admin' | 'coordenador' | 'aluno';

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (session.user as any).entidadeId = token.entidadeId;
      (session.user as any).isNewPpc = token.isNewPpc;
      (session as any).token = token.accessToken;

      if (token.role === 'aluno') {
        (session.user as any).cursoId = token.cursoId;
        (session.user as any).turmaId = token.turmaId;
      }
      if (token.role === 'coordenador') {
        (session.user as any).cursoId = token.cursoId;
      }
      return session;
    }
  }
};
