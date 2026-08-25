/**
 * High-definition (1080x1920) Canvas Poster Generator for LinkChinaMed
 * Creates marketing posters for Agents and KOLs with embedded static QR codes.
 */

export interface PosterOptions {
  qrCanvas: HTMLCanvasElement;
  code: string;
  role: "agent" | "kol";
  userName?: string;
}

export async function generateMedicalTravelPoster(opts: PosterOptions): Promise<string> {
  const width = 1080;
  const height = 1920;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get 2d canvas context");

  // 1. Background Gradient (Luxury Dark Emerald to Deep Navy)
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, "#064e3b"); // Deep emerald
  bgGrad.addColorStop(0.35, "#065f46"); // Emerald
  bgGrad.addColorStop(0.7, "#0f172a"); // Slate 900
  bgGrad.addColorStop(1, "#020617"); // Darkest slate
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Decorative subtle ambient glow rings
  const glow1 = ctx.createRadialGradient(200, 300, 50, 200, 300, 600);
  glow1.addColorStop(0, "rgba(16, 185, 129, 0.25)");
  glow1.addColorStop(1, "rgba(16, 185, 129, 0)");
  ctx.fillStyle = glow1;
  ctx.beginPath();
  ctx.arc(200, 300, 600, 0, Math.PI * 2);
  ctx.fill();

  const glow2 = ctx.createRadialGradient(880, 1100, 50, 880, 1100, 700);
  glow2.addColorStop(0, "rgba(59, 130, 246, 0.2)");
  glow2.addColorStop(1, "rgba(59, 130, 246, 0)");
  ctx.fillStyle = glow2;
  ctx.beginPath();
  ctx.arc(880, 1100, 700, 0, Math.PI * 2);
  ctx.fill();

  // 2. Top Header Brand Bar
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 44px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("LinkChinaMed", 80, 130);

  ctx.fillStyle = "#34d399"; // Emerald 400
  ctx.font = "600 24px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("CROSS-BORDER HEALTHCARE CONCIERGE", 80, 170);

  // Top Right Tag
  ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
  roundRect(ctx, 740, 95, 260, 55, 28);
  ctx.fill();
  ctx.fillStyle = "#f8fafc";
  ctx.font = "bold 20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Official Partner", 870, 130);
  ctx.textAlign = "left";

  // 3. Hero Statement Box
  ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
  roundRect(ctx, 80, 230, 920, 260, 32);
  ctx.fill();
  ctx.strokeStyle = "rgba(52, 211, 153, 0.3)";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#fbbf24"; // Amber 400
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

  // 4. Core Service Pillars / Value Badges (4 cards)
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

    // Icon Circle
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    roundRect(ctx, 110, pillarY + 25, 90, 90, 20);
    ctx.fill();
    ctx.font = "44px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(p.icon, 130, pillarY + 86);

    // Text
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 32px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText(p.title, 230, pillarY + 62);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "500 22px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText(p.desc, 230, pillarY + 102);

    pillarY += 165;
  }

  // 5. Bottom QR & Call to Action Container
  const footerY = 1240;
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, 80, footerY, 920, 560, 36);
  ctx.fill();
  ctx.strokeStyle = "rgba(16, 185, 129, 0.4)";
  ctx.lineWidth = 3;
  ctx.stroke();

  // Draw static QR Code from provided canvas
  ctx.drawImage(opts.qrCanvas, 130, footerY + 70, 420, 420);

  // Right side of Footer: Code & Instructions
  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 34px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("SCAN TO CONNECT", 590, footerY + 130);

  ctx.fillStyle = "#64748b";
  ctx.font = "500 22px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("Scan with phone camera to", 590, footerY + 175);
  ctx.fillText(opts.role === "agent" ? "join as official KOL partner." : "access top hospital care.", 590, footerY + 205);

  // Partner Code Pill
  ctx.fillStyle = "#f1f5f9";
  roundRect(ctx, 590, footerY + 250, 360, 110, 20);
  ctx.fill();
  ctx.strokeStyle = "#cbd5e1";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = "#64748b";
  ctx.font = "bold 18px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("PARTNER INVITE CODE", 615, footerY + 290);

  ctx.fillStyle = "#059669"; // Emerald 600
  ctx.font = "900 42px monospace";
  ctx.fillText(opts.code, 615, footerY + 338);

  // Security & Trust footnote
  ctx.fillStyle = "#94a3b8";
  ctx.font = "600 18px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("🔒 100% HIPAA & PIPL Compliant", 590, footerY + 410);
  ctx.fillText("🌐 www.linkchinamed.com", 590, footerY + 440);

  // 6. Very bottom copyright
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.font = "18px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("© LinkChinaMed Inc. • Global Cross-Border Medical Care Navigation", width / 2, 1860);

  return canvas.toDataURL("image/png");
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
