/**
 * Multi-Format High-Definition Canvas Poster Generator for LinkChinaMed
 * Supports 9:16 Story, 1:1 Square Feed, and 3:4 High-Res Flyer formats.
 */

export type PosterFormat = "story" | "square" | "flyer";

export interface PosterOptions {
  qrCanvas: HTMLCanvasElement;
  code: string;
  role: "agent" | "kol";
  userName?: string;
  format?: PosterFormat;
}

export const POSTER_DIMENSIONS: Record<PosterFormat, { width: number; height: number; label: string; ratio: string; desc: string }> = {
  story: {
    width: 1080,
    height: 1920,
    label: "9:16 竖版全屏",
    ratio: "1080 × 1920 px",
    desc: "适合 Instagram Story, TikTok, 微信朋友圈, WhatsApp 动态",
  },
  square: {
    width: 1080,
    height: 1080,
    label: "1:1 社交方形",
    ratio: "1080 × 1080 px",
    desc: "适合 Instagram Feed, LinkedIn, Twitter/X, 社群动态分享",
  },
  flyer: {
    width: 1200,
    height: 1600,
    label: "3:4 打印展架",
    ratio: "1200 × 1600 px",
    desc: "适合 A4 高清印刷、线下接待台展架、商务单页",
  },
};

export async function generateMedicalTravelPoster(opts: PosterOptions): Promise<string> {
  const format = opts.format || "story";
  const { width, height } = POSTER_DIMENSIONS[format];

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get 2d canvas context");

  // 1. Background Gradient (Luxury Dark Emerald to Deep Slate/Navy)
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, "#064e3b"); // Deep emerald
  bgGrad.addColorStop(0.35, "#065f46"); // Emerald
  bgGrad.addColorStop(0.75, "#0f172a"); // Slate 900
  bgGrad.addColorStop(1, "#020617"); // Darkest slate
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Decorative ambient glow rings
  const glow1 = ctx.createRadialGradient(width * 0.2, height * 0.15, 50, width * 0.2, height * 0.15, width * 0.6);
  glow1.addColorStop(0, "rgba(16, 185, 129, 0.25)");
  glow1.addColorStop(1, "rgba(16, 185, 129, 0)");
  ctx.fillStyle = glow1;
  ctx.beginPath();
  ctx.arc(width * 0.2, height * 0.15, width * 0.6, 0, Math.PI * 2);
  ctx.fill();

  const glow2 = ctx.createRadialGradient(width * 0.8, height * 0.7, 50, width * 0.8, height * 0.7, width * 0.7);
  glow2.addColorStop(0, "rgba(59, 130, 246, 0.2)");
  glow2.addColorStop(1, "rgba(59, 130, 246, 0)");
  ctx.fillStyle = glow2;
  ctx.beginPath();
  ctx.arc(width * 0.8, height * 0.7, width * 0.7, 0, Math.PI * 2);
  ctx.fill();

  // Scale factor based on width
  const scale = width / 1080;

  if (format === "story") {
    renderStoryLayout(ctx, opts, width, height, scale);
  } else if (format === "square") {
    renderSquareLayout(ctx, opts, width, height, scale);
  } else {
    renderFlyerLayout(ctx, opts, width, height, scale);
  }

  return canvas.toDataURL("image/png");
}

