"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  buildFreeTopicQuestions,
  buildRandomFixedPracticeSet,
} from "../freeQuestionBank";
import { getSupabaseBrowserClient } from "../lib/supabaseClient";
import { getLearningTopicForQuestion, learningTopics } from "../learningTopics";
import { certifications, getCertification, type CertSlug } from "../certifications";
import { getStarterQuestions } from "../starterQuestions";

type GeneratedQuestion = {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  whyOthersWrong?: string[];
  mindsetTip?: string;
  domain?: string;
  topic?: string;
  difficulty?: string;
  source?: string;
  warning?: string;
};

type ExamQuestion = GeneratedQuestion & {
  id: string;
  selectedAnswer?: number;
  markedForReview?: boolean;
  reviewed?: boolean;
  isCorrect?: boolean;
};

type ExamMode = "exam" | "practice";
type DomainFilter = string;
type DifficultyFilter = string;
type FreeTopicSlug = string;
type PracticeAccess = "free" | "live";
type SavedProgress = {
  certSlug: string;
  accessType?: PracticeAccess;
  isFreeTopicPractice?: boolean;
  freeTopicSlug?: FreeTopicSlug | null;
  mode?: ExamMode;
  domain?: DomainFilter;
  difficulty?: DifficultyFilter;
  questions?: ExamQuestion[];
  questionBank?: GeneratedQuestion[];
  questionNumber?: number;
  selectedAnswers?: Record<number, number>;
  reviewedAnswers?: Record<number, boolean>;
  markedForReview?: Record<number, boolean>;
  timeLeft?: number;
  score?: number;
};

const palettePageSize = 60;
const liveStoredStarterCount = 25;
const firstApiTriggerAnswerCount = 10;
const desiredBufferAhead = 25;
const planStorageKey = "pmp-simulator-plan-v1";
const userStorageKey = "pmp-simulator-user-v1";
const freeTopicQuestionCount = 150;

// Storage key helpers with cert isolation
function getStorageKey(prefix: string, certSlug: string): string {
  const cert = getCertification(certSlug);
  return `pmp-simulator-${cert.storagePrefix}-${prefix}`;
}
const progressStorageKey = (s: string) => `pmp-${s}-progress-v1`;
const resultsStorageKey = (s: string) => `pmp-${s}-latest-results-v1`;
const mistakeNotebookStorageKey = (s: string) => `pmp-${s}-mistake-notebook-v1`;
const weakAreaStorageKey = (s: string) => `pmp-${s}-weak-area-stats-v1`;

function getFreeTopicSlugs(certSlug: string): string[] {
  const cert = getCertification(certSlug);
  return cert.freeTopicSlugs;
}

function getPaidTopicSlugs(certSlug: string): string[] {
  const cert = getCertification(certSlug);
  return cert.topicSlugs;
}

function getTotalQuestions(certSlug: string): number {
  const cert = getCertification(certSlug);
  return cert.totalQuestions;
}

function getDomainOptions(certSlug: string) {
  const cert = getCertification(certSlug);
  return cert.domains;
}

function getTimeLimit(certSlug: string): number {
  const cert = getCertification(certSlug);
  return cert.timeLimitMinutes * 60;
}

function cleanOption(option: string) {
  return option.replace(/^[A-D][).:-]\s*/i, "").trim();
}

function cleanQuestion(question: GeneratedQuestion): GeneratedQuestion {
  return {
    ...question,
    options: question.options.slice(0, 4).map(cleanOption),
    whyOthersWrong: question.whyOthersWrong?.slice(0, 4),
  };
}

function toExamQuestion(
  question: GeneratedQuestion | ExamQuestion,
  index: number,
): ExamQuestion {
  const cleanedQuestion = cleanQuestion(question);
  const maybeExamQuestion = question as Partial<ExamQuestion>;

  return {
    ...cleanedQuestion,
    id: maybeExamQuestion.id ?? `starter-${index + 1}`,
    selectedAnswer: maybeExamQuestion.selectedAnswer,
    markedForReview: maybeExamQuestion.markedForReview ?? false,
    reviewed: maybeExamQuestion.reviewed ?? false,
    isCorrect:
      maybeExamQuestion.selectedAnswer === undefined
        ? undefined
        : maybeExamQuestion.selectedAnswer === cleanedQuestion.correctAnswer,
  };
}

