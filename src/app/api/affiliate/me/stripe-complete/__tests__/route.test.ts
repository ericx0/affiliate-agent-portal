import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock next/headers cookies
vi.mock("next/headers", () => ({
  cookies: () => ({
    getAll: () => [],
    set: vi.fn(),
  }),
}));

// Mock @supabase/ssr
const mockSupabaseState = {
  user: null as null | { email: string },
  rpcResponses: {} as Record<string, unknown>,
  updateResponses: {} as Record<string, unknown>,
};

vi.mock("@supabase/ssr", () => ({
  createServerClient: () => ({
    auth: {
      getUser: vi.fn(async () => ({ data: { user: mockSupabaseState.user } })),
    },
    rpc: vi.fn(async (fn: string, _args: unknown) => {
      const fnKey = fn as keyof typeof mockSupabaseState.rpcResponses;
      if (fnKey in mockSupabaseState.rpcResponses) {
        return { data: mockSupabaseState.rpcResponses[fnKey], error: null };
      }
      return { data: null, error: null };
    }),
    from: vi.fn(() => ({
      update: vi.fn((payload: unknown) => ({
        eq: vi.fn(() => {
          (mockSupabaseState as any).__lastUpdatePayload = payload;
          if ((mockSupabaseState as any).__updateShouldFail) {
            return Promise.resolve({
              data: null,
              error: { message: "RLS rejected" },
            });
          }
          return Promise.resolve({ data: [{ id: "ok" }], error: null });
        }),
      })),
    })),
  }),
}));

const { POST } = await import("@/app/api/affiliate/me/stripe-complete/route");

function makeReq(body?: Record<string, unknown>) {
  return new Request("http://localhost/api/affiliate/me/stripe-complete", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

beforeEach(() => {
  mockSupabaseState.user = null;
  mockSupabaseState.rpcResponses = {};
  mockSupabaseState.updateResponses = {};
  (mockSupabaseState as any).__updateShouldFail = false;
  (mockSupabaseState as any).__lastUpdatePayload = null;
});

describe("stripe-complete route handler (AAP-P0-2 + AAP-P0-6)", () => {
  it("returns 401 when no authenticated user", async () => {
    mockSupabaseState.user = null;
    const res = await POST(makeReq({ accountId: "acct_x" }) as any);
    expect(res.status).toBe(401);
  });

  it("returns 422 for missing accountId (Zod validation)", async () => {
    mockSupabaseState.user = { email: "agent@example.com" };
    const res = await POST(makeReq({}) as any);
    expect(res.status).toBe(422);
  });

  it("returns 422 for malformed accountId", async () => {
    mockSupabaseState.user = { email: "agent@example.com" };
    const res = await POST(makeReq({ accountId: "" }) as any);
    expect(res.status).toBe(422);
  });

  it("returns 403 when body.accountId !== promoter.stripe_account_id", async () => {
    mockSupabaseState.user = { email: "agent@example.com" };
    mockSupabaseState.rpcResponses.affiliate_list_promoters = [
      {
        id: "promoter_1",
        email: "agent@example.com",
        role: "agent",
        status: "active",
        stripe_account_id: "acct_owner",
      },
    ];
    const res = await POST(makeReq({ accountId: "acct_someone_else" }) as any);
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error.code).toBe("ACCOUNT_ID_MISMATCH");
  });

  it("returns 403 when promoter role is not 'agent'", async () => {
    mockSupabaseState.user = { email: "kol@example.com" };
    mockSupabaseState.rpcResponses.affiliate_list_promoters = [
      {
        id: "promoter_2",
        email: "kol@example.com",
        role: "kol",
        status: "active",
        stripe_account_id: "acct_kol",
      },
    ];
    const res = await POST(makeReq({ accountId: "acct_kol" }) as any);
    expect(res.status).toBe(403);
  });

  it("returns 404 when promoter not found", async () => {
    mockSupabaseState.user = { email: "ghost@example.com" };
    mockSupabaseState.rpcResponses.affiliate_list_promoters = [];
    const res = await POST(makeReq({ accountId: "acct_x" }) as any);
    expect(res.status).toBe(404);
  });

  it("returns 500 (NOT silent success) when DB update fails (AAP-P0-6)", async () => {
    mockSupabaseState.user = { email: "agent@example.com" };
    mockSupabaseState.rpcResponses.affiliate_list_promoters = [
      {
        id: "promoter_3",
        email: "agent@example.com",
        role: "agent",
        status: "active",
        stripe_account_id: "acct_owner",
      },
    ];
    (mockSupabaseState as any).__updateShouldFail = true;
    const res = await POST(makeReq({ accountId: "acct_owner" }) as any);
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error.code).toBe("UPDATE_FAILED");
  });

  it("returns 200 on happy path with role='agent' and matching accountId", async () => {
    mockSupabaseState.user = { email: "agent@example.com" };
    mockSupabaseState.rpcResponses.affiliate_list_promoters = [
      {
        id: "promoter_ok",
        email: "agent@example.com",
        role: "agent",
        status: "active",
        stripe_account_id: "acct_match",
      },
    ];
    const res = await POST(makeReq({ accountId: "acct_match" }) as any);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.completed).toBe(true);
  });
});
