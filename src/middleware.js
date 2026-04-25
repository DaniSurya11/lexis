import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  
  // Rute yang dilindungi
  const protectedPaths = ["/dashboard", "/checkout", "/booking", "/chat"]
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path))

  if (isProtected && !user) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("from", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Jika user sudah login dan mengakses /login atau /register, lempar ke dashboard
  if (user && (pathname === "/login" || pathname.startsWith("/register"))) {
     const userRole = user.user_metadata?.role;
     const targetUrl = new URL(userRole === 'lawyer' ? '/dashboard/lawyer' : '/dashboard', request.url);
     return NextResponse.redirect(targetUrl);
  }
  
  return supabaseResponse
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/checkout/:path*",
    "/booking/:path*",
    "/chat/:path*",
    "/login",
    "/register/:path*"
  ],
}

