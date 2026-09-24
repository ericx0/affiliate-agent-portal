"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import {
  Hospital,
  BookOpen,
  Search,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
  Globe2,
  MessageSquare,
  HelpCircle,
  FileText,
  AlertTriangle,
  Stethoscope,
  ExternalLink,
  Layers,
  Heart,
  Activity,
  Brain,
  Bone,
  Flame,
  Award,
} from "lucide-react";

interface SpecialtyItem {
  id: string;
  nameEn: string;
  nameZh: string;
  direction: string;
  hospitals: string;
  clinicalHighlights: string[];
  costAdvantage: string;
  readyCopyEn: string;
  readyCopyZh: string;
}

const SPECIALTIES_DATA: SpecialtyItem[] = [
  {
    id: "onc-car-t",
    nameEn: "BCMA & CD19 CAR-T Cell Therapy",
    nameZh: "全人源 BCMA / CD19 CAR-T 细胞免疫疗法",
    direction: "oncology",
    hospitals: "中国医学科学院肿瘤医院、复旦大学附属肿瘤医院、瑞金医院",
    clinicalHighlights: [
      "针对复发/难治性多发性骨髓瘤 (R/R Multiple Myeloma) 完全缓解率 (CR) > 75%",
      "中国首创全人源单链抗体结构，免疫原性极低，细胞制备周期仅需 2~3 周",
      "国家药监局 (NMPA) 批准正式上市规范商业化应用",
    ],
    costAdvantage: "欧美同类 CAR-T 治疗总开销高达 $450,000–$500,000；中国综合自费仅为其 1/4 至 1/5 ($80k–$120k 全包)。",
    readyCopyEn: "Breaking: FDA & NMPA-approved BCMA CAR-T cell therapy in China delivers a 75%+ complete response rate for multiple myeloma at 1/4 of Western costs ($80k–$120k vs $450k+ in the US). Fast 2-week turnaround, zero waitlist at premier National Cancer Centers. Request a 72-hour second opinion: [InviteLink]",
    readyCopyZh: "【国际重磅】中国获批全人源 BCMA CAR-T 细胞治疗多发性骨髓瘤，完全缓解率超 75%，费用仅为欧美 1/4（国内自费约 8-12 万美金，美国标价 45 万美金+）。零排期直通国家癌症中心单人层流仓。详情咨询：[InviteLink]",
  },
  {
    id: "onc-ivonescimab",
    nameEn: "Ivonescimab (PD-1 / VEGF-A Bispecific)",
    nameZh: "依沃西单抗 (全球首创 PD-1 / VEGF-A 双特异性抗体)",
    direction: "oncology",
    hospitals: "中山大学肿瘤防治中心、中国医学科学院肿瘤医院",
    clinicalHighlights: [
      "全球首个在 III 期注册临床 (HARMONi-2) 单药头对头直接击败全球药王 Keytruda (K药) 的肿瘤免疫双抗",
      "非小细胞肺癌一线无进展生存期 (mPFS) 翻倍至 11.14 个月，疾病进展风险降低 49%",
      "兼具免疫激活与抗血管生成协同效应",
    ],
    costAdvantage: "欧美目前尚未获批上市；年综合用药费用仅为欧美使用 K 药的 1/6。",
    readyCopyEn: "Global First: Ivonescimab (PD-1/VEGF-A bispecific antibody) defeated Keytruda head-to-head in Phase III trials, doubling PFS for lung cancer. Available now at China's top thoracic oncology centers at a fraction of Western immunotherapy prices. Connect with specialists: [InviteLink]",
    readyCopyZh: "【全球首创】依沃西单抗双特异性抗体在国际 III 期临床头对头击败全球“药王”Keytruda，肺癌无进展生存期翻倍。中国顶级肿瘤中心现货可及，年用药成本仅为欧美 1/6。了解评估流程：[InviteLink]",
  },
  {
    id: "onc-proton",
    nameEn: "Proton & Heavy Ion Radiation Therapy",
    nameZh: "质子与重离子精准放射治疗 (布拉格峰爆破)",
    direction: "oncology",
    hospitals: "上海市质子重离子医院 (SPHIC)、山东省肿瘤医院质子中心",
    clinicalHighlights: [
      "全球极少数同时兼备质子束与碳离子束的尖端放射治疗中心",
      "利用布拉格峰 (Bragg Peak) 特性，亚毫米级精准在肿瘤体内释放能量，最大程度保护周围正常健康器官",
      "脊索瘤、颅底脑膜瘤、前列腺癌与儿童实体瘤的黄金放射手段",
    ],
    costAdvantage: "欧美质子重离子治疗需 $150,000–$200,000；中国公立特需标准化疗程约 $40,000–$50,000。",
    readyCopyEn: "Targeted Cancer Radiotherapy: Shanghai Proton and Heavy Ion Center (SPHIC) offers dual-beam carbon ion and proton therapy for inoperable tumors and chordomas with sub-millimeter precision. Half the cost of US/European centers with fast VIP admission: [InviteLink]",
    readyCopyZh: "【微型粒子爆破】上海质子重离子医院配备质子与重离子双束流，颅底、脊柱及前列腺恶性肿瘤毫厘级杀伤，保护重要脏器。公立特需收费透明。立即评估：[InviteLink]",
  },
  {
    id: "cardio-tavi",
    nameEn: "Minimally Invasive TAVI & LVAD",
    nameZh: "经导管主动脉瓣置换 (TAVI) 与人工心脏 (LVAD)",
    direction: "cardiovascular",
    hospitals: "中国医学科学院阜外医院（国家心血管病中心）、北京安贞医院",
    clinicalHighlights: [
      "阜外医院为全球最大心血管诊疗中心（年心脏介入及手术逾 40,000 例，成功率 > 99.2%）",
      "高龄严重主动脉瓣狭窄患者无需开胸体外循环，大腿根部微创介入，24 小时下床活动",
      "终末期心力衰竭磁悬浮左心室辅助装置（人工心脏）植入与重症逆转",
    ],
    costAdvantage: "欧美同等 TAVI 手术开销 $120,000+，英国 NHS 漫长等待；阜外国际部全套微创方案约 $35,000–$45,000，48 小时入院。",
    readyCopyEn: "World #1 Volume Cardiac Center: Fuwai Hospital performs 40,000+ heart procedures yearly with 99.2%+ success. Minimally invasive TAVI valve replacement requires no open-chest surgery, 24h recovery, zero NHS waitlists. Book VIP consultation: [InviteLink]",
    readyCopyZh: "【世界第一心血管中心】国家心血管中心（阜外医院）年手术超 4 万例。微创 TAVI 无需开胸，24小时下床，免除欧美漫长等待排期，全套费用仅欧美 1/3。绿色通道直达：[InviteLink]",
  },
  {
    id: "neuro-dbs",
    nameEn: "Deep Brain Stimulation (DBS) & Brain Surgery",
    nameZh: "脑深部电刺激术 (DBS脑起搏器) 与复杂颅底显微外科",
    direction: "neuroscience",
    hospitals: "首都医科大学附属北京天坛医院、首都医科大学宣武医院",
    clinicalHighlights: [
      "天坛与宣武为亚洲最大神经外科与神经疾病临床中心，院士级专家领衔",
      "DBS 脑起搏器植入毫米级微创调控帕金森病 (Parkinson's)、原发性震颤与肌张力障碍",
      "支持术后远程云端调谐刺激参数，跨国患者回国后无需频繁往返中国",
    ],
    costAdvantage: "欧美同等 DBS 脑起搏器手术费及耗材标价 $100,000+；中国顶尖三甲国际部综合费用约 $30,000–$40,000。",
    readyCopyEn: "Advanced Parkinson's & Tremor Control: Beijing Tiantan & Xuanwu Hospital offer state-of-the-art Deep Brain Stimulation (DBS) with remote cloud programming post-surgery. World-class microneurosurgery at 70% cost savings: [InviteLink]",
    readyCopyZh: "【告别震颤与僵直】天坛与宣武医院开展 DBS 脑起搏器微创调控，亚洲最大神经外科中心保障。术后支持远程跨国调参，综合费用仅欧美 1/3。了解详情：[InviteLink]",
  },
  {
    id: "second-opinion",
    nameEn: "72-Hour Rapid Medical Second Opinion ($199)",
    nameZh: "72 小时三甲特需专家书面第二诊疗意见 (远程评估)",
    direction: "remote",
    hospitals: "中国全部 63 家顶级公立三甲国际部主任医师库",
    clinicalHighlights: [
      "100% 远程办理，无需长途旅行，快速出具全英文正式诊疗诊断书",
      "由全国顶尖公立三甲医院科室主任/教授级专家亲自背书审阅",
      "对标国际 NCCN 临床路径，提供明确的病理分期、手术可切除性评估及靶向用药建议",
    ],
    costAdvantage: "梅奥/纪念斯隆远程二诊通常要价 $800–$2,500；LinkChinaMed 官方三甲网络统一 $199 极速交付。",
    readyCopyEn: "Get Clarity Before Major Surgery: Leading Chief Physicians from China's top Grade 3-A hospitals will review your medical records and provide a comprehensive written second opinion in 72 hours. Just $199 flat fee (vs $1,500+ in the US). Submit records online: [InviteLink]",
    readyCopyZh: "【重大病情二次确认】无需长途奔波，中国顶尖三甲医院主任医师 72 小时内出具全英文正式诊疗建议，全国统一定价仅 $199（欧美同类服务标价 $1,500+）。扫码在线提交：[InviteLink]",
  },
];

