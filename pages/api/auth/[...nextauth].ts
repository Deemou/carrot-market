/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable no-param-reassign */
import NextAuth, { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import client from '@/libs/server/client';
import type { Adapter } from 'next-auth/adapters';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { isSamePassword } from '@/libs/server/hash';
import { NextApiHandler } from 'next';

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV !== 'production',
  adapter: PrismaAdapter(client) as Adapter,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email Address',
          type: 'email'
        },
        password: { label: 'Password', type: 'password' }
      },

      async authorize(credentials) {
        if (!credentials) throw new Error('Invalid input');

        const { email, password } = credentials;

        const user = await client.user.findUnique({
          where: { email }
        });
        if (!user?.password) throw new Error('Invalid email or password.');

        const match = await isSamePassword(password, user.password);
        if (!match) throw new Error('Invalid email or password.');

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email
        };
      }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      profile(profile) {
        return {
          id: profile.id.toString() as string,
          name: (profile.name ?? profile.login) as string,
          email: profile.email as string
        };
      }
    })
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }

      return token;
    },
    async session({ session, token }) {
      console.log('provider에서 넘겨받은 정보', session);
      console.log('token', token);
      session.user.id = token.sub!;
      session.accessToken = token.accessToken;
      session.user.provider = token.provider;
      return session;
    }
  }
};

// export default NextAuth(authOptions);
const authHandler: NextApiHandler = (req, res) =>
  NextAuth(req, res, authOptions);
export default authHandler;
