"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FadeIn,
  SlideUp,
  StaggerContainer,
  StaggerItem,
  AnimatedCounter,
  AnimatedProgressBar,
  AnimatedScoreRing,
  PageTransition,
  CardSkeleton,
} from "../components/Animations";

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

const planStorageKey = "exampro-plan-v1";

function resultsStorageKey(certSlug: string) {
  return `exampro-${certSlug}-latest-results-v1`;
}
function weakAreaStorageKey(certSlug: string) {
  return `exampro-${certSlug}-weak-area-stats-v1`;
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
      <main className="results-page">
        <section className="results-shell">
          <div className="results-header">
            <div>
              <p className="intro-eyebrow">Results</p>
              <div className="skeleton-pulse" style={{ width: "200px", height: "36px", borderRadius: 6, marginBottom: 8 }} />
              <div className="skeleton-pulse" style={{ width: "140px", height: "16px", borderRadius: 4 }} />
            </div>
          </div>
          <div className="results-score-grid">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i}>
                <div className="skeleton-pulse" style={{ width: "60%", height: "12px", borderRadius: 4, marginBottom: 8 }} />
                <div className="skeleton-pulse" style={{ width: "40%", height: "28px", borderRadius: 4 }} />
              </div>
            ))}
          </div>
          <CardSkeleton />
          <CardSkeleton />
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

  // Determine score color
  const scoreColor =
    summary.percentage >= 80 ? "var(--accent-green)" :
    summary.percentage >= 60 ? "#2563eb" :
    summary.percentage >= 40 ? "#d97706" :
    "var(--accent-red)";

  return (
    <main className="results-page">
      <PageTransition>
        <section className="results-shell">
          <StaggerContainer>
            <StaggerItem>
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
            </StaggerItem>

            <StaggerItem>
              <div className="results-score-area">
                <div className="results-score-ring-wrap">
                  <AnimatedScoreRing
                    percentage={summary.percentage}
                    size={150}
                    strokeWidth={12}
                    label="Readiness"
                    delay={0.2}
                  />
                </div>
                <StaggerContainer className="results-score-grid">
                  <StaggerItem>
                    <div className="results-score-card">
                      <p>Correct</p>
                      <strong style={{ color: "var(--accent-green)" }}>
                        <AnimatedCounter value={summary.score} duration={0.6} />
                        <span style={{ color: "var(--muted-text)", fontSize: 16 }}>/{summary.answeredCount || results.totalQuestions}</span>
                      </strong>
                    </div>
                  </StaggerItem>
                  <StaggerItem>
                    <div className="results-score-card">
                      <p>Incorrect</p>
                      <strong style={{ color: "var(--accent-red)" }}>
                        <AnimatedCounter value={summary.incorrectCount} duration={0.6} />
                      </strong>
                    </div>
                  </StaggerItem>
                  <StaggerItem>
                    <div className="results-score-card">
                      <p>Answered</p>
                      <strong>
                        <AnimatedCounter value={summary.answeredCount} duration={0.6} />
                        <span style={{ color: "var(--muted-text)", fontSize: 16 }}>/{results.totalQuestions}</span>
                      </strong>
                    </div>
                  </StaggerItem>
                  <StaggerItem>
                    <div className="results-score-card">
                      <p>Marked</p>
                      <strong>
                        <AnimatedCounter value={summary.markedCount} duration={0.6} />
                      </strong>
                    </div>
                  </StaggerItem>
                </StaggerContainer>
              </div>
            </StaggerItem>

            <SlideUp delay={0.3}>
              <div className="results-panels">
                <section>
                  <h2>Strengths</h2>
                  {summary.strengths.length ? (
                    <StaggerContainer>
                      {summary.strengths.map((row) => (
                        <StaggerItem key={row.domain}>
                          <div className="results-panel-row">
                            <span>{row.domain}</span>
                            <strong style={{ color: "var(--accent-green)" }}>{row.correct}/{row.total}</strong>
                            <AnimatedProgressBar
                              value={Math.round((row.correct / row.total) * 100)}
                              height={6}
                              color="var(--accent-green)"
                              delay={0.3}
                            />
                          </div>
                        </StaggerItem>
                      ))}
                    </StaggerContainer>
                  ) : (
                    <p>Answer more questions to identify strengths.</p>
                  )}
                </section>
                <section>
                  <h2>Weak Areas</h2>
                  {summary.weakAreas.length ? (
                    <StaggerContainer>
                      {summary.weakAreas.map((row) => (
                        <StaggerItem key={row.domain}>
                          <div className="results-panel-row">
                            <span>{row.domain}</span>
                            <strong style={{ color: "var(--accent-red)" }}>{row.correct}/{row.total}</strong>
                            <AnimatedProgressBar
                              value={Math.round((row.correct / row.total) * 100)}
                              height={6}
                              color={row.correct / row.total >= 0.5 ? "var(--accent-green)" : "var(--accent-red)"}
                              delay={0.35}
                            />
                          </div>
                        </StaggerItem>
                      ))}
                    </StaggerContainer>
                  ) : (
                    <p>Answer more questions to identify weak areas.</p>
                  )}
                </section>
              </div>
            </SlideUp>

            <FadeIn delay={0.4}>
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
            </FadeIn>

            <SlideUp delay={0.5}>
              <section className="results-domain-table">
                <h2>You Struggle With</h2>
                {summary.topicWeakAreas.length ? (
                  <StaggerContainer>
                    {summary.topicWeakAreas.map((row, idx) => {
                      const pct = Math.round((row.correct / row.total) * 100);
                      return (
                        <StaggerItem key={row.topic}>
                          <motion.div
                            className="results-domain-row"
                            whileHover={{ x: 4 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          >
                            <span>{row.topic}</span>
                            <strong>{pct}%</strong>
                            <AnimatedProgressBar
                              value={pct}
                              height={10}
                              color={pct >= 50 ? "var(--accent-green)" : pct >= 30 ? "#d97706" : "var(--accent-red)"}
                              delay={0.15 * idx}
                              duration={0.5}
                            />
                          </motion.div>
                        </StaggerItem>
                      );
                    })}
                  </StaggerContainer>
                ) : (
                  <p>Answer more questions to build weak-area tracking.</p>
                )}
              </section>
            </SlideUp>

            <SlideUp delay={0.6}>
              <section className="results-domain-table">
                <h2>Domain Breakdown</h2>
                {summary.domainRows.map((row, idx) => {
                  const pct = Math.round((row.correct / row.total) * 100);
                  return (
                    <motion.div
                      key={row.domain}
                      className="results-domain-row"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.3, delay: 0.08 * idx, ease: "easeOut" }}
                      whileHover={{ x: 4 }}
                    >
                      <span>{row.domain}</span>
                      <strong>{row.correct}/{row.total}</strong>
                      <AnimatedProgressBar
                        value={pct}
                        height={10}
                        color={scoreColor}
                        delay={0.15 * idx}
                        duration={0.5}
                      />
                    </motion.div>
                  );
                })}
              </section>
            </SlideUp>

            <SlideUp delay={0.7}>
              <section className="results-domain-table">
                <h2>Long-Term Weak Area Tracking</h2>
                {Object.values(weakAreaStats).length ? (
                  <StaggerContainer>
                    {Object.values(weakAreaStats)
                      .sort((a, b) => b.mistakes - a.mistakes)
                      .slice(0, 5)
                      .map((row, idx) => {
                        const accuracy = Math.round((row.correct / row.attempts) * 100);
                        return (
                          <StaggerItem key={row.topic}>
                            <motion.div
                              className="results-domain-row"
                              whileHover={{ x: 4 }}
                              transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                              <span>{row.topic}</span>
                              <strong>{row.mistakes} mistakes · {accuracy}%</strong>
                              <AnimatedProgressBar
                                value={accuracy}
                                height={10}
                                color={accuracy >= 60 ? "var(--accent-green)" : accuracy >= 40 ? "#d97706" : "var(--accent-red)"}
                                delay={0.1 * idx}
                                duration={0.5}
                              />
                            </motion.div>
                          </StaggerItem>
                        );
                      })}
                  </StaggerContainer>
                ) : (
                  <p>Complete a practice session to start tracking weak areas.</p>
                )}
              </section>
            </SlideUp>
          </StaggerContainer>
        </section>
      </PageTransition>
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
