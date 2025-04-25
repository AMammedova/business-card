import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: ['en', 'az', 'ru'],
  defaultLocale: 'en',
  localePrefix: 'always'
});

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (
    pathname === '/' ||
    pathname === '/en' ||
    pathname === '/az' ||
    pathname === '/ru'
  ) {
    const id = searchParams.get('id') || '1018';

    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `${pathname.replace(/\/$/, '')}/profile/${id}`;

    return NextResponse.redirect(redirectUrl);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
