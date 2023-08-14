import NextAuth, { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import client from '@/libs/server/client';
import type { Adapter } from 'next-auth/adapters';
import GithubProvider from 'next-auth/providers/github';
import KakaoProvider from 'next-auth/providers/kakao';
import NaverProvider from 'next-auth/providers/naver';
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
          avatar: user.avatar || ''
        };
      }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      allowDangerousEmailAccountLinking: true
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_ID,
      clientSecret: process.env.KAKAO_SECRET,
      allowDangerousEmailAccountLinking: true
    }),
    NaverProvider({
      clientId: process.env.NAVER_ID,
      clientSecret: process.env.NAVER_SECRET,
      allowDangerousEmailAccountLinking: true
    })
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, account, user, trigger, session }) {
      // This will only be true on the first login
      if (account && user) {
        if (user.email) {
          await client.user.update({
            where: { email: user.email },
            data: {
              emailVerified: true
            }
          });
        }

        return {
          ...token,
          ...user,
          provider: account.provider,
          accessToken: account.access_token
        };
      }
      if (trigger === 'update' && session) {
        return { ...token, ...session?.user };
      }

      return token;
    },
    async session({ session, token }) {
      console.log('session', session);
      console.log('token', token);
      return { ...session, user: token };
    }
  }
};

const authHandler: NextApiHandler = (req, res) =>
  NextAuth(req, res, authOptions);
export default authHandler;
