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
    (async () => {
      const { data } = await supabase.auth.getSession();
      setReady(!!data.session);
    })();
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