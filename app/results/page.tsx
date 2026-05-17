"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type ResultQuestion = {
  question: string;
  correctAnswer: number;
  selectedAnswer?: number;
  isCorrect?: boolean;
  markedForReview?: boolean;
  domain?: string;
  topic?: string;
  difficulty?: string;
};

type LatestResults = {
  mode?: string;
  domain?: string;
  difficulty?: string;
  questions: ResultQuestion[];
  score: number;
  answeredCount: number;
  availableQuestions: number;
  totalQuestions: number;
  timeLeft: number;
  finishedAt: string;
};

const resultsStorageKey = "pmp-simulator-latest-results-v1";
const weakAreaStorageKey = "pmp-simulator-weak-area-stats-v1";
const planStorageKey = "pmp-simulator-plan-v1";

type WeakAreaStats = Record<
  string,
  { domain: string; topic: string; attempts: number; correct: number; mistakes: number }
>;

function getQuestionDomain(question: ResultQuestion) {
  if (question.domain && question.domain !== "Mixed") {
    return question.domain;
  }

  const text = question.question.toLowerCase();

  if (text.includes("risk")) {
    return "Risk";
  }

  if (text.includes("stakeholder")) {
    return "Stakeholder";
  }

  if (text.includes("agile") || text.includes("sprint")) {
    return "Agile";
  }

  if (text.includes("hybrid")) {
    return "Hybrid";
  }

  return "General";
}

function getQuestionTopic(question: ResultQuestion) {
  if (question.topic) {
    return question.topic;
  }

  return getQuestionDomain(question);
}

function getReadiness(percentage: number, answeredCount: number) {
  if (answeredCount < 20) {
    return "Needs more data";
  }

  if (percentage >= 80) {
    return "Strong readiness";
  }

  if (percentage >= 70) {
    return "Close to ready";
  }

  return "Needs focused practice";
}

function isPaidPlan(plan: string | null) {
  return plan === "founder" || plan === "annual" || plan === "global";
}

