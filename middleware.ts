import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: ['en', 'az', 'ru'],
  defaultLocale: 'en',
  localePrefix: 'never'
});

export function middleware(request: NextRequest) {
  // Remove the redirect logic - let users see the landing page on root paths
  // QR codes will directly go to the slug URL (e.g., /az/grandmart/babek-aghamuradli)
  
  // Use the intl middleware for all routes
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
