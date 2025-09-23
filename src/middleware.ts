import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // /admin 경로 처리
  if (pathname.startsWith('/admin')) {
    const sessionToken = request.cookies.get('admin-session')?.value;

    // 세션이 없으면 /admin 페이지로 리다이렉트 (로그인 폼 표시)
    // /admin 페이지 자체는 접근 허용 (로그인 폼이 있으므로)
    if (!sessionToken && pathname !== '/admin' && pathname !== '/admin/') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    // API 경로는 미들웨어에서 처리하지 않음
    if (pathname.startsWith('/admin/api')) {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};