import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { findAgentMatch } from "@/lib/auth-guards";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "email_required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "https://api.linkchinamed.com";
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJpc3MiOiAic3VwYWJhc2UiLCAicmVmIjogImxjbS1wcm9kIiwgInJvbGUiOiAic2VydmljZV9yb2xlIiwgImlhdCI6IDE3ODkyMDgwOTAsICJleHAiOiAyMTA0NTY4MDkwfQ.yssH-J-aeEqzPRxYhTIFF0VI9y8N2Ca0miqp5YjXIwQ";

    // 1. Check promoter role using internal RPC via service_role key
    const rpcRes = await fetch(`${supabaseUrl.replace(/\/+$/, "")}/rest/v1/rpc/affiliate_list_promoters`, {
      method: "POST",
      headers: {
        "apikey": serviceKey,
        "Authorization": `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ p_search: normalizedEmail }),
    });

    if (!rpcRes.ok) {
      const errText = await rpcRes.text();
      console.error("[send-code] affiliate_list_promoters error:", rpcRes.status, errText);
      return NextResponse.json({ error: "check_failed" }, { status: 500 });
    }

    const promoters = await rpcRes.json();
    const match = findAgentMatch(promoters, normalizedEmail);

    if (!match) {
      const candidate = Array.isArray(promoters)
        ? promoters.find((p: any) => p.email?.toLowerCase() === normalizedEmail)
        : null;
      return NextResponse.json({
        error: candidate?.role === "kol" ? "registered_as_kol" : "not_registered_agent",
      }, { status: 400 });
    }

    // 2. Trigger GoTrue OTP via official Supabase client to dispatch Lark email
    const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
    const { error: otpErr } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: { shouldCreateUser: false },
    });

    if (otpErr) {
      console.error("[send-code] GoTrue OTP error:", otpErr);
      return NextResponse.json({ error: otpErr.message || "Failed to send code" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[send-code] Unexpected error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
