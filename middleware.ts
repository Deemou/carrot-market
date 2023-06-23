import {
  NextFetchEvent,
  NextRequest,
  NextResponse,
  userAgent
} from 'next/server';
import { getToken } from 'next-auth/jwt';

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

  const secret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req, secret });

  if (!token && !isAuthPages()) {
    // req.nextUrl.searchParams.set('from', req.nextUrl.pathname);
    req.nextUrl.pathname = loginUrl;
    return NextResponse.redirect(req.nextUrl);
  }

  if (token && isAuthPages()) {
    req.nextUrl.pathname = '/';
    return NextResponse.redirect(req.nextUrl);
  }
};

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
