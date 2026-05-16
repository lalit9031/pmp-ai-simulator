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

export default function ResultsPage() {
  const [results, setResults] = useState<LatestResults | null>(null);

  useEffect(() => {
    const loadHandle = window.setTimeout(() => {
      const savedResults = window.localStorage.getItem(resultsStorageKey);

      if (savedResults) {
        setResults(JSON.parse(savedResults) as LatestResults);
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

    return {
      score,
      answeredCount,
      percentage,
      readiness: getReadiness(percentage, answeredCount),
      strengths: sortedDomains.slice(0, 2),
      weakAreas: sortedDomains.slice(-2).reverse(),
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
          <p>Submit an exam or practice session to see your score summary.</p>
          <Link href="/exam" className="intro-primary-action">
            Start Practice
          </Link>
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
          <Link href="/exam" className="intro-primary-action">
            Continue Practice
          </Link>
        </div>

        <div className="results-score-grid">
          <div>
            <p>Score</p>
            <strong>
              {summary.score}/{summary.answeredCount || results.totalQuestions}
            </strong>
          </div>
          <div>
            <p>Percentage</p>
            <strong>{summary.percentage}%</strong>
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
      </section>
    </main>
  );
}
