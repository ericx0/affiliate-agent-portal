"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { supabase } from "@/lib/supabase";
import { Link } from "@/navigation";

const inputClass =
  "h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30";

export default function ForgotPasswordPage() {
  const t = useTranslations("forgotPassword");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSending(true);
    try {
      const redirectTo = `${window.location.origin}/${locale}/reset-password`;
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });
      if (resetErr) throw resetErr;
      setSent(true);
    } catch {
      setError(t("errorGeneric"));
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 space-y-3 text-center">
        <h1 className="text-xl font-semibold">{t("successTitle")}</h1>
        <p className="text-sm text-gray-600">{t("successBody")}</p>
        <Link
          href="/login"
          className="inline-block w-full h-10 leading-10 rounded-md bg-brand-500 text-white font-medium hover:opacity-90"
        >
          {t("backToLogin")}
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
          type="email"
          placeholder={t("emailPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className={inputClass}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={sending}
          className="w-full h-10 rounded-md bg-brand-500 text-white font-medium hover:opacity-90 disabled:opacity-50"
        >
          {sending ? t("submitting") : t("submit")}
        </button>
      </form>
      <div className="text-center">
        <Link href="/login" className="text-xs text-gray-500 hover:text-gray-700">
          {t("backToLogin")}
        </Link>
      </div>
    </div>
  );
}