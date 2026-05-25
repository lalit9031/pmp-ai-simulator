"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FaCheck, FaLockOpen } from "react-icons/fa";
import { getPricingInfo, isIndia } from "../lib/pricing";
import { getSupabaseBrowserClient } from "../lib/supabaseClient";
import { isAdminEmail } from "../lib/admin";

const planStorageKey = "pmp-simulator-plan-v1";
const paidUsersStorageKey = "pmp-simulator-paid-users-v1";
const userStorageKey = "pmp-simulator-user-v1";

const paidFeatures = [
  "Live PMP practice test with fresh AI project management questions",
  "185-question, 240-minute exam format",
  "All PMP learning topics beyond the four free core topics",
  "Ethical AI, AI-assisted decision making, ESG, and sustainability topics",
  "Business value, strategy alignment, and benefits realization coverage",
  "New learning topics added as the PMP exam changes",
];

function isPaidPlan(plan: string | null) {
  return plan === "founder" || plan === "annual" || plan === "global";
}

export default function PricingPage() {
  const router = useRouter();
  const [paidUsers, setPaidUsers] = useState(0);
  const [activePlan, setActivePlan] = useState<string | null>(null);
  const [userInIndia, setUserInIndia] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchServerCount = useCallback(async () => {
    try {
      const response = await fetch("/api/signup-count");
      const data = await response.json();

      if (data.source === "database" && typeof data.count === "number") {
        setPaidUsers(data.count);
        // Sync to localStorage for offline/fallback use
        window.localStorage.setItem(
          paidUsersStorageKey,
          String(data.count),
        );
      }
    } catch {
      // Fall back to localStorage if the API call fails
      const localCount = Number(
        window.localStorage.getItem(paidUsersStorageKey) ?? 0,
      );
      setPaidUsers(localCount);
    }
  }, []);

  useEffect(() => {
    const loadHandle = window.setTimeout(() => {
      // Read localStorage first for instant display, then update from server
      const localCount = Number(
        window.localStorage.getItem(paidUsersStorageKey) ?? 0,
      );
      setPaidUsers(localCount);
      setActivePlan(window.localStorage.getItem(planStorageKey));
      setUserInIndia(isIndia());
      setLoading(false);

      // Check if current user is admin
      const raw = window.localStorage.getItem(userStorageKey);
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as { email?: string };
          setIsAdmin(isAdminEmail(parsed.email));
        } catch {
          /* ignore */
        }
      }

      // Fetch server count asynchronously (will update when ready)
      void fetchServerCount();
    }, 0);

    return () => window.clearTimeout(loadHandle);
  }, [fetchServerCount]);

  const founderAvailable = paidUsers < 100;
  const pricing = getPricingInfo(founderAvailable, userInIndia);
  const currentPlan = founderAvailable ? "founder" : "annual";

  const handleCheckout = async (plan: string) => {
    // Admin users: grant access directly, skip payment
    if (isAdmin) {
      window.localStorage.setItem(planStorageKey, plan);

      // Optimistically update local state
      const updatedCount = Math.min(100, paidUsers + 1);
      setPaidUsers(updatedCount);
      window.localStorage.setItem(
        paidUsersStorageKey,
        String(updatedCount),
      );

      // Submit purchase to server
      const supabase = getSupabaseBrowserClient();
      let userId: string | null = null;
      let email: string | null = null;

      if (supabase) {
        const { data } = await supabase.auth.getUser();
        userId = data?.user?.id ?? null;
        email = data?.user?.email ?? null;
      }

      fetch("/api/submit-purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, userId, email }),
      }).catch(() => {
        /* non-blocking */
      });

      setActivePlan(plan);
      window.localStorage.removeItem("pmp-simulator-progress-v1");
      router.push("/exam?plan=live&fresh=1");
      return;
    }

    // Non-admin users: redirect to checkout page with payment options
    router.push(`/checkout?plan=${encodeURIComponent(plan)}`);
  };

  if (loading) {
    return (
      <main className="pricing-page">
        <section className="pricing-shell">
          <div className="pricing-nav">
            <Link href="/learn" className="learn-back-link">
              &larr; Learning Hub
            </Link>
          </div>
          <div className="pricing-header">
            <p className="intro-eyebrow">Paid Plan</p>
            <h1>Loading pricing...</h1>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="pricing-page">
      <section className="pricing-shell">
        <div className="pricing-nav">
          <Link href="/learn" className="learn-back-link">
            &larr; Learning Hub
          </Link>
        </div>

        <div className="pricing-header">
          <p className="intro-eyebrow">Paid Plan</p>
          <h1>Unlock live PMP practice with AI questions.</h1>
          <p>
            Free users practice from a fixed 1000-question bank. Paid users get
            live AI project management questions and expanded learning topics
            for one year.
          </p>
        </div>

        <div className="pricing-grid">
          <section className="pricing-card">
            <span className="pricing-kicker">Free</span>
            <h2>Free Practice</h2>
            <div className="pricing-price">Rs. 0</div>
            <p>
              Sign in and access four core PMP topics: Agile, Risk,
              Stakeholder, and Hybrid. Read, test, and practice before
              upgrading.
            </p>
            <Link
              href="/exam?plan=free&fresh=1"
              className="intro-secondary-action"
            >
              Start free practice
            </Link>
          </section>

          <section className="pricing-card pricing-card-featured">
            <span className="pricing-kicker">
              {founderAvailable ? "First 100 users" : "Annual access"}
            </span>
            <h2>Live PMP Practice</h2>
            <div className="pricing-price">
              {userInIndia
                ? `Rs. ${pricing.price}`
                : `$${pricing.price.toFixed(2)}`}
            </div>
            <p>
              {founderAvailable
                ? `${100 - paidUsers} founder ${100 - paidUsers === 1 ? "seat" : "seats"} left at ${pricing.label}.`
                : `Founder pricing is complete. Annual access is ${pricing.label}.`}
            </p>

            <button
              type="button"
              onClick={() => handleCheckout(currentPlan)}
              className="intro-primary-action pricing-button"
            >
              <FaLockOpen aria-hidden="true" />
              {isPaidPlan(activePlan)
                ? "Plan active"
                : `Pay ${pricing.label} & unlock`}
            </button>

            {userInIndia && (
              <p className="pricing-global-note">
                Outside India?{" "}
                <button
                  type="button"
                  onClick={() => handleCheckout("global")}
                  className="pricing-text-link"
                >
                  Pay {getPricingInfo(founderAvailable, false).label}
                </button>
              </p>
            )}

            {!userInIndia && (
              <p className="pricing-global-note">
                In India?{" "}
                <button
                  type="button"
                  onClick={() => handleCheckout("global")}
                  className="pricing-text-link"
                >
                  Pay {getPricingInfo(founderAvailable, true).label}
                </button>
              </p>
            )}

            <ul className="pricing-feature-list">
              {paidFeatures.map((feature) => (
                <li key={feature}>
                  <FaCheck aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </section>
    </main>
  );
}