function buildQuestionsFromSavedProgress(savedProgress: SavedProgress, certSlug: string) {
  if (savedProgress.questions?.length) {
    return savedProgress.questions.map(toExamQuestion);
  }

  const baseQuestions = savedProgress.questionBank?.length
    ? savedProgress.questionBank
    : getStarterQuestions(certSlug);

  return baseQuestions.map((question, index) => {
    const selectedAnswer = savedProgress.selectedAnswers?.[index];
    return {
      ...toExamQuestion(question, index),
      selectedAnswer,
      markedForReview: savedProgress.markedForReview?.[index] ?? false,
      reviewed: savedProgress.reviewedAnswers?.[index] ?? false,
      isCorrect:
        selectedAnswer === undefined
          ? undefined
          : selectedAnswer === question.correctAnswer,
    };
  });
}

function getFallbackWhyWrong(question: GeneratedQuestion, optionIndex: number) {
  if (optionIndex === question.correctAnswer) {
    return "This is the best answer because it addresses the situation with collaboration, analysis, and appropriate governance before taking irreversible action.";
  }
  return "This option is weaker because it moves too quickly to escalation, avoidance, unilateral action, or a scope decision before the project manager has clarified the facts and engaged the right people.";
}

function getMindsetTip(question: GeneratedQuestion) {
  return (
    question.mindsetTip ??
    "PMI mindset: first understand the issue, collaborate with the team and stakeholders, assess impact, then act through the right process."
  );
}

function saveMistakeToNotebook(question: ExamQuestion, selectedAnswer: number, certSlug: string) {
  const topic = getLearningTopicForQuestion(question);
  const mistake = {
    id: `${question.id}-${Date.now()}`,
    question: cleanUserQuestionText(question.question),
    selectedAnswer,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
    domain: topic.domain,
    topic: topic.title,
    difficulty: question.difficulty ?? "Mixed",
    learningPath: `/learn/${topic.slug}`,
    savedAt: new Date().toISOString(),
  };

  try {
    const existingMistakes = window.localStorage.getItem(
      mistakeNotebookStorageKey(certSlug),
    );
    const mistakes = existingMistakes ? JSON.parse(existingMistakes) : [];
    window.localStorage.setItem(
      mistakeNotebookStorageKey(certSlug),
      JSON.stringify([mistake, ...mistakes].slice(0, 100)),
    );
  } catch {
    // Learning recommendations should never block answer review.
  }
}

function saveIncorrectAnswersToNotebook(questions: ExamQuestion[], certSlug: string) {
  questions
    .filter(
      (q) =>
        q.selectedAnswer !== undefined &&
        q.selectedAnswer !== q.correctAnswer,
    )
    .forEach((q) => {
      saveMistakeToNotebook(q, q.selectedAnswer as number, certSlug);
    });
}

function loadSavedProgress(certSlug: string): SavedProgress | null {
  if (typeof window === "undefined") return null;
  try {
    const key = progressStorageKey(certSlug);
    const saved = window.localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as SavedProgress) : null;
  } catch {
    return null;
  }
}

function loadPaidPlan() {
  if (typeof window === "undefined") return false;
  try {
    const plan = window.localStorage.getItem(planStorageKey);
    return plan === "founder" || plan === "annual" || plan === "global";
  } catch {
    return false;
  }
}

function loadSignedInUser() {
  if (typeof window === "undefined") return false;
  try {
    return Boolean(window.localStorage.getItem(userStorageKey));
  } catch {
    return false;
  }
}

function buildStoredPracticeQuestions(accessType: PracticeAccess, certSlug: string, count?: number) {
  const cert = getCertification(certSlug);
  const allowedSlugs = accessType === "live" ? cert.topicSlugs : cert.freeTopicSlugs;
  return buildRandomFixedPracticeSet(count ?? cert.totalQuestions, allowedSlugs).map(toExamQuestion);
}

function buildLiveExamStarterQuestions(certSlug: string) {
  const cert = getCertification(certSlug);
  return buildRandomFixedPracticeSet(liveStoredStarterCount, cert.topicSlugs).map(toExamQuestion);
}

function cleanUserQuestionText(question: string) {
  return question
    .replace(/^Practice bank \d+:\s*/i, "")
    .replace(/^Topic practice \d+:\s*/i, "")
    .trim();
}

