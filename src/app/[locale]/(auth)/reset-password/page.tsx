"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { supabase } from "@/lib/supabase";
import { useRouter, Link } from "@/navigation";

const inputClass =
  "h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30";

export default function ResetPasswordPage() {
  const t = useTranslations("resetPassword");
  const router = useRouter();
  const locale = useLocale();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState<boolean | null>(null);

  useEffect(() => {
    let resolved = false;

    // 0) Manual setSession from the recovery URL hash. @supabase/ssr 0.5.2's
    //    detectSessionInUrl silently no-ops under the Cloudflare proxy
    //    (storageKey origin `api.linkchinamed.com` ≠ JWT issuer
    //    `bqjbvnkdhbrkdaraxnvm.supabase.co`), so drive setSession ourselves.
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const hashType = hashParams.get("type");
    const hashAccess = hashParams.get("access_token");
    const hashRefresh = hashParams.get("refresh_token");
    if (hashType === "recovery" && hashAccess && hashRefresh) {
      supabase.auth
        .setSession({ access_token: hashAccess, refresh_token: hashRefresh })
        .then(({ error: setErr }) => {
          if (resolved || setErr) return;
          resolved = true;
          setReady(true);
        });
    }

    // 1) Some SSR cookie flows already set a session before mount.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (resolved || !session) return;
      resolved = true;
      setReady(true);
    });

    // 2) Implicit recovery flow: tokens arrive via URL hash, then ssr
    //    fires PASSWORD_RECOVERY once it has set the session.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
          resolved = true;
          setReady(true);
          subscription.unsubscribe();
        }
      }
    );

    const timeoutId = window.setTimeout(() => {
      if (resolved) return;
      resolved = true;
      subscription.unsubscribe();
      setReady(false);
    }, 30000);

    return () => {
      subscription.unsubscribe();
      window.clearTimeout(timeoutId);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError(t("errorMismatch"));
      return;
    }
    if (password.length < 8) {
      setError(t("errorWeak"));
      return;
    }
    setSubmitting(true);
    try {
      const { error: updateErr } = await supabase.auth.updateUser({ password });
      if (updateErr) throw updateErr;
      setTimeout(() => router.push(`/${locale}/dashboard`), 1500);
    } catch {
      setError(t("errorGeneric"));
    } finally {
      setSubmitting(false);
    }
  };

  if (ready === null) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 text-center text-sm text-gray-500">
        ...
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 space-y-3 text-center">
        <p className="text-sm text-red-600">{t("errorExpired")}</p>
        <Link
          href="/forgot-password"
          className="inline-block w-full h-10 leading-10 rounded-md bg-brand-500 text-white font-medium hover:opacity-90"
        >
          {t("submit")}
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 space-y-3">
      <h1 className="text-xl font-semibold text-center">{t("title")}</h1>
      <p className="text-sm text-gray-600 text-center">{t("subtitle")}</p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="password"
          placeholder={t("newPlaceholder")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
          className={inputClass}
        />
        <input
          type="password"
          placeholder={t("confirmPlaceholder")}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
          className={inputClass}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full h-10 rounded-md bg-brand-500 text-white font-medium hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? t("submitting") : t("submit")}
        </button>
      </form>
    </div>
  );
}