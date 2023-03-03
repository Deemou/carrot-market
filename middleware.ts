/* eslint-disable consistent-return */
import { getIronSession } from 'iron-session/edge';
import {
  NextFetchEvent,
  NextRequest,
  NextResponse,
  userAgent
} from 'next/server';

const loginUrl = '/login';
const signUpUrl = '/sign-up';

export const middleware = async (req: NextRequest, ev: NextFetchEvent) => {
  function isAuthPages() {
    return req.url.includes(loginUrl) || req.url.includes(signUpUrl);
  }

  if (userAgent(req).isBot) {
    return new NextResponse('No mercy for bot.', {
      status: 403
    });
  }

  const res = NextResponse.next();
  const session = await getIronSession(req, res, {
    cookieName: process.env.COOKIE_NAME!,
    password: process.env.COOKIE_PASSWORD!,
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production' // if you are using https
    }
  });

  if (!session.user && !isAuthPages()) {
    req.nextUrl.searchParams.set('from', req.nextUrl.pathname);
    req.nextUrl.pathname = loginUrl;
    return NextResponse.redirect(req.nextUrl);
  }
};

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
