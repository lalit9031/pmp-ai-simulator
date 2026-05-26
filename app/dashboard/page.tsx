"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "../lib/supabaseClient";
import { getExamCertifications, type Certification } from "../certifications";
import {
  FadeIn,
  SlideUp,
  StaggerContainer,
  StaggerItem,
  AnimatedCounter,
} from "../components/Animations";

// ── Types ──

type Profile = {
  name: string | null;
  email: string | null;
  plan: string | null;
};

type ExamRow = {
  id: string;
  certification: string;
  score: number;
  percentage: number;
  answered_count: number;
  correct_count: number;
  incorrect_count: number;
  created_at: string;
};

type CertProgress = {
  hasProgress: boolean;
  hasResults: boolean;
  latestPercentage: number | null;
  answeredCount: number;
  totalQuestions: number;
  mistakeCount: number;
  weakAreaCount: number;
};

type SavedQuestion = {
  selectedAnswer?: number;
  isCorrect?: boolean;
};

type SavedResults = {
  questions?: SavedQuestion[];
  finishedAt?: string;
};

type AttemptPoint = {
  certSlug: string;
  percentage: number;
  answeredCount: number;
  correctCount: number;
  finishedAt: string;
};

type StreakStats = {
  current: number;
  longest: number;
  activeDays: number;
};

const userStorageKey = "pmp-simulator-user-v1";
const planStorageKey = "pmp-simulator-plan-v1";
const attemptHistoryStorageKey = "pmp-attempt-history-v1";

function progressStorageKey(slug: string) {
  return `pmp-${slug}-progress-v1`;
}
function resultsStorageKey(slug: string) {
  return `pmp-${slug}-latest-results-v1`;
}
function weakAreaStorageKey(slug: string) {
  return `pmp-${slug}-weak-area-stats-v1`;
}
function mistakeNotebookStorageKey(slug: string) {
  return `pmp-${slug}-mistake-notebook-v1`;
}

function emptyCertProgress(cert: Certification): CertProgress {
  return {
    hasProgress: false,
    hasResults: false,
    latestPercentage: null,
    answeredCount: 0,
    totalQuestions: cert.totalQuestions,
    mistakeCount: 0,
    weakAreaCount: 0,
  };
}

function parseResults(raw: string): SavedResults | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed as SavedResults;
  } catch {
    return null;
  }
}

function loadCertProgress(cert: Certification): CertProgress {
  try {
    const progressRaw = window.localStorage.getItem(progressStorageKey(cert.slug));
    const resultsRaw = window.localStorage.getItem(resultsStorageKey(cert.slug));
    const weakRaw = window.localStorage.getItem(weakAreaStorageKey(cert.slug));
    const mistakesRaw = window.localStorage.getItem(mistakeNotebookStorageKey(cert.slug));

    const hasProgress = !!progressRaw;
    const hasResults = !!resultsRaw;

    let latestPercentage: number | null = null;
    let answeredCount = 0;
    let totalQuestions = cert.totalQuestions;

    if (resultsRaw) {
      const parsed = parseResults(resultsRaw);
      if (parsed) {
        const answered = parsed.questions?.filter(
          (question) => question.selectedAnswer !== undefined,
        ).length ?? 0;
        const correct = parsed.questions?.filter(
          (question) => question.isCorrect,
        ).length ?? 0;
        answeredCount = answered;
        latestPercentage = answered > 0 ? Math.round((correct / answered) * 100) : null;
      }
    } else if (progressRaw) {
      try {
        const parsed = JSON.parse(progressRaw) as SavedResults;
        totalQuestions = parsed.questions?.length ?? cert.totalQuestions;
        answeredCount = parsed.questions?.filter(
          (question) => question.selectedAnswer !== undefined,
        ).length ?? 0;
      } catch {}
    }

    let mistakeCount = 0;
    if (mistakesRaw) {
      try {
        const mistakes = JSON.parse(mistakesRaw);
        mistakeCount = Array.isArray(mistakes) ? mistakes.length : 0;
      } catch {}
    }

    let weakAreaCount = 0;
    if (weakRaw) {
      try {
        const weak = JSON.parse(weakRaw);
        weakAreaCount = Object.keys(weak).length;
      } catch {}
    }

    return {
      hasProgress,
      hasResults,
      latestPercentage,
      answeredCount,
      totalQuestions,
      mistakeCount,
      weakAreaCount,
    };
  } catch {
    return emptyCertProgress(cert);
  }
}

