import createMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { locales } from "@/navigation";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: "en",
  localePrefix: "always",
});

// Protected area: /<locale>/{dashboard,kols,commissions}[//]
// Built from the locales list so every locale (en/zh/ar/ru/es) is guarded.
const PROTECTED = new RegExp(
  `^/(${locales.join("|")})/(dashboard|kols|commissions)(?:/|$)`,
);

export async function middleware(request: NextRequest) {
  const response = intlMiddleware(request);
  const { pathname } = request.nextUrl;

  // Skip auth entirely on public pages (login, register, forgot/reset
  // password, marketing, locale-only fallbacks). Avoids:
  //   - getUser() latency on every public hit
  //   - stale-cookie hangs on browsers carrying an old Supabase session
  //   - re-validating tokens the page doesn't need
  // PROTECTED paths still call getUser() below.
  if (!PROTECTED.test(pathname)) {
    return response;
  }

  // Bind a Supabase server client to the request/response cookies so the
  // session is refreshed and readable at the edge (no client-side flash).
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options?: Record<string, unknown>;
          }[],
        ) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // getUser() throws on malformed/expired cookies (e.g. session JSON
  // whose embedded JWT signature no longer verifies post-key-rotation,
  // or cookies from a prior deploy that changed the cookie name).
  // Treat any auth error as "no user" so stale state in the browser
  // doesn't bring the whole middleware down with MIDDLEWARE_INVOCATION_FAILED.
  let user: { id: string } | null = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    user = null;
  }

  if (!user) {
    const locale = pathname.split("/")[1] || "en";
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  // Match all routes except API, _next internals, _vercel, and files with extensions
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
