"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { learningTopics } from "../learningTopics";

const planStorageKey = "pmp-simulator-plan-v1";
const freeTopicSlugs = ["agile", "risk", "stakeholder", "hybrid"];

function isPaidPlanActive() {
  const plan = window.localStorage.getItem(planStorageKey);
  return plan === "founder" || plan === "annual";
}

export default function LearnPage() {
  const [hasPaidPlan, setHasPaidPlan] = useState(false);

  useEffect(() => {
    setHasPaidPlan(isPaidPlanActive());
  }, []);

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
          {Object.values(learningTopics).map((topic) => {
            const isLocked = !hasPaidPlan && !freeTopicSlugs.includes(topic.slug);

            return (
              <Link
                key={topic.slug}
                href={isLocked ? "/pricing" : `/learn/${topic.slug}`}
                className={`learn-topic-card ${
                  isLocked ? "learn-topic-locked" : ""
                }`}
              >
                <div className="learn-topic-card-meta">
                  <span>{topic.domain}</span>
                  {isLocked && <strong>Paid</strong>}
                </div>
                <h2>{topic.title}</h2>
                <p>{topic.summary}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
