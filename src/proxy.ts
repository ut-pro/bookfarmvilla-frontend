import { NextResponse, type NextRequest } from "next/server";

const CANONICAL_HOST = "www.bookfarmvilla.com";

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostIsCanonical = url.hostname === CANONICAL_HOST;
  const forwardedProtocol = request.headers
    .get("x-forwarded-proto")
    ?.split(",")[0]
    .trim();
  const requestIsHttps =
    (forwardedProtocol ?? url.protocol.slice(0, -1)) === "https";
  const hasTrailingSlash =
    url.pathname.length > 1 && url.pathname.endsWith("/");

  if (hostIsCanonical && requestIsHttps && !hasTrailingSlash) {
    return NextResponse.next();
  }

  if (!hostIsCanonical) {
    url.hostname = CANONICAL_HOST;
  }

  url.protocol = "https:";

  if (hasTrailingSlash) {
    url.pathname = url.pathname.slice(0, -1);
  }

  return NextResponse.redirect(url, 301);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
