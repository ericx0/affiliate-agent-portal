"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { apiFetch } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { QRCodeCanvas } from "qrcode.react";
import { generateMedicalTravelPoster } from "@/lib/poster-generator";
import { OutreachScriptsModal } from "@/components/OutreachScriptsModal";
import { AgentDocsModal } from "@/components/AgentDocsModal";
import { AgentEnablementBanner } from "@/components/AgentEnablementBanner";
import {
  Users,
  Award,
  TrendingUp,
  Wallet,
  Copy,
  Check,
  Share2,
  Sparkles,
  QrCode,
  Download,
  X,
  BookOpen,
  GraduationCap,
  Loader2,
} from "lucide-react";

const TIER_RATE_BY_LEVEL: Record<number, { nextRate: number | null; minKols: number }> = {
  5: { nextRate: 8, minKols: 0 },
  8: { nextRate: 10, minKols: 10 },
  10: { nextRate: null, minKols: 100 },
};

interface AgentStats {
  totalKols: number;
  activeKols: number;
  totalPaid: number;
  totalPending: number;
  totalApproved: number;
  agentRate: number;
}

interface InviteCodeResponse {
  agent_invite_code: string;
  invite_link: string;
}

interface TeamKol {
  id: string;
  name: string;
  gmv_total: number;
  total_commission_earned: number;
}

const TOP_KOL_LIMIT = 20;

