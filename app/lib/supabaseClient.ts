import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

export function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && getSupabasePublicKey());
}

function getSupabasePublicKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

const defaultAuthOptions = {
  autoRefreshToken: true,
  detectSessionInUrl: true,
  persistSession: true,
};

export function getSupabaseBrowserClient(skipSessionDetection?: boolean) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublicKey = getSupabasePublicKey();

  if (!supabaseUrl || !supabasePublicKey) {
    return null;
  }

  // When skipSessionDetection is true (used from auth callback page),
  // create a fresh client that won't race to exchange the code against
  // our manual exchangeCodeForSession call.
  if (skipSessionDetection) {
    return createBrowserClient(supabaseUrl, supabasePublicKey, {
      auth: {
        ...defaultAuthOptions,
        detectSessionInUrl: false,
      },
    });
  }

  browserClient ??= createBrowserClient(supabaseUrl, supabasePublicKey, {
    auth: defaultAuthOptions,
  });

  return browserClient;
}
