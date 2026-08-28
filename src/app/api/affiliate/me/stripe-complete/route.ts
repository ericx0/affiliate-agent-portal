import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { z } from "zod";

// AAP-P0-2 + AAP-P0-6: stripe-complete route handler.
//
// This file did NOT exist in the agent-portal checkout — the audit was
// written against the affiliate-portal (KOL) copy. Per next.config.js
// rewrites(), /api/affiliate/* was proxied to affiliate-service with no
// per-route auth on body. With a route handler at this path Next.js
// prefers the local handler over the wildcard rewrite (specific wins),
// so the security checks below apply regardless of upstream.
//
// AAP-P0-2: body.accountId must equal the user's own
//   promoter.stripe_account_id (otherwise 403), AND role === 'agent'.
// AAP-P0-6: non-empty updateErr returns 500, never silent success.

const StripeCompleteBody = z.object({
  accountId: z.string().min(1).max(128),
});

const SUPPORTED_LOCALES = new Set(["zh", "en", "es", "ar", "ru"]);

function deriveLocale(req: NextRequest): string {
  try {
    const seg = new URL(req.url).pathname.split("/").filter(Boolean)[0];
    if (seg && SUPPORTED_LOCALES.has(seg)) return seg;
    const referer = req.headers.get("referer");
    if (referer) {
      const m = referer.match(/\/([a-z]{2})\//);
      if (m && SUPPORTED_LOCALES.has(m[1])) return m[1];
    }
  } catch {
    // ignore
  }
  return "zh";
}

function jsonError(status: number, code: string, message: string) {
  return NextResponse.json({ error: { code, message } }, { status });
}

export async function POST(req: NextRequest) {
  const locale = deriveLocale(req);

  // 1) Zod-validate body. Malformed body → 422.
  let body: { accountId: string };
  try {
    const raw = await req.json().catch(() => null);
    const parsed = StripeCompleteBody.safeParse(raw);
    if (!parsed.success) {
      return jsonError(
        422,
        "VALIDATION_ERROR",
        parsed.error.issues[0]?.message ?? "invalid body"
      );
    }
    body = parsed.data;
  } catch {
    return jsonError(422, "VALIDATION_ERROR", "invalid body");
  }

  // 2) Authn: current user via cookies / Bearer fallback.
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
          cookiesToSet.forEach(({ name, value, options }: { name: string; value: string; options?: any }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let email = user?.email?.toLowerCase();
  if (!email) {
    const authHeader = req.headers.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const { data: jwtUser } = await supabase.auth.getUser(
        authHeader.substring(7)
      );
      email = jwtUser?.user?.email?.toLowerCase();
    }
  }

  if (!email) {
    return jsonError(401, "UNAUTHENTICATED", "未登录");
  }

  // 3) Look up promoter — p_role='agent' (defence in depth with layout gate).
  const { data: promoters, error: rpcErr } = await supabase.rpc(
    "affiliate_list_promoters",
    { p_search: email, p_role: "agent" }
  );

  if (rpcErr) {
    return jsonError(500, "RPC_FAILED", rpcErr.message);
  }

  const promoter = Array.isArray(promoters)
    ? (promoters as any[]).find(
        (p) => p.email && p.email.toLowerCase() === email
      )
    : null;

  if (!promoter) {
    return jsonError(404, "PROMOTER_NOT_FOUND", "未找到推广者信息");
  }

  // 4) Role gate — only 'agent' + 'active' allowed.
  if (promoter.role !== "agent" || promoter.status !== "active") {
    return jsonError(403, "NOT_AGENT", "非 Agent 账号");
  }

  // 5) AAP-P0-2 core: body.accountId MUST equal the user's own
  //    stripe_account_id. Cross-actor claim blocked here.
  if (!promoter.stripe_account_id) {
    return jsonError(403, "NO_STRIPE_ACCOUNT", "尚未创建 Stripe Connect 账号");
  }
  if (body.accountId !== promoter.stripe_account_id) {
    return jsonError(403, "ACCOUNT_ID_MISMATCH", "Stripe 账号不属于当前用户");
  }

  // 6) Persist onboarding completion. ANY error → 500, never silent success
  //    (AAP-P0-6).
  const { error: updateErr } = await supabase
    .from("promoters")
    .update({ stripe_onboarding_completed: true })
    .eq("id", promoter.id);

  if (updateErr) {
    return jsonError(500, "UPDATE_FAILED", updateErr.message);
  }

  return NextResponse.json({
    data: {
      completed: true,
      locale,
      accountId: promoter.stripe_account_id,
    },
  });
}
