import { test, expect, type Page } from "@playwright/test";

/**
 * Login pre-check E2E for the agent portal.
 *
 * The page calls the `check-email` Supabase Edge Function to classify
 * the submitted email (kol / agent / not registered) before issuing
 * an OTP. The production Edge Function verifies Turnstile with the
 * production secret, which rejects Cloudflare's `1x00000000...AA`
 * test site key — so the network call is intercepted here and the
 * response is mocked to exercise the three UI branches.
 *
 * The Agent happy path also reaches `supabase.auth.signInWithOtp`,
 * which validates Turnstile against the same production secret. The
 * `/auth/v1/otp` call is mocked with a 200 to let the page advance
 * to the OTP step (the input rendering is what we care about here).
 */

type CheckEmailResponse = {
  exists: boolean;
  role: "kol" | "agent" | null;
  registered: boolean;
};

async function mockCheckEmail(page: Page, body: CheckEmailResponse) {
  await page.route("**/functions/v1/check-email**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(body),
    });
  });
}

async function mockSignInWithOtp(page: Page) {
  await page.route("**/auth/v1/otp**", async (route) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: "{}" });
  });
}

test.describe("Agent login pre-check", () => {
  test("KOL email shows role-mismatch error, no OTP", async ({ page }) => {
    await mockCheckEmail(page, { exists: true, role: "kol", registered: true });
    await page.goto("/en/login");
    await page.fill('input[type="email"]', "kol-test@linkchinamed.com");
    await page.click('button[type="submit"]');
    await expect(page.locator("text=/registered as a KOL/i")).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.locator('input[inputmode="numeric"]')).toHaveCount(0);
  });

  test("unregistered email shows not-registered error, no OTP", async ({ page }) => {
    await mockCheckEmail(page, { exists: false, role: null, registered: false });
    await page.goto("/en/login");
    await page.fill(
      'input[type="email"]',
      `nobody-${Date.now()}@example.com`,
    );
    await page.click('button[type="submit"]');
    await expect(page.locator("text=/no agent account/i")).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.locator('input[inputmode="numeric"]')).toHaveCount(0);
  });

  test("Agent email advances to OTP step", async ({ page }) => {
    await mockCheckEmail(page, { exists: true, role: "agent", registered: true });
    await mockSignInWithOtp(page);
    await page.goto("/en/login");
    await page.fill('input[type="email"]', "agent-test@linkchinamed.com");
    await page.click('button[type="submit"]');
    await expect(page.locator('input[inputmode="numeric"]')).toBeVisible({
      timeout: 10_000,
    });
  });
});
