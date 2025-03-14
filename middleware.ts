import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'az', 'ru'],
  defaultLocale: 'en',
  localePrefix: 'always'
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};