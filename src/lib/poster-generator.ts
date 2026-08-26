/**
 * Multi-Format High-Definition Canvas Poster Generator for LinkChinaMed
 * Supports 9:16 Story, 1:1 Square Feed, and 3:4 High-Res Flyer formats.
 */

export type PosterFormat = "story" | "square" | "flyer";

export type CopyType = "b2c" | "b2b";

export interface PosterOptions {
  qrCanvas: HTMLCanvasElement;
  code: string;
  role: "agent" | "kol";
  userName?: string;
  format?: PosterFormat;
  aiBackgroundUrl?: string; // This will now be used as the Hero Image
  copyType?: CopyType; // "b2c" for patients, "b2b" for agents
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

  // 1. Solid White/Light Background for the whole poster
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  // Subtle brand green gradient at the very top
  const topGrad = ctx.createLinearGradient(0, 0, width, 400);
  topGrad.addColorStop(0, "#f0fdf4"); // very light green
  topGrad.addColorStop(1, "#ffffff");
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, width, 400);

  // Load Hero Image if provided
  let heroImage: HTMLImageElement | null = null;
  if (opts.aiBackgroundUrl) {
    try {
      heroImage = await loadBackgroundImage(opts.aiBackgroundUrl);
    } catch (err) {
      console.error("Failed to load hero image", err);
    }
  }

  // Scale factor based on width
  const scale = width / 1080;

  if (format === "story") {
    if (opts.copyType === "b2b") {
      renderB2BStoryLayout(ctx, opts, width, height, heroImage);
    } else {
      renderStoryLayout(ctx, opts, width, height, heroImage);
    }
  } else if (format === "square") {
    renderSquareLayout(ctx, opts, width, height, heroImage);
  } else {
    renderFlyerLayout(ctx, opts, width, height, heroImage);
  }

  return canvas.toDataURL("image/png");
}

function renderStoryLayout(
  ctx: CanvasRenderingContext2D,
  opts: PosterOptions,
  width: number,
  height: number,
  heroImage: HTMLImageElement | null
) {
  // --- 1. HEADER ---
  ctx.fillStyle = "#064e3b"; // Dark brand green
  ctx.font = "bold 44px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("LinkChinaMed | Your Healthcare Concierge in China", 60, 100);

  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 56px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("WORLD-CLASS HEALTHCARE.", 60, 180);
  ctx.fillStyle = "#059669";
  ctx.fillText("ZERO WAITING.", 60, 250);
  
  ctx.fillStyle = "#64748b";
  ctx.font = "600 32px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("Direct Access to China's Premier AAA Hospitals", 60, 310);

  // --- 2. HERO IMAGE ---
  const imgY = 360;
  const imgH = 480;
  ctx.save();
  roundRect(ctx, 60, imgY, 960, imgH, 24);
  ctx.clip();
  if (heroImage) {
    // cover crop
    const imgRatio = heroImage.width / heroImage.height;
    const boxRatio = 960 / imgH;
    let sWidth = heroImage.width;
    let sHeight = heroImage.height;
    let sX = 0;
    let sY = 0;
    
    if (imgRatio > boxRatio) {
      sWidth = sHeight * boxRatio;
      sX = (heroImage.width - sWidth) / 2;
    } else {
      sHeight = sWidth / boxRatio;
      sY = (heroImage.height - sHeight) / 2;
    }
    ctx.drawImage(heroImage, sX, sY, sWidth, sHeight, 60, imgY, 960, imgH);
  } else {
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(60, imgY, 960, imgH);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "32px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("【 高质感国际医疗大片（摄影实景） 】", width / 2, imgY + imgH / 2);
    ctx.textAlign = "left";
  }
  ctx.restore();

  // --- 3. PILLARS ---
  const pillarsY = 900;
  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 36px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("WHY GLOBAL PATIENTS CHOOSE US:", 60, pillarsY);

  const pillars = [
    { icon: "⚡", title: "Zero Waitlist:", desc: "Fast-track oncology & surgery admission" },
    { icon: "💰", title: "30%–70% Savings:", desc: "vs Western private medical costs" },
    { icon: "🌐", title: "1-on-1 Bilingual Escort:", desc: "Full hospital accompaniment" },
    { icon: "🛡️", title: "100% Transparent:", desc: "Official hospital billing" },
  ];

  let pY = pillarsY + 70;
  for (const p of pillars) {
    ctx.fillStyle = "#f8fafc";
    roundRect(ctx, 60, pY, 960, 100, 16);
    ctx.fill();
    ctx.strokeStyle = "#e2e8f0";
    ctx.stroke();

    ctx.font = "36px sans-serif";
    ctx.fillText(p.icon, 90, pY + 65);
    
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 28px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText(p.title, 150, pY + 60);

    ctx.fillStyle = "#475569";
    ctx.font = "500 28px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    const titleWidth = ctx.measureText(p.title).width;
    ctx.fillText(p.desc, 150 + titleWidth + 15, pY + 60);

    pY += 120;
  }

  // --- 4. FOOTER ---
  const footerY = 1420;
  ctx.fillStyle = "#f0fdf4";
  roundRect(ctx, 60, footerY, 960, 420, 32);
  ctx.fill();
  ctx.strokeStyle = "#bbf7d0";
  ctx.lineWidth = 2;
  ctx.stroke();

  // QR
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, 110, footerY + 60, 300, 300, 20);
  ctx.fill();
  ctx.drawImage(opts.qrCanvas, 120, footerY + 70, 280, 280);

  // Text
  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 44px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("GET FREE CASE REVIEW", 450, footerY + 120);
  ctx.fillText("& VIP GUIDE", 450, footerY + 175);

  ctx.fillStyle = "#475569";
  ctx.font = "30px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("Scan to chat with our international", 450, footerY + 235);
  ctx.fillText("medical care team in English", 450, footerY + 275);

  ctx.fillStyle = "#059669";
  ctx.font = "bold 28px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("🔗 www.linkchinamed.com", 450, footerY + 340);

  // Code
  ctx.fillStyle = "#064e3b";
  ctx.font = "bold 26px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText(`Partner Code: ${opts.code}`, 450, footerY + 380);
}

