import NextAuth, { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      provider: string;
    } & DefaultSession['user'];
    accessToken: string | undefined;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    provider: string;
    accessToken: string | undefined;
  }
}