const BATTLECARDS = [
  {
    q: "Why choose China instead of Mayo Clinic (US), Singapore, or Thailand?",
    qZh: "为什么选择中国，而不是梅奥、新加坡或泰国？",
    a: "1. Massive Clinical Surgical Volume: China's top AAA hospitals treat more complex cases in a month than many Western hospitals do in years (Fuwai does 40,000+ cardiac surgeries annually with 99.2%+ success rate).\n2. Next-Gen Drug Access: China has approved innovative cell therapies (BCMA CAR-T) and first-in-class bispecifics (Ivonescimab) that defeated Keytruda in Phase III trials, priced at 1/4 to 1/5 of Western private rates.\n3. Zero Waitlist: Avoid 6–12 month NHS/Canada waiting lists; VIP international departments schedule specialist consultations and procedures in days.",
  },
  {
    q: "Is language a barrier? How do international patients communicate with doctors?",
    qZh: "语言不通如何看病？国际患者如何与医生交流？",
    a: "LinkChinaMed provides a dedicated 1-on-1 bilingual medical care manager and companion for every patient. They handle translation of medical records, accompany patients during hospital consultations, handle prescription dispensing, and provide full hospital logistics. Doctors at top Grade 3-A hospital international departments are also fluent in English.",
  },
  {
    q: "Are China's public Grade 3-A international departments credible and safe?",
    qZh: "中国公立三甲医院国际部靠谱吗？收费透明吗？",
    a: "They are National Medical Centers directly under the National Health Commission (such as Peking Union Medical College Hospital and Chinese Academy of Medical Sciences Cancer Hospital). All clinical fees are officially regulated and paid directly to the hospital billing desk. LinkChinaMed strictly provides non-clinical administrative concierge and translation services, ensuring 100% financial and clinical transparency.",
  },
  {
    q: "Why is CAR-T in China only 1/4 of the US cost ($80k-$120k vs $450k)?",
    qZh: "为什么中国的 CAR-T 治疗仅需欧美 1/4 的费用 ($80k vs $450k)？",
    a: "China has developed a robust domestic biotechnology supply chain with locally manufactured viral vectors, magnetic beads, and automated cell culture systems, drastically reducing production overhead. Combined with standardized public hospital special service pricing, international patients enjoy the exact same high-potency cell therapies without the massive pharmaceutical price inflation seen in the US.",
  },
  {
    q: "How does the $199 Second Opinion work? Does the patient have to travel?",
    qZh: "72 小时 $199 远程第二意见如何运作？患者必须来中国吗？",
    a: "No travel required! The patient simply uploads their scans (DICOM/CT/MRI) and pathology reports online. Our clinical team translates and compiles the dossier, submits it to a Chief Physician at a designated National Medical Center, and delivers a comprehensive written English evaluation report within 72 business hours. If the patient decides to travel later, the $199 is 100% credited toward their on-site concierge package.",
  },
  {
    q: "How are funds handled? Is payment safe?",
    qZh: "资金如何结算？支付安全吗？",
    a: "All service fees are securely processed via Stripe with international bank cards, Apple Pay, or international bank wire. Hospital medical fees are paid directly by the patient to the hospital's official cashier window upon admission. We never hold or commingle hospital care deposits.",
  },
];

