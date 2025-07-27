import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Public API routes that don't require authentication
  const publicApiRoutes = [
    '/api/categories',
  ];

  // Check if this is a public API route
  const isPublicApiRoute = publicApiRoutes.some(route => 
    req.nextUrl.pathname === route || 
    req.nextUrl.pathname.startsWith(route + '/')
  );

  // Special handling for projects API - allow public access unless requesting unpublished
  const isProjectsApi = req.nextUrl.pathname === '/api/projects';
  const includeUnpublished = req.nextUrl.searchParams.get('includeUnpublished') === 'true';
  const isPublicProjectsRequest = isProjectsApi && !includeUnpublished;

  // Protect API routes (except public ones)
  if (req.nextUrl.pathname.startsWith('/api/') && !isPublicApiRoute && !isPublicProjectsRequest) {
    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/api/:path*',
    '/dashboard/:path*'
  ],
} 