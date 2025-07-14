import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
  matcher: ["/settings/:path*"],
};
