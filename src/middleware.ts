import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const protectedPaths = ['/dashboard', '/diagnostic', '/directions', '/podcast', '/practice', '/return', '/letter'];
  const authPaths = ['/auth/signin', '/auth/signup'];
  const pathname = request.nextUrl.pathname;

  const isProtected = protectedPaths.some(p => pathname.startsWith(p));
  const isAuthPage = authPaths.some(p => pathname.startsWith(p));

  // Only check auth when visiting protected or auth pages — skip for landing page
  // and static assets to avoid hanging when Supabase is paused
  if (!isProtected && !isAuthPage) {
    return response;
  }

  // Race the auth check against a 4-second timeout so the middleware never
  // blocks indefinitely when Supabase is unreachable
  let user = null;
  try {
    const authPromise = supabase.auth.getUser();
    const timeoutPromise = new Promise<null>((resolve) =>
      setTimeout(() => resolve(null), 4000)
    );

    const result = await Promise.race([authPromise, timeoutPromise]);
    if (result && 'data' in result) {
      user = result.data.user;
    }
  } catch (err) {
    // Auth check failed — treat as unauthenticated
    console.error('Middleware auth check failed:', err);
  }

  // Redirect unauthenticated users away from protected pages
  if (isProtected && !user) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  // Redirect authenticated users away from auth pages
  if (isAuthPage && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth/callback).*)'],
};
