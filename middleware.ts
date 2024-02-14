import { NextRequest, NextResponse } from "next/server";
// export { default } from "next-auth/middleware"; // forma basica de usar next-auth

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isPublicPath = path === "/login";

  const token =
    req.cookies.get("next-auth.session-token")?.value || "";

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }
}

export const config = {
  matcher: ["/teacher/:path*", "/", "/login"],
};
