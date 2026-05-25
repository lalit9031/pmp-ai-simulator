"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCheck, FaLockOpen } from "react-icons/fa";

const planStorageKey = "pmp-simulator-plan-v1";
const paidUsersStorageKey = "pmp-simulator-paid-users-v1";

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

  useEffect(() => {
    const loadHandle = window.setTimeout(() => {
      setPaidUsers(
        Number(window.localStorage.getItem(paidUsersStorageKey) ?? 0),
      );
      setActivePlan(window.localStorage.getItem(planStorageKey));
    }, 0);

    return () => window.clearTimeout(loadHandle);
  }, []);

  const founderAvailable = paidUsers < 100;
  const currentPrice = founderAvailable ? 199 : 399;
  const currentPlan = founderAvailable ? "founder" : "annual";

  const handleCheckout = (plan: string) => {
    window.localStorage.setItem(planStorageKey, plan);

    if (plan !== "global") {
      window.localStorage.setItem(
        paidUsersStorageKey,
        String(Math.min(100, paidUsers + 1)),
      );
      setPaidUsers((value) => Math.min(100, value + 1));
    }

    setActivePlan(plan);
    window.localStorage.removeItem("pmp-simulator-progress-v1");
    router.push("/exam?plan=live&fresh=1");
  };

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
            <div className="pricing-price">Rs. {currentPrice}</div>
            <p>
              {founderAvailable
                ? `${100 - paidUsers} founder seats left at Rs. 199.`
                : "Founder pricing is complete. Annual access is Rs. 399."}
              {" "}Outside India, full-version access is $3.
            </p>

            <button
              type="button"
              onClick={() => handleCheckout(currentPlan)}
              className="intro-primary-action pricing-button"
            >
              <FaLockOpen aria-hidden="true" />
              {isPaidPlan(activePlan) ? "Plan active" : "Pay Rs. and unlock"}
            </button>

            <button
              type="button"
              onClick={() => handleCheckout("global")}
              className="intro-secondary-action pricing-button pricing-global-button"
            >
              Pay $3 outside India
            </button>

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
