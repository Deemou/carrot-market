import {
  NextFetchEvent,
  NextRequest,
  NextResponse,
  userAgent
} from 'next/server';
import { getToken } from 'next-auth/jwt';
import { HOME_URL, LOGIN_URL, PROFILE_URL, SIGNUP_URL } from './routes';

export const middleware = async (req: NextRequest, ev: NextFetchEvent) => {
  function isAuthPages() {
    return req.url.includes(LOGIN_URL) || req.url.includes(SIGNUP_URL);
  }
  function isAuthNeededPages() {
    return req.url.endsWith(PROFILE_URL);
  }

  if (userAgent(req).isBot) {
    return new NextResponse('No mercy for bot.', {
      status: 403
    });
  }

  const secret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req, secret });

  if (!token && isAuthNeededPages()) {
    req.nextUrl.pathname = LOGIN_URL;
    return NextResponse.redirect(req.nextUrl);
  }

  if (token && isAuthPages()) {
    req.nextUrl.pathname = HOME_URL;
    return NextResponse.redirect(req.nextUrl);
  }
};

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
