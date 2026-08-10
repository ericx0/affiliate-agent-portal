"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/navigation";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import TurnstileLoader from "@/components/TurnstileLoader";
import { supabase } from "@/lib/supabase";

const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ||
  (process.env.NODE_ENV !== "production" ? "1x00000000000000000000AA" : "");

export default function AgentLoginPage() {
  const t = useTranslations("agentLogin");
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");

  const [mounted, setMounted] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    const render = () => {
      if (!turnstileRef.current || !window.turnstile) return;
      if (widgetIdRef.current) {
        try { window.turnstile.remove(widgetIdRef.current); } catch {}
      }
      widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token: string) => setTurnstileToken(token),
        "expired-callback": () => setTurnstileToken(""),
        "error-callback": () => setTurnstileToken(""),
      });
    };
    if (window.turnstile) {
      render();
    } else {
      window.__lcm_turnstile_cb = render;
    }
    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try { window.turnstile.remove(widgetIdRef.current); } catch {}
        widgetIdRef.current = null;
      }
    };
  }, [mounted]);

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!turnstileToken) {
      setError(t("captchaRequired"));
      return;
    }

    try {
      // Pre-check lives on Supabase Edge Functions (shared with KOL portal);
      // it returns { exists, role: "kol" | "agent", registered }.
      const fnBase = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
      const checkRes = await fetch(
        `${fnBase}/functions/v1/check-email?email=${encodeURIComponent(email)}`,
        { headers: { "X-Turnstile-Token": turnstileToken } }
      );
      if (checkRes.status === 429) {
        setError(t("rateLimited"));
        return;
      }
      if (!checkRes.ok) {
        setError(t("checkFailed"));
        return;
      }
      const checkData = (await checkRes.json()) as {
        exists: boolean;
        role: "kol" | "agent" | null;
        registered: boolean;
      };
      if (!checkData.exists) {
        setError(t("notRegisteredAgent"));
        return;
      }
      if (checkData.role === "kol") {
        setError(t("registeredAsKol"));
        return;
      }
      // role === "agent" — proceed to OTP
    } catch {
      setError(t("checkFailed"));
      return;
    }

    setSending(true);
    try {
      const { error: otpErr } = await supabase.auth.signInWithOtp({
        email,
        options: { captchaToken: turnstileToken, shouldCreateUser: false },
      });
      if (otpErr) throw otpErr;
      setSent(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  };

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setVerifying(true);
    try {
      const { error: verifyErr } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: "email",
      });
      if (verifyErr) throw verifyErr;
      router.push("/dashboard");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <main className="max-w-md mx-auto px-4 py-16">
      <TurnstileLoader />
      <div className="flex justify-end mb-6">
        <LocaleSwitcher />
      </div>
      <h1 className="text-2xl font-bold mb-6">{sent ? t("enterCodeTitle") : t("pageTitle")}</h1>

      {!sent ? (
        <form onSubmit={sendCode} className="space-y-4">
          <p className="text-sm text-slate-600">{t("introText")}</p>
          <input
            type="email"
            placeholder={t("emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border rounded-xl"
          />

          <div className="flex justify-center my-2">
            {mounted && <div ref={turnstileRef} />}
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button type="submit" disabled={sending || !turnstileToken}
            className="w-full py-3 bg-brand-500 text-white rounded-xl font-semibold disabled:opacity-50">
            {sending ? t("sending") : t("sendCode")}
          </button>
        </form>
      ) : (
        <form onSubmit={verifyCode} className="space-y-4">
          <p className="text-sm text-slate-600">
            {t.rich("codeSentTo", {
              email: () => <span className="font-semibold">{email}</span>,
            })}
          </p>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder={t("codePlaceholder")}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            required
            className="w-full p-3 text-center text-2xl tracking-widest border rounded-xl"
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button type="submit" disabled={verifying || code.length !== 6}
            className="w-full py-3 bg-brand-500 text-white rounded-xl font-semibold disabled:opacity-50">
            {verifying ? t("sending") : t("verifyLogin")}
          </button>
          <button type="button" onClick={() => { setSent(false); setError(""); }}
            className="w-full text-sm text-slate-500 hover:underline">
            {t("useDifferentEmail")}
          </button>
        </form>
      )}
    </main>
  );
}
