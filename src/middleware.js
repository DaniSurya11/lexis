import { NextResponse } from "next/server";

/**
 * Middleware Otentikasi — Lexis Premium
 * Proteksi otomatis semua rute di bawah /dashboard, /checkout, /booking, /chat
 * 
 * Saat backend nyata tersedia, ganti pengecekan cookie "isAuthenticated"
 * dengan verifikasi JWT menggunakan jose atau next-auth.
 */
export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Rute yang dilindungi
  const protectedPaths = ["/dashboard", "/checkout", "/booking", "/chat"];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
  
  if (!isProtected) {
    return NextResponse.next();
  }

  // Cek cookie autentikasi (set saat login)
  // Nama cookie harus konsisten dengan yang di-set pada handleLogin
  const isAuthenticated = request.cookies.get("lexis_auth")?.value;
  
  if (!isAuthenticated) {
    // Redirect ke login dengan parameter 'from' agar bisa redirect balik setelah login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    
    // Tambahkan header agar browser tidak cache halaman protected
    const response = NextResponse.redirect(loginUrl);
    response.headers.set("Cache-Control", "no-store");
    return response;
  }

  return NextResponse.next();
}

// Hanya jalankan middleware untuk rute-rute berikut (bukan asset statis)
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/checkout/:path*",
    "/booking/:path*",
    "/chat/:path*",
  ],
};
