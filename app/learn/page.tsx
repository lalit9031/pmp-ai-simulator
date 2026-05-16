"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { learningTopics } from "../learningTopics";

const planStorageKey = "pmp-simulator-plan-v1";
const freeTopicSlugs = ["agile", "risk", "stakeholder"];

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
            Topic guides now include agile, risk, stakeholders, hybrid delivery,
            ethical AI, sustainability, ESG, value delivery, and business
            environment thinking. Each topic connects to 150 practice questions
            across easy, medium, and hard difficulty.
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
