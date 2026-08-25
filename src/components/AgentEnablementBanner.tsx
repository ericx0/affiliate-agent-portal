"use client";

import { Sparkles, BookOpen, MessageSquare, QrCode, Users, GraduationCap, ShieldCheck, ArrowRight } from "lucide-react";

interface AgentEnablementBannerProps {
  onOpenDocs: () => void;
  onOpenScripts: () => void;
  onOpenPoster: () => void;
}

export function AgentEnablementBanner({
  onOpenDocs,
  onOpenScripts,
  onOpenPoster,
}: AgentEnablementBannerProps) {
  return (
    <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 rounded-3xl p-6 md:p-8 text-white shadow-xl border border-emerald-500/25 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Top Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-white/10 pb-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/15 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              代理实战赋能中心 • Agent Enablement & Playbook
            </div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-white tracking-tight">
              招募海外创作者战队 • 赚取 5%–10% 团队高客单佣金
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
              平台提供定期实操培训、多语言高转化招募话术库与 1080×1920 高清营销海报，全方位助力拓客与成单。
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
            <button
              onClick={onOpenDocs}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              <BookOpen className="w-4 h-4" />
              📖 查阅实战手册 (Playbook)
            </button>

            <button
              onClick={onOpenScripts}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all border border-white/15 backdrop-blur-md hover:scale-[1.02] active:scale-[0.98]"
            >
              <MessageSquare className="w-4 h-4 text-amber-300" />
              招募话术库
            </button>

            <button
              onClick={onOpenPoster}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all border border-white/15 backdrop-blur-md hover:scale-[1.02] active:scale-[0.98]"
            >
              <QrCode className="w-4 h-4 text-emerald-400" />
              生成营销海报
            </button>
          </div>
        </div>

        {/* 3 Overview Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            onClick={onOpenDocs}
            className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/40 rounded-2xl p-5 space-y-2.5 backdrop-blur-sm transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Users className="w-4 h-4" />
                您的核心定位
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              招募并辅导海外健康/养生/生活方式 KOL 创作者。下级出单即可终身享受 5%–10% 团队管理极差佣金。
            </p>
          </div>

          <div
            onClick={onOpenDocs}
            className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-500/40 rounded-2xl p-5 space-y-2.5 backdrop-blur-sm transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <GraduationCap className="w-4 h-4" />
                培训与物料支持
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              每周定期举办线上培训与答疑会，后台通过邮件广播同步会议链接；提供三甲官方素材与多语言邀约模板。
            </p>
          </div>

          <div
            onClick={onOpenDocs}
            className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/40 rounded-2xl p-5 space-y-2.5 backdrop-blur-sm transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-300 font-bold text-sm">
                <ShieldCheck className="w-4 h-4" />
                三甲国际部与合规
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              零排队直通顶级三甲公立医院国际部，省 30%–70% 医疗费用，1对1双语陪诊，医院直接收费零差价。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
