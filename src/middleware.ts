import { auth } from "@/lib/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnDashboard = 
    !req.nextUrl.pathname.startsWith('/login') && 
    !req.nextUrl.pathname.startsWith('/register') &&
    !req.nextUrl.pathname.startsWith('/api/auth');

  if (isOnDashboard && !isLoggedIn) {
     return Response.redirect(new URL("/login", req.nextUrl));
  }
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|login|register).*)"],
};
