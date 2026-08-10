import { test, expect } from "@playwright/test";

test.describe("Agent KOLs page", () => {
  test.skip("lists KOLs owned by this agent", async ({ page }) => {
    await page.goto("/en/kols");
    await expect(page.locator("table")).toBeVisible();
  });
});
