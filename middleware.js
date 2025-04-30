// src/middleware.js
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose'; // Using jose for JWT verification as it works in Edge Runtime

const JWT_SECRET = process.env.JWT_SECRET || 'this-is-a-super-secret-key-for-dev-only';
const secret = new TextEncoder().encode(JWT_SECRET);

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // Define public paths that don't require authentication
  const publicPaths = ['/login', '/api/auth/login', '/api/auth/register'];

  // Allow access to public paths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // If no token and trying to access a protected route, redirect to login
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  try {
    // Verify the token
    const { payload } = await jwtVerify(token, secret);
    
    // Add user info to the request headers for API routes or server components
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.id);
    requestHeaders.set('x-user-role', payload.role);
    requestHeaders.set('x-user-username', payload.username);

    // Check for role-based access if needed (example for an admin-only route)
    // if (pathname.startsWith('/admin') && payload.role !== 'admin') {
    //   const url = request.nextUrl.clone();
    //   url.pathname = '/unauthorized'; // Or redirect to a suitable page
    //   return NextResponse.redirect(url);
    // }

    // Continue to the requested page/api route with added headers
    return NextResponse.next({ request: { headers: requestHeaders } });

  } catch (err) {
    // If token verification fails (invalid or expired), redirect to login
    console.error('JWT Verification Error:', err.message);
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    // Clear the invalid token cookie
    const response = NextResponse.redirect(url);
    response.cookies.delete('token');
    return response;
  }
}

// Specify the paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - /login (login page)
     * - /api/auth/login (login API)
     * - /api/auth/register (register API)
     */
    '/((?!_next/static|_next/image|favicon.ico|login|api/auth/login|api/auth/register).*)',
  ],
};

