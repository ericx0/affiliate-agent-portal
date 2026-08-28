// Shared auth/role guards for the Agent portal.
//
// Centralised so that every layout/page/route that needs a role check or
// locale-derived URL goes through the same code path. Imported by:
//   - app/[locale]/(protected)/layout.tsx        (AAP-P0-1)
//   - app/[locale]/login/page.tsx                 (AAP-P0-4)
//   - app/[locale]/(protected)/dashboard/page.tsx (AAP-P0-3)
//   - api/affiliate/me/stripe-complete/route.ts   (AAP-P0-2/6)
//   - api/affiliate/me/stripe-connect/route.ts    (AAP-P0-5)

import type { NextRequest } from "next/server";

export const SUPPORTED_LOCALES = ["zh", "en", "es", "ar", "ru"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "zh";

const LOCALE_SET = new Set<string>(SUPPORTED_LOCALES);

export function isSupportedLocale(value: unknown): value is Locale {
  return typeof value === "string" && LOCALE_SET.has(value);
}

/**
 * Resolve the locale to use in redirect/return URLs. Priority:
 *   1. First locale segment of the request URL path.
 *   2. First locale segment of the Referer header (used when the
 *      request itself is an internal fetch whose origin stripped the locale).
 *   3. DEFAULT_LOCALE.
 *
 * Never trust an unvalidated locale — bad input returns DEFAULT_LOCALE.
 */
export function deriveLocaleFromRequest(req: NextRequest | Request): Locale {
  try {
    const url = new URL(req.url);
    const seg = url.pathname.split("/").filter(Boolean)[0];
    if (isSupportedLocale(seg)) return seg;

    const referer = req.headers.get("referer");
    if (referer) {
      const m = referer.match(/\/([a-z]{2})\//);
      if (m && isSupportedLocale(m[1])) return m[1];
    }
  } catch {
    // fall through
  }
  return DEFAULT_LOCALE;
}

export interface PromoterLite {
  id: string;
  email?: string | null;
  role?: string | null;
  status?: string | null;
  stripe_account_id?: string | null;
  stripe_onboarding_completed?: boolean | null;
}

/**
 * Strict allowlist for an Agent-portal-eligible promoter.
 * Returns the match, or null. Rejects undefined / pending / null /
 * 'kol' / 'admin' roles. The only accepted role is 'agent'.
 */
export function findAgentMatch(
  promoters: PromoterLite[] | null | undefined,
  email: string | null | undefined,
): PromoterLite | null {
  if (!Array.isArray(promoters) || !email) return null;
  const normalized = email.trim().toLowerCase();

  const candidate = promoters.find(
    (p) => p.email && p.email.toLowerCase() === normalized,
  );
  if (!candidate) return null;
  if (candidate.status !== "active") return null;

  // Explicit allowlist: only 'agent' (exact match) gets through.
  // 'kol' / 'pending' / 'admin' / null / undefined all rejected.
  if (candidate.role !== "agent") return null;

  return candidate;
}
