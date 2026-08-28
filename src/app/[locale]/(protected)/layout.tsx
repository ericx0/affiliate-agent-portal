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
      const { data } = await supabase.auth.getUser();
      if (cancelled) return;
      if (!data.user) {
        router.push("/login");
        return;
      }
      const email = data.user.email?.trim().toLowerCase();
      if (!email) {
        await supabase.auth.signOut();
        router.push("/login");
        return;
      }
      const { data: list } = await supabase.rpc("affiliate_list_promoters", {
        p_search: email,
        p_role: "agent",
      });
      const match = Array.isArray(list)
        ? (list as any[]).find((p) => p.email?.toLowerCase() === email)
        : null;
      if (!match || match.role !== "agent" || match.status !== "active") {
        setDenied(true);
        await supabase.auth.signOut();
        router.push("/login?error=not_agent");
        return;
      }
      setLoading(false);
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
      <nav className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex gap-6 items-center">
            <Link href="/dashboard" className="font-bold">{t("agentPortalTitle")}</Link>
            <Link href="/kols">{t("kols")}</Link>
            <Link href="/commissions">{t("commissions")}</Link>
            <Link href="/playbook" className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold hover:text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg transition-colors">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              {t("playbook")}
            </Link>
            <Link href="/marketing/posters" className="text-emerald-600 font-medium hover:text-emerald-700">海报图库</Link>
            <Link href="/dashboard/settings/stripe">{t("settings")}</Link>
            <Link href="/account">{t("account")}</Link>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <LocaleSwitcher />
            <button
              onClick={() => supabase.auth.signOut().then(() => router.push("/login"))}
              className="text-sm text-slate-500"
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
