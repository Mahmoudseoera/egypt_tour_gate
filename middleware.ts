import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const languagePrefixes = ["ar", "de", "fra"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  if (!firstSegment || !languagePrefixes.includes(firstSegment)) {
    return NextResponse.next();
  }

  const rewrittenPath = `/${segments.slice(1).join("/")}` || "/";
  const url = request.nextUrl.clone();
  url.pathname = rewrittenPath === "//" ? "/" : rewrittenPath;

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|assets).*)"],
};