function renderStoryLayout(
  ctx: CanvasRenderingContext2D,
  opts: PosterOptions,
  width: number,
  height: number,
  scale: number
) {
  // Header
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 44px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("LinkChinaMed", 80, 130);

  ctx.fillStyle = "#34d399";
  ctx.font = "600 24px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("CROSS-BORDER HEALTHCARE CONCIERGE", 80, 170);

  ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
  roundRect(ctx, 740, 95, 260, 55, 28);
  ctx.fill();
  ctx.fillStyle = "#f8fafc";
  ctx.font = "bold 20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Official Partner", 870, 130);
  ctx.textAlign = "left";

  // Hero Card
  ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
  roundRect(ctx, 80, 230, 920, 260, 32);
  ctx.fill();
  ctx.strokeStyle = "rgba(52, 211, 153, 0.3)";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#fbbf24";
  ctx.font = "bold 24px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText(opts.role === "agent" ? "CREATOR RECRUITMENT PROGRAM" : "PREMIER MEDICAL ACCESS IN CHINA", 120, 290);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 56px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  if (opts.role === "agent") {
    ctx.fillText("Monetize Medical Travel.", 120, 370);
    ctx.font = "bold 44px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillStyle = "#93c5fd";
    ctx.fillText("Earn 5%–10% Team Commissions", 120, 435);
  } else {
    ctx.fillText("World-Class Healthcare.", 120, 370);
    ctx.font = "bold 44px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillStyle = "#34d399";
    ctx.fillText("Zero Waiting List. 70% Less Cost.", 120, 435);
  }

  // 4 Pillars
  const pillars = opts.role === "agent" ? [
    { icon: "💎", title: "High-Ticket Earnings", desc: "Earn $100–$2,500+ per client booking across your creator network." },
    { icon: "🔄", title: "Lifetime Attribution", desc: "Permanent client binding with ongoing annual repeat checkup commissions." },
    { icon: "🎓", title: "Full Creator Toolkit", desc: "Tested pitch scripts, ready-to-use posters & weekly training webinars." },
    { icon: "🤝", title: "24/7 Care Concierge", desc: "Official medical team handles consultation & hospital logistics for you." },
  ] : [
    { icon: "⚡", title: "Zero Waitlist Access", desc: "Fast-track admission to China's Premier AAA International Departments." },
    { icon: "💰", title: "Save 30%–70% Costs", desc: "Top-tier surgery, oncology & executive checkups at a fraction of Western costs." },
    { icon: "🌐", title: "1-on-1 Bilingual Escort", desc: "Dedicated medical chaperone from registration to pharmacy guidance." },
    { icon: "🛡️", title: "100% Transparent Billing", desc: "Hospital treatment fees paid directly to hospital with zero agency markup." },
  ];

  let pillarY = 530;
  for (const p of pillars) {
    ctx.fillStyle = "rgba(15, 23, 42, 0.65)";
    roundRect(ctx, 80, pillarY, 920, 140, 24);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    roundRect(ctx, 110, pillarY + 25, 90, 90, 20);
    ctx.fill();
    ctx.font = "44px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(p.icon, 130, pillarY + 86);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 32px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText(p.title, 230, pillarY + 62);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "500 22px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText(p.desc, 230, pillarY + 102);

    pillarY += 165;
  }

  // Footer QR
  const footerY = 1240;
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, 80, footerY, 920, 560, 36);
  ctx.fill();
  ctx.strokeStyle = "rgba(16, 185, 129, 0.4)";
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.drawImage(opts.qrCanvas, 130, footerY + 70, 420, 420);

  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 34px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("SCAN TO CONNECT", 590, footerY + 130);

  ctx.fillStyle = "#64748b";
  ctx.font = "500 22px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("Scan with phone camera to", 590, footerY + 175);
  ctx.fillText(opts.role === "agent" ? "join as official KOL partner." : "access top hospital care.", 590, footerY + 205);

  ctx.fillStyle = "#f1f5f9";
  roundRect(ctx, 590, footerY + 250, 360, 110, 20);
  ctx.fill();
  ctx.strokeStyle = "#cbd5e1";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = "#64748b";
  ctx.font = "bold 18px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("PARTNER INVITE CODE", 615, footerY + 290);

  ctx.fillStyle = "#059669";
  ctx.font = "900 42px monospace";
  ctx.fillText(opts.code, 615, footerY + 338);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "600 18px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("🔒 100% HIPAA & PIPL Compliant", 590, footerY + 410);
  ctx.fillText("🌐 www.linkchinamed.com", 590, footerY + 440);

  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.font = "18px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("© LinkChinaMed Inc. • Global Cross-Border Medical Care Navigation", width / 2, 1860);
}

