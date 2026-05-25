"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "../../lib/supabaseClient";

const userStorageKey = "pmp-simulator-user-v1";

export default function AuthCallbackPage() {
  const [message, setMessage] = useState("Finishing sign in...");
  const [errorDetail, setErrorDetail] = useState("");

  useEffect(() => {
    // Create a fresh supabase client WITHOUT detectSessionInUrl to avoid
    // a race where the client's internal detection tries to exchange the
    // code at the same time as our manual exchange below.
    const supabase = getSupabaseBrowserClient(true);
    const params = new URLSearchParams(window.location.search);

    // Also check URL hash for code (some OAuth flows put it there)
    const hashParams = new URLSearchParams(
      window.location.hash.replace("#", "?"),
    );

    const nextPath = params.get("next") || hashParams.get("next") || "/";

    if (!supabase || !supabase.auth) {
      setMessage("Supabase is not configured.");
      setErrorDetail(
        "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to continue.",
      );
      return;
    }

    const finishSignIn = async () => {
      try {
        // Check for code in search params or hash
        const code = params.get("code") || hashParams.get("code");

        if (code) {
          const { error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            // Check if this looks like a Vercel Auth interceptor issue
            if (
              window.location.search.includes("protection") ||
              window.location.search.includes("vercel")
            ) {
              setMessage("Vercel Authentication is blocking sign in.");
              setErrorDetail(
                "Go to your Vercel dashboard → Project Settings → Protection → Authentication, and either disable Vercel Authentication or add /auth/callback to the bypass list. Then try signing in again.",
              );
              return;
            }

            setMessage("Could not complete sign in. Please try again.");
            setErrorDetail(
              exchangeError.message ||
                "The authentication code could not be exchanged. This may happen if the link has expired or if Vercel Authentication is enabled.",
            );
            return;
          }

          // Clean the URL so refreshing doesn't try to reuse the expired code
          window.history.replaceState(null, "", "/auth/callback");
        }

        // Get the user session
        const { data, error: getUserError } = await supabase.auth.getUser();
        const user = data?.user;

        if (getUserError || !user) {
          setMessage("Could not complete sign in. Please try again.");
          setErrorDetail(
            getUserError?.message ||
              "No user session found. Try signing in again.",
          );
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

        // Attempt to upsert profile — don't block sign-in if this fails
        try {
          await supabase.from("profiles").upsert(
            {
              id: profile.id,
              name: profile.name,
              email: profile.email,
              avatar_url: profile.avatar_url,
              plan: "free",
              updated_at: new Date().toISOString(),
            },
            { onConflict: "id" },
          );
        } catch {
          // Profile upsert is non-critical — proceed with sign-in anyway
        }

        // Redirect to the destination
        window.location.replace(
          nextPath.startsWith("/") ? nextPath : "/",
        );
      } catch (err) {
        setMessage("Something went wrong during sign in.");
        setErrorDetail(
          err instanceof Error
            ? err.message
            : "An unexpected error occurred. Please try again.",
        );
      }
    };

    finishSignIn();
  }, []);

  return (
    <main className="coming-page">
      <section className="coming-shell">
        <p className="intro-eyebrow">Google Sign In</p>
        <h1>{message}</h1>
        {errorDetail && <p className="auth-error-note">{errorDetail}</p>}
        {!errorDetail && (
          <p>This page connects your Google account to your PMP account.</p>
        )}
        <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
          <Link href="/login" className="intro-secondary-action">
            Back to Login
          </Link>
          {errorDetail && (
            <Link href="/" className="intro-primary-action">
              Go Home
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
