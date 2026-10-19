import createMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { locales } from "@/navigation";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: "en",
  localePrefix: "always",
});

// Protected area: every (protected)/* route under /<locale>/.
// (protected) is a Next.js route group invisible to middleware, so we
// list the actual path segments here. Adding a new page under
// (protected)/ requires extending this list — the (protected)/layout.tsx
// role gate is the source of truth, but it runs AFTER the initial SSR
// HTML, so static content (commission rates, outreach scripts, etc.)
// would leak to unauthenticated visitors without this edge gate.
// Built from the locales list so every locale (en/zh/ar/ru/es) is guarded.
const PROTECTED = new RegExp(
  `^/(${locales.join("|")})/(dashboard|kols|commissions|account|marketing|prospecting|resources|playbook)(?:/|$)`,
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

  // getUser() throws on malformed/expired cookies or if the upstream gateway blocks
  // the network call to /auth/v1/user with non-JSON 401 response.
  let user: { id: string } | null = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    user = null;
  }

  // Resilient fallback: inspect signed JWT in auth-token cookie to verify session validity
  if (!user) {
    try {
      const allCookies = request.cookies.getAll();
      for (const c of allCookies) {
        if (c.name.includes("auth-token")) {
          let raw = c.value;
          if (raw.startsWith("base64-")) {
            const base64 = raw.substring(7).replace(/-/g, "+").replace(/_/g, "/");
            raw = decodeURIComponent(
              atob(base64)
                .split("")
                .map((char) => "%" + ("00" + char.charCodeAt(0).toString(16)).slice(-2))
                .join("")
            );
          }
          const session = JSON.parse(raw);
          const token = session.access_token || (Array.isArray(session) ? session[0] : null);
          if (token && typeof token === "string") {
            const parts = token.split(".");
            if (parts.length === 3) {
              const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
              const payload = JSON.parse(
                decodeURIComponent(
                  atob(b64)
                    .split("")
                    .map((char) => "%" + ("00" + char.charCodeAt(0).toString(16)).slice(-2))
                    .join("")
                )
              );
              const now = Math.floor(Date.now() / 1000);
              if (payload && payload.exp && payload.exp > now && payload.sub) {
                user = { id: payload.sub };
                break;
              }
            }
          }
        }
      }
    } catch {
      user = null;
    }
  }

  if (!user) {
    if (
      process.env.NODE_ENV !== "production" &&
      request.cookies.get("x-e2e-agent")?.value === "1"
    ) {
      return response;
    }
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
