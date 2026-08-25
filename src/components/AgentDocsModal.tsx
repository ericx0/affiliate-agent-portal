"use client";

import { useState } from "react";
import {
  BookOpen,
  X,
  Sparkles,
  ShieldCheck,
  Users,
  DollarSign,
  HelpCircle,
  Video,
  FileText,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

interface AgentDocsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenScripts?: () => void;
  onOpenPoster?: () => void;
}

export function AgentDocsModal({
  open,
  onOpenChange,
  onOpenScripts,
  onOpenPoster,
}: AgentDocsModalProps) {
  const [activeTab, setActiveTab] = useState<"role" | "kols" | "services" | "faq" | "training">("role");

  if (!open) return null;

  const tabs = [
    { id: "role", label: "核心定位与佣金机制", icon: DollarSign },
    { id: "kols", label: "目标 KOL 与招募渠道", icon: Users },
    { id: "services", label: "核心服务与合规红线", icon: ShieldCheck },
    { id: "faq", label: "常见异议与应对答疑", icon: HelpCircle },
    { id: "training", label: "官方培训与物料支持", icon: Video },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-950 p-6 text-white relative flex-shrink-0">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            LinkChinaMed Agent Playbook
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            代理赋能与培训指南 (Agent Playbook & Training Hub)
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            面向全球代理商的完整实战指南：涵盖工作定位、KOL 招募拓客、高客单佣金体系、核心卖点与合规准则。
          </p>
        </div>

        {/* Content Area with Side Tabs */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          {/* Side Tabs */}
          <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-3 flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto flex-shrink-0">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left whitespace-nowrap md:whitespace-normal ${
                    active
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/20"
                      : "text-slate-600 hover:bg-slate-200/70 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-white" : "text-slate-400"}`} />
                  <span className="flex-1">{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Display */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6 text-sm text-slate-700 bg-white leading-relaxed">
            {activeTab === "role" && (
              <div className="space-y-5">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-lg font-bold text-slate-900">1. 代理商核心定位与收益模式</h3>
                  <p className="text-xs text-slate-500 mt-0.5">理解您的角色定位，最大化团队被动收益</p>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2">
                  <div className="font-bold text-emerald-900 text-sm">🎯 您的首要核心工作：招募与赋能 KOL</div>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    代理商（Agent）是 LinkChinaMed 全球创作者生态的合伙人。您的主要使命是<strong>拓展并辅导海外健康、养生、医疗旅游及跨国生活方式领域的 KOL 创作者</strong>。当您招募的下级 KOL 带来客户并完成就医服务时，您将持续获得<strong>团队管理极差佣金（5%–10%）</strong>。
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900 block">Level 1 (铜牌代理)</span>
                    <span className="text-emerald-600 font-extrabold text-lg block">5% 团队佣金</span>
                    <span className="text-slate-500 block">招募 1–10 名活跃 KOL</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900 block">Level 2 (银牌代理)</span>
                    <span className="text-emerald-600 font-extrabold text-lg block">8% 团队佣金</span>
                    <span className="text-slate-500 block">招募 11–100 名活跃 KOL</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900 block">Level 3 (金牌代理)</span>
                    <span className="text-emerald-600 font-extrabold text-lg block">10% 团队佣金</span>
                    <span className="text-slate-500 block">招募 100+ 名活跃 KOL</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400">高客单价收益测算示例</h4>
                  <ul className="list-disc list-inside text-xs text-slate-600 space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <li><strong>VIP 深度防癌与全身精密体检</strong>：客单价 $2,500 USD，下级 KOL 出单，代理单笔管理佣金可达 <strong>$125 – $250 USD</strong>。</li>
                    <li><strong>重疾二次诊疗与多学科专家会诊 (MDT)</strong>：客单价 $3,800 USD，代理单笔管理佣金 <strong>$190 – $380 USD</strong>。</li>
                    <li><strong>跨境专科微创手术及康复陪诊包</strong>：客单价 $10,000 – $25,000 USD，代理单笔管理佣金 <strong>$500 – $2,500 USD</strong>。</li>
                    <li><strong>终身客户绑定机制</strong>：客户首次通过下级 KOL 推广码建档，后续年度复查或再次就诊订单，代理及 KOL 终身享有分佣。</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "kols" && (
              <div className="space-y-5">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-lg font-bold text-slate-900">2. 目标 KOL 画像与高效招募打法</h3>
                  <p className="text-xs text-slate-500 mt-0.5">精准锁定海外创作者，快速搭建您的分销战队</p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 text-xs">四类极具转化潜力的目标创作者画像：</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <span className="font-bold text-slate-900">1. 健康、瑜伽与抗衰博主 (Wellness Creators)</span>
                      <p className="text-slate-500">粉丝注重预防医学与精密体检，极度认可高品质医疗与健康筛查。</p>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <span className="font-bold text-slate-900">2. 海外生活与文化体验博主 (Expats & Travel)</span>
                      <p className="text-slate-500">受众有跨国就医与旅行习惯，能生动展示中国三甲医院国际部的现代与高效。</p>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <span className="font-bold text-slate-900">3. 慢性病及患者互助社群主理人 (Patient Advocates)</span>
                      <p className="text-slate-500">粉丝有强烈的专科就医与免排队第二诊疗需求，客单价与转化率极高。</p>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <span className="font-bold text-slate-900">4. 涉外商务及高净值经纪人 (Business Advisors)</span>
                      <p className="text-slate-500">直接触达需要高质量 VIP 绿色通道的企业高管与跨境商旅人士。</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-amber-300">💡 招募工具箱与邀约模板</span>
                    {onOpenScripts && (
                      <button
                        onClick={() => {
                          onOpenChange(false);
                          onOpenScripts();
                        }}
                        className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg font-bold transition-colors inline-flex items-center gap-1"
                      >
                        打开话术库 <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-slate-300">
                    平台已内置包含 Instagram DM、LinkedIn 商业私信、WhatsApp 邀约在内的多套英文高转化邀约模板，点击话术库可一键复制并自动携带您的 8 位专属邀请码。
                  </p>
                </div>
              </div>
            )}

            {activeTab === "services" && (
              <div className="space-y-5">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-lg font-bold text-slate-900">3. 核心服务定位与业务合规红线</h3>
                  <p className="text-xs text-slate-500 mt-0.5">统一宣传统一口径，坚守医疗合规底线</p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 text-xs">四大核心对外宣传卖点：</h4>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
                      <span className="font-bold text-emerald-600">⚡ 零排队直通三甲国际部</span>
                      <span className="text-slate-600">快速绿色通道预约协和、华西等全国顶级公立三甲特需/国际部专家与手术。</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
                      <span className="font-bold text-emerald-600">💰 节省 30%–70% 医疗费用</span>
                      <span className="text-slate-600">与欧美及新加坡私立医院相比，中国顶级公立三甲医疗水准同等但费用大幅降低。</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
                      <span className="font-bold text-emerald-600">🌐 1对1 专属双语医学向导</span>
                      <span className="text-slate-600">提供自机场接机、院内全程一对一陪诊、病历专业医学翻译至出院取药全流程服务。</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
                      <span className="font-bold text-emerald-600">🛡️ 100% 透明直接支付医院</span>
                      <span className="text-slate-600">所有医院诊疗及检查费用均由患者在医院窗口直接缴纳，平台零加价、零药品提成。</span>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
                  <div className="font-bold text-amber-900 text-xs flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    ⚠️ 极其重要的合规红线 (Compliance Guidelines)
                  </div>
                  <ul className="list-disc list-inside text-xs text-amber-800 space-y-1">
                    <li>LinkChinaMed 是一家提供<strong>跨境就医行政协调、翻译向导及预约协助</strong>的科技服务平台。</li>
                    <li>平台及代理商<strong>不提供任何医疗诊断、不开展线上处方、不承诺任何医疗效果</strong>。</li>
                    <li>严禁任何代理或 KOL 向患者承诺“包治愈”或伪造医院医生背书。</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "faq" && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-lg font-bold text-slate-900">4. 常见异议与解答答疑 (KOL FAQs)</h3>
                  <p className="text-xs text-slate-500 mt-0.5">招募沟通中常见问题标准话术解答</p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="border border-slate-200 rounded-xl p-4 space-y-1.5 bg-slate-50">
                    <span className="font-bold text-slate-900 block">Q1: KOL 担心跨国医疗纠纷，如何打消顾虑？</span>
                    <p className="text-slate-600">
                      <strong>答复：</strong>患者所有医疗合同与知情同意书均在医院国际部直接签署，医疗责任归属于医院。LinkChinaMed 为患者提供正规就医向导协议与商业保险协助，并在就医全流程中安排双语向导保障沟通无障碍。
                    </p>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-4 space-y-1.5 bg-slate-50">
                    <span className="font-bold text-slate-900 block">Q2: 佣金如何结算？会不会拖欠？</span>
                    <p className="text-slate-600">
                      <strong>答复：</strong>平台接入全球最大的合规支付通道 <strong>Stripe Connect</strong>。客户完成就医付款后，系统自动清算佣金，每月固定打款至 KOL 及代理商的银行账户或 Stripe 钱包，透明可查。
                    </p>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-4 space-y-1.5 bg-slate-50">
                    <span className="font-bold text-slate-900 block">Q3: 为什么选择中国三甲医院国际部，而不是去日韩或泰国？</span>
                    <p className="text-slate-600">
                      <strong>答复：</strong>中国公立顶级三甲医院（如协和、华西、瑞金）在重症医学、肿瘤复杂手术、器官移植及精密放化疗等临床诊疗体量和技术上处于世界前列；且国际部环境优雅、医生全英语沟通、无排队周期，相比日韩欧美具有极其显著的性价比与时效优势。
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "training" && (
              <div className="space-y-5">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-lg font-bold text-slate-900">5. 官方培训、通知与物料支持</h3>
                  <p className="text-xs text-slate-500 mt-0.5">利用平台全套素材与定期培训，快速赋能创作者</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-2">
                    <div className="font-bold text-emerald-900 text-sm flex items-center gap-1.5">
                      <Video className="w-4 h-4 text-emerald-700" />
                      每周线上培训会 (Zoom Webinars)
                    </div>
                    <p className="text-xs text-emerald-800">
                      官方运营团队每周二/周四定期举办多语言线上培训与答疑会，管理后台将通过邮件广播直接向您的邮箱发送参会链接。
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-2xl space-y-2">
                    <div className="font-bold text-blue-900 text-sm flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-blue-700" />
                      1080×1920 高清营销海报
                    </div>
                    <p className="text-xs text-blue-800">
                      内置智能海报合成引擎，一键生成带有您 8 位专属邀请码与静态二维码的高清英文宣传海报，适用于 Instagram Story 及社群分发。
                    </p>
                    {onOpenPoster && (
                      <button
                        onClick={() => {
                          onOpenChange(false);
                          onOpenPoster();
                        }}
                        className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-bold transition-colors inline-flex items-center gap-1 mt-1"
                      >
                        生成并保存海报 <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 space-y-2">
                  <span className="font-bold text-slate-900">📚 持续更新说明</span>
                  <p>
                    本培训手册由 LinkChinaMed 官方运营团队根据前线拓客实战与医院合作进展持续维护更新。如有任何特定领域的招募疑问或定制化物料需求，可随时与您的专属客户经理联系。
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
          <div className="text-xs text-slate-500">
            LinkChinaMed Official Agent Enablement Series • v2.0
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenChange(false)}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
            >
              完成阅读并返回
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