export default function AgentDashboard() {
  const t = useTranslations("agent");
  const tDash = useTranslations("dashboard");
  const [stats, setStats] = useState<AgentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [invite, setInvite] = useState<InviteCodeResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showScriptsModal, setShowScriptsModal] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [generatingPoster, setGeneratingPoster] = useState(false);
  const [topKols, setTopKols] = useState<TeamKol[]>([]);
  const qrWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        let realRate = 5;
        let promoterData: any = null;
        try {
          const { data: userRes } = await supabase.auth.getUser();
          const userEmail = userRes?.user?.email?.trim().toLowerCase();
          if (userEmail) {
            const { data: list } = await supabase.rpc("affiliate_list_promoters", {
              p_search: userEmail,
            });
            if (Array.isArray(list)) {
              promoterData = list.find((p: any) => p.email?.toLowerCase() === userEmail);
              if (promoterData?.commission_rate) {
                realRate = Number(promoterData.commission_rate);
              }
            }
          }

          const data = await apiFetch<AgentStats>("/api/affiliate/agent/stats").catch(
            () => null
          );

          const currentStats: AgentStats = data ?? {
            totalKols: 0,
            activeKols: 0,
            totalPaid: 0,
            totalPending: 0,
            totalApproved: 0,
            agentRate: realRate,
          };
          if (realRate !== 5 && currentStats.agentRate === 5) {
            currentStats.agentRate = realRate;
          }
          setStats(currentStats);

          const inviteData = await apiFetch<InviteCodeResponse>(
            "/api/affiliate/agent/invite-code"
          ).catch(() => null);

          const agentCode =
            inviteData?.agent_invite_code ||
            promoterData?.agent_invite_code ||
            (userRes?.user?.id ? userRes.user.id.slice(0, 8).toUpperCase() : "");

          if (inviteData && inviteData.agent_invite_code) {
            setInvite(inviteData);
          } else if (agentCode) {
            setInvite({
              agent_invite_code: agentCode,
              invite_link: `https://affiliate.linkchinamed.com/register?agent=${agentCode}`,
            });
          }

          const kolsData = await apiFetch<{ kols: TeamKol[] }>(
            "/api/affiliate/agent/kols"
          ).catch(() => ({ kols: [] }));

          const sorted = (kolsData.kols || [])
            .slice()
            .sort((a, b) => (b.gmv_total || 0) - (a.gmv_total || 0))
            .slice(0, TOP_KOL_LIMIT);
          setTopKols(sorted);
        } catch (e) {
          console.warn("Direct RPC agent lookup error:", e);
        }
      } catch (err) {
        console.error("Failed to load agent dashboard:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const agentRate = stats?.agentRate ?? 5;
  const kolCount = stats?.totalKols ?? 0;

  let tierName = t("tierBronze");
  let tierRate = "5%";
  let nextGoal = t("goalToLevel2", { count: Math.max(0, 10 - kolCount) });
  let progressPercent = (kolCount / 10) * 100;

  if (agentRate >= 10) {
    tierName = t("tierGold");
    tierRate = "10%";
    nextGoal = t("maxTierReached");
    progressPercent = 100;
  } else if (agentRate >= 8) {
    tierName = t("tierSilver");
    tierRate = "8%";
    nextGoal = t("goalToLevel3", { count: Math.max(0, 100 - kolCount) });
    progressPercent = (kolCount / 100) * 100;
  }

  const handleCopyLink = () => {
    const link = invite?.invite_link;
    if (!link) return;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inviteLink = invite?.invite_link ?? "";

  const handleDownloadQrPoster = async () => {
    const canvas = qrWrapperRef.current?.querySelector("canvas");
    if (!canvas) return;
    try {
      setGeneratingPoster(true);
      const posterDataUrl = await generateMedicalTravelPoster({
        qrCanvas: canvas as HTMLCanvasElement,
        code: invite?.agent_invite_code || "PARTNER",
        role: "agent",
      });
      const a = document.createElement("a");
      a.href = posterDataUrl;
      a.download = `linkchinamed-agent-poster-${invite?.agent_invite_code || "partner"}.png`;
      a.click();
    } catch (e) {
      console.error("Poster generation failed:", e);
      const url = (canvas as HTMLCanvasElement).toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = "linkchinamed-agent-invite-qr.png";
      a.click();
    } finally {
      setGeneratingPoster(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t("pageTitle")}</h1>
        <p className="text-sm text-slate-500 mt-1">{t("dashboardSubtitle")}</p>
      </div>

      {/* Independent Agent Enablement & Playbook Banner */}
      <AgentEnablementBanner
        onOpenDocs={() => setShowDocsModal(true)}
        onOpenScripts={() => setShowScriptsModal(true)}
        onOpenPoster={() => setShowQrModal(true)}
      />

      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-semibold backdrop-blur-md">
            <Award className="w-4 h-4 text-amber-300" />
            {t("tierBadge")}
          </div>
          <div className="text-3xl font-extrabold flex items-center gap-3">
            {tierName}
            <span className="text-xl bg-amber-400 text-slate-900 px-3 py-1 rounded-xl font-black">
              {tierRate} {t("commission")}
            </span>
          </div>
          <p className="text-xs text-blue-100">{nextGoal}</p>
        </div>
        <div className="w-full md:w-64 space-y-2 bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
          <div className="flex justify-between text-xs font-bold text-blue-200">
            <span>{t("recruitmentProgress")}</span>
            <span>{t("progressCount", { count: kolCount })}</span>
          </div>
          <div className="w-full bg-blue-950/60 rounded-full h-3 overflow-hidden">
            <div
              className="bg-amber-400 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold">{t("statTotalKols")}</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{stats?.totalKols} {t("personUnit")}</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold">{t("statActiveKols")}</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{stats?.activeKols} {t("personUnit")}</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold">{t("statTotalPaid")}</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              ${((stats?.totalPaid ?? 0) / 100).toFixed(2)}
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold">{t("statPendingCommission")}</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              ${((stats?.totalPending ?? 0) / 100).toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{t("inviteCardTitle")}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{t("inviteCardDesc")}</p>
          </div>
          <button
            onClick={() => setShowQrModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold transition-colors self-start sm:self-auto"
          >
            <QrCode className="w-4 h-4 text-slate-600" />
            {t("qrButton")}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-xs font-semibold text-slate-400">{t("inviteCodeLabel")}</span>
            <div className="font-mono text-lg font-bold text-blue-600 tracking-wider">
              {invite?.agent_invite_code || "—"}
            </div>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-xs font-semibold text-slate-400">{t("inviteLinkLabel")}</span>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-mono text-slate-600 truncate">{invite?.invite_link || t("inviteUnavailable")}</span>
              {invite?.invite_link && (
                <button
                  onClick={handleCopyLink}
                  className="p-1.5 hover:bg-slate-200 text-slate-500 rounded-lg transition-colors flex-shrink-0"
                  title={t("copyLink")}
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {t("myKolTeam")}
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">{stats?.totalKols ?? 0} {t("personUnit")}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">{t("kolsSubtitle")}</p>
          </div>
        </div>
        {loading ? (
          <div className="text-center py-12 text-slate-400 text-sm">{t("loading")}</div>
        ) : topKols.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">{t("emptyTitle")}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 text-xs text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">{t("thKol")}</th>
                  <th className="py-3 px-4">{t("thGmv")}</th>
                  <th className="py-3 px-4">{t("thCommissionEarned")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topKols.map((kol) => (
                  <tr key={kol.id} className="hover:bg-slate-50">
                    <td className="py-4 px-4 font-medium text-slate-900">{kol.name}</td>
                    <td className="py-4 px-4 text-slate-600">${Number(kol.gmv_total ?? 0).toFixed(2)}</td>
                    <td className="py-4 px-4 font-bold text-emerald-600">${Number(kol.total_commission_earned ?? 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-slate-900 text-slate-300 p-6 rounded-2xl text-xs space-y-2">
        <div className="font-bold text-white text-sm">{t("rulesTitle")}</div>
        <p>{t("ruleLevel1")}</p>
        <p>{t("ruleLevel2")}</p>
        <p>{t("ruleLevel3")}</p>
      </div>

      {/* Complete Agent Playbook & Training Hub Modal */}
      <AgentDocsModal
        open={showDocsModal}
        onOpenChange={setShowDocsModal}
        onOpenScripts={() => setShowScriptsModal(true)}
        onOpenPoster={() => setShowQrModal(true)}
      />

      {/* Outreach Pitch Scripts Modal */}
      <OutreachScriptsModal
        open={showScriptsModal}
        onOpenChange={setShowScriptsModal}
        inviteCode={invite?.agent_invite_code || "—"}
        inviteLink={inviteLink}
      />

      {/* Invite QR poster modal */}
      {showQrModal && inviteLink && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full space-y-6 relative shadow-2xl">
            <button onClick={() => setShowQrModal(false)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 rounded-full"><X className="w-5 h-5" /></button>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-slate-900">{t("qrModalTitle")}</h3>
              <p className="text-xs text-slate-500">{t("qrModalDesc")}</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-6 rounded-2xl shadow-inner flex flex-col items-center justify-center text-white space-y-4">
              <div className="bg-white p-4 rounded-xl shadow-lg" ref={qrWrapperRef}>
                <QRCodeCanvas value={inviteLink} size={180} level="H" includeMargin={true} />
              </div>
              <div className="text-center">
                <div className="font-bold text-sm tracking-wide">LinkChinaMed Partner</div>
                <div className="text-[11px] text-emerald-100 mt-0.5">Invite Code: {invite?.agent_invite_code}</div>
              </div>
            </div>
            <button
              onClick={handleDownloadQrPoster}
              disabled={generatingPoster}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm inline-flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {generatingPoster ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  正在生成高清海报...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  {tDash("savePoster")} (1080×1920 HD)
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
