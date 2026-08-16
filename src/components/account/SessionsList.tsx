"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { supabase } from "@/lib/supabase";

export default function SessionsList() {
  const t = useTranslations("account.sessions");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSignOutOthers = async () => {
    if (!window.confirm(t("signOutOthersConfirm"))) return;
    setError("");
    setSuccess(false);
    setSubmitting(true);
    try {
      const { error: signOutErr } = await supabase.auth.signOut({ scope: "others" });
      if (signOutErr) throw signOutErr;
      setSuccess(true);
    } catch {
      setError(t("errorGeneric"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between py-3 px-4 bg-slate-50 rounded-lg border border-slate-100">
        <div>
          <div className="text-sm font-medium text-slate-900">{t("current")}</div>
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">{t("success")}</p>}
      <button
        onClick={handleSignOutOthers}
        disabled={submitting}
        className="h-10 px-4 rounded-md border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50"
      >
        {t("signOutOthers")}
      </button>
    </div>
  );
}