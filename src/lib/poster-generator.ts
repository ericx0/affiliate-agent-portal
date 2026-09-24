/**
 * Multi-Format High-Definition Canvas Poster Generator for LinkChinaMed
 * Supports 9:16 Story, 1:1 Square Feed, and 3:4 High-Res Flyer formats.
 * 100% Client-Side Pure Canvas Rendering with Embedded Dynamic QR Code.
 */

export type PosterFormat = "story" | "square" | "flyer";

export type PosterThemeId =
  | "b2b_partner"
  | "premier_hospitals"
  | "cutting_edge_oncology"
  | "second_opinion";

export interface PosterTheme {
  id: PosterThemeId;
  name: string;
  tag: string;
  headline: string;
  subheadline: string;
  accentColor: string;
  pillars: Array<{ icon: string; title: string; desc: string }>;
  ctaTitle: string;
  ctaSubtitle: string;
  bgGradStart: string;
  bgGradEnd: string;
}

export const POSTER_THEMES: Record<PosterThemeId, PosterTheme> = {
  b2b_partner: {
    id: "b2b_partner",
    name: "Global Healthcare Creator Partner",
    tag: "B2B CREATOR RECRUITMENT",
    headline: "MONETIZE GLOBAL HEALTHCARE",
    subheadline: "Earn 5%–10% Team Override Commissions with Zero Medical Experience Needed",
    accentColor: "#059669",
    bgGradStart: "#064e3b",
    bgGradEnd: "#022c22",
    pillars: [
      { icon: "💎", title: "High-Ticket Payouts:", desc: "Earn $100–$2,500+ per client referral" },
      { icon: "🔄", title: "Permanent Attribution:", desc: "Lifetime client binding & automatic Stripe payouts" },
      { icon: "🎓", title: "Full Sales Enablement:", desc: "Tested pitch scripts, hospital dossiers & webinars" },
      { icon: "🛡️", title: "Zero Clinical Liability:", desc: "Hospital handles all medical care; 100% transparent" },
    ],
    ctaTitle: "BECOME AN OFFICIAL PARTNER",
    ctaSubtitle: "Scan QR code to activate your partner portal",
  },
  premier_hospitals: {
    id: "premier_hospitals",
    name: "Direct Access to Premier AAA Hospitals",
    tag: "GLOBAL PATIENT VIP CONCIERGE",
    headline: "WORLD-CLASS HEALTHCARE. ZERO WAITING.",
    subheadline: "Direct Fast-Track Admission to China's Top Public AAA Hospital International Wings",
    accentColor: "#0284c7",
    bgGradStart: "#0c4a6e",
    bgGradEnd: "#082f49",
    pillars: [
      { icon: "⚡", title: "Zero Waitlists:", desc: "Consult top specialists & schedule surgery in days" },
      { icon: "💰", title: "30%–70% Savings:", desc: "Fraction of US/EU private medical procedure costs" },
      { icon: "🌐", title: "1-on-1 Bilingual Escort:", desc: "Full accompaniment, medical translation & logistics" },
      { icon: "🏥", title: "National Medical Centers:", desc: "Peking Union, Fuwai Cardiovascular & CAMS Cancer" },
    ],
    ctaTitle: "GET FREE CASE EVALUATION",
    ctaSubtitle: "Scan to connect with our international care team",
  },
  cutting_edge_oncology: {
    id: "cutting_edge_oncology",
    name: "Next-Gen CAR-T & Precision Oncology",
    tag: "BREAKTHROUGH CANCER THERAPIES",
    headline: "ADVANCED CELL THERAPY & BISPECIFICS",
    subheadline: "China-Approved BCMA CAR-T & Dual Antibodies at 1/4 Western Treatment Costs",
    accentColor: "#10b981",
    bgGradStart: "#042f2e",
    bgGradEnd: "#021d1b",
    pillars: [
      { icon: "🔬", title: "Next-Gen CAR-T:", desc: "BCMA & CD19 therapy with fast 2-week cell turnaround" },
      { icon: "💊", title: "World-First Bispecifics:", desc: "Ivonescimab (PD-1/VEGF-A) & Cadonilimab" },
      { icon: "🎯", title: "Proton & Heavy Ion:", desc: "Sub-millimeter beam targeting complex tumors" },
      { icon: "💵", title: "Radical Affordability:", desc: "$80k–$120k comprehensive vs $450k+ in the US" },
    ],
    ctaTitle: "EXPLORE CUTTING-EDGE OPTIONS",
    ctaSubtitle: "Scan to check medical eligibility & clinical protocols",
  },
  second_opinion: {
    id: "second_opinion",
    name: "72-Hour Rapid Second Opinion ($199)",
    tag: "REMOTE CLINICAL ASSESSMENT",
    headline: "EXPERT SECOND OPINION IN 72 HOURS",
    subheadline: "Comprehensive Written Diagnostic Review by Leading Grade 3-A Chief Physicians",
    accentColor: "#d97706",
    bgGradStart: "#451a03",
    bgGradEnd: "#1c0a00",
    pillars: [
      { icon: "⏱️", title: "Guaranteed 72h SLA:", desc: "Formal written medical review within 3 business days" },
      { icon: "👨‍⚕️", title: "Top Chief Specialists:", desc: "Reviewed exclusively by department heads & professors" },
      { icon: "📄", title: "Bilingual Medical Report:", desc: "Actionable staging, treatment path & surgical options" },
      { icon: "🔒", title: "100% Remote & Safe:", desc: "No travel required; peace of mind before big decisions" },
    ],
    ctaTitle: "REQUEST SECOND OPINION NOW",
    ctaSubtitle: "Scan to submit medical records securely ($199 flat fee)",
  },
};

