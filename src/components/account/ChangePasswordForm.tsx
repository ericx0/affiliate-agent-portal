"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { supabase } from "@/lib/supabase";

const inputClass =
  "h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30";

export default function ChangePasswordForm() {
  const t = useTranslations("account.changePassword");
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (next !== confirm) {
      setError(t("errorMismatch"));
      return;
    }
    if (next.length < 8) {
      setError(t("errorWeak"));
      return;
    }
    setSubmitting(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const email = userData.user?.email;
      if (!email) throw new Error("no-email");

      const { error: signInErr } = await supabase.auth.signInWithPassword({
        email,
        password: current,
      });
      if (signInErr) {
        setError(t("errorCurrent"));
        return;
      }

      const { error: updateErr } = await supabase.auth.updateUser({ password: next });
      if (updateErr) throw updateErr;

      setSuccess(true);
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch {
      setError(t("errorGeneric"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="password"
        placeholder={t("currentPlaceholder")}
        value={current}
        onChange={(e) => setCurrent(e.target.value)}
        required
        autoComplete="current-password"
        className={inputClass}
      />
      <input
        type="password"
        placeholder={t("newPlaceholder")}
        value={next}
        onChange={(e) => setNext(e.target.value)}
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
      {success && <p className="text-sm text-green-600">{t("success")}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="h-10 px-4 rounded-md bg-brand-500 text-white font-medium hover:opacity-90 disabled:opacity-50"
      >
        {submitting ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}