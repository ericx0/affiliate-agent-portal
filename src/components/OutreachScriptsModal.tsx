"use client";

import { useState } from "react";
import { Copy, Check, BookOpen, MessageSquare, Mail, Send, X } from "lucide-react";

interface OutreachScriptsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inviteCode: string;
  inviteLink: string;
}

export function OutreachScriptsModal({
  open,
  onOpenChange,
  inviteCode,
  inviteLink,
}: OutreachScriptsModalProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!open) return null;

  const scripts = [
    {
      title: "Instagram / TikTok DM (Short & High-Converting)",
      icon: MessageSquare,
      tag: "Social DM",
      content: `Hey [Name]! Love your content on health & travel. 👋 

I'm partnering with LinkChinaMed (a premier global healthcare concierge connecting international patients to top-tier Grade 3-A hospital international departments in China).

We have an exclusive creator partner program where creators earn high-ticket commissions ($100–$2,500+ per client) promoting VIP health screenings and medical travel.

Zero waiting lists, 30-70% savings vs US/EU care, and full 1-on-1 bilingual medical chaperone support.

Check out the creator portal & join our network with my invite code: ${inviteCode}
👉 ${inviteLink}

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
${inviteLink} (Invite Code: ${inviteCode})

Let me know if you'd like a quick intro call with our partner team!

Best regards,`,
    },
    {
      title: "WhatsApp / WeChat Community Pitch",
      icon: Send,
      tag: "Community / Group",
      content: `🌟 Exciting Creator Opportunity: LinkChinaMed Healthcare Partner Program!

If you create content around health, wellness, medical travel, or living abroad, LinkChinaMed has launched their global creator network.

✨ Highlights:
- Connect followers to top Grade 3-A International Medical Centers with ZERO waitlist
- 30%–70% savings on executive checkups, oncology, and specialty surgery
- Full 1-on-1 English medical chaperone & certified translation
- High-ticket earnings ($100 to $2,500+ per referral) with lifetime client attribution

Join using my official partner invite link:
🔗 ${inviteLink} (Code: ${inviteCode})`,
    },
  ];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[88vh] overflow-y-auto space-y-6 relative shadow-2xl">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1 pr-8">
          <div className="flex items-center gap-2 text-emerald-600">
            <BookOpen className="w-5 h-5" />
            <h3 className="text-lg font-bold text-slate-900">
              KOL 创作者招募话术库 (Outreach Pitch Scripts)
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            直接复制并微调以下专为海外社交媒体（Instagram / TikTok / LinkedIn / Email）设计的高转化邀约模板，专属邀请码与链接已自动填充。
          </p>
        </div>

        <div className="space-y-4">
          {scripts.map((s, idx) => {
            const Icon = s.icon;
            const isCopied = copiedIndex === idx;
            return (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 hover:border-emerald-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-sm text-slate-800">{s.title}</span>
                    <span className="text-[11px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-semibold">
                      {s.tag}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(s.content, idx)}
                    className="h-8 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 hover:text-emerald-700 inline-flex items-center gap-1.5 transition-colors"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        已复制
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        一键复制
                      </>
                    )}
                  </button>
                </div>
                <pre className="text-xs text-slate-600 bg-white p-3.5 rounded-xl border border-slate-100 whitespace-pre-wrap font-sans leading-relaxed">
                  {s.content}
                </pre>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
