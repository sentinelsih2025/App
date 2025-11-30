import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const token = req.cookies.get("token")?.value;
  const path = url.pathname.toLowerCase();

  // Public routes
  const publicRoutes = ["/", "/login", "/signup"];

  if (publicRoutes.includes(path)) {
    return NextResponse.next();
  }

  // Block private routes
  if (!token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api).*)",
  ],
};