function saveWeakAreaStats(questions: ExamQuestion[], certSlug: string) {
  const answered = questions.filter((q) => q.selectedAnswer !== undefined);
  if (!answered.length) return;

  try {
    const existing = window.localStorage.getItem(weakAreaStorageKey(certSlug));
    const stats = existing ? JSON.parse(existing) : {};
    answered.forEach((question) => {
      const topic = getLearningTopicForQuestion(question);
      const key = topic.slug;
      stats[key] ??= { domain: topic.domain, topic: topic.title, attempts: 0, correct: 0, mistakes: 0 };
      stats[key].attempts += 1;
      if (question.isCorrect) stats[key].correct += 1;
      else stats[key].mistakes += 1;
    });
    window.localStorage.setItem(weakAreaStorageKey(certSlug), JSON.stringify(stats));
  } catch {
    // non-blocking
  }
}

async function saveExamToDatabase(
  questions: ExamQuestion[],
  result: {
    certSlug: string;
    mode: ExamMode;
    domain: DomainFilter;
    difficulty: DifficultyFilter;
    score: number;
    answeredCount: number;
    totalQuestions: number;
    timeLeft: number;
  },
) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return;

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return;

  const correctCount = questions.filter((q) => q.isCorrect).length;
  const incorrectCount = result.answeredCount - correctCount;
  const percentage = result.answeredCount ? Math.round((correctCount / result.answeredCount) * 100) : 0;

  const { data: exam } = await supabase
    .from("exams")
    .insert({
      user_id: user.id,
      certification: result.certSlug,
      mode: result.mode,
      domain: result.domain,
      difficulty: result.difficulty,
      score: result.score,
      percentage,
      answered_count: result.answeredCount,
      correct_count: correctCount,
      incorrect_count: incorrectCount,
      total_questions: result.totalQuestions,
      time_left: result.timeLeft,
    })
    .select("id")
    .single();

  if (!exam) return;

  const answerRows = questions
    .filter((q) => q.selectedAnswer !== undefined)
    .map((q) => {
      const topic = getLearningTopicForQuestion(q);
      return {
        exam_id: exam.id,
        user_id: user.id,
        certification: result.certSlug,
        question: cleanUserQuestionText(q.question),
        selected_answer: q.selectedAnswer,
        correct_answer: q.correctAnswer,
        is_correct: q.isCorrect === true,
        topic: topic.title,
        domain: topic.domain,
        difficulty: q.difficulty ?? "Mixed",
      };
    });

  if (answerRows.length) {
    await supabase.from("answers").insert(answerRows);
  }
}

// ── Component ──