function isAttemptPoint(value: unknown): value is AttemptPoint {
  if (!value || typeof value !== "object") return false;
  const attempt = value as Partial<AttemptPoint>;

  return (
    typeof attempt.certSlug === "string" &&
    typeof attempt.percentage === "number" &&
    typeof attempt.answeredCount === "number" &&
    typeof attempt.correctCount === "number" &&
    typeof attempt.finishedAt === "string"
  );
}

function loadAttemptHistory(examCerts: Certification[]) {
  try {
    const raw = window.localStorage.getItem(attemptHistoryStorageKey);
    const saved: unknown = raw ? JSON.parse(raw) : [];
    const history = Array.isArray(saved) ? saved.filter(isAttemptPoint) : [];
    const existingFinishTimes = new Set(history.map((attempt) => attempt.finishedAt));

    for (const cert of examCerts) {
      const resultRaw = window.localStorage.getItem(resultsStorageKey(cert.slug));
      if (!resultRaw) continue;
      const result = parseResults(resultRaw);
      const questions = result?.questions ?? [];
      const finishedAt = result?.finishedAt;
      if (!finishedAt || existingFinishTimes.has(finishedAt)) continue;

      const answeredCount = questions.filter(
        (question) => question.selectedAnswer !== undefined,
      ).length;
      const correctCount = questions.filter((question) => question.isCorrect).length;
      if (!answeredCount) continue;

      history.push({
        certSlug: cert.slug,
        answeredCount,
        correctCount,
        percentage: Math.round((correctCount / answeredCount) * 100),
        finishedAt,
      });
    }

    return history;
  } catch {
    return [];
  }
}