export interface PosterOptions {
  qrCanvas: HTMLCanvasElement;
  code: string;
  themeId?: PosterThemeId;
  format?: PosterFormat;
  userName?: string;
}

export const POSTER_DIMENSIONS: Record<
  PosterFormat,
  { width: number; height: number; label: string; ratio: string; desc: string }
> = {
  story: {
    width: 1080,
    height: 1920,
    label: "9:16 Story / Reels",
    ratio: "1080 × 1920 px",
    desc: "Optimized for Instagram Stories, TikTok, WhatsApp Status, and full-screen mobile share",
  },
  square: {
    width: 1080,
    height: 1080,
    label: "1:1 Social Feed",
    ratio: "1080 × 1080 px",
    desc: "Optimized for Instagram Feed, LinkedIn posts, Twitter/X, and social group sharing",
  },
  flyer: {
    width: 1200,
    height: 1600,
    label: "3:4 Print & Flyer",
    ratio: "1200 × 1600 px",
    desc: "Optimized for high-resolution A4 printing, clinic waiting rooms, and conference handouts",
  },
};

export async function generateMedicalTravelPoster(opts: PosterOptions): Promise<string> {
  const format = opts.format || "story";
  const theme = POSTER_THEMES[opts.themeId || "b2b_partner"];
  const { width, height } = POSTER_DIMENSIONS[format];

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get 2d canvas context");

  if (format === "story") {
    renderStoryLayout(ctx, opts, theme, width, height);
  } else if (format === "square") {
    renderSquareLayout(ctx, opts, theme, width, height);
  } else {
    renderFlyerLayout(ctx, opts, theme, width, height);
  }

  return canvas.toDataURL("image/png");
}

function renderStoryLayout(
  ctx: CanvasRenderingContext2D,
  opts: PosterOptions,
  theme: PosterTheme,
  width: number,
  height: number
) {
  // Background Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, theme.bgGradStart);
  bgGrad.addColorStop(0.7, theme.bgGradEnd);
  bgGrad.addColorStop(1, "#020617");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle decorative geometric accents
  ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(width, 0, 500, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, height * 0.4, 400, 0, Math.PI * 2);
  ctx.stroke();

  // 1. BRAND BADGE & HEADER
  const pad = 64;
  let curY = 90;

  // Tag Badge
  ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
  roundRect(ctx, pad, curY, 380, 52, 26);
  ctx.fill();

  ctx.fillStyle = "#34d399";
  ctx.font = "bold 20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText(`✨ ${theme.tag}`, pad + 24, curY + 34);

  curY += 80;

  // Company Brand Name
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 32px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("LinkChinaMed | Premier Global Healthcare", pad, curY);

  curY += 65;

  // Main Headline
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 52px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  const words = theme.headline.split(" ");
  if (words.length > 3) {
    const line1 = words.slice(0, 3).join(" ");
    const line2 = words.slice(3).join(" ");
    ctx.fillText(line1, pad, curY);
    curY += 64;
    ctx.fillStyle = "#6ee7b7";
    ctx.fillText(line2, pad, curY);
  } else {
    ctx.fillText(theme.headline, pad, curY);
  }

  curY += 50;

  // Subheadline
  ctx.fillStyle = "#94a3b8";
  ctx.font = "500 26px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  wrapText(ctx, theme.subheadline, pad, curY, width - pad * 2, 38);

  curY += 100;

  // 2. VALUE PILLARS
  for (const p of theme.pillars) {
    ctx.fillStyle = "rgba(15, 23, 42, 0.65)";
    roundRect(ctx, pad, curY, width - pad * 2, 115, 20);
    ctx.fill();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Icon
    ctx.font = "40px sans-serif";
    ctx.fillText(p.icon, pad + 28, curY + 70);

    // Title
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 26px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText(p.title, pad + 95, curY + 50);

    // Desc
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "400 23px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText(p.desc, pad + 95, curY + 86);

    curY += 135;
  }

  // 3. BOTTOM FOOTER WITH QR CODE
  const footerY = height - 580;
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, pad, footerY, width - pad * 2, 510, 32);
  ctx.fill();

  // QR Code Frame
  const qrBoxSize = 340;
  const qrX = pad + 40;
  const qrY = footerY + 85;

  ctx.fillStyle = "#f8fafc";
  roundRect(ctx, qrX, qrY, qrBoxSize, qrBoxSize, 20);
  ctx.fill();
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw QR Image
  const qrInnerPad = 20;
  ctx.drawImage(
    opts.qrCanvas,
    qrX + qrInnerPad,
    qrY + qrInnerPad,
    qrBoxSize - qrInnerPad * 2,
    qrBoxSize - qrInnerPad * 2
  );

  // Footer Right Content
  const textX = qrX + qrBoxSize + 40;
  let textY = footerY + 130;

  ctx.fillStyle = "#0f172a";
  ctx.font = "900 36px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("SCAN TO CONNECT", textX, textY);

  textY += 45;
  ctx.fillStyle = "#475569";
  ctx.font = "500 23px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  wrapText(ctx, theme.ctaSubtitle, textX, textY, width - textX - pad, 32);

  textY += 95;
  // Partner Code Pill
  ctx.fillStyle = "#f0fdf4";
  roundRect(ctx, textX, textY, width - textX - pad - 20, 95, 16);
  ctx.fill();
  ctx.strokeStyle = "#86efac";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#065f46";
  ctx.font = "bold 18px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("OFFICIAL INVITE CODE", textX + 24, textY + 36);

  ctx.fillStyle = "#047857";
  ctx.font = "900 34px monospace";
  ctx.fillText(opts.code || "LCM-VIP", textX + 24, textY + 74);

  // Web Domain at bottom
  ctx.fillStyle = "#64748b";
  ctx.font = "bold 20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("🔗 www.linkchinamed.com", textX, footerY + 440);
}

