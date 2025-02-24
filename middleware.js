import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token');
  const isLoginPage = request.nextUrl.pathname === '/login';

  // Si l'utilisateur n'est pas connecté et n'est pas sur la page de connexion
  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Si l'utilisateur est connecté et essaie d'accéder à la page de connexion
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 