import { test, expect } from "@playwright/test";

test.describe("Agent Stripe settings", () => {
  test.skip("loads Stripe connect page", async ({ page }) => {
    await page.goto("/en/dashboard/settings/stripe");
    await expect(page.locator("h1")).toContainText(/Stripe/i);
  });
});