export default function ExamPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read cert slug from URL
  const certSlug = (searchParams.get("cert") ?? "pmp") as CertSlug;
  const cert = getCertification(certSlug);

  const [questions, setQuestions] = useState<ExamQuestion[]>(() =>
    getStarterQuestions(certSlug).map(toExamQuestion),
  );
  const questionsRef = useRef(questions);
  const isPrefetchingRef = useRef(false);
  const [hasLoadedProgress, setHasLoadedProgress] = useState(false);
  const [mode, setMode] = useState<ExamMode>("practice");
  const [domain, setDomain] = useState<DomainFilter>(cert.defaultDomain || "Mixed");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("Mixed");
  const [freeTopicSlug, setFreeTopicSlug] = useState<FreeTopicSlug | null>(null);
  const [isFreeTopicPractice, setIsFreeTopicPractice] = useState(false);
  const [hasPaidPlan, setHasPaidPlan] = useState(false);
  const [accessType, setAccessType] = useState<PracticeAccess>("free");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [paletteSegment, setPaletteSegment] = useState(0);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(getTimeLimit(certSlug));
  const [prefetchError, setPrefetchError] = useState("");

  // Derive cert-specific constants
  const totalQuestions = useMemo(() => getTotalQuestions(certSlug), [certSlug]);
  const paidTopicSlugs = useMemo(() => getPaidTopicSlugs(certSlug), [certSlug]);
  const freeTopicSlugsArr = useMemo(() => getFreeTopicSlugs(certSlug), [certSlug]);
  const domainOptions = useMemo(() => getDomainOptions(certSlug), [certSlug]);
  const currentProgressKey = useMemo(() => progressStorageKey(certSlug), [certSlug]);

  const currentQuestion = questions[currentQuestionIndex] ?? null;
  const activeTotalQuestions = isFreeTopicPractice ? freeTopicQuestionCount : totalQuestions;
  const questionNumber = currentQuestionIndex + 1;
  const selectedOption = currentQuestion?.selectedAnswer ?? null;
  const hasReviewedCurrent = currentQuestion?.reviewed === true;
  const answeredCount = questions.filter((q) => q.selectedAnswer !== undefined).length;
  const markedCount = questions.filter((q) => q.markedForReview).length;
  const visibleDomainOptions = hasPaidPlan
    ? domainOptions
    : domainOptions.filter((option) => !option.paidOnly);
  const isCurrentCorrect =
    currentQuestion &&
    selectedOption !== null &&
    currentQuestion.correctAnswer === selectedOption;
  const learningTopic = currentQuestion
    ? getLearningTopicForQuestion(currentQuestion)
    : null;
  const bufferedAhead = currentQuestion
    ? Math.max(0, questions.length - questionNumber)
    : questions.length;

  const score = useMemo(
    () => questions.reduce((total, q) => (q.isCorrect ? total + 1 : total), 0),
    [questions],
  );

  const appendQuestion = useCallback(
    (question: GeneratedQuestion) => {
      setQuestions((prev) => {
        if (prev.length >= activeTotalQuestions) return prev;
        const next = [
          ...prev,
          {
            ...toExamQuestion(question, prev.length),
            id: `generated-${Date.now()}-${prev.length + 1}`,
          },
        ];
        questionsRef.current = next;
        return next;
      });
    },
    [activeTotalQuestions],
  );

  const fetchGeneratedQuestion = useCallback(async () => {
    const params = new URLSearchParams();
    if (domain !== "Mixed") params.set("domain", domain);
    if (difficulty !== "Mixed") params.set("difficulty", difficulty);
    params.set("cert", certSlug);

    const response = await fetch(`/api/generate-question?${params.toString()}`, {
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Failed to fetch question");
    return (await response.json()) as GeneratedQuestion;
  }, [difficulty, domain, certSlug]);

  const ensureQuestionBank = useCallback(
    async (targetCount: number) => {
      if (isPrefetchingRef.current) return;
      isPrefetchingRef.current = true;
      try {
        while (
          questionsRef.current.length < targetCount &&
          questionsRef.current.length < activeTotalQuestions
        ) {
          const generatedQuestion = await fetchGeneratedQuestion();
          appendQuestion(generatedQuestion);
          setPrefetchError("");
        }
      } catch (error) {
        console.error(error);
        setPrefetchError("AI question generation paused. The local starter bank is still ready.");
      } finally {
        isPrefetchingRef.current = false;
      }
    },
    [activeTotalQuestions, appendQuestion, fetchGeneratedQuestion],
  );

  useEffect(() => {
    questionsRef.current = questions;
  }, [questions]);

  useEffect(() => {
    const loadHandle = window.setTimeout(() => {
      if (!loadSignedInUser()) {
        const nextPath = `${window.location.pathname}${window.location.search}`;
        router.replace(`/login?next=${encodeURIComponent(nextPath)}`);
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const requestedTopic = params.get("topic") as FreeTopicSlug | null;
      const requestedFreeMode = params.get("free") === "1";
      const requestedPlan = params.get("plan");
      const forceFreshSession = params.get("fresh") === "1";
      const isSupportedTopic = requestedTopic !== null && requestedTopic in learningTopics;

      const userHasPaidPlan = loadPaidPlan();
      const nextAccessType: PracticeAccess =
        requestedPlan === "free" || !userHasPaidPlan ? "free" : "live";

      const canOpenRequestedTopic =
        requestedTopic !== null &&
        (userHasPaidPlan || freeTopicSlugsArr.includes(requestedTopic));

      setHasPaidPlan(userHasPaidPlan);
      setAccessType(nextAccessType);

      if (requestedFreeMode && requestedTopic && isSupportedTopic && canOpenRequestedTopic) {
        const freeQuestions = buildFreeTopicQuestions(requestedTopic).map(toExamQuestion);
        setQuestions(freeQuestions);
        questionsRef.current = freeQuestions;
        setMode("practice");
        setDomain(freeQuestions[0]?.domain ?? "Mixed");
        setDifficulty("Mixed");
        setFreeTopicSlug(requestedTopic);
        setIsFreeTopicPractice(true);
        setAccessType("free");
        setCurrentQuestionIndex(0);
        setPaletteSegment(0);
        setShowAnswer(false);
        setTimeLeft(getTimeLimit(certSlug));
        setHasLoadedProgress(true);
        return;
      }

      const savedProgress = loadSavedProgress(certSlug);
      const canUseSavedProgress = savedProgress?.accessType === nextAccessType && !forceFreshSession;

      if (canUseSavedProgress && savedProgress) {
        const savedQuestionIndex = Math.max(0, (savedProgress.questionNumber ?? 1) - 1);
        const savedQuestions = buildQuestionsFromSavedProgress(savedProgress, certSlug);
        setQuestions(savedQuestions);
        questionsRef.current = savedQuestions;
        setMode(savedProgress.mode ?? "practice");
        setDomain(savedProgress.domain ?? "Mixed");
        setDifficulty(savedProgress.difficulty ?? "Mixed");
        setFreeTopicSlug(savedProgress.freeTopicSlug ?? null);
        setIsFreeTopicPractice(savedProgress.isFreeTopicPractice ?? false);
        setCurrentQuestionIndex(savedQuestionIndex);
        setPaletteSegment(Math.floor(savedQuestionIndex / palettePageSize));
        setShowAnswer(savedQuestions[savedQuestionIndex]?.reviewed ?? false);
        setTimeLeft(savedProgress.timeLeft ?? getTimeLimit(certSlug));
      } else if (nextAccessType === "free") {
        const fixedQuestions = buildStoredPracticeQuestions("free", certSlug);
        setQuestions(fixedQuestions);
        questionsRef.current = fixedQuestions;
        setMode("practice");
      } else {
        const starterQuestionsForLiveExam = buildLiveExamStarterQuestions(certSlug);
        setQuestions(starterQuestionsForLiveExam);
        questionsRef.current = starterQuestionsForLiveExam;
        setMode("exam");
        setDomain("Mixed");
        setDifficulty("Mixed");
        setCurrentQuestionIndex(0);
        setPaletteSegment(0);
        setShowAnswer(false);
        setTimeLeft(getTimeLimit(certSlug));
      }

      setHasLoadedProgress(true);
    }, 0);

    return () => window.clearTimeout(loadHandle);
  }, [router, certSlug, freeTopicSlugsArr]);

  // Prefetch AI questions for live exam
  useEffect(() => {
    if (isFreeTopicPractice || accessType !== "live" || !hasPaidPlan || mode !== "exam") return;
    if (answeredCount < firstApiTriggerAnswerCount) return;

    const targetCount = Math.min(activeTotalQuestions, questionNumber + desiredBufferAhead);
    const prefetchHandle = window.setTimeout(() => {
      void ensureQuestionBank(targetCount);
    }, 0);
    return () => window.clearTimeout(prefetchHandle);
  }, [activeTotalQuestions, accessType, answeredCount, hasPaidPlan, ensureQuestionBank, isFreeTopicPractice, mode, questionNumber]);

  // Timer
  useEffect(() => {
    if (mode === "practice") return;
    const timer = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          window.clearInterval(timer);
          window.alert("Time is up!");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [mode]);

  // Save progress
  useEffect(() => {
    if (!hasLoadedProgress) return;

    const selectedAnswers: Record<number, number> = {};
    const reviewedAnswers: Record<number, boolean> = {};
    const markedForReview: Record<number, boolean> = {};

    questions.forEach((q, i) => {
      if (q.selectedAnswer !== undefined) selectedAnswers[i] = q.selectedAnswer;
      if (q.reviewed) reviewedAnswers[i] = true;
      if (q.markedForReview) markedForReview[i] = true;
    });

    window.localStorage.setItem(
      currentProgressKey,
      JSON.stringify({
        certSlug,
        accessType,
        isFreeTopicPractice,
        freeTopicSlug,
        mode,
        domain,
        difficulty,
        questions,
        questionNumber,
        selectedAnswers,
        reviewedAnswers,
        markedForReview,
        timeLeft,
        score,
      }),
    );
  }, [accessType, certSlug, currentProgressKey, difficulty, domain, freeTopicSlug, hasLoadedProgress, isFreeTopicPractice, mode, questions, questionNumber, score, timeLeft]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const handleAnswer = (index: number) => {
    setQuestions((prev) => {
      const next = prev.map((q, i) =>
        i === currentQuestionIndex
          ? {
              ...q,
              selectedAnswer: index,
              reviewed: mode === "exam" ? q.reviewed : false,
              isCorrect: index === q.correctAnswer,
            }
          : q,
      );
      questionsRef.current = next;
      return next;
    });
    setShowAnswer(false);
  };

  const handleModeChange = (nextMode: ExamMode) => {
    if (nextMode === mode) return;
    if (accessType === "live" && hasPaidPlan) {
      const nextQuestions =
        nextMode === "practice"
          ? buildStoredPracticeQuestions("live", certSlug)
          : buildLiveExamStarterQuestions(certSlug);
      setQuestions(nextQuestions);
      questionsRef.current = nextQuestions;
      setMode(nextMode);
      setCurrentQuestionIndex(0);
      setPaletteSegment(0);
      setShowAnswer(false);
      setTimeLeft(getTimeLimit(certSlug));
      setPrefetchError("");
      return;
    }
    setMode(nextMode);
  };

  const handleReviewAnswer = () => {
    if (selectedOption === null) return;
    setQuestions((prev) => {
      const next = prev.map((q, i) =>
        i === currentQuestionIndex ? { ...q, reviewed: true } : q,
      );
      questionsRef.current = next;
      return next;
    });
    if (currentQuestion && selectedOption !== currentQuestion.correctAnswer) {
      saveMistakeToNotebook(currentQuestion, selectedOption, certSlug);
    }
    setShowAnswer(true);
  };

  const toggleMarkedForReview = () => {
    setQuestions((prev) => {
      const next = prev.map((q, i) =>
        i === currentQuestionIndex ? { ...q, markedForReview: !q.markedForReview } : q,
      );
      questionsRef.current = next;
      return next;
    });
  };

  const handleNext = () => {
    if (!currentQuestion || selectedOption === null || (mode === "practice" && !hasReviewedCurrent)) return;
    if (questionNumber >= activeTotalQuestions) {
      handleSubmitExam();
      return;
    }
    const nextIndex = questionNumber; // 0-based
    setCurrentQuestionIndex(nextIndex);
    setPaletteSegment(Math.floor(nextIndex / palettePageSize));
    setShowAnswer(questions[nextIndex]?.reviewed === true);
  };

  const handleBack = () => {
    const nextIndex = Math.max(0, currentQuestionIndex - 1);
    setCurrentQuestionIndex(nextIndex);
    setPaletteSegment(Math.floor(nextIndex / palettePageSize));
    setShowAnswer(questions[nextIndex]?.reviewed === true);
  };

  const handleQuestionJump = (index: number) => {
    setCurrentQuestionIndex(index);
    setPaletteSegment(Math.floor(index / palettePageSize));
    setShowAnswer(questions[index]?.reviewed === true);
  };

  const handleSubmitExam = () => {
    const finishedAt = new Date().toISOString();
    const cleanedQuestions = questions.map((q) => ({
      ...q,
      question: cleanUserQuestionText(q.question),
    }));

    saveWeakAreaStats(cleanedQuestions, certSlug);
    saveIncorrectAnswersToNotebook(cleanedQuestions, certSlug);
    void saveExamToDatabase(cleanedQuestions, {
      certSlug,
      mode,
      domain,
      difficulty,
      score,
      answeredCount,
      totalQuestions: activeTotalQuestions,
      timeLeft,
    });

    window.localStorage.setItem(
      resultsStorageKey(certSlug),
      JSON.stringify({
        certSlug,
        mode,
        domain,
        difficulty,
        freeTopicSlug,
        isFreeTopicPractice,
        questions: cleanedQuestions,
        score,
        answeredCount,
        availableQuestions: questions.length,
        totalQuestions: activeTotalQuestions,
        timeLeft,
        finishedAt,
      }),
    );

    router.push(`/results?cert=${encodeURIComponent(certSlug)}`);
  };

  const paletteStart = paletteSegment * palettePageSize + 1;
  const visibleQuestionNumbers = Array.from(
    { length: Math.min(palettePageSize, activeTotalQuestions - paletteStart + 1) },
    (_, i) => paletteStart + i,
  );
  const paletteSegmentCount = Math.ceil(activeTotalQuestions / palettePageSize);
  const progressPercent = (questionNumber / activeTotalQuestions) * 100;

  return (
    <main className="exam-page">
      <div className="exam-shell">
        <div className="exam-breadcrumb">
          {cert.title} &gt; {mode === "exam" ? "Timed Exam" : "Practice Mode"}
        </div>

        <div className="exam-overview">
          <div>
            <p className="exam-overview-label">Question</p>
            <strong>{questionNumber} of {activeTotalQuestions}</strong>
          </div>
          <div>
            <p className="exam-overview-label">Answered</p>
            <strong>{answeredCount}</strong>
          </div>
          <div>
            <p className="exam-overview-label">
              {isFreeTopicPractice ? "Free Topic" : accessType === "live" && mode === "exam" ? "Live Set" : "Practice Set"}
            </p>
            <strong>{questions.length}/{activeTotalQuestions}</strong>
          </div>
          <div>
            <p className="exam-overview-label">Ready Ahead</p>
            <strong>{bufferedAhead}</strong>
          </div>
        </div>

        <div className="exam-mode-bar" aria-label="Simulator mode and question filters">
          {isFreeTopicPractice ? (
            <div className="exam-locked-topic">
              Free {domain} Practice · {freeTopicQuestionCount} questions
            </div>
          ) : (
            <div className="exam-mode-group" role="group" aria-label="Mode">
              <button
                type="button"
                onClick={() => handleModeChange("practice")}
                className={mode === "practice" ? "exam-mode-active" : ""}
              >
                Learning Practice
              </button>
              <button
                type="button"
                onClick={() => handleModeChange("exam")}
                className={mode === "exam" ? "exam-mode-active" : ""}
              >
                Final Exam
              </button>
            </div>
          )}

          {!isFreeTopicPractice && !hasPaidPlan && (
            <Link href="/pricing" className="exam-upgrade-link">
              Unlock live {cert.shortName} test
            </Link>
          )}

          {!isFreeTopicPractice && (
            <>
              <label>
                Domain
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value as DomainFilter)}
                >
                  {visibleDomainOptions.map((option) => (
                    <option key={option.label} value={option.label}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Difficulty
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as DifficultyFilter)}
                >
                  {["Mixed", "Easy", "Medium", "Hard"].map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </label>
            </>
          )}
        </div>

        <div className="exam-progress-track" aria-hidden="true">
          <span style={{ width: `${progressPercent}%` }} />
        </div>

        <div className="exam-palette-controls" aria-label="Question ranges">
          {Array.from({ length: paletteSegmentCount }, (_, s) => s).map((segment) => {
            const start = segment * palettePageSize + 1;
            const end = Math.min(activeTotalQuestions, start + palettePageSize - 1);
            return (
              <button
                key={segment}
                type="button"
                onClick={() => setPaletteSegment(segment)}
                className={paletteSegment === segment ? "exam-segment-active" : ""}
              >
                {start}-{end}
              </button>
            );
          })}
        </div>

        <div className="exam-palette" aria-label="Question navigator">
          {visibleQuestionNumbers.map((number) => {
            const index = number - 1;
            const isCurrent = number === questionNumber;
            const paletteQuestion = questions[index];
            const isAnswered = paletteQuestion?.selectedAnswer !== undefined;
            const isMarked = paletteQuestion?.markedForReview === true;
            const isBuffered = index < questions.length;

            return (
              <button
                key={number}
                type="button"
                disabled={!isBuffered}
                onClick={() => handleQuestionJump(index)}
                className={`exam-number ${
                  isCurrent
                    ? "exam-number-current"
                    : isMarked
                      ? "exam-number-review"
                      : isAnswered
                        ? "exam-number-answered"
                        : ""
                } ${!isBuffered ? "exam-number-pending" : ""}`}
              >
                {number}
              </button>
            );
          })}
        </div>

        <div className="exam-statusbar">
          <div className="exam-status-item">
            <span className="exam-status-chip exam-status-chip-current" /> Current
          </div>
          <div className="exam-status-item">
            <span className="exam-status-chip" /> Unanswered
          </div>
          <div className="exam-status-item">
            <span className="exam-status-chip exam-status-chip-pending" />
            {isFreeTopicPractice ? "Locked Topic" : accessType === "live" && mode === "exam" ? "Preparing" : "Available"}
          </div>
          <div className="exam-status-item">
            <span className="exam-status-chip exam-status-chip-answered" /> Answered
          </div>
          <div className="exam-status-item">
            <span className="exam-status-chip exam-status-chip-review" /> Marked
          </div>
          <div className="exam-metrics">
            <span>{mode === "exam" ? `Time Left: ${formattedTime}` : "No time limit"}</span>
            <span>Score: {score}</span>
            <span>Marked: {markedCount}</span>
          </div>
        </div>

        {prefetchError && <div className="exam-prefetch-note">{prefetchError}</div>}

        {!isFreeTopicPractice && !hasPaidPlan && (
          <div className="exam-plan-note">
            Free practice includes {cert.freeTopicSlugs.length} core {cert.shortName} topics. Paid users unlock every
            topic and live {cert.shortName} exam practice.
          </div>
        )}

        {!isFreeTopicPractice && accessType === "live" && hasPaidPlan && mode === "practice" && (
          <div className="exam-live-note">
            Paid Learning Practice includes the full {cert.shortName} topic library
            with all domains and difficulty levels.
          </div>
        )}

        {!isFreeTopicPractice && accessType === "live" && hasPaidPlan && mode === "exam" && (
          <div className="exam-live-note">
            Live {cert.shortName} Exam is active. New adaptive questions are prepared as you progress.
          </div>
        )}

        <div className="exam-review-row">
          <button
            type="button"
            onClick={handleReviewAnswer}
            disabled={selectedOption === null || mode === "exam"}
            className="exam-button-red"
          >
            {mode === "exam" ? "Review After Submit" : "Review Answer"}
          </button>
          <button
            type="button"
            onClick={toggleMarkedForReview}
            className="exam-button-secondary"
          >
            {currentQuestion?.markedForReview ? "Unmark Review" : "Mark For Review"}
          </button>
          <button
            type="button"
            onClick={handleSubmitExam}
            className="exam-button-secondary"
          >
            Submit Exam
          </button>
        </div>

        <div className="exam-content">
          {!currentQuestion && (
            <div className="exam-center-state">
              <div className="exam-spinner" />
              <p>Preparing the next question...</p>
              <p>The background buffer is catching up.</p>
            </div>
          )}

          {currentQuestion && (
            <>
              <div>
                <div className="exam-question-meta">
                  <h1 className="exam-muted-title">Question {questionNumber}</h1>
                  {showAnswer && selectedOption !== null && (
                    <span
                      className={
                        isCurrentCorrect
                          ? "exam-result-badge exam-result-correct"
                          : "exam-result-badge exam-result-incorrect"
                      }
                    >
                      {isCurrentCorrect ? "Correct" : "Incorrect"}
                    </span>
                  )}
                </div>
                <h2 className="exam-question">{cleanUserQuestionText(currentQuestion.question)}</h2>
              </div>

              <div className="exam-options">
                {currentQuestion.options.map((option, index) => {
                  let buttonStyle = "";
                  if (selectedOption === index) buttonStyle = "exam-option-selected";
                  if (showAnswer) {
                    if (index === currentQuestion.correctAnswer) {
                      buttonStyle = "exam-option-correct";
                    } else if (index === selectedOption && index !== currentQuestion.correctAnswer) {
                      buttonStyle = "exam-option-wrong";
                    }
                  }
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => !showAnswer && handleAnswer(index)}
                      disabled={showAnswer}
                      className={`exam-option ${buttonStyle}`}
                    >
                      <div className="exam-option-inner">
                        <div className="exam-radio">
                          {selectedOption === index && <div className="exam-radio-dot" />}
                        </div>
                        <div className="exam-option-text">
                          <span className="exam-option-label">{String.fromCharCode(65 + index)}.</span>
                          {option}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {showAnswer && (
                <div className="exam-explanation">
                  <div className="exam-explanation-header">
                    <p className="exam-explanation-title">Answer Explanation</p>
                    <span>Correct answer: {String.fromCharCode(65 + currentQuestion.correctAnswer)}</span>
                  </div>
                  <p>{currentQuestion.explanation}</p>

                  <div className="exam-explanation-grid">
                    <div>
                      <p className="exam-explanation-subtitle">Elimination Logic</p>
                      <ul>
                        {currentQuestion.options.map((option, index) => (
                          <li key={option}>
                            <strong>{String.fromCharCode(65 + index)}.</strong>{" "}
                            {currentQuestion.whyOthersWrong?.[index] ?? getFallbackWhyWrong(currentQuestion, index)}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="exam-mindset-tip">
                      <p className="exam-explanation-subtitle">PMI Mindset Tip</p>
                      <p>{getMindsetTip(currentQuestion)}</p>
                    </div>
                  </div>

                  {!isCurrentCorrect && learningTopic && (
                    <div className="exam-learning-card">
                      <div>
                        <p className="exam-explanation-subtitle">Recommended Study</p>
                        <h3>{learningTopic.title}</h3>
                        <p>{learningTopic.summary}</p>
                      </div>
                      <Link href={`/learn/${learningTopic.slug}`} className="exam-learn-link">
                        Learn This Topic
                      </Link>
                    </div>
                  )}
                </div>
              )}

              <div className="exam-footer">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={questionNumber === 1}
                  className="exam-button-red"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={selectedOption === null || (mode === "practice" && !hasReviewedCurrent)}
                  className="exam-button-red"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
