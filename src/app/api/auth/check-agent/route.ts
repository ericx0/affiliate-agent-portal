import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

function decodeJwtPayload(token: string): any {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(b64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "https://api.linkchinamed.com";
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJpc3MiOiAic3VwYWJhc2UiLCAicmVmIjogImxjbS1wcm9kIiwgInJvbGUiOiAic2VydmljZV9yb2xlIiwgImlhdCI6IDE3ODkyMDgwOTAsICJleHAiOiAyMTA0NTY4MDkwfQ.yssH-J-aeEqzPRxYhTIFF0VI9y8N2Ca0miqp5YjXIwQ";

    let email: string | undefined;

    // 1. Try resolving user from cookies
    try {
      const cookieStore = cookies();
      const allCookies = cookieStore.getAll();
      for (const c of allCookies) {
        if (c.name.includes("auth-token")) {
          let raw = c.value;
          if (raw.startsWith("base64-")) {
            const b64 = raw.substring(7).replace(/-/g, "+").replace(/_/g, "/");
            raw = decodeURIComponent(
              atob(b64)
                .split("")
                .map((char) => "%" + ("00" + char.charCodeAt(0).toString(16)).slice(-2))
                .join("")
            );
          }
          const session = JSON.parse(raw);
          const token = session.access_token || (Array.isArray(session) ? session[0] : null);
          if (token && typeof token === "string") {
            const payload = decodeJwtPayload(token);
            const now = Math.floor(Date.now() / 1000);
            if (payload && payload.exp && payload.exp > now && payload.email) {
              email = payload.email.toLowerCase();
              break;
            }
          }
        }
      }
    } catch {}

    // 2. Try resolving user from Authorization header
    if (!email) {
      const authHeader = req.headers.get("Authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.substring(7);
        const payload = decodeJwtPayload(token);
        const now = Math.floor(Date.now() / 1000);
        if (payload && payload.exp && payload.exp > now && payload.email) {
          email = payload.email.toLowerCase();
        }
      }
    }

    if (!email) {
      return NextResponse.json({ authenticated: false, isAgent: false, error: "not_authenticated" }, { status: 401 });
    }

    // 3. Query promoter using service_role to bypass anon/authenticated RPC permission locks
    const rpcRes = await fetch(`${supabaseUrl.replace(/\/+$/, "")}/rest/v1/rpc/affiliate_list_promoters`, {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        p_search: email,
        p_role: "agent",
      }),
    });

    if (!rpcRes.ok) {
      console.error("[check-agent] RPC error:", await rpcRes.text());
      return NextResponse.json({ authenticated: true, isAgent: false, error: "rpc_lookup_failed" }, { status: 500 });
    }

    const list = await rpcRes.json();
    const promoter = Array.isArray(list)
      ? list.find((p: any) => p.email?.toLowerCase() === email)
      : null;

    if (!promoter || promoter.role !== "agent" || promoter.status !== "active") {
      return NextResponse.json({ authenticated: true, isAgent: false, error: "not_an_active_agent" }, { status: 403 });
    }

    return NextResponse.json({
      authenticated: true,
      isAgent: true,
      email,
      promoter,
    });
  } catch (err: any) {
    console.error("[check-agent] Unexpected error:", err);
    return NextResponse.json({ authenticated: false, isAgent: false, error: err.message }, { status: 500 });
  }
}