function renderSquareLayout(
  ctx: CanvasRenderingContext2D,
  opts: PosterOptions,
  width: number,
  height: number,
  scale: number
) {
  // Top Header
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 38px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("LinkChinaMed", 60, 90);

  ctx.fillStyle = "#34d399";
  ctx.font = "600 20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("CROSS-BORDER HEALTHCARE CONCIERGE", 60, 125);

  ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
  roundRect(ctx, 760, 60, 260, 50, 25);
  ctx.fill();
  ctx.fillStyle = "#f8fafc";
  ctx.font = "bold 18px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Official Partner", 890, 92);
  ctx.textAlign = "left";

  // Hero Banner
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 44px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  if (opts.role === "agent") {
    ctx.fillText("Monetize Medical Travel.", 60, 200);
    ctx.font = "bold 32px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillStyle = "#93c5fd";
    ctx.fillText("Earn 5%–10% Team Override Commissions", 60, 245);
  } else {
    ctx.fillText("World-Class Healthcare in China.", 60, 200);
    ctx.font = "bold 32px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillStyle = "#34d399";
    ctx.fillText("Zero Waiting List • 30%–70% Cost Savings", 60, 245);
  }

  // Left 2 Pillars + Right QR Card
  const pillars = opts.role === "agent" ? [
    { icon: "💎", title: "High-Ticket Earnings", desc: "Earn $100–$2,500+ per referral." },
    { icon: "🔄", title: "Lifetime Attribution", desc: "Permanent client binding & repeat payout." },
    { icon: "🎓", title: "Full Creator Toolkit", desc: "Tested pitch scripts & weekly webinars." },
    { icon: "🤝", title: "24/7 Medical Concierge", desc: "Hospital team handles all logistics." },
  ] : [
    { icon: "⚡", title: "Zero Waitlist Access", desc: "Direct access to top Grade 3-A specialists." },
    { icon: "💰", title: "Save 30%–70% Costs", desc: "World-class care at fraction of US/EU price." },
    { icon: "🌐", title: "1-on-1 Bilingual Escort", desc: "Dedicated chaperone & certified translation." },
    { icon: "🛡️", title: "100% Direct Billing", desc: "Fees paid to hospital with zero markup." },
  ];

  let leftY = 300;
  for (const p of pillars) {
    ctx.fillStyle = "rgba(15, 23, 42, 0.7)";
    roundRect(ctx, 60, leftY, 520, 130, 20);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.font = "32px -apple-system, sans-serif";
    ctx.fillText(p.icon, 85, leftY + 75);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 24px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText(p.title, 140, leftY + 52);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "500 18px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText(p.desc, 140, leftY + 88);

    leftY += 150;
  }

  // Right QR Box
  const qrBoxX = 610;
  const qrBoxY = 300;
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, qrBoxX, qrBoxY, 410, 580, 28);
  ctx.fill();
  ctx.strokeStyle = "rgba(16, 185, 129, 0.4)";
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.drawImage(opts.qrCanvas, qrBoxX + 45, qrBoxY + 40, 320, 320);

  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 22px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("SCAN TO CONNECT", qrBoxX + 205, qrBoxY + 395);

  ctx.fillStyle = "#f1f5f9";
  roundRect(ctx, qrBoxX + 35, qrBoxY + 420, 340, 80, 16);
  ctx.fill();
  ctx.strokeStyle = "#cbd5e1";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = "#64748b";
  ctx.font = "bold 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("PARTNER CODE", qrBoxX + 205, qrBoxY + 448);

  ctx.fillStyle = "#059669";
  ctx.font = "900 30px monospace";
  ctx.fillText(opts.code, qrBoxX + 205, qrBoxY + 484);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "600 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("🔒 HIPAA & PIPL Compliant", qrBoxX + 205, qrBoxY + 540);
  ctx.textAlign = "left";

  // Footer note
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.font = "16px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("© LinkChinaMed Inc. • Global Healthcare Concierge • www.linkchinamed.com", width / 2, 1030);
}

