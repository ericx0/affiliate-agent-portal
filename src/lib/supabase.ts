import { createBrowserClient } from "@supabase/ssr";

// Phase 1.2 / Full_Stack_Optimization_Plan_2026_08_27.md:
// Safe init with fallback — prevents CI / typecheck-only runs from crashing
// when env vars are absent. Runtime paths in Vercel + .env.local always
// provide real values; the fallback only kicks in during build/typecheck.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

if (!url || !anonKey) {
  // ponytail: build-time guard. Runtime requests will fail auth (same
  // surface as before), but module load no longer throws — tests + CI
  // typecheck complete without env files.
  console.warn(
    "[supabase] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing; client will fail at request time",
  );
}

export const supabase = createBrowserClient(
  url || "https://placeholder.supabase.co",
  anonKey || "placeholder-anon-key",
);