"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { supabase } from "@/lib/supabase";
import { apiFetch } from "@/lib/api";
import {
  POSTER_THEMES,
  POSTER_DIMENSIONS,
  PosterThemeId,
  PosterFormat,
  generateMedicalTravelPoster,
} from "@/lib/poster-generator";
import QRCode from "qrcode";
import {
  Download,
  Copy,
  Check,
  Sparkles,
  QrCode,
  Image as ImageIcon,
  Layers,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Loader2,
} from "lucide-react";

export default function PostersPage() {
  const [agentCode, setAgentCode] = useState<string>("");
  const [inviteLink, setInviteLink] = useState<string>("");
  const [selectedTheme, setSelectedTheme] = useState<PosterThemeId>("b2b_partner");
  const [selectedFormat, setSelectedFormat] = useState<PosterFormat>("story");
  const [posterDataUrl, setPosterDataUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    async function fetchAgentData() {
      setLoading(true);
      try {
        // Try getting invite code from agent invite-code endpoint
        const inviteData = await apiFetch<{ agent_invite_code: string; invite_link: string }>(
          "/api/affiliate/agent/invite-code"
        ).catch(() => null);

        let code = inviteData?.agent_invite_code || "";
        let link = inviteData?.invite_link || "";

        if (!code) {
          const { data: userRes } = await supabase.auth.getUser();
          const email = userRes?.user?.email?.trim().toLowerCase();
          if (email) {
            const { data: list } = await supabase.rpc("affiliate_list_promoters", {
              p_search: email,
              p_role: "agent",
            });
            if (Array.isArray(list) && list.length > 0) {
              const matched = list.find((p: any) => p.email?.toLowerCase() === email);
              code = matched?.agent_invite_code || matched?.referral_code || "LCM-VIP";
            }
          }
        }

        if (!code) code = "LCM-VIP";
        if (!link) link = `https://affiliate.linkchinamed.com/register?ref=${code}`;

        setAgentCode(code);
        setInviteLink(link);
      } catch (err) {
        console.error("Failed to load agent profile", err);
        setAgentCode("LCM-VIP");
        setInviteLink("https://affiliate.linkchinamed.com/register");
      } finally {
        setLoading(false);
      }
    }

    fetchAgentData();
  }, []);

  // Re-generate poster whenever theme, format, or agentCode changes
  useEffect(() => {
    if (!agentCode) return;

    let isCancelled = false;

    async function renderPoster() {
      setGenerating(true);
      try {
        const qrCanvas = document.createElement("canvas");
        const targetLink = `https://affiliate.linkchinamed.com/register?ref=${agentCode}&utm_source=poster_${selectedTheme}`;

        await QRCode.toCanvas(qrCanvas, targetLink, {
          width: 360,
          margin: 1,
          color: { dark: "#0f172a", light: "#ffffff" },
        });

        if (isCancelled) return;

        const dataUrl = await generateMedicalTravelPoster({
          qrCanvas,
          code: agentCode,
          themeId: selectedTheme,
          format: selectedFormat,
        });

        if (!isCancelled) {
          setPosterDataUrl(dataUrl);
        }
      } catch (err) {
        console.error("Error generating poster:", err);
      } finally {
        if (!isCancelled) {
          setGenerating(false);
        }
      }
    }

    renderPoster();

    return () => {
      isCancelled = true;
    };
  }, [agentCode, selectedTheme, selectedFormat]);

  const handleCopyLink = () => {
    if (!inviteLink) return;
    navigator.clipboard.writeText(inviteLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownload = () => {
    if (!posterDataUrl) return;
    const a = document.createElement("a");
    a.href = posterDataUrl;
    a.download = `LinkChinaMed-Poster-${selectedTheme}-${selectedFormat}-${agentCode}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Official Creator Recruitment & Global Patient Posters
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            全球招募与宣传海报中心 (Posters & QR Studio)
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
            选择官方预设的高保真国际医疗主题海报。系统会自动将您的专属带参二维码和 Partner Code 嵌入海报中。一键导出高清大图，用于招募下级 KOL 或开展国际就医推广。
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-white/10">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-xs flex items-center gap-2">
              <span className="text-slate-400">您的邀请码:</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">{agentCode || "Loading..."}</span>
            </div>

            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs transition-colors shadow-sm"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedLink ? "链接已复制" : "复制专属注册链接"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Controls on Left, Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Select Theme */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <Layers className="w-5 h-5 text-emerald-600" />
              1. 选择海报主题 (Select Official Theme)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(Object.keys(POSTER_THEMES) as PosterThemeId[]).map((themeKey) => {
                const t = POSTER_THEMES[themeKey];
                const active = selectedTheme === themeKey;
                return (
                  <button
                    key={themeKey}
                    onClick={() => setSelectedTheme(themeKey)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      active
                        ? "border-emerald-600 bg-emerald-50/60 shadow-sm ring-2 ring-emerald-600/20"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
                        {t.tag}
                      </span>
                      {active && <Check className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <div className="font-bold text-slate-900 text-sm mt-2">{t.name}</div>
                    <div className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {t.subheadline}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Select Aspect Ratio */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <ImageIcon className="w-5 h-5 text-emerald-600" />
              2. 选择画幅尺寸 (Select Aspect Ratio)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(Object.keys(POSTER_DIMENSIONS) as PosterFormat[]).map((formatKey) => {
                const f = POSTER_DIMENSIONS[formatKey];
                const active = selectedFormat === formatKey;
                return (
                  <button
                    key={formatKey}
                    onClick={() => setSelectedFormat(formatKey)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      active
                        ? "border-emerald-600 bg-emerald-50/60 shadow-sm ring-2 ring-emerald-600/20"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-900 text-xs">{f.label}</div>
                      {active && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">{f.ratio}</div>
                    <div className="text-xs text-slate-500 mt-1.5 line-clamp-2">{f.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Highlights */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              海报与二维码特性保证：
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-500">
              <li>二维码由前端 Canvas 纯本地合成，带参直达下级注册页，绝不失效；</li>
              <li>扫码注册的博主自动绑定到您的代理团队名下，享受终身业绩归属；</li>
              <li>支持用于 Instagram Story, TikTok, WhatsApp 状态及线下展架高精度输出。</li>
            </ul>
          </div>
        </div>

        {/* Preview Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-4">
              <span className="font-bold text-slate-900 text-sm">海报实时预览 (Live Canvas Preview)</span>
              <span className="text-xs font-mono text-slate-400">
                {POSTER_DIMENSIONS[selectedFormat].ratio}
              </span>
            </div>

            {/* Poster Frame */}
            <div className="w-full bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 relative flex items-center justify-center p-2 min-h-[460px]">
              {generating ? (
                <div className="flex flex-col items-center gap-2 text-slate-400 py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                  <span className="text-xs">渲染高清海报中…</span>
                </div>
              ) : posterDataUrl ? (
                <img
                  src={posterDataUrl}
                  alt="Personalized Medical Poster Preview"
                  className="w-full h-auto object-contain rounded-xl max-h-[580px]"
                />
              ) : (
                <div className="text-slate-500 text-xs py-16">准备渲染中…</div>
              )}
            </div>

            {/* Download CTA */}
            <div className="w-full mt-5 space-y-2">
              <button
                onClick={handleDownload}
                disabled={generating || !posterDataUrl}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-900/10 flex items-center justify-center gap-2 text-sm"
              >
                <Download className="w-4 h-4" />
                下载超清 PNG 海报 (Download High-Res)
              </button>
              <p className="text-[11px] text-slate-400 text-center">
                点击直接保存至本地相册或电脑，可原图分享或喷绘打印
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
