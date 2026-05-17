"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaArrowRight,
  FaBookOpen,
  FaChartLine,
  FaClock,
  FaRegFileAlt,
} from "react-icons/fa";

const routeCards = [
  {
    title: "PMP Simulator",
    href: "/exam",
    status: "Ready",
    description: "Start a timed 185-question PMP-style exam session.",
    icon: FaRegFileAlt,
  },
  {
    title: "Final Results",
    href: "/results",
    status: "Ready",
    description: "Review score, domain performance, and answer history.",
    icon: FaClock,
  },
  {
    title: "Learning Hub",
    href: "/learn",
    status: "Ready",
    description: "Study targeted PMP topics after missed questions.",
    icon: FaBookOpen,
  },
  {
    title: "Analytics",
    href: "/dashboard",
    status: "Later",
    description: "Track readiness trends and focus areas over time.",
    icon: FaChartLine,
  },
];

const userStorageKey = "pmp-simulator-user-v1";
const planStorageKey = "pmp-simulator-plan-v1";

function isPaidPlan(plan: string | null) {
  return plan === "founder" || plan === "annual" || plan === "global";
}

export default function IntroPage() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [hasPaidPlan, setHasPaidPlan] = useState(false);

  useEffect(() => {
    const loadHandle = window.setTimeout(() => {
      const user = window.localStorage.getItem(userStorageKey);
      const plan = window.localStorage.getItem(planStorageKey);

      setIsSignedIn(Boolean(user));
      setHasPaidPlan(isPaidPlan(plan));
    }, 0);

    return () => window.clearTimeout(loadHandle);
  }, []);

  const startExamHref = isSignedIn
    ? hasPaidPlan
      ? "/exam?plan=live&fresh=1"
      : "/exam?plan=free&fresh=1"
    : "/login?next=%2Fexam%3Fplan%3Dfree%26fresh%3D1";

  return (
    <main className="intro-page">
      <nav className="intro-nav" aria-label="Primary navigation">
        <Link href="/" className="intro-brand">
          PMP Simulator
        </Link>
        <div className="intro-nav-links">
          <Link href="/exam">Exam</Link>
          <Link href="/results">Results</Link>
          <Link href="/learn">Learn</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/login" className="intro-nav-action">
            Login
          </Link>
        </div>
      </nav>

      <section className="intro-hero">
        <div className="intro-copy">
          <p className="intro-eyebrow">PMI-style practice environment</p>
          <h1>PMP Simulator</h1>
          <p className="intro-lede">
            Sign in to start the free PMP plan with four learning topics,
            saved progress, results analytics, and upgrade when you are ready
            for the live full-version simulator.
          </p>
          <div className="intro-actions">
            <Link href={startExamHref} className="intro-primary-action">
              Start Exam
              <FaArrowRight aria-hidden="true" />
            </Link>
            <Link href="/pricing" className="intro-secondary-action">
              View Plans
            </Link>
          </div>
        </div>

        <div className="intro-panel" aria-label="Exam setup preview">
          <div className="intro-panel-header">
            <span>Exam Session</span>
            <strong>240:00</strong>
          </div>
          <div className="intro-progress-grid" aria-hidden="true">
            {Array.from({ length: 36 }, (_, index) => (
              <span
                key={index}
                className={index < 6 ? "intro-progress-active" : ""}
              />
            ))}
          </div>
          <div className="intro-panel-footer">
            <span>185 questions</span>
            <span>AI, ESG, value focus</span>
          </div>
        </div>
      </section>

      <section className="intro-offer" aria-label="Practice plans">
        <div>
          <span>Free practice</span>
          <strong>4 core topics included</strong>
          <p>
            Signed-in learners can read, test, and practice Agile, Risk,
            Stakeholder, and Hybrid topics with saved browser progress.
          </p>
        </div>
        <div>
          <span>Paid live test</span>
          <strong>AI PMP questions</strong>
          <p>
            Subscribe to unlock the live simulator, all PMP topics, AI,
            sustainability, ESG, business value, and full-version practice.
          </p>
        </div>
        <div>
          <span>Founder price</span>
          <strong>Rs. 199 India · $3 global</strong>
          <p>
            First 100 India users get Rs. 199 access. Learners outside India
            can unlock the full version for $3.
          </p>
        </div>
      </section>

      <section className="intro-routes" aria-label="Application routes">
        {routeCards.map((card) => {
          const Icon = card.icon;

          return (
            <Link key={card.href} href={card.href} className="intro-route-card">
              <div className="intro-route-icon">
                <Icon aria-hidden="true" />
              </div>
              <div>
                <div className="intro-route-heading">
                  <h2>{card.title}</h2>
                  <span>{card.status}</span>
                </div>
                <p>{card.description}</p>
              </div>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