export default function ResultsPage() {
  const [results, setResults] = useState<LatestResults | null>(null);
  const [weakAreaStats, setWeakAreaStats] = useState<WeakAreaStats>({});
  const [hasPaidPlan, setHasPaidPlan] = useState(false);

  useEffect(() => {
    const loadHandle = window.setTimeout(() => {
      const savedResults = window.localStorage.getItem(resultsStorageKey);
      const savedWeakAreaStats = window.localStorage.getItem(weakAreaStorageKey);
      const savedPlan = window.localStorage.getItem(planStorageKey);

      setHasPaidPlan(isPaidPlan(savedPlan));

      if (savedResults) {
        setResults(JSON.parse(savedResults) as LatestResults);
      }

      if (savedWeakAreaStats) {
        setWeakAreaStats(JSON.parse(savedWeakAreaStats) as WeakAreaStats);
      }
    }, 0);

    return () => window.clearTimeout(loadHandle);
  }, []);

  const summary = useMemo(() => {
    if (!results) {
      return null;
    }

    const answeredQuestions = results.questions.filter(
      (question) => question.selectedAnswer !== undefined,
    );
    const answeredCount = answeredQuestions.length;
    const score = answeredQuestions.filter((question) => question.isCorrect)
      .length;
    const percentage = answeredCount
      ? Math.round((score / answeredCount) * 100)
      : 0;

    const domainRows = Object.values(
      answeredQuestions.reduce<
        Record<string, { domain: string; correct: number; total: number }>
      >((groups, question) => {
        const domain = getQuestionDomain(question);

        groups[domain] ??= { domain, correct: 0, total: 0 };
        groups[domain].total += 1;

        if (question.isCorrect) {
          groups[domain].correct += 1;
        }

        return groups;
      }, {}),
    ).sort((left, right) => right.total - left.total);

    const sortedDomains = [...domainRows].sort(
      (left, right) =>
        right.correct / right.total - left.correct / left.total,
    );
    const topicRows = Object.values(
      answeredQuestions.reduce<
        Record<string, { topic: string; domain: string; correct: number; total: number }>
      >((groups, question) => {
        const topic = getQuestionTopic(question);
        const domain = getQuestionDomain(question);

        groups[topic] ??= { topic, domain, correct: 0, total: 0 };
        groups[topic].total += 1;

        if (question.isCorrect) {
          groups[topic].correct += 1;
        }

        return groups;
      }, {}),
    );
    const sortedTopics = [...topicRows].sort(
      (left, right) => left.correct / left.total - right.correct / right.total,
    );
    const recommendation = sortedTopics[0];

    return {
      score,
      answeredCount,
      incorrectCount: answeredCount - score,
      percentage,
      readiness: getReadiness(percentage, answeredCount),
      strengths: sortedDomains.slice(0, 2),
      weakAreas: sortedDomains.slice(-2).reverse(),
      topicWeakAreas: sortedTopics.slice(0, 3),
      recommendation,
      domainRows,
      markedCount: results.questions.filter((question) => question.markedForReview)
        .length,
    };
  }, [results]);

  if (!results || !summary) {
    return (
      <main className="coming-page">
        <section className="coming-shell">
          <p className="intro-eyebrow">Final Results</p>
          <h1>No completed attempt yet.</h1>
          <p>
            Submit a practice session to see readiness, strong areas, weak
            areas, and your next learning recommendation.
          </p>
          <Link
            href={hasPaidPlan ? "/exam?plan=live&fresh=1" : "/pricing"}
            className="intro-primary-action"
          >
            {hasPaidPlan ? "Start Live Simulator" : "Take Paid Plan"}
          </Link>
          {!hasPaidPlan && (
            <Link href="/learn" className="intro-secondary-action coming-secondary">
              Use Free Topics
            </Link>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="results-page">
      <section className="results-shell">
        <div className="results-header">
          <div>
            <p className="intro-eyebrow">Final Results</p>
            <h1>{summary.readiness}</h1>
            <p>
              {results.mode === "exam" ? "Final exam" : "Learning practice"} ·{" "}
              {results.domain ?? "Mixed"} · {results.difficulty ?? "Mixed"}
            </p>
          </div>
          <Link
            href={hasPaidPlan ? "/exam?plan=live&fresh=1" : "/pricing"}
            className="intro-primary-action"
          >
            {hasPaidPlan ? "Continue Live Simulator" : "Unlock Full Version"}
          </Link>
        </div>

        <div className="results-score-grid">
          <div>
            <p>PMP Readiness Score</p>
            <strong>{summary.percentage}%</strong>
          </div>
          <div>
            <p>Correct Answers</p>
            <strong>
              {summary.score}/{summary.answeredCount || results.totalQuestions}
            </strong>
          </div>
          <div>
            <p>Incorrect Answers</p>
            <strong>{summary.incorrectCount}</strong>
          </div>
          <div>
            <p>Answered</p>
            <strong>
              {summary.answeredCount}/{results.totalQuestions}
            </strong>
          </div>
          <div>
            <p>Marked</p>
            <strong>{summary.markedCount}</strong>
          </div>
        </div>

        <div className="results-panels">
          <section>
            <h2>Strengths</h2>
            {summary.strengths.length ? (
              summary.strengths.map((row) => (
                <p key={row.domain}>
                  {row.domain}: {row.correct}/{row.total}
                </p>
              ))
            ) : (
              <p>Answer more questions to identify strengths.</p>
            )}
          </section>

          <section>
            <h2>Weak Areas</h2>
            {summary.weakAreas.length ? (
              summary.weakAreas.map((row) => (
                <p key={row.domain}>
                  {row.domain}: {row.correct}/{row.total}
                </p>
              ))
            ) : (
              <p>Answer more questions to identify weak areas.</p>
            )}
          </section>
        </div>

        <section className="results-recommendation">
          <div>
            <p className="intro-eyebrow">Recommendation</p>
            <h2>
              Study{" "}
              {summary.recommendation?.topic ??
                summary.weakAreas[0]?.domain ??
                "one focused topic"}
              .
            </h2>
            <p>
              Your next best improvement area is based on missed answers,
              topic accuracy, and recent practice history.
            </p>
          </div>
          <Link href="/learn" className="intro-primary-action">
            Open Learning Hub
          </Link>
        </section>

        <section className="results-domain-table">
          <h2>You Struggle With</h2>
          {summary.topicWeakAreas.length ? (
            summary.topicWeakAreas.map((row) => {
              const topicPercent = Math.round((row.correct / row.total) * 100);

              return (
                <div key={row.topic} className="results-domain-row">
                  <span>{row.topic}</span>
                  <strong>{topicPercent}%</strong>
                  <div className="results-domain-track" aria-hidden="true">
                    <span style={{ width: `${topicPercent}%` }} />
                  </div>
                </div>
              );
            })
          ) : (
            <p>Answer more questions to build weak-area tracking.</p>
          )}
        </section>

        <section className="results-domain-table">
          <h2>Domain Breakdown</h2>
          {summary.domainRows.map((row) => {
            const domainPercent = Math.round((row.correct / row.total) * 100);

            return (
              <div key={row.domain} className="results-domain-row">
                <span>{row.domain}</span>
                <strong>
                  {row.correct}/{row.total}
                </strong>
                <div className="results-domain-track" aria-hidden="true">
                  <span style={{ width: `${domainPercent}%` }} />
                </div>
              </div>
            );
          })}
        </section>

        <section className="results-domain-table">
          <h2>Long-Term Weak Area Tracking</h2>
          {Object.values(weakAreaStats).length ? (
            Object.values(weakAreaStats)
              .sort((left, right) => right.mistakes - left.mistakes)
              .slice(0, 5)
              .map((row) => {
                const accuracy = Math.round((row.correct / row.attempts) * 100);

                return (
                  <div key={row.topic} className="results-domain-row">
                    <span>{row.topic}</span>
                    <strong>
                      {row.mistakes} mistakes · {accuracy}%
                    </strong>
                    <div className="results-domain-track" aria-hidden="true">
                      <span style={{ width: `${accuracy}%` }} />
                    </div>
                  </div>
                );
              })
          ) : (
            <p>Complete a practice session to start tracking weak areas.</p>
          )}
        </section>
      </section>
    </main>
  );
}