function renderSquareLayout(
  ctx: CanvasRenderingContext2D,
  opts: PosterOptions,
  theme: PosterTheme,
  width: number,
  height: number
) {
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, theme.bgGradStart);
  bgGrad.addColorStop(1, theme.bgGradEnd);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  const pad = 50;
  let curY = 70;

  // Header Tag
  ctx.fillStyle = "#34d399";
  ctx.font = "bold 18px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(`✨ ${theme.tag} • LinkChinaMed`, pad, curY);

  curY += 45;
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 42px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(theme.headline, pad, curY);

  curY += 40;
  ctx.fillStyle = "#94a3b8";
  ctx.font = "500 22px -apple-system, BlinkMacSystemFont, sans-serif";
  wrapText(ctx, theme.subheadline, pad, curY, width - pad * 2, 30);

  // Middle 2 Pillars
  curY += 75;
  for (let i = 0; i < Math.min(2, theme.pillars.length); i++) {
    const p = theme.pillars[i];
    ctx.fillStyle = "rgba(15, 23, 42, 0.55)";
    roundRect(ctx, pad, curY, width - pad * 2, 85, 14);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.stroke();

    ctx.font = "32px sans-serif";
    ctx.fillText(p.icon, pad + 20, curY + 54);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 22px sans-serif";
    ctx.fillText(p.title, pad + 70, curY + 42);

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "400 20px sans-serif";
    ctx.fillText(p.desc, pad + 70, curY + 68);

    curY += 100;
  }

  // Bottom White Card with QR
  const footerY = height - 420;
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, pad, footerY, width - pad * 2, 380, 24);
  ctx.fill();

  const qrBox = 290;
  const qrX = pad + 35;
  const qrY = footerY + 45;

  ctx.fillStyle = "#f8fafc";
  roundRect(ctx, qrX, qrY, qrBox, qrBox, 16);
  ctx.fill();

  const inner = 16;
  ctx.drawImage(opts.qrCanvas, qrX + inner, qrY + inner, qrBox - inner * 2, qrBox - inner * 2);

  const textX = qrX + qrBox + 35;
  let textY = footerY + 95;

  ctx.fillStyle = "#0f172a";
  ctx.font = "900 32px sans-serif";
  ctx.fillText(theme.ctaTitle, textX, textY);

  textY += 38;
  ctx.fillStyle = "#475569";
  ctx.font = "500 20px sans-serif";
  wrapText(ctx, theme.ctaSubtitle, textX, textY, width - textX - pad, 28);

  textY += 80;
  ctx.fillStyle = "#f0fdf4";
  roundRect(ctx, textX, textY, width - textX - pad - 10, 80, 12);
  ctx.fill();
  ctx.strokeStyle = "#86efac";
  ctx.stroke();

  ctx.fillStyle = "#065f46";
  ctx.font = "bold 16px sans-serif";
  ctx.fillText("PARTNER INVITE CODE", textX + 18, textY + 30);

  ctx.fillStyle = "#047857";
  ctx.font = "900 28px monospace";
  ctx.fillText(opts.code || "LCM-VIP", textX + 18, textY + 64);
}

function renderFlyerLayout(
  ctx: CanvasRenderingContext2D,
  opts: PosterOptions,
  theme: PosterTheme,
  width: number,
  height: number
) {
  // Flyer: 1200 x 1600 (3:4 ratio for printing)
  ctx.scale(width / 1080, height / 1920);
  renderStoryLayout(ctx, opts, theme, 1080, 1920);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(" ");
  let line = "";
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}
