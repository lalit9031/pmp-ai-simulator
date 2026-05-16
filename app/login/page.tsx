"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { FaEnvelope, FaGoogle } from "react-icons/fa";

const userStorageKey = "pmp-simulator-user-v1";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [savedUser, setSavedUser] = useState<string | null>(null);

  useEffect(() => {
    const user = window.localStorage.getItem(userStorageKey);
    setSavedUser(user);
  }, []);

  const saveUser = (nextUser: { name: string; email: string; provider: string }) => {
    window.localStorage.setItem(userStorageKey, JSON.stringify(nextUser));
    setSavedUser(JSON.stringify(nextUser));
    router.push("/dashboard");
  };

  const handleEmailLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveUser({
      name: name.trim() || "PMP Learner",
      email: email.trim(),
      provider: "email",
    });
  };

  const handleGoogleDemo = () => {
    saveUser({
      name: "Google User",
      email: "google.user@example.com",
      provider: "google-demo",
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
              Use Google sign-in or email access to continue your PMP learning
              path, practice history, results, and paid live test plan.
            </p>

            <div className="auth-benefits">
              <span>Saved results</span>
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

            <button
              type="button"
              onClick={handleGoogleDemo}
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
              Google and payment buttons are wired as a front-end prototype.
              Connect OAuth and checkout providers when backend services are
              ready.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
