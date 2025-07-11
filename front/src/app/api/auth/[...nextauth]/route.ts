import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { LoginResponseDto } from '@/types/auth';
import axios from 'axios';
import https from 'https';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {},
        password: {}
      },
      async authorize(credentials) {
        try {
          const httpsAgent = new https.Agent({
            rejectUnauthorized: false // <- ignora certificado autoassinado
          });

          const response = await axios.post<LoginResponseDto>(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              email: credentials?.email,
              senha: credentials?.password
            },
            { httpsAgent }
          );

          const user = response.data;

          // Ensure role is one of the allowed values
          const allowedRoles = ['admin', 'coordenador', 'aluno'] as const;
          const userRole = user.role.toLowerCase();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (!allowedRoles.includes(userRole as any)) {
            throw new Error('Invalid user role');
          }
          return {
            id: user.email,
            name: user.nome,
            email: user.email,
            role: userRole as 'admin' | 'coordenador' | 'aluno',
            token: user.token
          };
        } catch (err) {
          console.error('Erro ao autenticar:', err);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/login'
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.token = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.name = token.name as string;
      session.user.email = token.email as string;
      session.user.role = token.role as 'admin' | 'coordenador' | 'aluno';
      session.token = token.token as string;
      return session;
    }
  }
});

export { handler as GET, handler as POST };
