"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { supabase } from "@/lib/supabase";
import { apiFetch } from "@/lib/api";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { Link, useRouter } from "@/navigation";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("nav");
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/login");
        return;
      }
      try {
        // agent-auth validates role='agent'; 403 -> not an agent.
        await apiFetch("/api/affiliate/agent/stats");
        setLoading(false);
      } catch {
        router.push("/login?error=not_an_agent");
      }
    })();
  }, [router]);

  if (loading) return <div className="p-8">{t("loading")}</div>;

  return (
    <div className="min-h-screen">
      <nav className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex gap-6">
            <Link href="/dashboard" className="font-bold">{t("agentPortalTitle")}</Link>
            <Link href="/kols">{t("kols")}</Link>
            <Link href="/commissions">{t("commissions")}</Link>
            <Link href="/dashboard/settings/stripe">{t("settings")}</Link>
            <Link href="/account">{t("account")}</Link>
          </div>
          <div className="flex items-center gap-3">
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
