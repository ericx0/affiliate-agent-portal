"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/navigation";
import { supabase } from "@/lib/supabase";

const inputClass =
  "h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/30";

export default function DeleteAccountDialog({ email }: { email: string }) {
  const t = useTranslations("account.deleteAccount");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setError("");
    if (confirmEmail !== email) {
      setError(t("errorMismatch"));
      return;
    }
    setSubmitting(true);
    try {
      const { error: rpcErr } = await supabase.rpc("request_account_deletion");
      if (rpcErr) throw rpcErr;
      await supabase.auth.signOut();
      router.push("/login");
    } catch {
      setError(t("errorGeneric"));
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="h-10 px-4 rounded-md border border-red-300 bg-white text-red-600 font-medium hover:bg-red-50"
      >
        {t("button")}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl">
        <h3 className="text-lg font-bold text-slate-900">{t("confirmTitle")}</h3>
        <p className="text-sm text-slate-600">{t("confirmBody")}</p>
        <input
          type="email"
          placeholder={t("emailPlaceholder")}
          value={confirmEmail}
          onChange={(e) => setConfirmEmail(e.target.value)}
          className={inputClass}
          autoComplete="off"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-2">
          <button
            onClick={() => {
              setOpen(false);
              setError("");
              setConfirmEmail("");
            }}
            disabled={submitting}
            className="flex-1 h-10 rounded-md border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50"
          >
            {t("cancel")}
          </button>
          <button
            onClick={handleDelete}
            disabled={submitting}
            className="flex-1 h-10 rounded-md bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50"
          >
            {t("confirmButton")}
          </button>
        </div>
      </div>
    </div>
  );
}