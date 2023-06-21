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
          email: user.email,
          avatar: ''
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
          email: profile.email as string,
          avatar: ''
        };
      }
    })
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, account, user, trigger, session }) {
      // This will only be true on the first login
      if (account && user) {
        return {
          ...token,
          ...user,
          provider: account.provider,
          accessToken: account.access_token
        };
      }
      if (trigger === 'update' && session) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return { ...token, ...session?.user };
      }

      return token;
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    }
  }
};

const authHandler: NextApiHandler = (req, res) =>
  NextAuth(req, res, authOptions);
export default authHandler;
