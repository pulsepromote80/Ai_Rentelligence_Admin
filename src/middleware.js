import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isProtectedPath = pathname.startsWith("/pages");

  // 🔐 If not logged in and trying to access protected content
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ✅ Allow access in all other cases
  return NextResponse.next();
}

export const config = {
  matcher: ["/login/:path*", "/pages/:path*"],
};
