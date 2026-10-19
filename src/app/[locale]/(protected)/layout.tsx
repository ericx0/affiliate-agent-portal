"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { supabase } from "@/lib/supabase";
import { apiFetch } from "@/lib/api";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import NotificationBell from "@/components/NotificationBell";
import { Link, useRouter } from "@/navigation";
import { BookOpen } from "lucide-react";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("nav");
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);

  // AAP-P0-1: hard role gate. KOL / admin / customer / unauthenticated
  // users are blocked from every (protected)/* route. The previous
  // version only checked getUser() so anyone with a Supabase session
  // could browse /dashboard, /kols, /commissions and hit the
  // agent-only RPCs that mutate KOL state.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const mockUser =
        process.env.NODE_ENV !== "production" && typeof window !== "undefined"
          ? (window as any).__E2E_MOCK_USER__
          : null;
      if (mockUser) {
        setLoading(false);
        return;
      }

      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData?.session?.access_token;
        const headers: Record<string, string> = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch("/api/auth/check-agent", { headers });
        if (cancelled) return;

        if (res.status === 401) {
          router.push("/login");
          return;
        }

        const data = await res.json();
        if (cancelled) return;

        if (!data.isAgent) {
          setDenied(true);
          await supabase.auth.signOut();
          router.push("/login?error=not_agent");
          return;
        }

        setLoading(false);
      } catch {
        if (cancelled) return;
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (loading)
    return (
      <div className="p-8" aria-busy="true">
        {t("loading")}
      </div>
    );

  if (denied) {
    return (
      <div className="p-8 text-center text-slate-500">
        <p className="text-sm">Access denied: agent role required.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <nav className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex gap-4 sm:gap-6 items-center overflow-x-auto text-xs sm:text-sm py-2">
            <Link href="/dashboard" className="font-extrabold text-slate-900 whitespace-nowrap">{t("agentPortalTitle")}</Link>
            <Link href="/kols" className="text-slate-600 hover:text-slate-900 font-medium whitespace-nowrap">{t("kols")}</Link>
            <Link href="/marketing/posters" className="text-slate-600 hover:text-slate-900 font-medium whitespace-nowrap">{t("posters")}</Link>
            <Link href="/prospecting" className="text-slate-600 hover:text-slate-900 font-medium whitespace-nowrap">{t("prospecting")}</Link>
            <Link href="/resources" className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-lg transition-colors whitespace-nowrap border border-emerald-200">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              {t("resources")}
            </Link>
            <Link href="/commissions" className="text-slate-600 hover:text-slate-900 font-medium whitespace-nowrap">{t("commissions")}</Link>
            <Link href="/dashboard/settings/stripe" className="text-slate-600 hover:text-slate-900 font-medium whitespace-nowrap">{t("settings")}</Link>
            <Link href="/account" className="text-slate-600 hover:text-slate-900 font-medium whitespace-nowrap">{t("account")}</Link>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 ml-4">
            <NotificationBell />
            <LocaleSwitcher />
            <button
              onClick={() => supabase.auth.signOut().then(() => router.push("/login"))}
              className="text-xs sm:text-sm text-slate-500 hover:text-slate-800 whitespace-nowrap"
            >
              {t("logout")}
            </button>
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
