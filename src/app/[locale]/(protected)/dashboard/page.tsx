"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { apiFetch } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { Link } from "@/navigation";
import {
  Users,
  Award,
  Wallet,
  QrCode,
  Check,
  Copy,
  Sparkles,
  ArrowRight,
  Compass,
  BookOpen,
  Activity,
  DollarSign,
  CreditCard,
  TrendingUp,
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
  // 6-card dashboard: team-aggregate order stats (admin-only detail in Lark)
  teamOrdersInProgress: number;
  teamOrdersCompleted: number;
  teamGmvClosed: number;
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

interface StripeStatus {
  connected: boolean;
  accountId: string | null;
  payoutsEnabled: boolean;
}

const TOP_KOL_LIMIT = 20;

export default function AgentDashboard() {
  const t = useTranslations("agent");
  const tDash = useTranslations("dashboard");
  const [stats, setStats] = useState<AgentStats | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("lcm_agent_promoter");
        if (raw) {
          const p = JSON.parse(raw);
          const rate = Number(p.commission_rate) || 10;
          return {
            totalKols: 0,
            activeKols: 0,
            totalPaid: 0,
            totalPending: 0,
            totalApproved: 0,
            agentRate: rate,
            teamOrdersInProgress: 0,
            teamOrdersCompleted: 0,
            teamGmvClosed: 0,
          };
        }
      } catch {}
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const [invite, setInvite] = useState<InviteCodeResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [topKols, setTopKols] = useState<TeamKol[]>([]);
  const [stripe, setStripe] = useState<StripeStatus | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        let realRate = 10;
        let promoterData: any = null;
        let userRes: any = null;
        try {
          const raw = typeof window !== "undefined" ? localStorage.getItem("lcm_agent_promoter") : null;
          if (raw) {
            promoterData = JSON.parse(raw);
            if (promoterData.commission_rate) {
              realRate = Number(promoterData.commission_rate);
            }
          }
        } catch {}

        try {
          const { data } = await supabase.auth.getUser();
          userRes = data;
          if (!promoterData) {
            const res = await fetch("/api/auth/check-agent");
            if (res.ok) {
              const checkData = await res.json();
              if (checkData.promoter) {
                promoterData = checkData.promoter;
                if (promoterData.commission_rate) {
                  realRate = Number(promoterData.commission_rate);
                }
                localStorage.setItem("lcm_agent_promoter", JSON.stringify(promoterData));
              }
            }
          }
        } catch (e) {
          console.warn("Agent lookup error:", e);
        }

          // Parallelize all dashboard data fetching
          const [statsData, inviteData, kolsData, stripeRes] = await Promise.all([
            apiFetch<AgentStats>("/api/affiliate/agent/stats").catch(() => null),
            apiFetch<InviteCodeResponse>("/api/affiliate/agent/invite-code").catch(() => null),
            apiFetch<{ kols: TeamKol[] }>("/api/affiliate/agent/kols").catch(() => ({ kols: [] })),
            apiFetch<{ data: StripeStatus }>("/api/affiliate/me/stripe-status").catch(() => null),
          ]);

          const currentStats: AgentStats = statsData ?? {
            totalKols: 0,
            activeKols: 0,
            totalPaid: 0,
            totalPending: 0,
            totalApproved: 0,
            agentRate: realRate,
            teamOrdersInProgress: 0,
            teamOrdersCompleted: 0,
            teamGmvClosed: 0,
          };
          if (realRate !== 5 && currentStats.agentRate === 5) {
            currentStats.agentRate = realRate;
          }
          setStats(currentStats);

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

          const sorted = (kolsData.kols || [])
            .slice()
            .sort((a, b) => (b.gmv_total || 0) - (a.gmv_total || 0))
            .slice(0, TOP_KOL_LIMIT);
          setTopKols(sorted);

          if (stripeRes?.data) setStripe(stripeRes.data);
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

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t("pageTitle")}</h1>
        <p className="text-sm text-slate-500 mt-1">{t("dashboardSubtitle")}</p>
      </div>

      {/* 6-card agent overview.
          Layout: 1 col mobile / 2 col sm / 3 col lg.
          Cards 3+4 (team orders / team GMV) are aggregate only — admin
          sees per-order detail in Lark; this portal intentionally does not
          expose customer/order detail to KOL recruiters. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card 1: My Tier */}
        <div className="bg-gradient-to-br from-amber-50 via-white to-amber-50 p-6 rounded-2xl border border-amber-100 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">{t("tierBadge")}</div>
              <div className="text-lg font-bold text-slate-900 mt-0.5">{tierName}</div>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-700">{tierRate}</span>
            <span className="text-xs text-slate-500 font-semibold">{t("commission")}</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-bold text-slate-500">
              <span>{t("recruitmentProgress")}</span>
              <span>{t("progressCount", { count: kolCount })}</span>
            </div>
            <div className="w-full bg-amber-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-slate-500 pt-0.5">{nextGoal}</p>
          </div>
        </div>

        {/* Card 2: My Team */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t("teamCardTitle")}</div>
              {loading && !stats ? (
                <div className="h-5 w-16 bg-slate-200 rounded animate-pulse mt-1" />
              ) : (
                <div className="text-lg font-bold text-slate-900 mt-0.5">
                  {stats?.totalKols ?? 0} <span className="text-xs text-slate-500 font-medium">{t("personUnit")}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg font-semibold">
              <TrendingUp className="w-3 h-3" />
              {stats?.activeKols ?? 0} {t("personUnit")} {t("statusActive")}
            </span>
          </div>
          <Link
            href="/kols"
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1"
          >
            {tDash("topKols")} <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Card 3: Team Orders (In Progress / Completed) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t("teamOrdersTitle")}</div>
              <div className="text-lg font-bold text-slate-900 mt-0.5">
                {stats ? stats.teamOrdersInProgress + stats.teamOrdersCompleted : 0}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-amber-50 px-3 py-2 rounded-lg">
              <div className="text-[10px] font-bold text-amber-700 uppercase">{t("teamOrdersInProgressLabel")}</div>
              <div className="text-xl font-extrabold text-amber-800 mt-0.5">
                {stats?.teamOrdersInProgress ?? 0}
              </div>
            </div>
            <div className="bg-emerald-50 px-3 py-2 rounded-lg">
              <div className="text-[10px] font-bold text-emerald-700 uppercase">{t("teamOrdersCompletedLabel")}</div>
              <div className="text-xl font-extrabold text-emerald-800 mt-0.5">
                {stats?.teamOrdersCompleted ?? 0}
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-400">Aggregated only — order details live in Lark.</p>
        </div>

        {/* Card 4: Team GMV Closed */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t("teamGmvTitle")}</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
                ${((stats?.teamGmvClosed ?? 0) / 100).toLocaleString("en-US", { maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-500">USD · cumulative across {t("teamOrdersCompletedLabel")} orders</p>
        </div>

        {/* Card 5: My Commission */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t("myCommissionTitle")}</div>
              <div className="text-lg font-bold text-slate-900 mt-0.5">
                ${(((stats?.totalPaid ?? 0) + (stats?.totalApproved ?? 0)) / 100).toLocaleString("en-US", { maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-emerald-50 px-3 py-2 rounded-lg">
              <div className="text-[10px] font-bold text-emerald-700 uppercase">{t("commissionReceivedLabel")}</div>
              <div className="text-sm font-bold text-emerald-800 mt-0.5">
                ${((stats?.totalPaid ?? 0) / 100).toLocaleString("en-US", { maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="bg-amber-50 px-3 py-2 rounded-lg">
              <div className="text-[10px] font-bold text-amber-700 uppercase">{t("commissionPendingLabel")}</div>
              <div className="text-sm font-bold text-amber-800 mt-0.5">
                ${((stats?.totalPending ?? 0) / 100).toLocaleString("en-US", { maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>

        {/* Card 6: Stripe KYC / Payouts */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t("stripeKycTitle")}</div>
              <div className="text-base font-bold mt-0.5">
                {!stripe ? (
                  <span className="text-slate-400">—</span>
                ) : stripe.connected && stripe.payoutsEnabled ? (
                  <span className="text-emerald-600">{t("stripeKycConnected")}</span>
                ) : stripe.connected ? (
                  <span className="text-amber-600">{t("stripeKycPending")}</span>
                ) : (
                  <span className="text-slate-500">{t("stripeKycNotConnected")}</span>
                )}
              </div>
            </div>
          </div>
          <Link
            href="/dashboard/settings/stripe"
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            {t("ctaCompleteStripe")} <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{t("inviteCardTitle")}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{t("inviteCardDesc")}</p>
          </div>
          <Link
            href="/marketing/posters"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold transition-colors self-start sm:self-auto shadow-sm"
          >
            <QrCode className="w-4 h-4 text-emerald-700" />
            生成营销海报 / 二维码
          </Link>
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

      {/* Global Creator & Patient Growth Enablement Hub */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 p-6 sm:p-7 rounded-3xl text-white shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Global Creator & Healthcare Growth Toolkit
            </div>
            <h3 className="text-lg font-bold text-white">全球拓客与赋能中心 (Growth & Enablement Hub)</h3>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              为您的代理团队配备顶级拓展工具：现阶段重点突破疾病矩阵、全网精准找人搜索词库、带参二维码海报生成、以及中国 63 家顶尖公立三甲名院直联多语话术。
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <Link
            href="/marketing/posters"
            className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between text-emerald-400 mb-2">
                <QrCode className="w-5 h-5" />
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </div>
              <div className="font-bold text-sm text-white">专属二维码海报中心</div>
              <p className="text-xs text-slate-300 mt-1">4 套官方高保真海报，动态嵌入个人带参二维码，支持 9:16/1:1/3:4 极速导出</p>
            </div>
          </Link>

          <Link
            href="/prospecting"
            className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between text-blue-400 mb-2">
                <Compass className="w-5 h-5" />
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
              </div>
              <div className="font-bold text-sm text-white">全球拓客作战地图</div>
              <p className="text-xs text-slate-300 mt-1">现阶段重点疾病 (CAR-T/阜外/脑科/二诊)、全网搜索词库、平台内容结构与邮箱挖掘实战</p>
            </div>
          </Link>

          <Link
            href="/resources"
            className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between text-amber-400 mb-2">
                <BookOpen className="w-5 h-5" />
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
              </div>
              <div className="font-bold text-sm text-white">医疗资源与话术知识库</div>
              <p className="text-xs text-slate-300 mt-1">6 大方向 53 专科名院速查、专科直联多语话术、8 大杀手级异议抗辩宝典与合规红线</p>
            </div>
          </Link>
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

    </div>
  );
}
