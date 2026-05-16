import { NextResponse } from 'next/server';

export function middleware(request) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const userRole = request.cookies.get('userRole')?.value;
  const { pathname } = request.nextUrl;

  // Protected route prefixes
  const protectedRoutes = ['/profile', '/cart', '/my-orders', '/admin', '/my-products', '/checkout'];
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  // 1. If trying to access a protected route without a token
  if (isProtectedRoute && !accessToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Role-based protection for admin routes
  if (pathname.startsWith('/admin')) {
    const isAdmin = userRole === 'ADMIN' || userRole === 'ROLE_ADMIN';
    if (!isAdmin) {
      // Redirect non-admin users to home or unauthorized page
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // 3. Redirect authenticated users away from auth pages (login/register)
  const authRoutes = ['/login', '/register'];
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
