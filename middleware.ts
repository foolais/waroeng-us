import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

const ProtectedRoutes = ["/super", "/admin", "/dashboard"];

export async function middleware(request: NextRequest) {
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const role = session?.user.role;
  const storeId = session?.user.store_id;
  const { pathname } = request.nextUrl;

  let redirectUrl = "/";
  switch (role) {
    case "SUPER_ADMIN":
      redirectUrl = "/super/dashboard";
      break;
    case "ADMIN":
      redirectUrl = `/${storeId}/admin/dashboard`;
      break;
    case "CASHIER":
      redirectUrl = `/${storeId}/dashboard`;
      break;
  }

  if (
    !isLoggedIn &&
    ProtectedRoutes.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  if (isLoggedIn && role !== "SUPER_ADMIN" && pathname.startsWith("/super")) {
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  if (isLoggedIn && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
