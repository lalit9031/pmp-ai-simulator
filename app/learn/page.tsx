"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { learningTopics } from "../learningTopics";

const planStorageKey = "pmp-simulator-plan-v1";
const freeTopicSlugs = ["agile", "risk", "stakeholder", "hybrid"];

function isPaidPlanActive() {
  const plan = window.localStorage.getItem(planStorageKey);
  return plan === "founder" || plan === "annual" || plan === "global";
}

export default function LearnPage() {
  const [hasPaidPlan, setHasPaidPlan] = useState(false);

  useEffect(() => {
    const loadHandle = window.setTimeout(() => {
      setHasPaidPlan(isPaidPlanActive());
    }, 0);

    return () => window.clearTimeout(loadHandle);
  }, []);

  const visibleTopics = Object.values(learningTopics).filter(
    (topic) => hasPaidPlan || freeTopicSlugs.includes(topic.slug),
  );

  return (
    <main className="learn-page">
      <section className="learn-shell">
        <div className="learn-header">
          <p className="intro-eyebrow">Learning Hub</p>
          <h1>Study the PMP logic behind your mistakes.</h1>
          <p>
            Free users get four core PMP topics. Paid users unlock ethical AI,
            sustainability, ESG, value delivery, business environment thinking,
            and the complete topic library.
          </p>
        </div>

        <div className="learn-grid">
          {visibleTopics.map((topic) => (
            <Link
              key={topic.slug}
              href={`/learn/${topic.slug}`}
              className="learn-topic-card"
            >
              <div className="learn-topic-card-meta">
                <span>{topic.domain}</span>
              </div>
              <h2>{topic.title}</h2>
              <p>{topic.summary}</p>
            </Link>
          ))}
        </div>

        {!hasPaidPlan && (
          <section className="learn-upgrade-band">
            <div>
              <p className="intro-eyebrow">Full Version</p>
              <h2>Unlock every PMP topic and the live simulator.</h2>
              <p>
                Free users can study Agile, Risk, Stakeholder, and Hybrid.
                Subscribe for AI Ethics, Sustainability, Business Environment,
                and the complete adaptive learning path.
              </p>
            </div>
            <Link href="/pricing" className="intro-primary-action">
              View Paid Plan
            </Link>
          </section>
        )}
      </section>
    </main>
  );
}