export default function ResourcesPage() {
  const [activeSection, setActiveSection] = useState<"catalog" | "battlecards" | "swipe" | "checklist" | "compliance">("catalog");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDirection, setSelectedDirection] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [agentCode, setAgentCode] = useState<string>("LCM-VIP");
  const [inviteLink, setInviteLink] = useState<string>("https://affiliate.linkchinamed.com/register");
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  useEffect(() => {
    async function loadAgentCode() {
      try {
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

        if (code) setAgentCode(code);
        if (!link && code) link = `https://affiliate.linkchinamed.com/register?ref=${code}`;
        if (link) setInviteLink(link);
      } catch (e) {
        console.error("Failed to load agent info", e);
      }
    }
    loadAgentCode();
  }, []);

  const handleCopy = (text: string, id: string) => {
    const formatted = text.replace(/\[InviteLink\]/g, inviteLink).replace(/\[InviteCode\]/g, agentCode);
    navigator.clipboard.writeText(formatted);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredSpecialties = SPECIALTIES_DATA.filter((s) => {
    const matchesDir = selectedDirection === "all" || s.direction === selectedDirection;
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      !q ||
      s.nameEn.toLowerCase().includes(q) ||
      s.nameZh.toLowerCase().includes(q) ||
      s.hospitals.toLowerCase().includes(q) ||
      s.costAdvantage.toLowerCase().includes(q);
    return matchesDir && matchesQuery;
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-3">
            <Stethoscope className="w-3.5 h-3.5" />
            Medical Knowledge Base & Sales Enablement Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            权威医疗资源与多语话术中心
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
            将中国 63 家顶尖公立三甲名院、王牌专科突破疗法与国际销售话术、杀手级异议抗辩深度打通。在一个界面内，随时随地调取权威医院背书与专属转化话术。
          </p>
        </div>
      </div>

      {/* Navigation Sub-Menu */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2 pb-1">
        {[
          { id: "catalog", label: "1. 顶尖专科与名院速查 (Specialties)", icon: Hospital },
          { id: "battlecards", label: "2. 国际异议抗辩宝典 (Battlecards)", icon: HelpCircle },
          { id: "swipe", label: "3. 全渠道多语话术工坊 (Swipe Files)", icon: MessageSquare },
          { id: "checklist", label: "4. 患者 5 分钟初筛清单 (Checklist)", icon: FileText },
          { id: "compliance", label: "5. 跨境医疗合规红线 (Compliance)", icon: ShieldCheck },
        ].map((sec) => {
          const Icon = sec.icon;
          const active = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id as any)}
              className={`flex items-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                active
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/10"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Icon className="w-4 h-4" />
              {sec.label}
            </button>
          );
        })}
      </div>

      {/* Section 1: Specialties & Hospitals Catalog */}
      {activeSection === "catalog" && (
        <div className="space-y-6">
          {/* Search & Filter Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="搜索专科、新药、医院（如 CAR-T, 阜外, 肺癌）"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {[
                { id: "all", label: "全部方向" },
                { id: "oncology", label: "肿瘤与新药" },
                { id: "cardiovascular", label: "心血管微创" },
                { id: "neuroscience", label: "神经脑科" },
                { id: "remote", label: "远程第二意见" },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedDirection(filter.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedDirection === filter.id
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Specialties Grid */}
          <div className="space-y-4">
            {filteredSpecialties.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4 hover:border-emerald-300 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      {item.nameEn}
                    </h3>
                    <div className="text-xs text-slate-500 font-medium mt-0.5">{item.nameZh}</div>
                  </div>
                  <div className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 w-fit">
                    🏥 承接名院：{item.hospitals}
                  </div>
                </div>

                {/* Highlights & Cost */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5 bg-slate-50/70 p-3.5 rounded-xl border border-slate-150">
                    <span className="font-bold text-slate-800">核心临床突破与技术亮点：</span>
                    <ul className="space-y-1 text-slate-600 list-disc list-inside">
                      {item.clinicalHighlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1.5 bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-200">
                    <span className="font-bold text-emerald-900">全球费用对比与排期优势：</span>
                    <p className="text-emerald-800 leading-relaxed">{item.costAdvantage}</p>
                  </div>
                </div>

                {/* Direct-Linked Pitch Script (One-Click Copy) */}
                <div className="bg-slate-900 p-4 rounded-xl text-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Copy className="w-3.5 h-3.5" />
                      专属推广与触达文案 (Ready-to-Use Pitch Copy with Your Link)
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(item.readyCopyEn, `${item.id}-en`)}
                        className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1"
                      >
                        {copiedId === `${item.id}-en` ? <Check className="w-3 h-3 text-emerald-400" /> : null}
                        {copiedId === `${item.id}-en` ? "已复制 EN" : "复制英文文案"}
                      </button>
                      <button
                        onClick={() => handleCopy(item.readyCopyZh, `${item.id}-zh`)}
                        className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1"
                      >
                        {copiedId === `${item.id}-zh` ? <Check className="w-3 h-3 text-emerald-400" /> : null}
                        {copiedId === `${item.id}-zh` ? "已复制 中文" : "复制中文文案"}
                      </button>
                    </div>
                  </div>
                  <p className="text-xs font-mono text-slate-300 bg-slate-950/60 p-2.5 rounded border border-white/5 leading-relaxed select-all">
                    {item.readyCopyEn.replace(/\[InviteLink\]/g, inviteLink)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 2: Objections Handling Battlecards */}
      {activeSection === "battlecards" && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-xs sm:text-sm text-slate-600 leading-relaxed">
            <strong className="text-slate-900 font-bold">国际患者高频异议应对策略：</strong> 国际患者跨境就医最大的顾虑往往集中在<strong>“技术是否可信”、“语言是否畅通”、“资金与收费是否透明”</strong>。遇到客户或博主质疑时，可直接使用以下经临床与法务审核的标准应答：
          </div>

          <div className="space-y-3">
            {BATTLECARDS.map((card, idx) => {
              const isExpanded = expandedCard === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedCard(isExpanded ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="font-bold text-slate-900 text-sm sm:text-base">{card.q}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{card.qZh}</div>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="p-5 pt-0 border-t border-slate-100 bg-slate-50/50 space-y-3">
                      <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-normal">
                        {card.a}
                      </div>
                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => handleCopy(card.a, `battle-${idx}`)}
                          className="px-3 py-1.5 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-sm inline-flex items-center gap-1.5 transition-colors"
                        >
                          {copiedId === `battle-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          {copiedId === `battle-${idx}` ? "应答应答已复制" : "复制标准应答"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Section 3: Swipe File Studio */}
      {activeSection === "swipe" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              四大主力语种全渠道私信工坊 (Multi-Lingual Swipe Files)
            </h3>
            <p className="text-xs text-slate-500">
              包含自动注入您的 Partner Code ({agentCode}) 与注册链接的完整成套文案，覆盖四大国际主力语言：
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* English Swipe */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">English (LinkedIn InMail / Email)</span>
                  <button
                    onClick={() =>
                      handleCopy(
                        `Subject: Partnership Opportunity: High-Ticket Healthcare & Wellness Creator Program

Hi [Name],

I came across your profile and admire your work in the wellness and international lifestyle space.

I wanted to reach out regarding a partnership opportunity with LinkChinaMed. We provide international patients with seamless access to China's world-leading public AAA hospital international departments (e.g. Peking Union, Fuwai Cardiovascular, CAMS Cancer Hospital).

Why our creator partners love working with us:
• High-Ticket Earnings: Earn $100–$2,500+ per referred client
• High Demand: Zero waiting lists for specialists + 30%–70% cost savings vs Western private healthcare
• Full Concierge: 1-on-1 bilingual medical chaperone handles hospital navigation and translation
• 100% Transparent: Medical fees are paid directly to the hospital by the patient

You can activate your partner portal with my invite code (${agentCode}) here:
${inviteLink}

Best regards,
[Your Name]`,
                        "swipe-en"
                      )
                    }
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    {copiedId === "swipe-en" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    复制英文
                  </button>
                </div>
                <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded font-mono leading-relaxed line-clamp-6">
                  Subject: Partnership Opportunity: High-Ticket Healthcare & Wellness Creator Program...
                </div>
              </div>

              {/* Spanish Swipe */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">Español (Instagram / WhatsApp)</span>
                  <button
                    onClick={() =>
                      handleCopy(
                        `Hola [Nombre]! 👋 Me encanta tu contenido sobre salud y bienestar.

Te escribo para compartir una oportunidad exclusiva de colaboración con LinkChinaMed, conectando pacientes internacionales con los mejores hospitales públicos de China con ahorros del 70% y cero listas de espera.

Los creadores ganan comisiones de alto valor ($100–$2,500+ por paciente) promoviendo segundas opiniones médicas y turismo de salud de primer nivel.

Regístrate como creador asociado aquí:
${inviteLink} (Código: ${agentCode})`,
                        "swipe-es"
                      )
                    }
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    {copiedId === "swipe-es" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    复制西语
                  </button>
                </div>
                <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded font-mono leading-relaxed line-clamp-6">
                  Hola [Nombre]! Te escribo para compartir una oportunidad exclusiva de colaboración con LinkChinaMed...
                </div>
              </div>

              {/* Russian Swipe */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">Русский (Telegram / WhatsApp)</span>
                  <button
                    onClick={() =>
                      handleCopy(
                        `Здравствуйте, [Имя]! 👋

Предлагаем партнерство с LinkChinaMed — ведущим сервисом медицинского туризма в государственные клиники высшей категории Китая (онкология, кардиохирургия, второе мнение за 72 часа).

Высокие партнерские выплаты ($100–$2,500+ за пациента) и полное русскоязычное медицинское сопровождение.

Регистрация в партнерском кабинете:
${inviteLink} (Промокод: ${agentCode})`,
                        "swipe-ru"
                      )
                    }
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    {copiedId === "swipe-ru" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    复制俄语
                  </button>
                </div>
                <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded font-mono leading-relaxed line-clamp-6">
                  Здравствуйте, [Имя]! Предлагаем партнерство с LinkChinaMed — ведущим сервисом медицинского туризма...
                </div>
              </div>

              {/* Arabic Swipe */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">العربية (WhatsApp / Instagram)</span>
                  <button
                    onClick={() =>
                      handleCopy(
                        `مرحباً [الاسم]! 👋

يسرنا دعوتكم للشراكة مع LinkChinaMed لتوفير وصول مباشر للمرضى الدوليين لأرقى المستشفيات الحكومية في الصين بدون قوائم انتظار، مع توفير مرافق طبي ثنائي اللغة ومترجم معتمد.

فرصة عمولات مجزية للشركاء والمروجين ($100–$2,500+ لكل حالة).

رابط تفعيل حساب الشريك:
${inviteLink} (رمز الشريك: ${agentCode})`,
                        "swipe-ar"
                      )
                    }
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    {copiedId === "swipe-ar" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    复制阿语
                  </button>
                </div>
                <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded font-mono leading-relaxed line-clamp-6" dir="rtl">
                  مرحباً [الاسم]! يسرنا دعوتكم للشراكة مع LinkChinaMed لتوفير وصول مباشر للمرضى الدوليين لأرقى المستشفيات...
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 4: 5-Minute Pre-screening Checklist */}
      {activeSection === "checklist" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <FileText className="w-5 h-5 text-emerald-600" />
            患者就医前 5 分钟初筛自测清单 (Pre-screening Checklist)
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            在向平台提交患者或推荐 $199 第二意见前，请引导患者或其家属核实以下 5 项条件，确保病例满足三甲特需承接标准：
          </p>

          <div className="space-y-3">
            {[
              {
                q: "1. 明确的临床诊断与近期病历材料",
                desc: "患者需持有 6 个月以内的正式医疗报告（如活检病理报告、CT / MRI DICOM 影像原盘、放化疗出院小结）。无任何基础检查者建议先在当地做初步排查。",
              },
              {
                q: "2. 患者长途飞行适航性 (Fit-to-Fly Status)",
                desc: "若需赴华治疗，患者心肺功能需能耐受 8-12 小时国际长途飞行。处于严重意识障碍、急性活动性大出血或重症监护生命支持阶段的患者暂不适宜跨境转运。",
              },
              {
                q: "3. 资金预算与公立收费认知",
                desc: "患者需知晓中国公立三甲医院费用直接在窗口结算，自费价格约为欧美私立的 30%–50%，需备有足额国际信用卡或国际电汇渠道。",
              },
              {
                q: "4. 护照有效期与陪同人员安排",
                desc: "患者及陪同亲属的国际护照有效期需在 6 个月以上。平台将为合格患者出具三甲医院官方就医邀请函以办理中国 S2 医疗陪护签证。",
              },
              {
                q: "5. 第一步首推远程第二诊疗意见 ($199)",
                desc: "凡对治疗方案有任何犹豫的患者，一律首推 $199 远程第二诊疗意见。专家确认接诊后再订机票，双方风险降为零。",
              },
            ].map((checkItem, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1">
                <div className="font-bold text-slate-900 text-xs sm:text-sm">{checkItem.q}</div>
                <div className="text-xs text-slate-600 leading-relaxed">{checkItem.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 5: Compliance Redlines */}
      {activeSection === "compliance" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-rose-700 font-bold text-base">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            跨境医疗法律红线与严禁行为 (Compliance Redlines)
          </div>
          <p className="text-xs text-slate-500">
            作为 LinkChinaMed 全球代理商，您及您招募的全部 KOL/推广人员必须严格遵守以下法律边界：
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-2">
              <span className="font-bold text-rose-900 text-xs flex items-center gap-1.5">
                🚫 严禁承诺 100% 疗效或治愈率
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                医学具有高度个体差异性。任何推广员严禁在宣传中向患者做出“包治百病”、“保证痊愈”、“彻底断根”等误导性虚假陈述。必须使用客观的“临床试验完全缓解率”、“无进展生存期中位数”等权威科学用语。
              </p>
            </div>

            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-2">
              <span className="font-bold text-rose-900 text-xs flex items-center gap-1.5">
                🚫 严禁非医务人员擅自诊断或处方
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                代理商与推广员的法定身份是“非医疗行政向导与跨境就医陪诊服务商”，绝非执业医师。严禁私自为患者解读药物用量、更改现有医嘱或擅自下达疾病诊断。
              </p>
            </div>

            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-2">
              <span className="font-bold text-rose-900 text-xs flex items-center gap-1.5">
                🚫 严禁私自代收或截留医院医疗费用
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                患者的全部门诊挂号费、检查费、手术费与住院押金，必须由患者本人在医院收费窗口或医院官方结算通道直接支付。任何代理严禁以个人名义或私卡代收代缴医疗款。
              </p>
            </div>

            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-2">
              <span className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
                ✅ 严格履行法律告知与隐私数据保护 (PIPL / HIPAA)
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                患者上传的病历与个人健康信息受到国际隐私法规严格保护。平台全程采用端到端加密传输与 RFC3161 防篡改时间戳存证，确保患者权益不受任何侵犯。
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
