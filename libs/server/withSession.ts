/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next';

declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      id: number;
    };
    auth?: {
      email: string;
    };
  }
}

const cookieOptions = {
  cookieName: process.env.COOKIE_NAME!,
  password: process.env.COOKIE_PASSWORD!
};

export default function withApiSession(fn: any) {
  return withIronSessionApiRoute(fn, cookieOptions);
}

export function withSsrSession(handler: any) {
  return withIronSessionSsr(handler, cookieOptions);
}