function renderFlyerLayout(
  ctx: CanvasRenderingContext2D,
  opts: PosterOptions,
  width: number,
  height: number,
  scale: number
) {
  // Flyer Header
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 48px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("LinkChinaMed", 80, 120);

  ctx.fillStyle = "#34d399";
  ctx.font = "600 24px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("GLOBAL CROSS-BORDER HEALTHCARE NAVIGATION", 80, 160);

  ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
  roundRect(ctx, 840, 85, 280, 60, 30);
  ctx.fill();
  ctx.fillStyle = "#f8fafc";
  ctx.font = "bold 22px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Official Partner", 980, 123);
  ctx.textAlign = "left";

  // Hero Card
  ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
  roundRect(ctx, 80, 220, 1040, 220, 28);
  ctx.fill();
  ctx.strokeStyle = "rgba(52, 211, 153, 0.3)";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#fbbf24";
  ctx.font = "bold 24px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText(opts.role === "agent" ? "CREATOR RECRUITMENT PROGRAM" : "PREMIER MEDICAL ACCESS IN CHINA", 120, 275);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 52px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  if (opts.role === "agent") {
    ctx.fillText("Monetize Medical Travel.", 120, 345);
    ctx.font = "bold 38px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillStyle = "#93c5fd";
    ctx.fillText("Earn 5%–10% Team Override Commissions", 120, 400);
  } else {
    ctx.fillText("World-Class Healthcare.", 120, 345);
    ctx.font = "bold 38px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillStyle = "#34d399";
    ctx.fillText("Zero Waiting List • 30%–70% Cost Savings", 120, 400);
  }

  // 4 Pillars (2x2 Grid)
  const pillars = opts.role === "agent" ? [
    { icon: "💎", title: "High-Ticket Earnings", desc: "Earn $100–$2,500+ per referral." },
    { icon: "🔄", title: "Lifetime Attribution", desc: "Permanent client binding & repeat payout." },
    { icon: "🎓", title: "Full Creator Toolkit", desc: "Tested pitch scripts & weekly webinars." },
    { icon: "🤝", title: "24/7 Medical Concierge", desc: "Hospital team handles all logistics." },
  ] : [
    { icon: "⚡", title: "Zero Waitlist Access", desc: "Direct access to top Grade 3-A specialists." },
    { icon: "💰", title: "Save 30%–70% Costs", desc: "World-class care at fraction of US/EU price." },
    { icon: "🌐", title: "1-on-1 Bilingual Escort", desc: "Dedicated chaperone & certified translation." },
    { icon: "🛡️", title: "100% Direct Billing", desc: "Fees paid to hospital with zero markup." },
  ];

  const gridPositions = [
    { x: 80, y: 480 },
    { x: 620, y: 480 },
    { x: 80, y: 650 },
    { x: 620, y: 650 },
  ];

  for (let i = 0; i < pillars.length; i++) {
    const p = pillars[i];
    const pos = gridPositions[i];

    ctx.fillStyle = "rgba(15, 23, 42, 0.65)";
    roundRect(ctx, pos.x, pos.y, 500, 140, 20);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.font = "38px -apple-system, sans-serif";
    ctx.fillText(p.icon, pos.x + 30, pos.y + 80);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 26px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText(p.title, pos.x + 95, pos.y + 60);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "500 20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText(p.desc, pos.x + 95, pos.y + 98);
  }

  // Footer QR
  const footerY = 840;
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, 80, footerY, 1040, 680, 32);
  ctx.fill();
  ctx.strokeStyle = "rgba(16, 185, 129, 0.4)";
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.drawImage(opts.qrCanvas, 140, footerY + 90, 500, 500);

  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 38px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("SCAN TO CONNECT", 680, footerY + 160);

  ctx.fillStyle = "#64748b";
  ctx.font = "500 24px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("Scan with phone camera to", 680, footerY + 215);
  ctx.fillText(opts.role === "agent" ? "join as official partner." : "access premier healthcare.", 680, footerY + 250);

  ctx.fillStyle = "#f1f5f9";
  roundRect(ctx, 680, footerY + 310, 400, 130, 20);
  ctx.fill();
  ctx.strokeStyle = "#cbd5e1";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = "#64748b";
  ctx.font = "bold 20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("PARTNER INVITE CODE", 710, footerY + 360);

  ctx.fillStyle = "#059669";
  ctx.font = "900 48px monospace";
  ctx.fillText(opts.code, 710, footerY + 415);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "600 20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("🔒 100% HIPAA & PIPL Compliant", 680, footerY + 510);
  ctx.fillText("🌐 www.linkchinamed.com", 680, footerY + 545);

  // Copyright
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.font = "20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("© LinkChinaMed Inc. • Global Medical Travel Concierge", width / 2, 1560);
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
