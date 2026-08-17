"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/navigation";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import TurnstileLoader from "@/components/TurnstileLoader";
import { supabase } from "@/lib/supabase";

const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ||
  (process.env.NODE_ENV !== "production" ? "1x00000000000000000000AA" : "");

// Card UI tokens aligned with admin-v2 / KOL portal / partner portal.
// See memory: portal-login-ui-alignment-2026-08-16.
const inputClass =
  "h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30";

type Mode = "otp" | "password";

// Sanitize the `next` query param so a crafted link can't redirect a
// logged-in agent off-site. Only relative single-leading-slash allowed.
function safeNextPath(input: string | undefined): string {
  if (typeof input !== "string") return "/dashboard";
  if (!input.startsWith("/")) return "/dashboard";
  if (input.startsWith("//")) return "/dashboard";
  return input;
}

export default function AgentLoginPage() {
  const t = useTranslations("agentLogin");
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("otp");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!turnstileToken) {
      setError(t("captchaRequired"));
      return;
    }

    setSending(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: { captchaToken: turnstileToken },
      });

      if (signInError) {
        setError(
          signInError.message.toLowerCase().includes("credential")
            ? t("passwordErrorInvalid")
            : signInError.message || t("passwordErrorGeneric")
        );
        setTurnstileToken("");
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const target = params.get("next");
      router.push(safeNextPath(target ?? undefined));
    } catch (e: any) {
      setError(e.message || t("passwordErrorGeneric"));
    } finally {
      setSending(false);
    }
  };

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!turnstileToken) {
      setError(t("captchaRequired"));
      return;
    }

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const { data, error: rpcErr } = await supabase.rpc("affiliate_list_promoters", {
        p_search: normalizedEmail,
      });

      if (rpcErr) {
        console.error("affiliate_list_promoters check failed:", rpcErr);
        setError(t("checkFailed"));
        return;
      }

      const match = Array.isArray(data)
        ? data.find((p: any) => p.email?.toLowerCase() === normalizedEmail)
        : null;

      if (!match || match.status !== "active") {
        setError(t("notRegisteredAgent"));
        return;
      }

      if (match.role === "kol") {
        setError(t("registeredAsKol"));
        return;
      }

      if (match.role !== "agent") {
        setError(t("notRegisteredAgent"));
        return;
      }
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
      const params = new URLSearchParams(window.location.search);
      const target = params.get("next");
      router.push(safeNextPath(target ?? undefined));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-end mb-4">
          <LocaleSwitcher />
        </div>
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
          <TurnstileLoader />
          <div className="flex flex-col items-center gap-3 mb-4">
            <Image
              src="/logo.png"
              alt="LinkChinaMed"
              width={160}
              height={48}
              className="h-12 w-auto object-contain"
              priority
            />
            <h1 className="text-xl font-semibold">
              LinkChinaMed <span className="text-brand-500">Agents</span>
            </h1>
            <p className="text-sm text-gray-600">{t("subtitle")}</p>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-1 rounded-md bg-gray-100 p-1">
            {(
              [
                ["otp", t("tabOtp")],
                ["password", t("tabPassword")],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setMode(key);
                  setError("");
                  setSent(false);
                }}
                className={
                  "rounded-md px-3 py-1.5 text-sm transition-colors " +
                  (mode === key
                    ? "bg-white font-medium shadow-sm text-gray-900"
                    : "text-gray-500 hover:text-gray-700")
                }
              >
                {label}
              </button>
            ))}
          </div>

          {mode === "password" ? (
            <form onSubmit={handlePasswordLogin} className="space-y-3">
              <input
                type="email"
                required
                placeholder={t("emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
              <input
                type="password"
                required
                placeholder={t("passwordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-xs text-brand-600 hover:text-brand-700 hover:underline"
                >
                  {t("forgotPassword")}
                </Link>
              </div>
              <div className="flex justify-center">
                {mounted && <div ref={turnstileRef} />}
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={sending || !turnstileToken}
                className="w-full h-10 rounded-md bg-brand-500 text-white font-medium hover:opacity-90 disabled:opacity-50"
              >
                {sending ? t("signingIn") : t("signIn")}
              </button>
            </form>
          ) : !sent ? (
            <form onSubmit={sendCode} className="space-y-3">
              <p className="text-sm text-gray-600">{t("introText")}</p>
              <input
                type="email"
                placeholder={t("emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputClass}
              />
              <div className="flex justify-center">
                {mounted && <div ref={turnstileRef} />}
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={sending || !turnstileToken}
                className="w-full h-10 rounded-md bg-brand-500 text-white font-medium hover:opacity-90 disabled:opacity-50"
              >
                {sending ? t("sending") : t("sendCode")}
              </button>
            </form>
          ) : (
            <form onSubmit={verifyCode} className="space-y-3">
              <p className="text-sm text-gray-600">
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
                className={inputClass + " text-center text-lg tracking-widest"}
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={verifying || code.length !== 6}
                className="w-full h-10 rounded-md bg-brand-500 text-white font-medium hover:opacity-90 disabled:opacity-50"
              >
                {verifying ? t("sending") : t("verifyLogin")}
              </button>
              <button
                type="button"
                onClick={() => { setSent(false); setError(""); }}
                className="w-full text-xs text-gray-500 hover:text-gray-700"
              >
                {t("useDifferentEmail")}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}