import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();
    if (!email || !code) {
      return NextResponse.json({ error: "email_and_code_required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedCode = code.trim();
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "https://api.linkchinamed.com";
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJpc3MiOiAic3VwYWJhc2UiLCAicmVmIjogImxjbS1wcm9kIiwgInJvbGUiOiAic2VydmljZV9yb2xlIiwgImlhdCI6IDE3ODkyMDgwOTAsICJleHAiOiAyMTA0NTY4MDkwfQ.yssH-J-aeEqzPRxYhTIFF0VI9y8N2Ca0miqp5YjXIwQ";

    // Use official Supabase client verifyOtp to validate code
    const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
    const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
      email: normalizedEmail,
      token: normalizedCode,
      type: "email",
    });

    if (verifyError || !verifyData?.session) {
      console.error("[verify-code] verifyOtp error:", verifyError);
      return NextResponse.json({ error: verifyError?.message || "Invalid or expired code" }, { status: 400 });
    }

    const response = NextResponse.json({ success: true, session: verifyData.session });

    // Explicitly set the sb-*-auth-token cookie compatible with @supabase/ssr
    const cookieHost = new URL(supabaseUrl).hostname.split(".")[0];
    const cookieName = `sb-${cookieHost}-auth-token`;
    const sessionString = JSON.stringify(verifyData.session);
    const cookieValue = `base64-${Buffer.from(sessionString).toString("base64url")}`;

    response.cookies.set(cookieName, cookieValue, {
      path: "/",
      sameSite: "lax",
      httpOnly: false,
      maxAge: 34560000,
    });

    return response;
  } catch (err: any) {
    console.error("[verify-code] Unexpected error:", err);
    return NextResponse.json({ error: err.message || "server_error" }, { status: 500 });
  }
}
