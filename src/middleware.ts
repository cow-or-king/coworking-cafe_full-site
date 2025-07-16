import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Routes publiques qui ne nécessitent pas d'authentification
  const publicRoutes = ["/login", "/site"];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Routes protégées qui nécessitent une authentification
  const protectedRoutes = ["/", "/admin"];
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  // Vérifier si l'utilisateur est authentifié
  const authCookie = request.cookies.get("auth_user");
  const isAuthenticated = !!authCookie;

  // Si c'est une route protégée et que l'utilisateur n'est pas authentifié
  if (isProtectedRoute && !isAuthenticated) {
    // Rediriger vers la page de login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Si c'est la page de login et que l'utilisateur est déjà authentifié
  if (pathname === "/login" && isAuthenticated) {
    // Rediriger vers le dashboard
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Vérifier si c'est une route de settings/développement
  if (pathname.startsWith("/settings")) {
    // En production, bloquer l'accès aux settings
    const isProduction = process.env.NODE_ENV === "production";
    const showDevFeatures =
      process.env.NEXT_PUBLIC_SHOW_DEV_FEATURES === "true";

    if (isProduction && !showDevFeatures) {
      // Rediriger vers la page d'accueil
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
