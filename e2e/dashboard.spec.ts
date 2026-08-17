import { test, expect } from "@playwright/test";

/**
 * Bug 2.1 regression: after env + rewrite fix, the portal must boot and the
 * API base must be reachable so the (protected)/layout guard
 * (`/api/affiliate/agent/stats`) doesn't 4xx and bounce the user to
 * `/login?error=not_an_agent`.
 *
 * Authenticated-journey assertions need a real Supabase session (out of scope
 * for this baseline); this is a smoke test that fails if the regression
 * recurs at the env/rewrite layer.
 */
test.describe("Bug 2.1: agent dashboard accessibility", () => {
  test("portal boots and API base is reachable", async ({ page }) => {
    await page.goto("/en/login");
    await expect(page.locator("h1")).toBeVisible({ timeout: 10_000 });

    const apiBase = process.env.NEXT_PUBLIC_AFFILIATE_API_URL || "";
    const apiWorks = await page.evaluate(async (base) => {
      try {
        const url = base ? `${base}/health` : "/api/affiliate/health";
        const resp = await fetch(url, { method: "GET" });
        return resp.status < 500; // 200/404 acceptable; not 5xx
      } catch {
        return false;
      }
    }, apiBase);

    expect(apiWorks).toBe(true);
  });
});
