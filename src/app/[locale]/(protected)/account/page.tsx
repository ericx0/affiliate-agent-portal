"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { supabase } from "@/lib/supabase";
import ChangePasswordForm from "@/components/account/ChangePasswordForm";
import SessionsList from "@/components/account/SessionsList";
import DeleteAccountDialog from "@/components/account/DeleteAccountDialog";

export default function AccountPage() {
  const t = useTranslations("account");
  const [email, setEmail] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) setEmail(data.user.email ?? "");
    })();
  }, []);

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-16">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t("title")}</h1>
        <p className="text-sm text-slate-500 mt-1">{t("subtitle")}</p>
      </div>

      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-3">
        <h2 className="text-lg font-bold text-slate-900">{t("section.profile")}</h2>
        <div>
          <label className="block text-xs text-slate-500 font-semibold uppercase mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            disabled
            className="h-10 w-full rounded-md border border-gray-300 bg-slate-50 px-3 text-sm text-slate-700"
          />
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-bold text-slate-900">{t("section.security")}</h2>
        <ChangePasswordForm />
      </section>

      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-bold text-slate-900">{t("section.sessions")}</h2>
        <SessionsList />
      </section>

      <section className="bg-white rounded-2xl border border-red-200 shadow-sm p-6 space-y-3">
        <h2 className="text-lg font-bold text-red-600">{t("section.danger")}</h2>
        <p className="text-sm text-slate-500">{t("deleteAccount.description")}</p>
        <DeleteAccountDialog email={email} />
      </section>
    </div>
  );
}