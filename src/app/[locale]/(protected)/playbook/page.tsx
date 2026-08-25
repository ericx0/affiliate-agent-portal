"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  BookOpen,
  DollarSign,
  Users,
  ShieldCheck,
  HelpCircle,
  Video,
  Sparkles,
  Copy,
  Check,
  ChevronRight,
  MessageSquare,
  Mail,
  Send,
  FileText,
  Hospital,
  AlertTriangle,
  Award,
} from "lucide-react";

export default function AgentPlaybookPage() {
  const tNav = useTranslations("nav");
  const [activeTab, setActiveTab] = useState<"role" | "kols" | "services" | "faq" | "training">("role");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const tabs = [
    { id: "role", label: "1. 核心定位与分佣体系", desc: "团队 5%–10% 极差机制与客单价收益测算", icon: DollarSign },
    { id: "kols", label: "2. 目标 KOL 与招募渠道", desc: "4 类高转化博主画像与私信邀约模板", icon: Users },
    { id: "services", label: "3. 核心服务与合规红线", desc: "四大服务卖点与非医疗行政向导合规准则", icon: ShieldCheck },
    { id: "faq", label: "4. 常见异议与解答答疑", desc: "跨国就医、Stripe结算、公立三甲优势标准答复", icon: HelpCircle },
    { id: "training", label: "5. 官方培训与素材中心", desc: "每周 Zoom 培训排期、高清海报与素材支持", icon: Video },
  ] as const;

  const scripts = [
    {
      title: "Instagram / TikTok DM (Short & High-Converting)",
      icon: MessageSquare,
      tag: "Social DM",
      content: `Hey [Name]! Love your content on health & wellness. 👋

I'm partnering with LinkChinaMed (a premier global healthcare concierge connecting international patients to top-tier Grade 3-A hospital international departments in China).

We have an exclusive creator partner program where creators earn high-ticket commissions ($100–$2,500+ per client) promoting VIP health screenings and medical travel.

Zero waiting lists, 30-70% savings vs US/EU care, and full 1-on-1 bilingual medical chaperone support.

Check out the creator portal & join our network:
👉 https://affiliate.linkchinamed.com/join

Would love to collaborate!`,
    },
    {
      title: "Professional Email / LinkedIn InMail",
      icon: Mail,
      tag: "Email / LinkedIn",
      content: `Subject: Partnership Opportunity: High-Ticket Healthcare & Wellness Creator Program

Hi [Name],

I came across your profile and admire your work in the wellness and international lifestyle space.

I wanted to reach out regarding an exciting partnership opportunity with LinkChinaMed, Inc. We provide international patients with seamless access to China's world-leading public AAA hospital international departments (e.g. Peking Union, West China Hospital).

Why our creator partners love working with us:
• High-Ticket Earnings: Earn 5%–10% on service packages ($2,000–$25,000 range)
• High Demand: Zero waiting lists for specialists + 30%–70% cost savings vs Western private healthcare
• Full Concierge: 1-on-1 bilingual medical chaperone handles all hospital navigation and translation
• 100% Transparent: Hospital fees are paid directly to the hospital by the patient

You can review our program details and activate your partner portal here:
https://affiliate.linkchinamed.com/join

Let me know if you'd like a quick intro call with our partner team!

Best regards,`,
    },
  ];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      {/* Top Page Header */}
      <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 rounded-3xl p-8 text-white shadow-xl border border-emerald-500/25 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-emerald-500/15 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            LinkChinaMed Official Agent Playbook • v2.0
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
            代理赋能与培训文档中心 (Playbook)
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            本中心面向全体注册 Agent 代理商，提供全套实战操作指南、分佣测算规则、多语言邀约话术库及合规要求。团队将在此持续迭代更新最新业务资料。
          </p>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Navigation Sidebar */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-4 border border-slate-100 shadow-sm space-y-2 sticky top-6">
          <div className="px-3 py-2 text-xs font-extrabold uppercase tracking-wider text-slate-400">
            文档目录导航 (Table of Contents)
          </div>
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`w-full text-left p-3.5 rounded-2xl transition-all flex items-start gap-3.5 ${
                  active
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20"
                    : "hover:bg-slate-50 text-slate-700"
                }`}
              >
                <div
                  className={`p-2 rounded-xl flex-shrink-0 ${
                    active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="font-bold text-sm leading-snug">{t.label}</div>
                  <div
                    className={`text-[11px] truncate leading-normal ${
                      active ? "text-emerald-100" : "text-slate-400"
                    }`}
                  >
                    {t.desc}
                  </div>
                </div>
              </button>
            );
          })}

          <div className="pt-4 border-t border-slate-100 px-3">
            <div className="text-[11px] text-slate-400 leading-relaxed">
              💡 提示：本手册由 LinkChinaMed 官方运营团队维护。如有疑问可联系您的专属代理经理。
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Document Content */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm min-h-[600px] text-slate-700 leading-relaxed space-y-8">
          {/* TAB 1: 核心定位与分佣体系 */}
          {activeTab === "role" && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-2xl font-extrabold text-slate-900">
                  1. 代理商核心定位与分佣收益体系
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  理解 Agent 战略角色，通过招募下级创作者获取可持续的团队管理分润
                </p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 space-y-2.5">
                <div className="font-bold text-emerald-950 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  战略定位：做创作者生态的组织者与孵化者
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  代理商无需亲自面向海外终端患者推销，您的核心价值是<strong>寻找并签约海外健康、养生、医疗旅游及跨国生活方式领域的 KOL 创作者</strong>。下级创作者在其社交媒体平台推广，当其粉丝转化为实际就医客户时，代理商自动享有 <strong>5%–10% 的团队极差管理佣金</strong>。
                </p>
              </div>

              {/* 3 Tier Levels */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 text-sm">代理等级与佣金比例 (Agent Tiers)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                    <span className="font-bold text-slate-900 block text-sm">🥉 Bronze Agent (Level 1)</span>
                    <span className="text-emerald-600 font-black text-xl block">5% 团队佣金</span>
                    <span className="text-slate-500 block">招募 1–10 名活跃 KOL</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                    <span className="font-bold text-slate-900 block text-sm">🥈 Silver Agent (Level 2)</span>
                    <span className="text-emerald-600 font-black text-xl block">8% 团队佣金</span>
                    <span className="text-slate-500 block">招募 11–100 名活跃 KOL</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                    <span className="font-bold text-slate-900 block text-sm">🥇 Gold Agent (Level 3)</span>
                    <span className="text-emerald-600 font-black text-xl block">10% 团队佣金</span>
                    <span className="text-slate-500 block">招募 100+ 名活跃 KOL</span>
                  </div>
                </div>
              </div>

              {/* Earnings Examples */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 text-sm">高客单价服务收益测算示例</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-100 rounded-xl overflow-hidden">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-100">
                      <tr>
                        <th className="py-3 px-4">就医服务类型</th>
                        <th className="py-3 px-4">平均客单价 (USD)</th>
                        <th className="py-3 px-4">KOL 直推收益 (5%-8%)</th>
                        <th className="py-3 px-4 text-emerald-700">代理团队佣金 (5%-10%)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="py-3.5 px-4 font-semibold text-slate-900">VIP 全身精密防癌筛查包</td>
                        <td className="py-3.5 px-4">$2,500</td>
                        <td className="py-3.5 px-4">$125 – $200</td>
                        <td className="py-3.5 px-4 font-bold text-emerald-600">$125 – $250</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 font-semibold text-slate-900">三甲国际部专家会诊 & 重疾二次诊疗 (MDT)</td>
                        <td className="py-3.5 px-4">$3,800</td>
                        <td className="py-3.5 px-4">$190 – $304</td>
                        <td className="py-3.5 px-4 font-bold text-emerald-600">$190 – $380</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 font-semibold text-slate-900">专科微创手术/肿瘤靶向综合陪诊住院包</td>
                        <td className="py-3.5 px-4">$12,000 – $25,000</td>
                        <td className="py-3.5 px-4">$600 – $2,000</td>
                        <td className="py-3.5 px-4 font-bold text-emerald-600">$600 – $2,500</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Attribution */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5">
                <span className="font-bold text-slate-900 block">🔒 客户终身归属与复购分成机制</span>
                <p className="text-slate-600 leading-relaxed">
                  患者通过您下级 KOL 推广码首次建档后，系统将其永久绑定至该 KOL 及您的代理账户。后续年度健康复查、家属预约或再次就医，您和下级 KOL 均持续享有终身分佣。
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: 目标 KOL 与招募渠道 */}
          {activeTab === "kols" && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-2xl font-extrabold text-slate-900">
                  2. 目标 KOL 创作者画像与高效招募打法
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  精准锁定海外社交媒体创作者，用高客单与真实价值快速签约
                </p>
              </div>

              {/* 4 Personas */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 text-sm">四类极高转化的创作者画像：</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                    <span className="font-bold text-slate-900 text-sm block">1. 健康、瑜伽与长寿抗衰博主</span>
                    <p className="text-slate-600">
                      粉丝关注预防医学、机能抗衰与深度精密体检。对中国顶级公立三甲国际部的早筛设备与体检服务有极大兴趣。
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                    <span className="font-bold text-slate-900 text-sm block">2. 海外生活方式与旅游体验达人</span>
                    <p className="text-slate-600">
                      受众有跨国旅行习惯与跨国就医认知。通过真实展示中国医院的现代、高效与零排队，转化率极高。
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                    <span className="font-bold text-slate-900 text-sm block">3. 慢性病及特定专科患者社群主理人</span>
                    <p className="text-slate-600">
                      社群成员长期面临本国就医排队过长、费用昂贵痛点，对中国顶级医院的第二诊疗意见 (Second Opinion) 需求刚性。
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                    <span className="font-bold text-slate-900 text-sm block">4. 涉外商务与高净值私人顾问</span>
                    <p className="text-slate-600">
                      常年服务跨国高净值人士与企业外派高管，可直接推荐 VIP 绿色通道高端体检及名医直通车。
                    </p>
                  </div>
                </div>
              </div>

              {/* Pitch Templates */}
              <div className="space-y-4 pt-2">
                <h3 className="font-bold text-slate-900 text-sm">常用招募私信模板 (Ready-to-use Scripts)</h3>
                {scripts.map((s, idx) => {
                  const isCopied = copiedIndex === idx;
                  return (
                    <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">{s.title}</span>
                        <button
                          onClick={() => handleCopy(s.content, idx)}
                          className="h-7 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 inline-flex items-center gap-1 transition-colors"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              已复制
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              复制模板
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-100 whitespace-pre-wrap font-sans leading-relaxed">
                        {s.content}
                      </pre>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: 核心服务与合规红线 */}
          {activeTab === "services" && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-2xl font-extrabold text-slate-900">
                  3. 核心就医服务定位与业务合规底线
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  统一全员宣传统一口径，确保所有宣传符合跨境医疗法律与伦理合规
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 text-sm">四大核心对外宣传卖点：</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl space-y-1">
                    <span className="font-bold text-emerald-900 text-sm block">⚡ 零排队直通三甲国际部</span>
                    <p className="text-emerald-800">
                      快速免排队预约全国顶级公立三甲特需/国际部名医、手术与深度检查，无需漫长等待。
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-2xl space-y-1">
                    <span className="font-bold text-blue-900 text-sm block">💰 节省 30%–70% 医疗费用</span>
                    <p className="text-blue-800">
                      相比欧美私立医院昂贵账单，中国顶级公立三甲具备世界一流医疗水平，但价格极为透明亲民。
                    </p>
                  </div>
                  <div className="p-4 bg-indigo-50/50 border border-indigo-200 rounded-2xl space-y-1">
                    <span className="font-bold text-indigo-900 text-sm block">🌐 1对1 专属双语医学陪诊</span>
                    <p className="text-indigo-800">
                      专职双语陪诊向导全程陪伴挂号、问诊、取药与报告翻译，彻底消除跨国语言与就医流程障碍。
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50/50 border border-purple-200 rounded-2xl space-y-1">
                    <span className="font-bold text-purple-900 text-sm block">🛡️ 100% 透明直接支付医院</span>
                    <p className="text-purple-800">
                      所有实际诊疗费用由患者直接在医院收费窗口支付，平台绝不进行任何加价或药品提成。
                    </p>
                  </div>
                </div>
              </div>

              {/* Compliance Red Lines */}
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5 space-y-2.5">
                <div className="font-bold text-red-950 text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  合规红线与法律声明 (Compliance Guidelines)
                </div>
                <ul className="list-disc list-inside text-xs text-red-900 space-y-1.5 leading-relaxed">
                  <li><strong>平台角色定位</strong>：LinkChinaMed 是跨境就医的<strong>行政协调、预约向导与医学翻译科技服务商</strong>，非医疗机构。</li>
                  <li><strong>严禁线上诊断与承诺疗效</strong>：代理与 KOL 严禁为患者提供医疗诊断建议，严禁使用“包治愈”、“100%有效”等虚假夸大词汇。</li>
                  <li><strong>隐私与知情同意</strong>：所有就医合同与医疗知情同意书由患者在医院现场签署，全程符合 HIPAA 与中国 PIPL 个人隐私安全法规。</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 4: 常见异议与解答答疑 */}
          {activeTab === "faq" && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-2xl font-extrabold text-slate-900">
                  4. 常见创作者异议与应对答疑 (KOL FAQs)
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  在招募与沟通 KOL 时的标准应对答复话术
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-900 text-sm">Q1: KOL 担心海外粉丝就医纠纷影响声誉，如何回应？</div>
                  <p className="text-slate-600 leading-relaxed">
                    <strong>标准答复：</strong>“我们合作的全部为国家顶级公立三甲医院国际部（如协和、华西、瑞金），医疗质量处于世界一流水平。所有医疗合同由患者与医院直接签署，医疗责任归属于医院。LinkChinaMed 为患者提供全程双语医学向导与翻译服务，确保沟通透明零差错，真正解决患者就医痛点。”
                  </p>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-900 text-sm">Q2: 佣金如何结算打款？会不会有汇率或合规问题？</div>
                  <p className="text-slate-600 leading-relaxed">
                    <strong>标准答复：</strong>“平台完全通过全球顶级合规通道 <strong>Stripe Connect</strong> 自动结算。创作者出单后，系统实时核算并在后台生成账单，每月 14 日自动以美元或当地法币电汇至创作者的银行账户，合规开具电子税表与交易明细。”
                  </p>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-900 text-sm">Q3: 相比泰国、日韩医疗旅游，中国三甲国际部有哪些核心优势？</div>
                  <p className="text-slate-600 leading-relaxed">
                    <strong>标准答复：</strong>“泰国日韩主要偏向医美或常规体检，而在<strong>肿瘤多学科综合会诊 (MDT)、复杂专科微创手术、心脑血管重症救治及器官移植</strong>等重疾领域，中国顶级三甲公立医院的病例储备与顶级专家体量处于世界领先地位；且国际部无需排队、全英语环境，性价比与救治效率极具竞争力。”
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: 官方培训与素材中心 */}
          {activeTab === "training" && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-2xl font-extrabold text-slate-900">
                  5. 官方培训排期与素材物料中心
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  充分利用官方培训与营销物料，快速赋能创作者团队
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-2">
                  <div className="font-bold text-emerald-950 text-sm flex items-center gap-2">
                    <Video className="w-4 h-4 text-emerald-600" />
                    每周线上培训与答疑会 (Zoom Webinars)
                  </div>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    官方团队每周定期开展线上培训会，深度解析最新三甲医院专家资源、转化话术与拓客案例。运营人员会通过管理后台广播向您的邮箱推送参会链接。
                  </p>
                </div>

                <div className="p-5 bg-blue-50/60 border border-blue-200 rounded-2xl space-y-2">
                  <div className="font-bold text-blue-950 text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    1080×1920 高清营销海报
                  </div>
                  <p className="text-xs text-blue-800 leading-relaxed">
                    进入代理看板「生成营销海报」，系统将根据您的 8 位专属邀请码与静态二维码，一键合成英文高清宣传海报，方便在 Instagram、TikTok、微信等渠道传播。
                  </p>
                </div>
              </div>

              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs text-slate-600">
                <span className="font-bold text-slate-900 block text-sm">📖 持续迭代说明</span>
                <p className="leading-relaxed">
                  本手册持续处于动态更新状态。随着平台接入更多公立三甲医院特色科室以及出台新的激励政策，本中心将第一时间同步更新。
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