function calendarDayKey(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function dateDayKey(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function utcTimeForDayKey(day: string) {
  const [year, month, date] = day.split("-").map(Number);
  return Date.UTC(year, month - 1, date);
}

function calculateStreak(attempts: AttemptPoint[]): StreakStats {
  const activeDays = new Set(
    attempts.map((attempt) => calendarDayKey(attempt.finishedAt)).filter((day) => day !== null),
  );
  if (!activeDays.size) return { current: 0, longest: 0, activeDays: 0 };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const cursor = new Date(today);
  if (!activeDays.has(dateDayKey(cursor))) cursor.setDate(cursor.getDate() - 1);

  let current = 0;
  while (activeDays.has(dateDayKey(cursor))) {
    current += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  const orderedDays = [...activeDays].sort();
  let longest = 0;
  let running = 0;
  let previousTime: number | null = null;
  for (const day of orderedDays) {
    const dateTime = utcTimeForDayKey(day);
    const consecutive = previousTime !== null && dateTime - previousTime === 86400000;
    running = consecutive ? running + 1 : 1;
    longest = Math.max(longest, running);
    previousTime = dateTime;
  }

  return { current, longest, activeDays: activeDays.size };
}

function isPaidPlan(plan: string | null) {
  return plan === "founder" || plan === "annual" || plan === "global";
}

// ── Component ──

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [exams, setExams] = useState<ExamRow[]>([]);
  const [status, setStatus] = useState("Loading your dashboard...");
  const [hasPaidPlan, setHasPaidPlan] = useState(false);
  const [localAttempts, setLocalAttempts] = useState<AttemptPoint[]>([]);

  const examCerts = useMemo(() => getExamCertifications(), []);
  const [certProgressMap, setCertProgressMap] = useState<Record<string, CertProgress>>(() =>
    Object.fromEntries(examCerts.map((cert) => [cert.slug, emptyCertProgress(cert)])),
  );

  useEffect(() => {
    const loadDashboard = async () => {
      const supabase = getSupabaseBrowserClient();
      const localUser = window.localStorage.getItem(userStorageKey);
      const savedPlan = window.localStorage.getItem(planStorageKey);
      setHasPaidPlan(isPaidPlan(savedPlan));
      setLocalAttempts(loadAttemptHistory(examCerts));
      setCertProgressMap(
        Object.fromEntries(examCerts.map((cert) => [cert.slug, loadCertProgress(cert)])),
      );

      if (!supabase) {
        setStatus("Connect Supabase to store users, exams, and analytics.");
        if (localUser) {
          const parsedUser = JSON.parse(localUser) as Profile;
          setProfile(parsedUser);
        }
        return;
      }

      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        setStatus("Sign in to see your saved backend profile and exam history.");
        if (localUser) {
          const parsedUser = JSON.parse(localUser) as Profile;
          setProfile(parsedUser);
          setStatus("");
        }
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("name,email,plan")
        .eq("id", userData.user.id)
        .single();

      const { data: examData } = await supabase
        .from("exams")
        .select(
          "id,certification,score,percentage,answered_count,correct_count,incorrect_count,created_at",
        )
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false })
        .limit(20);

      setProfile((profileData as Profile | null) ?? null);
      setExams((examData as ExamRow[] | null) ?? []);
      setStatus("");
    };

    void loadDashboard();
  }, [examCerts]);

  // Overall stats
  const overall = useMemo(() => {
    let totalAnswered = 0;
    let totalMistakes = 0;
    let totalWeakAreas = 0;
    let certsWithActivity = 0;

    for (const cert of examCerts) {
      const p = certProgressMap[cert.slug];
      totalAnswered += p.answeredCount;
      totalMistakes += p.mistakeCount;
      totalWeakAreas += p.weakAreaCount;
      if (p.hasProgress || p.hasResults) certsWithActivity++;
    }

    return { totalAnswered, totalMistakes, totalWeakAreas, certsWithActivity };
  }, [certProgressMap, examCerts]);

  const attemptsForInsights = useMemo(() => {
    const backendAttempts = exams.map((exam) => ({
      certSlug: exam.certification,
      percentage: exam.percentage,
      answeredCount: exam.answered_count,
      correctCount: exam.correct_count,
      finishedAt: exam.created_at,
    }));
    const combined = [...backendAttempts];

    for (const local of localAttempts) {
      const isBackendDuplicate = backendAttempts.some((backend) => {
        const difference = Math.abs(
          new Date(backend.finishedAt).getTime() - new Date(local.finishedAt).getTime(),
        );
        return (
          difference < 120000 &&
          backend.certSlug === local.certSlug &&
          backend.percentage === local.percentage
        );
      });
      if (!isBackendDuplicate) combined.push(local);
    }

    return combined.sort(
      (left, right) => new Date(left.finishedAt).getTime() - new Date(right.finishedAt).getTime(),
    );
  }, [exams, localAttempts]);

  const trendPoints = attemptsForInsights.slice(-8);
  const streak = useMemo(() => calculateStreak(attemptsForInsights), [attemptsForInsights]);
  const chartPoints = trendPoints
    .map((attempt, index) => {
      const x = trendPoints.length === 1 ? 320 : 32 + (index / (trendPoints.length - 1)) * 576;
      const y = 168 - (attempt.percentage / 100) * 136;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <main className="coming-page">
      <section className="coming-shell dashboard-shell">
        <FadeIn>
        <p className="intro-eyebrow">Dashboard</p>
        <h1>{profile?.name ?? "Your Certifications Dashboard"}</h1>
        <p>
          {profile?.email
            ? `${profile.email} · ${profile.plan ?? "free"} plan`
            : status}
        </p>
        </FadeIn>

        {/* Overall Stats */}
        <StaggerContainer className="dash-overall-grid">
          <StaggerItem>
          <div className="dash-overall-card">
            <p className="dash-overall-label">Certs Practiced</p>
            <strong className="dash-overall-value">
              <AnimatedCounter value={overall.certsWithActivity} />/{examCerts.length}
            </strong>
          </div>
          </StaggerItem>
          <StaggerItem>
          <div className="dash-overall-card">
            <p className="dash-overall-label">Questions Answered</p>
            <strong className="dash-overall-value">
              <AnimatedCounter value={overall.totalAnswered} />
            </strong>
          </div>
          </StaggerItem>
          <StaggerItem>
          <div className="dash-overall-card">
            <p className="dash-overall-label">Mistakes Logged</p>
            <strong className="dash-overall-value">
              <AnimatedCounter value={overall.totalMistakes} />
            </strong>
          </div>
          </StaggerItem>
          <StaggerItem>
          <div className="dash-overall-card">
            <p className="dash-overall-label">Weak Areas Tracked</p>
            <strong className="dash-overall-value">
              <AnimatedCounter value={overall.totalWeakAreas} />
            </strong>
          </div>
          </StaggerItem>
        </StaggerContainer>

        <div className="dash-insights-grid">
          <section className="dash-trends-card">
            <div className="dash-insight-heading">
              <div>
                <p className="dash-kicker">Performance</p>
                <h2 className="dash-section-title">Score Trends</h2>
              </div>
              <span className="dash-attempt-count">{attemptsForInsights.length} attempts</span>
            </div>
            {trendPoints.length ? (
              <>
                <svg
                  className="dash-trend-chart"
                  viewBox="0 0 640 196"
                  role="img"
                  aria-label={`Score trend across the latest ${trendPoints.length} attempts`}
                >
                  {[0, 50, 100].map((scoreValue) => {
                    const y = 168 - (scoreValue / 100) * 136;
                    return (
                      <g key={scoreValue}>
                        <line x1="32" y1={y} x2="608" y2={y} />
                        <text x="4" y={y + 4}>{scoreValue}</text>
                      </g>
                    );
                  })}
                  {trendPoints.length > 1 && <polyline points={chartPoints} />}
                  {trendPoints.map((attempt, index) => {
                    const x = trendPoints.length === 1 ? 320 : 32 + (index / (trendPoints.length - 1)) * 576;
                    const y = 168 - (attempt.percentage / 100) * 136;
                    return (
                      <g key={`${attempt.finishedAt}-${attempt.certSlug}`}>
                        <circle cx={x} cy={y} r="6" />
                        <text className="dash-trend-value" x={x} y={y - 14}>
                          {attempt.percentage}%
                        </text>
                        <text className="dash-trend-date" x={x} y="190">
                          {new Date(attempt.finishedAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </text>
                      </g>
                    );
                  })}
                </svg>
                <p className="dash-chart-note">Latest eight completed practice or exam sessions.</p>
              </>
            ) : (
              <p className="dash-empty-insight">Complete a practice session to begin your score trend.</p>
            )}
          </section>

          <section className="dash-streak-card">
            <p className="dash-kicker">Consistency</p>
            <h2 className="dash-section-title">Study Streak</h2>
            <div className="dash-current-streak">
              <strong><AnimatedCounter value={streak.current} /></strong>
              <span>{streak.current === 1 ? "day" : "days"} active</span>
            </div>
            <div className="dash-streak-metrics">
              <div>
                <strong><AnimatedCounter value={streak.longest} /></strong>
                <span>Longest streak</span>
              </div>
              <div>
                <strong><AnimatedCounter value={streak.activeDays} /></strong>
                <span>Study days</span>
              </div>
            </div>
            <p className="dash-streak-note">
              {streak.current
                ? "Complete a session each day to keep your streak growing."
                : "Complete a session today to start a streak."}
            </p>
          </section>
        </div>

        {/* Certification Progress Cards */}
        <StaggerContainer className="dash-cert-grid">
          {examCerts.map((cert) => {
            const progress = certProgressMap[cert.slug];
            const examHref = `/exam?cert=${cert.slug}&plan=${hasPaidPlan ? "live" : "free"}&fresh=1`;

            return (
              <StaggerItem key={cert.slug}>
              <div className="dash-cert-card">
                {/* Accent bar */}
                <div
                  className="dash-cert-accent"
                  style={{ background: cert.color }}
                />

                <div className="dash-cert-body">
                  <div className="dash-cert-header">
                    <span className="dash-cert-icon">{cert.icon}</span>
                    <div>
                      <h3 className="dash-cert-name">{cert.shortName}</h3>
                      <p className="dash-cert-desc">{cert.description}</p>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="dash-cert-stats">
                    <div className="dash-cert-stat">
                      <span className="dash-cert-stat-label">Answered</span>
                      <strong className="dash-cert-stat-value">
                        {progress.answeredCount}/{progress.totalQuestions}
                      </strong>
                    </div>
                    {progress.latestPercentage !== null && (
                      <div className="dash-cert-stat">
                        <span className="dash-cert-stat-label">Latest Score</span>
                        <strong
                          className="dash-cert-stat-value"
                          style={{
                            color:
                              progress.latestPercentage >= 80
                                ? "var(--accent-green)"
                                : progress.latestPercentage >= 60
                                  ? "#d97706"
                                  : "var(--accent-red)",
                          }}
                        >
                          {progress.latestPercentage}%
                        </strong>
                      </div>
                    )}
                    <div className="dash-cert-stat">
                      <span className="dash-cert-stat-label">Mistakes</span>
                      <strong className="dash-cert-stat-value">
                        {progress.mistakeCount}
                      </strong>
                    </div>
                    <div className="dash-cert-stat">
                      <span className="dash-cert-stat-label">Weak Areas</span>
                      <strong className="dash-cert-stat-value">
                        {progress.weakAreaCount}
                      </strong>
                    </div>
                  </div>

                  {/* Progress bar */}
                  {progress.answeredCount > 0 && (
                    <div className="dash-cert-progress-track">
                      <span
                        style={{
                          width: `${Math.min(100, Math.round((progress.answeredCount / progress.totalQuestions) * 100))}%`,
                          background: cert.color,
                        }}
                      />
                    </div>
                  )}

                  {/* Actions */}
                  <div className="dash-cert-actions">
                    <Link href={examHref} className="intro-primary-action">
                      {progress.hasProgress ? "Resume" : "Start Practice"}
                    </Link>
                    <Link
                      href={`/learn?cert=${cert.slug}`}
                      className="intro-secondary-action"
                    >
                      Learn
                    </Link>
                    {progress.hasResults && (
                      <Link
                        href={`/results?cert=${cert.slug}`}
                        className="intro-secondary-action"
                      >
                        Results
                      </Link>
                    )}
                  </div>
                </div>
              </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* Recent Exam History (from Supabase) */}
        {exams.length > 0 && (
          <FadeIn>
          <div className="dash-history-section">
            <h2 className="dash-section-title">Recent Exam History</h2>
            <div className="dash-history-list">
              {exams.slice(0, 10).map((exam) => {
                const cert = examCerts.find((c) => c.slug === exam.certification);
                return (
                  <div key={exam.id} className="dash-history-row">
                    <span className="dash-history-icon">
                      {cert?.icon ?? "📋"}
                    </span>
                    <div className="dash-history-info">
                      <strong>{cert?.shortName ?? exam.certification}</strong>
                      <span className="dash-history-meta">
                        {new Date(exam.created_at).toLocaleDateString()} ·{" "}
                        {exam.answered_count} answered
                      </span>
                    </div>
                    <div className="dash-history-score">
                      <span
                        className="dash-history-pct"
                        style={{
                          color:
                            exam.percentage >= 80
                              ? "var(--accent-green)"
                              : exam.percentage >= 60
                                ? "#d97706"
                                : "var(--accent-red)",
                        }}
                      >
                        {exam.percentage}%
                      </span>
                      <span className="dash-history-detail">
                        {exam.correct_count}/{exam.answered_count}
                      </span>
                    </div>
                    <Link
                      href={`/results?cert=${exam.certification}`}
                      className="dash-history-link"
                    >
                      View
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
          </FadeIn>
        )}

        {/* Quick actions */}
        <div className="intro-actions" style={{ marginTop: 24 }}>
          <Link href="/exam?plan=free&fresh=1" className="intro-primary-action">
            Start PMP Practice
          </Link>
          <Link href="/pricing" className="intro-secondary-action">
            View Pricing
          </Link>
          <Link href="/learn" className="intro-secondary-action">
            Learning Hub
          </Link>
        </div>
      </section>
    </main>
  );
}
