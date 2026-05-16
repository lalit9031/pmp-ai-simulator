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
  "Ethical AI, AI-assisted decision making, ESG, and sustainability topics",
  "Business value, strategy alignment, and benefits realization coverage",
  "New learning topics added as the PMP exam changes",
];

export default function PricingPage() {
  const router = useRouter();
  const [paidUsers, setPaidUsers] = useState(0);
  const [activePlan, setActivePlan] = useState<string | null>(null);

  useEffect(() => {
    setPaidUsers(Number(window.localStorage.getItem(paidUsersStorageKey) ?? 0));
    setActivePlan(window.localStorage.getItem(planStorageKey));
  }, []);

  const founderAvailable = paidUsers < 100;
  const currentPrice = founderAvailable ? 199 : 399;
  const currentPlan = founderAvailable ? "founder" : "annual";

  const handleCheckout = () => {
    window.localStorage.setItem(planStorageKey, currentPlan);
    window.localStorage.setItem(
      paidUsersStorageKey,
      String(Math.min(100, paidUsers + 1)),
    );
    setActivePlan(currentPlan);
    setPaidUsers((value) => Math.min(100, value + 1));
    window.localStorage.removeItem("pmp-simulator-progress-v1");
    router.push("/exam?plan=live&fresh=1");
  };

  return (
    <main className="pricing-page">
      <section className="pricing-shell">
        <nav className="intro-nav pricing-nav" aria-label="Pricing navigation">
          <Link href="/" className="intro-brand">
            PMP Simulator
          </Link>
          <div className="intro-nav-links">
            <Link href="/learn">Learn</Link>
            <Link href="/login">Login</Link>
          </div>
        </nav>

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
              Fixed 1000-question PMP practice bank with random practice sets
              and 150 learning questions per topic.
            </p>
            <Link href="/exam?plan=free&fresh=1" className="intro-secondary-action">
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
            </p>

            <button
              type="button"
              onClick={handleCheckout}
              className="intro-primary-action pricing-button"
            >
              <FaLockOpen aria-hidden="true" />
              {activePlan ? "Plan active" : "Pay and unlock"}
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
