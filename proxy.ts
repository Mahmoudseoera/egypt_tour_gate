import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_LOCALE, isSupportedLocale, LOCALE_COOKIE } from "@/lib/i18n/config";

function isIgnoredPath(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/assets") ||
    pathname.includes(".")
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isIgnoredPath(pathname)) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment && isSupportedLocale(firstSegment)) {
    const strippedPath = `/${segments.slice(1).join("/")}`.replace(/\/$/, "") || "/";

    if (firstSegment === DEFAULT_LOCALE) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = strippedPath;
      const response = NextResponse.redirect(redirectUrl, 307);
      response.cookies.set(LOCALE_COOKIE, DEFAULT_LOCALE, { path: "/" });
      return response;
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-locale", firstSegment);

    // Keep locale-prefixed URL as-is so Next resolves app/[locale] routes
    // (e.g. /fr, /de, /fr/about-us) and client pathname reflects the locale.
    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });

    response.cookies.set(LOCALE_COOKIE, firstSegment, { path: "/" });
    return response;
  }

  if (firstSegment && /^[a-z]{2}$/i.test(firstSegment) && !isSupportedLocale(firstSegment)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/${segments.slice(1).join("/")}`.replace(/\/$/, "") || "/";
    const response = NextResponse.redirect(redirectUrl, 307);
    response.cookies.set(LOCALE_COOKIE, DEFAULT_LOCALE, { path: "/" });
    return response;
  }

  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale = cookieLocale && isSupportedLocale(cookieLocale) ? cookieLocale : DEFAULT_LOCALE;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", locale);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  if (!cookieLocale || !isSupportedLocale(cookieLocale)) {
    response.cookies.set(LOCALE_COOKIE, locale, { path: "/" });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
