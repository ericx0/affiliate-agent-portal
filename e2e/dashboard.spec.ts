import { test, expect } from "@playwright/test";

test.describe("Agent dashboard", () => {
  test.skip("loads /dashboard for authenticated agent", async ({ page }) => {
    await page.goto("/en/dashboard");
    await expect(page.locator("h1")).toContainText(/agent|Agent/i);
  });

  test.skip("shows tier badge", async ({ page }) => {
    await page.goto("/en/dashboard");
    await expect(page.locator("text=/Bronze|Silver|Gold/")).toBeVisible();
  });
});
