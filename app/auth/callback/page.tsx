"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "../../lib/supabaseClient";

const userStorageKey = "pmp-simulator-user-v1";

export default function AuthCallbackPage() {
  const [message, setMessage] = useState("Finishing sign in...");

  useEffect(() => {
    const finishSignIn = async () => {
      const supabase = getSupabaseBrowserClient();
      const nextPath =
        new URLSearchParams(window.location.search).get("next") ??
        "/dashboard";

      if (!supabase) {
        setMessage("Supabase is not configured yet.");
        return;
      }

      const { data, error } = await supabase.auth.getSession();
      const user = data.session?.user;

      if (error || !user) {
        setMessage("Could not complete sign in. Please try again.");
        return;
      }

      const profile = {
        id: user.id,
        name:
          user.user_metadata?.full_name ??
          user.user_metadata?.name ??
          user.email?.split("@")[0] ??
          "PMP Learner",
        email: user.email ?? "",
        avatar_url: user.user_metadata?.avatar_url ?? null,
        provider: user.app_metadata?.provider ?? "supabase",
      };

      window.localStorage.setItem(userStorageKey, JSON.stringify(profile));

      await supabase.from("profiles").upsert({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        avatar_url: profile.avatar_url,
        plan: "free",
        updated_at: new Date().toISOString(),
      });

      window.location.replace(nextPath.startsWith("/") ? nextPath : "/dashboard");
    };

    void finishSignIn();
  }, []);

  return (
    <main className="coming-page">
      <section className="coming-shell">
        <p className="intro-eyebrow">Google Sign In</p>
        <h1>{message}</h1>
        <p>This page connects your Google account to your PMP account.</p>
        <Link href="/login" className="intro-secondary-action">
          Back to Login
        </Link>
      </section>
    </main>
  );
}
