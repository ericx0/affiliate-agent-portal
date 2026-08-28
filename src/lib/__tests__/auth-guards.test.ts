import { describe, it, expect } from "vitest";
import { deriveLocaleFromRequest, findAgentMatch } from "@/lib/auth-guards";

function makeReq({ url = "http://x.com/", headers = {} as Record<string, string> } = {}) {
  return new Request(url, { headers }) as any;
}

describe("deriveLocaleFromRequest (AAP-P0-5)", () => {
  it("parses locale from URL path when present", () => {
    const req = makeReq({
      url: "http://x.com/ar/dashboard/settings/stripe",
      headers: { referer: "http://x.com/zh/login" },
    });
    expect(deriveLocaleFromRequest(req)).toBe("ar");
  });

  it("falls back to referer when path lacks locale", () => {
    const req = makeReq({
      url: "http://x.com/dashboard",
      headers: { referer: "http://x.com/ru/something" },
    });
    expect(deriveLocaleFromRequest(req)).toBe("ru");
  });

  it("falls back to 'zh' when nothing matches", () => {
    const req = makeReq({ url: "http://x.com/" });
    expect(deriveLocaleFromRequest(req)).toBe("zh");
  });

  it("rejects locales not in the supported set", () => {
    const req = makeReq({ url: "http://x.com/xx/dashboard" });
    expect(deriveLocaleFromRequest(req)).toBe("zh");
  });
});

describe("findAgentMatch (AAP-P0-4)", () => {
  const lookup = (list: any[], email: string) =>
    findAgentMatch(list, email);

  it("returns null for empty list", () => {
    expect(lookup([], "a@b.com")).toBeNull();
  });

  it("returns null when email doesn't match any promoter", () => {
    expect(lookup([{ email: "x@y.com" }], "a@b.com")).toBeNull();
  });

  it("returns null for promoter with status !== 'active'", () => {
    expect(
      lookup(
        [{ email: "a@b.com", role: "agent", status: "pending" }],
        "a@b.com"
      )
    ).toBeNull();
  });

  it("returns null for promoter with role !== 'agent'", () => {
    expect(
      lookup(
        [
          { email: "a@b.com", role: "kol", status: "active" },
          { email: "a@b.com", role: null, status: "active" },
          { email: "a@b.com", role: undefined, status: "active" },
          { email: "a@b.com", role: "pending", status: "active" },
          { email: "a@b.com", role: "admin", status: "active" },
        ],
        "a@b.com"
      )
    ).toBeNull();
  });

  it("returns the match when role === 'agent' and status === 'active'", () => {
    const m = lookup(
      [{ email: "a@b.com", role: "agent", status: "active" }],
      "a@b.com"
    );
    expect(m).not.toBeNull();
    expect(m!.role).toBe("agent");
  });
});
