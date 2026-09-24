import { test, expect, type Page } from "@playwright/test";

/**
 * End-to-End Suite for Agent Enablement & Toolkit
 * Tests:
 * 1. Poster & Dynamic QR Studio (/marketing/posters)
 * 2. Global Prospecting & Outreach Playbook (/prospecting)
 * 3. Hospital Resources & Multi-Lingual Scripts Hub (/resources)
 * 4. Dashboard Toolkit Gateway Navigation (/dashboard)
 */

async function mockAgentAuthSession(page: Page) {
  // Inject Supabase session cookie and localStorage
  const rawSession = JSON.stringify({
    access_token: "mock-jwt-token-agent",
    refresh_token: "mock-refresh-token",
    expires_at: Math.floor(Date.now() / 1000) + 7200,
    user: {
      id: "mock-agent-user-id",
      email: "global-agent@linkchinamed.com",
      aud: "authenticated",
      role: "authenticated",
    },
  });

  await page.context().addCookies([
    {
      name: "x-e2e-agent",
      value: "1",
      domain: "localhost",
      path: "/",
    },
  ]);

  await page.addInitScript(() => {
    (window as any).__E2E_MOCK_USER__ = {
      id: "mock-agent-user-id",
      email: "global-agent@linkchinamed.com",
      aud: "authenticated",
      role: "authenticated",
    };
  });

  // Mock Supabase getUser call
  await page.route("**/auth/v1/user**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: "mock-agent-user-id",
        email: "global-agent@linkchinamed.com",
        aud: "authenticated",
        role: "authenticated",
      }),
    });
  });

  // Mock affiliate_list_promoters RPC
  await page.route("**/rest/v1/rpc/affiliate_list_promoters**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        {
          id: "mock-promoter-id",
          email: "global-agent@linkchinamed.com",
          role: "agent",
          status: "active",
          agent_invite_code: "GLOBAL-PRO-99",
          referral_code: "GLOBAL-PRO-99",
          commission_rate: 10,
        },
      ]),
    });
  });

  // Mock invite-code API
  await page.route("**/api/affiliate/agent/invite-code**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        agent_invite_code: "GLOBAL-PRO-99",
        invite_link: "https://affiliate.linkchinamed.com/register?ref=GLOBAL-PRO-99",
      }),
    });
  });

  // Mock stats API
  await page.route("**/api/affiliate/agent/stats**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        totalKols: 12,
        activeKols: 8,
        totalPaid: 450000,
        totalPending: 120000,
        totalApproved: 80000,
        agentRate: 10,
      }),
    });
  });

  // Mock notifications
  await page.route("**/api/affiliate/me/notifications**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ notifications: [], unreadCount: 0 }),
    });
  });
}

