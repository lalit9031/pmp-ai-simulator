"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { FaEnvelope, FaGoogle } from "react-icons/fa";
import {
  getSupabaseBrowserClient,
  isSupabaseConfigured,
} from "../lib/supabaseClient";

const userStorageKey = "pmp-simulator-user-v1";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [savedUser, setSavedUser] = useState<string | null>(null);
  const [authError, setAuthError] = useState("");
  const [googleNotice, setGoogleNotice] = useState("");

  useEffect(() => {
    const loadHandle = window.setTimeout(() => {
      const user = window.localStorage.getItem(userStorageKey);
      const error =
        new URLSearchParams(window.location.search).get("authError") ?? "";
      const notice =
        new URLSearchParams(window.location.search).get("googleNotice") ?? "";

      setSavedUser(user);
      setAuthError(error);
      setGoogleNotice(notice);
    }, 0);

    return () => window.clearTimeout(loadHandle);
  }, []);

  const saveUser = (nextUser: { name: string; email: string; provider: string }) => {
    window.localStorage.setItem(userStorageKey, JSON.stringify(nextUser));
    setSavedUser(JSON.stringify(nextUser));

    const nextPath =
      new URLSearchParams(window.location.search).get("next") ??
      "/exam?plan=free&fresh=1";
    router.push(nextPath.startsWith("/") ? nextPath : "/exam?plan=free&fresh=1");
  };

  const handleEmailLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const supabase = getSupabaseBrowserClient();

    if (supabase) {
      const nextPath =
        new URLSearchParams(window.location.search).get("next") ??
        "/dashboard";

      window.localStorage.setItem("pmp-pending-login-name", name.trim());
      void supabase.auth
        .signInWithOtp({
          email: email.trim(),
          options: {
            data: {
              full_name: name.trim() || "PMP Learner",
            },
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
              nextPath,
            )}`,
            shouldCreateUser: true,
          },
        })
        .then(({ error }) => {
          if (error) {
            setAuthError(error.message);
            return;
          }

          setGoogleNotice("Check your email for the sign-in link.");
        });
      return;
    }

    saveUser({
      name: name.trim() || "PMP Learner",
      email: email.trim(),
      provider: "email",
    });
  };

  const handleGoogleLogin = () => {
    const supabase = getSupabaseBrowserClient();
    const nextPath =
      new URLSearchParams(window.location.search).get("next") ?? "/dashboard";

    if (!supabase || !isSupabaseConfigured()) {
      setAuthError(
        "Supabase is not connected yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, then enable Google in Supabase Auth.",
      );
      return;
    }

    void supabase.auth
      .signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
            nextPath,
          )}`,
          queryParams: {
            prompt: "select_account",
          },
        },
      })
      .then(({ error }) => {
        if (error) {
          setAuthError(error.message);
        }
      });
  };

  return (
    <main className="auth-page">
      <section className="auth-shell">
        <Link href="/" className="learn-back-link">
          PMP Simulator
        </Link>

        <div className="auth-grid">
          <div className="auth-copy">
            <p className="intro-eyebrow">Member Access</p>
            <h1>Login to save progress and unlock paid practice.</h1>
            <p>
              Sign in or sign up to start the free PMP plan, keep exam
              progress, review results, and upgrade when you want the live
              simulator.
            </p>

            <div className="auth-benefits">
              <span>Saved results</span>
              <span>4 free PMP topics</span>
              <span>Learning recommendations</span>
              <span>Paid AI PMP tests</span>
              <span>Expanded topic updates</span>
            </div>
          </div>

          <div className="auth-card">
            {savedUser && (
              <div className="auth-signed-note">
                You are signed in on this browser.
              </div>
            )}

            {authError && <div className="auth-error-note">{authError}</div>}
            {googleNotice && (
              <div className="auth-google-note">{googleNotice}</div>
            )}

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="auth-google-button"
            >
              <FaGoogle aria-hidden="true" />
              Continue with Google
            </button>

            <div className="auth-divider">or</div>

            <form onSubmit={handleEmailLogin} className="auth-form">
              <label>
                Name
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                />
              </label>

              <label>
                Email
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                />
              </label>

              <button type="submit" className="intro-primary-action">
                <FaEnvelope aria-hidden="true" />
                Continue with email
              </button>
            </form>

            <p className="auth-small">
              Google sign-in uses Supabase Auth and stores the user profile in
              your database after sign-in.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
