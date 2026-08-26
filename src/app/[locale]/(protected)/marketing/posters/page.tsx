"use client";

import { useEffect, useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { supabase } from "@/lib/supabase";
import { Loader2, Download, Image as ImageIcon, X } from "lucide-react";
import { generateMedicalTravelPoster } from "@/lib/poster-generator";
import QRCode from "qrcode";

type PosterTemplate = {
  id: string;
  name: string;
  image_url: string;
};

export default function PostersPage() {
  const t = useTranslations();
  const [templates, setTemplates] = useState<PosterTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [userCode, setUserCode] = useState<string>("");
  const [previewTemplate, setPreviewTemplate] = useState<PosterTemplate | null>(null);
  const [generating, setGenerating] = useState(false);
  const [posterDataUrl, setPosterDataUrl] = useState<string>("");

  useEffect(() => {
    async function init() {
      // Fetch active templates
      const { data: tmplData } = await supabase
        .from("marketing_poster_templates")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });
      
      setTemplates(tmplData || []);

      // Fetch user profile to get partner code
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Find their code from affiliate_profiles or agents
        const { data: profile } = await supabase
          .from("affiliate_profiles")
          .select("code")
          .eq("user_id", user.id)
          .single();
        if (profile) {
          setUserCode(profile.code);
        } else {
            // fallback for older schema if needed
            const { data: agent } = await supabase
              .from("agents")
              .select("code")
              .eq("user_id", user.id)
              .single();
            if (agent) setUserCode(agent.code);
        }
      }
      setLoading(false);
    }
    init();
  }, []);

  async function handlePreview(template: PosterTemplate) {
    setPreviewTemplate(template);
    setGenerating(true);
    setPosterDataUrl("");
    try {
      // 1. Generate QR Code
      const qrCanvas = document.createElement("canvas");
      // B2B Agent Recruitment link
      const link = `https://affiliate.linkchinamed.com/register?agent=${userCode}`;
      
      await QRCode.toCanvas(qrCanvas, link, {
        width: 280,
        margin: 1,
        color: { dark: "#064e3b", light: "#ffffff" },
      });

      // 2. Generate Poster
      const dataUrl = await generateMedicalTravelPoster({
        qrCanvas,
        code: userCode,
        role: "agent",
        aiBackgroundUrl: template.image_url,
        copyType: "b2b", // Agent portal always uses B2B recruiting template
      });
      setPosterDataUrl(dataUrl);
    } catch (err) {
      console.error("Failed to generate poster:", err);
      alert("生成海报失败，请重试");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">招募海报图库</h1>
        <p className="text-slate-500 mt-1">选择并生成带有您专属邀请码的高清招募海报，用于发展您的 KOL 团队。</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-brand" /></div>
      ) : templates.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-dashed">
          <ImageIcon className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          <p className="text-slate-500">平台暂未上传任何海报模版</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {templates.map(tmpl => (
            <div key={tmpl.id} className="bg-white rounded-lg border overflow-hidden shadow-sm group">
              <div className="aspect-[3/4] relative bg-slate-100 cursor-pointer" onClick={() => handlePreview(tmpl)}>
                <img src={tmpl.image_url} alt={tmpl.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white font-medium px-4 py-2 bg-brand/90 rounded-full text-sm">生成专属海报</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden relative shadow-2xl">
            <button 
              onClick={() => setPreviewTemplate(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold">海报预览</h2>
              {posterDataUrl && (
                <a 
                  href={posterDataUrl} 
                  download={`LinkChinaMed_Poster_${userCode}.png`}
                  className="inline-flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-600 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  下载高清原图
                </a>
              )}
            </div>

            <div className="flex-1 overflow-auto p-6 bg-slate-100 flex justify-center">
              {generating ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-10 h-10 animate-spin text-brand mb-4" />
                  <p className="text-slate-600 font-medium">正在实时合成您的专属海报...</p>
                </div>
              ) : posterDataUrl ? (
                <img src={posterDataUrl} alt="Preview" className="max-w-full h-auto rounded-lg shadow-lg" style={{ maxHeight: '65vh' }} />
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
