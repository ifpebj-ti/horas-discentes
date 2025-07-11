import NextAuth from 'next-auth';

import { authOptions } from '@/lib/authOptions'; // ajuste o path se necessário

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