function renderSquareLayout(ctx: CanvasRenderingContext2D, opts: PosterOptions, width: number, height: number, heroImage: HTMLImageElement | null) {
  // Simplified square layout
  ctx.fillStyle = "#064e3b";
  ctx.font = "bold 32px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("LinkChinaMed | Premier Healthcare", 50, 70);

  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 46px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("WORLD-CLASS CARE. ZERO WAITING.", 50, 135);

  // HERO
  const imgY = 180;
  const imgH = 400;
  ctx.save();
  roundRect(ctx, 50, imgY, 980, imgH, 20);
  ctx.clip();
  if (heroImage) {
    ctx.drawImage(heroImage, 0, 0, heroImage.width, heroImage.height, 50, imgY, 980, imgH);
  } else {
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(50, imgY, 980, imgH);
  }
  ctx.restore();

  // QR Block
  ctx.fillStyle = "#f0fdf4";
  roundRect(ctx, 50, 620, 980, 400, 24);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  roundRect(ctx, 90, 660, 320, 320, 16);
  ctx.fill();
  ctx.drawImage(opts.qrCanvas, 100, 670, 300, 300);

  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 42px -apple-system, sans-serif";
  ctx.fillText("GET FREE CASE REVIEW", 450, 730);

  ctx.fillStyle = "#475569";
  ctx.font = "28px sans-serif";
  ctx.fillText("Scan to chat with our medical team", 450, 790);
  ctx.fillText("1-on-1 Bilingual Escort • 70% Less Cost", 450, 840);

  ctx.fillStyle = "#059669";
  ctx.font = "bold 32px monospace";
  ctx.fillText(`CODE: ${opts.code}`, 450, 910);
  
  ctx.fillStyle = "#047857";
  ctx.font = "24px sans-serif";
  ctx.fillText("🔗 www.linkchinamed.com", 450, 955);
}

function renderFlyerLayout(ctx: CanvasRenderingContext2D, opts: PosterOptions, width: number, height: number, heroImage: HTMLImageElement | null) {
  // TBD - same logic as story but adapted for 3:4.
  // Just reuse story with slightly different spacing for now.
  ctx.scale(width/1080, height/1920);
  renderStoryLayout(ctx, opts, 1080, 1920, heroImage);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
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

function loadBackgroundImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

function renderB2BStoryLayout(
  ctx: CanvasRenderingContext2D,
  opts: PosterOptions,
  width: number,
  height: number,
  heroImage: HTMLImageElement | null
) {
  // Dark Green Background for B2B
  ctx.fillStyle = "#064e3b";
  ctx.fillRect(0, 0, width, height);

  // Subtle gradient at bottom
  const botGrad = ctx.createLinearGradient(0, height - 600, 0, height);
  botGrad.addColorStop(0, "#064e3b");
  botGrad.addColorStop(1, "#022c22");
  ctx.fillStyle = botGrad;
  ctx.fillRect(0, height - 600, width, 600);

  // --- 1. HEADER ---
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 44px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("LinkChinaMed | Official Partner", 60, 100);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 56px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("Monetize Medical Travel.", 60, 180);
  ctx.fillStyle = "#34d399";
  ctx.fillText("Earn 5%-10% Team Override Commissions", 60, 250);

  // --- 2. PILLARS (B2B variant) ---
  const pillarsY = 360;
  const pillars = [
    { icon: "💎", title: "High-Ticket Earnings", desc: "Earn $100–$2,500+ per referral." },
    { icon: "🔄", title: "Lifetime Attribution", desc: "Permanent client binding & repeat payout." },
    { icon: "🎓", title: "Full Creator Toolkit", desc: "Tested pitch scripts & weekly webinars." },
    { icon: "🤝", title: "24/7 Medical Concierge", desc: "Hospital team handles all logistics." },
  ];

  let pY = pillarsY;
  for (const p of pillars) {
    ctx.fillStyle = "#0f172a";
    roundRect(ctx, 60, pY, 960, 120, 20);
    ctx.fill();

    ctx.font = "40px sans-serif";
    ctx.fillText(p.icon, 100, pY + 75);
    
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 32px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText(p.title, 170, pY + 55);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "500 28px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText(p.desc, 170, pY + 95);

    pY += 150;
  }

  // --- 3. FOOTER (QR CODE) ---
  const footerY = 1000;
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, 60, footerY, 960, 800, 32);
  ctx.fill();

  // QR
  roundRect(ctx, (width - 400) / 2, footerY + 80, 400, 400, 20);
  ctx.fill();
  ctx.drawImage(opts.qrCanvas, (width - 360) / 2, footerY + 100, 360, 360);

  // Text
  ctx.fillStyle = "#0f172a";
  ctx.textAlign = "center";
  ctx.font = "bold 44px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("SCAN TO CONNECT", width / 2, footerY + 550);

  // Code box
  ctx.fillStyle = "#f8fafc";
  roundRect(ctx, 240, footerY + 600, 600, 120, 24);
  ctx.fill();
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = "#64748b";
  ctx.font = "bold 24px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("PARTNER CODE", width / 2, footerY + 645);
  
  ctx.fillStyle = "#059669";
  ctx.font = "bold 48px monospace";
  ctx.fillText(opts.code, width / 2, footerY + 695);
  
  ctx.textAlign = "left";
}
