/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { withIronSessionApiRoute } from 'iron-session/next';

declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      id: number;
    };
  }
}

const cookieOptions = {
  cookieName: 'carrotsession',
  password: process.env.COOKIE_PASSWORD!
};

export default function withApiSession(fn: any) {
  return withIronSessionApiRoute(fn, cookieOptions);
}
