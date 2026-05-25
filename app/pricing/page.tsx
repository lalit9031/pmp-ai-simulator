"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { FaCheck, FaLockOpen } from "react-icons/fa";
import { getPricingInfo, isIndia } from "../lib/pricing";
import { getSupabaseBrowserClient } from "../lib/supabaseClient";
import { isAdminEmail } from "../lib/admin";
import { certifications, type CertSlug } from "../certifications";

const planStorageKey = "pmp-simulator-plan-v1";
const paidUsersStorageKey = "pmp-simulator-paid-users-v1";
const userStorageKey = "pmp-simulator-user-v1";

const paidFeatures = [
  "Live AI-powered practice tests across 5 certifications",
  "Timed exam simulations with real certification formats",
  "All learning topics beyond free core topics",
  "Six Sigma Green/Black Belt learning modules",
  "Personalized weak-area tracking and recommendations",
  "New topics added as certification exams change",
];

function isPaidPlan(plan: string | null) {
  return plan === "founder" || plan === "annual" || plan === "global";
}

function PricingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const certParam = searchParams.get("cert") as CertSlug | null;

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
        window.localStorage.setItem(paidUsersStorageKey, String(data.count));
      }
    } catch {
      const localCount = Number(window.localStorage.getItem(paidUsersStorageKey) ?? 0);
      setPaidUsers(localCount);
    }
  }, []);

  useEffect(() => {
    const loadHandle = window.setTimeout(() => {
      const localCount = Number(window.localStorage.getItem(paidUsersStorageKey) ?? 0);
      setPaidUsers(localCount);
      setActivePlan(window.localStorage.getItem(planStorageKey));
      setUserInIndia(isIndia());
      setLoading(false);

      const raw = window.localStorage.getItem(userStorageKey);
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as { email?: string };
          setIsAdmin(isAdminEmail(parsed.email));
        } catch {
          /* ignore */
        }
      }

      void fetchServerCount();
    }, 0);
    return () => window.clearTimeout(loadHandle);
  }, [fetchServerCount]);

  const founderAvailable = paidUsers < 100;
  const pricing = getPricingInfo(founderAvailable, userInIndia);
  const currentPlan = founderAvailable ? "founder" : "annual";

  const handleCheckout = async (plan: string) => {
    if (isAdmin) {
      window.localStorage.setItem(planStorageKey, plan);
      const updatedCount = Math.min(100, paidUsers + 1);
      setPaidUsers(updatedCount);
      window.localStorage.setItem(paidUsersStorageKey, String(updatedCount));

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
      }).catch(() => {});

      setActivePlan(plan);
      window.localStorage.removeItem("pmp-simulator-pmp-progress-v1");
      router.push("/exam?plan=live&fresh=1");
      return;
    }

    router.push(`/checkout?plan=${encodeURIComponent(plan)}`);
  };

  // All exam certifications
  const examCerts = Object.values(certifications).filter((c) => c.type === "exam");

  if (loading) {
    return (
      <main className="pricing-page">
        <section className="pricing-shell">
          <div className="pricing-nav">
            <Link href="/learn" className="learn-back-link">&larr; Learning Hub</Link>
          </div>
          <div className="pricing-header">
            <p className="intro-eyebrow">Pricing</p>
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
          <Link href="/learn" className="learn-back-link">&larr; Learning Hub</Link>
        </div>

        <div className="pricing-header">
          <p className="intro-eyebrow">Pricing</p>
          <h1>Unlock all certifications with AI questions.</h1>
          <p>
            Free users get core practice across all certifications. Paid users
            unlock live AI questions, full topic libraries, and timed exam
            simulations for one year.
          </p>
        </div>

        {/* Certification badges */}
        <div className="pricing-cert-badges">
          {examCerts.map((cert) => (
            <div key={cert.slug} className="pricing-cert-badge" style={{ borderLeftColor: cert.color }}>
              <span>{cert.icon}</span>
              <div>
                <strong>{cert.shortName}</strong>
                <span>{cert.totalQuestions} Q · {cert.timeLimitMinutes} min</span>
              </div>
            </div>
          ))}
          <div className="pricing-cert-badge pricing-cert-badge-learning" style={{ borderLeftColor: "#ca8a04" }}>
            <span>📊</span>
            <div>
              <strong>Six Sigma</strong>
              <span>Learning only</span>
            </div>
          </div>
        </div>

        <div className="pricing-grid">
          <section className="pricing-card">
            <span className="pricing-kicker">Free</span>
            <h2>Free Practice</h2>
            <div className="pricing-price">Rs. 0</div>
            <p>
              Core topics across all certifications. Practice with fixed
              question banks and track your progress.
            </p>
            <Link
              href={`/exam?cert=${certParam ?? "pmp"}&plan=free&fresh=1`}
              className="intro-secondary-action"
            >
              Start free practice
            </Link>
          </section>

          <section className="pricing-card pricing-card-featured">
            <span className="pricing-kicker">
              {founderAvailable ? "First 100 users" : "Annual access"}
            </span>
            <h2>All Certifications</h2>
            <div className="pricing-price">
              {userInIndia ? `Rs. ${pricing.price}` : `$${pricing.price.toFixed(2)}`}
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
                : `Pay ${pricing.label} & unlock all`}
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

export default function PricingPage() {
  return (
    <Suspense
      fallback={
        <main className="coming-page">
          <section className="coming-shell">
            <div className="exam-spinner" />
            <p>Loading pricing...</p>
          </section>
        </main>
      }
    >
      <PricingContent />
    </Suspense>
  );
}
