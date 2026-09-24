"use client";

import { useState } from "react";
import {
  Compass,
  Target,
  Search,
  Share2,
  Mail,
  Copy,
  Check,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Zap,
  Globe2,
  Users,
  ShieldCheck,
  BookOpen,
  MessageSquare,
  Flame,
  FileText,
  HelpCircle,
} from "lucide-react";

export default function ProspectingPage() {
  const [activeTab, setActiveTab] = useState<"diseases" | "queries" | "content" | "outreach" | "email">("diseases");
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const tabs = [
    { id: "diseases", label: "1. 现阶段重点疾病矩阵", icon: Target, desc: "晚期肿瘤CAR-T/双抗、心血管阜外、天坛脑科、72h二诊" },
    { id: "queries", label: "2. 全球精准搜索词库", icon: Search, desc: "EN/RU/AR/ES 跨平台找人标签与核心行业词" },
    { id: "content", label: "3. 各平台内容发布策略", icon: Share2, desc: "TikTok/Reels 短视频 Hook、YouTube长文、患者社区答疑" },
    { id: "outreach", label: "4. 达人与患者私信 SOP", icon: MessageSquare, desc: "高转化社媒私信脚本与破冰跟进节奏" },
    { id: "email", label: "5. 商业邮箱挖掘实战", icon: Mail, desc: "社媒Bio提取、Google Dorking 语法、专业工具" },
  ] as const;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-3">
            <Compass className="w-3.5 h-3.5" />
            Global Prospecting & Outreach Playbook
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            全球拓客作战地图与找人指南
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
            面向全球国际跨境就医与医疗旅游需求人群（北美、西欧、中东、独联体及拉美）。为代理商及其拓展团队提供现阶段推广重点、全网搜索词、内容策略与批量获取潜在博主与机构联系方式的实操工具箱。
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2 pb-1">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                active
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/10"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Current Phase Target Diseases */}
      {activeTab === "diseases" && (
        <div className="space-y-6">
          <div className="bg-emerald-50/70 border border-emerald-200 p-5 rounded-2xl flex items-start gap-3">
            <Flame className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
              <strong className="font-bold">为什么现阶段聚焦这 4 大方向？</strong>{" "}
              国际医疗旅游不能做普通门诊，必须打具有<strong>压倒性临床优势、欧美排期极长（NHS痛点）或自费天价（CAR-T欧美$450k+）</strong>的硬核重疾与突破性技术。这 4 个方向在海外转化率最高、信任建立最快！
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Disease 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  突破方向 01 • 肿瘤与血液瘤
                </span>
                <span className="text-xs font-mono text-slate-400">CAR-T & Bispecifics</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                前沿细胞疗法 (CAR-T) 与全球首创双特异性抗体
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                中国在细胞疗法临床注册试验数量位居世界前列。中国药监局 (NMPA) 批准的全人源 BCMA CAR-T 治疗复发多发性骨髓瘤，以及击败 Keytruda 药王的全球首创 PD-1/VEGF-A 双抗（依沃西单抗）和双免疫双抗（开坦尼）。
              </p>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150 text-xs space-y-1.5">
                <div className="font-bold text-slate-800">对标欧美压倒性优势：</div>
                <div className="text-slate-600">• 欧美 CAR-T 标价高达 $450,000–$500,000，中国自费全套仅为其 <strong>1/4 至 1/5</strong>；</div>
                <div className="text-slate-600">• 细胞制备周期仅需 2~3 周，零等待直接安排权威公立三甲单人层流仓；</div>
                <div className="text-slate-600">• 顶级承接名院：中国医学科学院肿瘤医院、复旦大学附属肿瘤医院。</div>
              </div>
            </div>

            {/* Disease 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  突破方向 02 • 心血管介入
                </span>
                <span className="text-xs font-mono text-slate-400">Fuwai Cardiovascular</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                微创瓣膜置换 (TAVI) 与人工心脏 (LVAD)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                阜外医院是全球年手术量最高的心血管中心（年手术逾 40,000 例）。对于高龄、无法耐受传统开胸手术的重度主动脉瓣狭窄患者，采用经导管微创 TAVI 介入仅需在大腿根部穿刺，术后 24 小时即可下床。
              </p>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150 text-xs space-y-1.5">
                <div className="font-bold text-slate-800">对标欧美压倒性优势：</div>
                <div className="text-slate-600">• 欧美私立心血管微创耗资 $150k+，英国 NHS 专科手术等待长达 6-12 个月；</div>
                <div className="text-slate-600">• 阜外国际部 48 小时极速会诊入院，手术成功率超 99.2%；</div>
                <div className="text-slate-600">• 顶级承接名院：中国医学科学院阜外医院（国家心血管病中心）。</div>
              </div>
            </div>

            {/* Disease 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                  突破方向 03 • 神经脑科
                </span>
                <span className="text-xs font-mono text-slate-400">DBS & Brain Surgery</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                脑起搏器 (DBS) 调控与复杂颅底肿瘤显微手术
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                针对中晚期帕金森病 (Parkinson's)、原发性震颤与肌张力障碍，北京天坛与宣武医院开展毫米级脑深部电刺激术 (DBS)；针对听神经瘤、脑膜瘤与海绵状血管瘤，拥有世界顶级显微保神经切除技术。
              </p>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150 text-xs space-y-1.5">
                <div className="font-bold text-slate-800">对标欧美压倒性优势：</div>
                <div className="text-slate-600">• 国际患者在天坛/宣武享受全球顶级神经外科手术量背书的安全性；</div>
                <div className="text-slate-600">• 术后智能远程无线程控，回国后仍可通过云端调节刺激参数；</div>
                <div className="text-slate-600">• 顶级承接名院：北京天坛医院、首都医科大学宣武医院。</div>
              </div>
            </div>

            {/* Disease 4 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  突破方向 04 • 低门槛敲门砖
                </span>
                <span className="text-xs font-mono text-slate-400">$199 Rapid Second Opinion</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                72 小时国际专家远程第二诊疗意见
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                绝大多数国际重症患者在赴华前必须消除疑虑。通过 $199 远程第二诊疗意见，患者无需长途飞行，仅需在线上传影像和病理资料，由三甲公立医院主任医师在 72 小时内出具全英文正式书面诊疗评估。
              </p>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150 text-xs space-y-1.5">
                <div className="font-bold text-slate-800">最高转化触达策略：</div>
                <div className="text-slate-600">• 作为拓客的第一道低成本验证，极易打消跨国就医信任摩擦；</div>
                <div className="text-slate-600">• 经评估适合跨境治疗者，二诊评估费 $199 可全额抵扣后续实地陪诊包；</div>
                <div className="text-slate-600">• KOL 与代理商可获 $40+ 即时分成，后续成单再享 5%–10% 高额返佣。</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Global Search Queries & Hashtags */}
      {activeTab === "queries" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-emerald-600" />
              全球四大语言区与国际社媒精准找人标签
            </h3>
            <p className="text-xs text-slate-500">
              在 Instagram、TikTok、YouTube、Twitter/X 检索以下标签，精准锁定海外慢病博主、医疗中介机构、患者代言人及医疗博主：
            </p>

            {/* English Section */}
            <div className="border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  英语主力市场 (North America, UK, Europe, Australia)
                </span>
                <span className="text-[11px] text-slate-400">主流平台：Instagram / TikTok / YouTube / Reddit</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "#cancerwarrior",
                  "#carttherapy",
                  "#chemojourney",
                  "#immunotherapy",
                  "#parkinsonswarrior",
                  "#medicaltourism",
                  "#secondopinion",
                  "#healthtravel",
                  "#chronicillnesswarrior",
                  "#protontherapy",
                  "#cancertreatmentcost",
                  "#medicaltravelconcierge",
                ].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => copyToClipboard(tag, tag)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-xs font-mono border border-slate-200 transition-colors"
                  >
                    {copiedIndex === tag ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Russian Section */}
            <div className="border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                  俄语与中亚独联体市场 (CIS & Central Asia: RU, KZ, UZ, TM)
                </span>
                <span className="text-[11px] text-slate-400">主流平台：Telegram / Instagram / YouTube / VK</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "медицинский туризм",
                  "лечение в Китае",
                  "лечение рака",
                  "протонная терапия",
                  "второе мнение врача",
                  "кардиохирургия",
                  "онкология Китай",
                  "ТКМ лечение",
                ].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => copyToClipboard(tag, tag)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-xs font-mono border border-slate-200 transition-colors"
                  >
                    {copiedIndex === tag ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Arabic Section */}
            <div className="border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  阿拉伯语海湾市场 (GCC: Saudi Arabia, UAE, Qatar, Kuwait)
                </span>
                <span className="text-[11px] text-slate-400">主流平台：Instagram / Snapchat / X (Twitter) / TikTok</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "السياحة العلاجية",
                  "علاج السرطان",
                  "جراحة القلب",
                  "رأي طبي ثان",
                  "مستشفيات الصين",
                  "العلاج بالخلايا التائية",
                  "الفحص الطبي الشامل",
                ].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => copyToClipboard(tag, tag)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-xs font-mono border border-slate-200 transition-colors"
                  >
                    {copiedIndex === tag ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Spanish Section */}
            <div className="border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  西班牙语市场 (Latin America & US Hispanic)
                </span>
                <span className="text-[11px] text-slate-400">主流平台：Instagram / YouTube / TikTok / Facebook</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "#turismomedico",
                  "#segundaopinionmedica",
                  "#tratamientooncologico",
                  "#terapiaavanzada",
                  "#cirugiacardiaca",
                  "#saludglobal",
                ].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => copyToClipboard(tag, tag)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-xs font-mono border border-slate-200 transition-colors"
                  >
                    {copiedIndex === tag ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Platform Content Strategies */}
      {activeTab === "content" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Strategy 1: TikTok / Reels */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-600" />
                  TikTok & Reels (15–30s)
                </span>
                <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                  短视频 3 步爆款结构
                </span>
              </div>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-900">1. Hook 痛点 (0–3秒)：</span>
                  <p className="text-slate-500">
                    "Why cancer patients in the US & Europe are flying to China for this new double antibody..."
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-900">2. Body 反差 (4–20秒)：</span>
                  <p className="text-slate-500">
                    展示真实数据：CAR-T 细胞疗法欧美自费 $450k，公立三甲仅 1/4；零等待排期，全程 1 对 1 双语医疗陪护。
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-900">3. CTA 转化 (21–30秒)：</span>
                  <p className="text-slate-500">
                    "Link in bio to check eligibility or get a 72-hour written second opinion from top specialists."
                  </p>
                </div>
              </div>
            </div>

            {/* Strategy 2: YouTube / Long-form */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  YouTube / Substack
                </span>
                <span className="text-[11px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">
                  深度长文攻略
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="font-bold text-slate-800">推荐高搜索量长尾选题：</div>
                <ul className="list-disc list-inside space-y-1.5 text-slate-500">
                  <li>"US vs China Cancer Treatment Cost Breakdown (CAR-T, Bispecifics & Proton)"</li>
                  <li>"How NHS Waiting Lists are Pushing UK Patients to Global Medical Tourism"</li>
                  <li>"A Complete Guide to Receiving Medical Care at China's Premier AAA Hospitals"</li>
                  <li>"What is a 72-Hour Rapid Medical Second Opinion & When Do You Need One?"</li>
                </ul>
              </div>
            </div>

            {/* Strategy 3: Reddit / Forums */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  Reddit & 患者社区
                </span>
                <span className="text-[11px] text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded">
                  价值解答与合规推荐
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="font-bold text-slate-800">目标板块 (Subreddits)：</div>
                <div className="flex flex-wrap gap-1 text-[11px] font-mono text-slate-500">
                  <span className="bg-slate-100 px-2 py-0.5 rounded">r/Cancer</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded">r/MultipleMyeloma</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded">r/Parkinsons</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded">r/MedicalTourism</span>
                </div>
                <div className="font-bold text-slate-800 pt-1">回复规范 (极其关键)：</div>
                <p className="text-slate-500 leading-relaxed">
                  严禁硬发广告！以病友或国际医疗志愿者身份客观解答费用与临床试验数据，建议对方“先花 $199 做个远程书面第二意见，多一个专家方案再决定”。
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Outreach & DM Scripts */}
      {activeTab === "outreach" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
              高转化国际社媒私信脚本 (Direct Message Scripts)
            </h3>
            <p className="text-xs text-slate-500">
              用于在 Instagram、LinkedIn、TikTok、WhatsApp 触达海外健康博主、慢病达人或医疗中介负责人。点击一键复制：
            </p>

            <div className="space-y-4">
              {/* Script 1: Creator Outreach */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    模版 1：面向海外健康博主 / KOL 达人邀约 (Creator Partnership)
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `Hi [Name], love your inspiring content around health & wellness! 👋

I'm partnering with LinkChinaMed (a premier global healthcare concierge connecting international patients to top-tier public Grade 3-A hospital international wings in China).

We run an exclusive creator partner program where creators earn high-ticket commissions ($100–$2,500+ per referral) helping patients access world-class oncology, cardiology, and VIP health checkups with zero waitlists and 70% savings vs US/EU care.

Patients are supported 1-on-1 by bilingual medical escorts. You can review program details & join with our invite code:
👉 https://affiliate.linkchinamed.com/join

Would love to explore a collaboration!`,
                        "script1"
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-sm"
                  >
                    {copiedIndex === "script1" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedIndex === "script1" ? "已复制" : "一键复制"}
                  </button>
                </div>
                <pre className="text-xs font-mono text-slate-700 bg-white p-3.5 rounded-lg border border-slate-200 whitespace-pre-wrap leading-relaxed">
{`Hi [Name], love your inspiring content around health & wellness! 👋

I'm partnering with LinkChinaMed (a premier global healthcare concierge connecting international patients to top-tier public Grade 3-A hospital international wings in China).

We run an exclusive creator partner program where creators earn high-ticket commissions ($100–$2,500+ per referral) helping patients access world-class oncology, cardiology, and VIP health checkups with zero waitlists and 70% savings vs US/EU care.

Patients are supported 1-on-1 by bilingual medical escorts. You can review program details & join with our invite code:
👉 https://affiliate.linkchinamed.com/join

Would love to explore a collaboration!`}
                </pre>
              </div>

              {/* Script 2: Patient Warm Outreach */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    模版 2：面向咨询或病情探讨者的温度破冰 (Patient Inquiry & Second Opinion)
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `Hi [Name], saw your post regarding your treatment journey. Wishing you immense strength and recovery! ❤️

I wanted to share that for complex cases, getting an international second opinion can often provide valuable alternative paths or clinical trials. 

Top public National Medical Centers in China offer a guaranteed 72-hour written Second Opinion for $199 flat (reviewed by Chief Specialists at hospitals like CAMS Cancer Hospital or Peking Union). 100% remote, no travel needed.

If helpful, you can explore the option here: https://www.linkchinamed.com/en/second-opinion

Praying for your healing!`,
                        "script2"
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-sm"
                  >
                    {copiedIndex === "script2" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedIndex === "script2" ? "已复制" : "一键复制"}
                  </button>
                </div>
                <pre className="text-xs font-mono text-slate-700 bg-white p-3.5 rounded-lg border border-slate-200 whitespace-pre-wrap leading-relaxed">
{`Hi [Name], saw your post regarding your treatment journey. Wishing you immense strength and recovery! ❤️

I wanted to share that for complex cases, getting an international second opinion can often provide valuable alternative paths or clinical trials. 

Top public National Medical Centers in China offer a guaranteed 72-hour written Second Opinion for $199 flat (reviewed by Chief Specialists at hospitals like CAMS Cancer Hospital or Peking Union). 100% remote, no travel needed.

If helpful, you can explore the option here: https://www.linkchinamed.com/en/second-opinion

Praying for your healing!`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Email Discovery Mastery */}
      {activeTab === "email" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Mail className="w-5 h-5 text-emerald-600" />
              国际商业邮箱与联系方式挖掘实战指南
            </h3>
            <p className="text-xs text-slate-500">
              如何快速找到海外 KOL 达人、医疗旅游经纪人、海外华人诊所或中介机构负责人的真实业务邮箱：
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Method 1 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">1</span>
                  社媒 Bio 与聚合主页挖掘 (Link in Bio)
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  在 Instagram 与 TikTok 博主主页中，90% 的合作博主会在简介中点击“Email”按钮，或在 <strong>Linktree, Beacons, Stan Store, Koji</strong> 等集合外链的第一行留下专属商业合作邮箱（如 `collab@...` 或 `contact@...`）。
                </p>
              </div>

              {/* Method 2 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">2</span>
                  YouTube "About" 页面商业邮箱查看
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  打开目标医疗科普/慢病博主的 YouTube 频道主页，进入 <strong>"About" (关于)</strong> 标签页，点击 <em>"View email address" (查看电子邮件地址)</em>，通过 Google 简单人机验证即可直接获取博主官方商业邮箱。
                </p>
              </div>

              {/* Method 3 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">3</span>
                  Google Dorking 精准搜索黑客语法
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  在 Google 搜索框输入高级布尔语法，直接抓取包含公开邮箱的社媒页面：
                </p>
                <div className="bg-white p-2.5 rounded border border-slate-200 font-mono text-[11px] text-slate-800 space-y-1">
                  <div>site:instagram.com "cancer survivor" ("gmail.com" OR "outlook.com")</div>
                  <div>site:linkedin.com/in "medical tourism facilitator" ("@gmail.com")</div>
                </div>
              </div>

              {/* Method 4 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">4</span>
                  专业 B2B 邮箱挖掘利器 (Tools)
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  针对海外医疗中介公司、旅行社、商会机构网站：
                </p>
                <ul className="text-xs text-slate-500 list-disc list-inside space-y-1">
                  <li><strong>Hunter.io / Snov.io</strong>: 输入目标公司官网域名，一秒列出全体高管公网邮箱；</li>
                  <li><strong>Apollo.io</strong>: 按“Healthcare Consultant / Medical Facilitator”免费筛选数万精准联系人；</li>
                  <li><strong>Clearbit Connect</strong>: Chrome 插件直接在 Gmail 侧边栏查询机构背景。</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
