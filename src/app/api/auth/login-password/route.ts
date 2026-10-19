import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "https://api.linkchinamed.com";
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJpc3MiOiAic3VwYWJhc2UiLCAicmVmIjogImxjbS1wcm9kIiwgInJvbGUiOiAic2VydmljZV9yb2xlIiwgImlhdCI6IDE3ODkyMDgwOTAsICJleHAiOiAyMTA0NTY4MDkwfQ.yssH-J-aeEqzPRxYhTIFF0VI9y8N2Ca0miqp5YjXIwQ";

    const res = await fetch(`${supabaseUrl.replace(/\/+$/, "")}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: {
        "apikey": serviceKey,
        "Authorization": `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: normalizedEmail,
        password: password,
      }),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({ msg: "Invalid login credentials" }));
      return NextResponse.json({ error: errJson.msg || errJson.error_description || "Invalid email or password" }, { status: 400 });
    }

    const tokenData = await res.json();
    const response = NextResponse.json({ success: true, session: tokenData });

    // Explicitly set the sb-*-auth-token cookie compatible with @supabase/ssr
    const cookieHost = new URL(supabaseUrl).hostname.split(".")[0];
    const cookieName = `sb-${cookieHost}-auth-token`;
    const sessionString = JSON.stringify(tokenData);
    const cookieValue = `base64-${Buffer.from(sessionString).toString("base64url")}`;

    response.cookies.set(cookieName, cookieValue, {
      path: "/",
      sameSite: "lax",
      httpOnly: false,
      maxAge: 34560000,
    });

    return response;
  } catch (err: any) {
    console.error("[login-password] Unexpected error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
