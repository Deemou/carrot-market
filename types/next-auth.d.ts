import NextAuth, { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      provider: string;
      avatar: string | undefined;
    } & DefaultSession['user'];
    accessToken: string | undefined;
  }
  interface User {
    id: string;
    name: string | null | undefined;
    email: string | null | undefined;
    avatar: string | undefined;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    provider: string;
    name: string | undefined;
    avatar: string | undefined;
    accessToken: string | undefined;
  }
}