test.describe("Agent Enablement & Toolkit E2E Journey", () => {
  test.beforeEach(async ({ page }) => {
    await mockAgentAuthSession(page);
  });

  test("Posters Studio: renders themes, formats, and canvas preview with code", async ({ page }) => {
    await page.goto("/zh/marketing/posters");

    // Check Header
    await expect(page.locator("h1")).toContainText("海报中心");

    // Verify Invite Code Pill
    await expect(page.locator("text=GLOBAL-PRO-99").first()).toBeVisible({ timeout: 10000 });

    // Verify 4 Themes are selectable
    await expect(page.locator("text=Global Healthcare Creator Partner")).toBeVisible();
    await expect(page.locator("text=Direct Access to Premier AAA Hospitals")).toBeVisible();
    await expect(page.locator("text=Next-Gen CAR-T & Precision Oncology")).toBeVisible();
    await expect(page.locator("text=72-Hour Rapid Second Opinion")).toBeVisible();

    // Verify Format Selector
    await expect(page.locator("text=9:16 Story / Reels")).toBeVisible();
    await expect(page.locator("text=1:1 Social Feed")).toBeVisible();
    await expect(page.locator("text=3:4 Print & Flyer")).toBeVisible();

    // Switch Theme to CAR-T
    await page.click("text=Next-Gen CAR-T & Precision Oncology");

    // Switch Format to Square
    await page.click("text=1:1 Social Feed");

    // Verify Live Canvas/Image is rendered
    const posterImg = page.locator('img[alt="Personalized Medical Poster Preview"]');
    await expect(posterImg).toBeVisible({ timeout: 10000 });

    // Verify Download Button
    const downloadBtn = page.locator("button:has-text('下载超清 PNG 海报')");
    await expect(downloadBtn).toBeEnabled();
  });

  test("Global Prospecting Guide: switches tabs and copies scripts", async ({ page }) => {
    await page.goto("/zh/prospecting");

    // Check Header
    await expect(page.locator("h1")).toContainText("全球拓客作战地图与找人指南");

    // Tab 1: Verify current phase diseases
    await expect(page.locator("text=前沿细胞疗法 (CAR-T)")).toBeVisible();
    await expect(page.locator("text=微创瓣膜置换 (TAVI)")).toBeVisible();
    await expect(page.locator("text=72 小时国际专家远程第二诊疗意见")).toBeVisible();

    // Switch to Tab 2: Global Search Queries
    await page.click("text=2. 全球精准搜索词库");
    await expect(page.locator("text=#cancerwarrior")).toBeVisible();
    await expect(page.locator("text=медицинский туризм")).toBeVisible();
    await expect(page.locator("text=السياحة العلاجية")).toBeVisible();

    // Switch to Tab 3: Content Strategy
    await page.click("text=3. 各平台内容发布策略");
    await expect(page.locator("text=TikTok & Reels (15–30s)")).toBeVisible();
    await expect(page.locator("text=YouTube / Substack")).toBeVisible();

    // Switch to Tab 5: Email Discovery
    await page.click("text=5. 商业邮箱挖掘实战");
    await expect(page.locator("text=社媒 Bio 与聚合主页挖掘")).toBeVisible();
    await expect(page.locator("text=Google Dorking 精准搜索黑客语法")).toBeVisible();
  });

  test("Hospital Resources & Multi-Lingual Scripts: filters and expands battlecards", async ({ page }) => {
    await page.goto("/zh/resources");

    // Check Header
    await expect(page.locator("h1")).toContainText("权威医疗资源与多语话术中心");

    // Verify Specialties Catalog
    await expect(page.locator("text=BCMA & CD19 CAR-T Cell Therapy")).toBeVisible();
    await expect(page.locator("text=中国医学科学院阜外医院")).toBeVisible();

    // Test Search Filter
    const searchInput = page.locator('input[placeholder*="搜索专科"]');
    await searchInput.fill("CAR-T");
    await expect(page.locator("text=BCMA & CD19 CAR-T Cell Therapy")).toBeVisible();

    // Test Section 2: Battlecards
    await page.click("text=2. 国际异议抗辩宝典 (Battlecards)");
    const firstQuestion = page.locator("text=Why choose China instead of Mayo Clinic");
    await expect(firstQuestion).toBeVisible();

    // Expand First Card
    await firstQuestion.click();
    await expect(page.locator("text=Massive Clinical Surgical Volume")).toBeVisible();
    await expect(page.locator("button:has-text('复制标准应答')")).toBeVisible();

    // Test Section 3: Swipe Files
    await page.click("text=3. 全渠道多语话术工坊 (Swipe Files)");
    await expect(page.locator("text=English (LinkedIn InMail / Email)")).toBeVisible();
    await expect(page.locator("text=Español (Instagram / WhatsApp)")).toBeVisible();
    await expect(page.locator("text=Русский (Telegram / WhatsApp)")).toBeVisible();
    await expect(page.locator("text=العربية (WhatsApp / Instagram)")).toBeVisible();

    // Test Section 5: Compliance
    await page.click("text=5. 跨境医疗合规红线 (Compliance)");
    await expect(page.locator("text=严禁承诺 100% 疗效或治愈率")).toBeVisible();
    await expect(page.locator("text=严禁非医务人员擅自诊断或处方")).toBeVisible();
  });

  test("Dashboard: renders Growth Toolkit and navigates correctly", async ({ page }) => {
    await page.goto("/zh/dashboard");

    // Check Enablement Hub Card
    await expect(page.locator("text=全球拓客与赋能中心 (Growth & Enablement Hub)")).toBeVisible();
    await expect(page.locator("text=专属二维码海报中心")).toBeVisible();
    await expect(page.locator("text=全球拓客作战地图")).toBeVisible();
    await expect(page.locator("text=医疗资源与话术知识库")).toBeVisible();

    // Click into Posters from Dashboard
    await page.click("text=专属二维码海报中心");
    await expect(page).toHaveURL(/\/marketing\/posters/);
  });
});
