"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

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
  certSlug?: string;
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

type WeakAreaStats = Record<
  string,
  { domain: string; topic: string; attempts: number; correct: number; mistakes: number }
>;

const planStorageKey = "pmp-simulator-plan-v1";

function resultsStorageKey(certSlug: string) {
  return `pmp-${certSlug}-latest-results-v1`;
}
function weakAreaStorageKey(certSlug: string) {
  return `pmp-${certSlug}-weak-area-stats-v1`;
}

function getQuestionDomain(question: ResultQuestion) {
  if (question.domain && question.domain !== "Mixed") return question.domain;
  const text = question.question.toLowerCase();
  if (text.includes("risk")) return "Risk";
  if (text.includes("stakeholder")) return "Stakeholder";
  if (text.includes("agile") || text.includes("sprint")) return "Agile";
  if (text.includes("hybrid")) return "Hybrid";
  return "General";
}

function getQuestionTopic(question: ResultQuestion) {
  return question.topic || getQuestionDomain(question);
}

function getReadiness(percentage: number, answeredCount: number) {
  if (answeredCount < 20) return "Needs more data";
  if (percentage >= 80) return "Strong readiness";
  if (percentage >= 70) return "Close to ready";
  return "Needs focused practice";
}

function isPaidPlan(plan: string | null) {
  return plan === "founder" || plan === "annual" || plan === "global";
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const certParam = searchParams.get("cert") ?? "pmp";

  const [results, setResults] = useState<LatestResults | null>(null);
  const [weakAreaStats, setWeakAreaStats] = useState<WeakAreaStats>({});
  const [hasPaidPlan, setHasPaidPlan] = useState(false);
  const [loading, setLoading] = useState(true);

  const activeCertSlug = results?.certSlug ?? certParam;
  const certExamHref = `/exam?cert=${activeCertSlug}&plan=${hasPaidPlan ? "live" : "free"}&fresh=1`;

  useEffect(() => {
    const loadHandle = window.setTimeout(() => {
      const savedResults = window.localStorage.getItem(resultsStorageKey(certParam));
      const savedWeakAreas = window.localStorage.getItem(weakAreaStorageKey(certParam));
      const savedPlan = window.localStorage.getItem(planStorageKey);

      setHasPaidPlan(isPaidPlan(savedPlan));
      if (savedResults) setResults(JSON.parse(savedResults));
      if (savedWeakAreas) setWeakAreaStats(JSON.parse(savedWeakAreas));
      setLoading(false);
    }, 0);
    return () => window.clearTimeout(loadHandle);
  }, [certParam]);

  const summary = useMemo(() => {
    if (!results) return null;

    const answered = results.questions.filter((q) => q.selectedAnswer !== undefined);
    const answeredCount = answered.length;
    const score = answered.filter((q) => q.isCorrect).length;
    const percentage = answeredCount ? Math.round((score / answeredCount) * 100) : 0;

    const domainRows = Object.values(
      answered.reduce<Record<string, { domain: string; correct: number; total: number }>>(
        (groups, q) => {
          const domain = getQuestionDomain(q);
          groups[domain] ??= { domain, correct: 0, total: 0 };
          groups[domain].total += 1;
          if (q.isCorrect) groups[domain].correct += 1;
          return groups;
        },
        {},
      ),
    ).sort((a, b) => b.total - a.total);

    const sortedDomains = [...domainRows].sort((a, b) => b.correct / b.total - a.correct / a.total);
    const topicRows = Object.values(
      answered.reduce<
        Record<string, { topic: string; domain: string; correct: number; total: number }>
      >((groups, q) => {
        const topic = getQuestionTopic(q);
        const domain = getQuestionDomain(q);
        groups[topic] ??= { topic, domain, correct: 0, total: 0 };
        groups[topic].total += 1;
        if (q.isCorrect) groups[topic].correct += 1;
        return groups;
      }, {}),
    );
    const sortedTopics = [...topicRows].sort((a, b) => a.correct / a.total - b.correct / b.total);

    return {
      score,
      answeredCount,
      incorrectCount: answeredCount - score,
      percentage,
      readiness: getReadiness(percentage, answeredCount),
      strengths: sortedDomains.slice(0, 2),
      weakAreas: sortedDomains.slice(-2).reverse(),
      topicWeakAreas: sortedTopics.slice(0, 3),
      recommendation: sortedTopics[0],
      domainRows,
      markedCount: results.questions.filter((q) => q.markedForReview).length,
      certSlug: results.certSlug ?? "pmp",
    };
  }, [results]);

  if (loading) {
    return (
      <main className="coming-page">
        <section className="coming-shell">
          <p className="intro-eyebrow">Results</p>
          <h1>Loading...</h1>
        </section>
      </main>
    );
  }

  if (!results || !summary) {
    return (
      <main className="coming-page">
        <section className="coming-shell">
          <p className="intro-eyebrow">Results</p>
          <h1>No completed attempt yet.</h1>
          <p>
            Submit a practice session to see readiness, strong areas, weak
            areas, and your next learning recommendation.
          </p>
          <Link href={certExamHref} className="intro-primary-action">
            {hasPaidPlan ? "Start Live Simulator" : "Take Free Practice"}
          </Link>
          {!hasPaidPlan && (
            <Link href="/learn" className="intro-secondary-action coming-secondary">
              Open Learning Hub
            </Link>
          )}
        </section>
      </main>
    );
  }

  const certSlug = summary.certSlug;

  return (
    <main className="results-page">
      <section className="results-shell">
        <div className="results-header">
          <div>
            <p className="intro-eyebrow">
              Results &mdash; {certSlug.toUpperCase()} Certification
            </p>
            <h1>{summary.readiness}</h1>
            <p>
              {results.mode === "exam" ? "Final exam" : "Learning practice"}
              {results.domain ? ` · ${results.domain}` : ""}
              {results.difficulty ? ` · ${results.difficulty}` : ""}
            </p>
          </div>
          <Link href={certExamHref} className="intro-primary-action">
            {hasPaidPlan ? "Continue Live Simulator" : "Unlock Full Version"}
          </Link>
        </div>

        <div className="results-score-grid">
          <div>
            <p>Readiness Score</p>
            <strong>{summary.percentage}%</strong>
          </div>
          <div>
            <p>Correct</p>
            <strong>{summary.score}/{summary.answeredCount || results.totalQuestions}</strong>
          </div>
          <div>
            <p>Incorrect</p>
            <strong>{summary.incorrectCount}</strong>
          </div>
          <div>
            <p>Answered</p>
            <strong>{summary.answeredCount}/{results.totalQuestions}</strong>
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
                <p key={row.domain}>{row.domain}: {row.correct}/{row.total}</p>
              ))
            ) : (
              <p>Answer more questions to identify strengths.</p>
            )}
          </section>
          <section>
            <h2>Weak Areas</h2>
            {summary.weakAreas.length ? (
              summary.weakAreas.map((row) => (
                <p key={row.domain}>{row.domain}: {row.correct}/{row.total}</p>
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
              {summary.recommendation?.topic ?? summary.weakAreas[0]?.domain ?? "one focused topic"}
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
              const pct = Math.round((row.correct / row.total) * 100);
              return (
                <div key={row.topic} className="results-domain-row">
                  <span>{row.topic}</span>
                  <strong>{pct}%</strong>
                  <div className="results-domain-track" aria-hidden="true">
                    <span style={{ width: `${pct}%` }} />
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
            const pct = Math.round((row.correct / row.total) * 100);
            return (
              <div key={row.domain} className="results-domain-row">
                <span>{row.domain}</span>
                <strong>{row.correct}/{row.total}</strong>
                <div className="results-domain-track" aria-hidden="true">
                  <span style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </section>

        <section className="results-domain-table">
          <h2>Long-Term Weak Area Tracking</h2>
          {Object.values(weakAreaStats).length ? (
            Object.values(weakAreaStats)
              .sort((a, b) => b.mistakes - a.mistakes)
              .slice(0, 5)
              .map((row) => {
                const accuracy = Math.round((row.correct / row.attempts) * 100);
                return (
                  <div key={row.topic} className="results-domain-row">
                    <span>{row.topic}</span>
                    <strong>{row.mistakes} mistakes · {accuracy}%</strong>
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

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <main className="coming-page">
          <section className="coming-shell">
            <p className="intro-eyebrow">Results</p>
            <h1>Loading...</h1>
          </section>
        </main>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
