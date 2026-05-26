"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  buildFreeTopicQuestions,
  buildRandomFixedPracticeSet,
} from "../freeQuestionBank";
import { getSupabaseBrowserClient } from "../lib/supabaseClient";
import { getLearningTopicForQuestion, learningTopics } from "../learningTopics";
import { getCertification, type CertSlug, type QuestionType } from "../certifications";
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
  questionType?: QuestionType;
  correctAnswers?: number[];
  matchItems?: { left: string; right: string }[];
  blankType?: "number" | "text";
  orderItems?: string[];
};

type ExamQuestion = GeneratedQuestion & {
  id: string;
  selectedAnswer?: number;
  selectedAnswers?: number[];
  matchAnswers?: { left: string; right: string }[];
  blankAnswer?: string;
  orderedItems?: string[];
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
  selectedMultiAnswers?: Record<number, number[]>;
  matchAnswerStore?: Record<number, { left: string; right: string }[]>;
  blankAnswerStore?: Record<number, string>;
  orderedAnswersStore?: Record<number, string[]>;
  reviewedAnswers?: Record<number, boolean>;
  markedForReview?: Record<number, boolean>;
  timeLeft?: number;
  score?: number;
};

const palettePageSize = 60;
const liveStoredStarterCount = 25;
const firstApiTriggerAnswerCount = 10;
const desiredBufferAhead = 25;
const planStorageKey = "exampro-plan-v1";
const userStorageKey = "exampro-user-v1";
const freeTopicQuestionCount = 150;

const progressStorageKey = (s: string) => `exampro-${s}-progress-v1`;
const resultsStorageKey = (s: string) => `exampro-${s}-latest-results-v1`;
const mistakeNotebookStorageKey = (s: string) => `exampro-${s}-mistake-notebook-v1`;
const weakAreaStorageKey = (s: string) => `exampro-${s}-weak-area-stats-v1`;
const attemptHistoryStorageKey = "exampro-attempt-history-v1";

function getFreeTopicSlugs(certSlug: string): string[] {
  const cert = getCertification(certSlug);
  return cert.freeTopicSlugs;
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
    selectedAnswers: maybeExamQuestion.selectedAnswers,
    matchAnswers: maybeExamQuestion.matchAnswers,
    blankAnswer: maybeExamQuestion.blankAnswer,
    orderedItems: maybeExamQuestion.orderedItems,
    markedForReview: maybeExamQuestion.markedForReview ?? false,
    reviewed: maybeExamQuestion.reviewed ?? false,
    isCorrect: undefined,
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
    const selectedAnswers = savedProgress.selectedMultiAnswers?.[index];
    const matchAnswers = savedProgress.matchAnswerStore?.[index];
    const blankAnswer = savedProgress.blankAnswerStore?.[index];
    const orderedItems = savedProgress.orderedAnswersStore?.[index];
    const q = toExamQuestion(question, index);
    const qType = question.questionType;
    let isCorrect: boolean | undefined;
    if (qType === "multiple-response" && selectedAnswers !== undefined) {
      isCorrect =
        selectedAnswers.length === question.correctAnswers?.length &&
        selectedAnswers.every((a) => question.correctAnswers?.includes(a));
    } else if (qType === "matching" && matchAnswers !== undefined) {
      isCorrect = matchAnswers.every((m) => {
        const match = question.matchItems?.find((mi) => mi.left === m.left);
        return match?.right === m.right;
      });
    } else if (qType === "fill-in-blank" && blankAnswer !== undefined) {
      isCorrect = blankAnswer.trim().toLowerCase() === question.options[question.correctAnswer].trim().toLowerCase();
    } else if (qType === "hotspot" && orderedItems !== undefined) {
      isCorrect =
        orderedItems.length === question.orderItems?.length &&
        orderedItems.every((item, i) => item === question.orderItems?.[i]);
    } else if (selectedAnswer !== undefined) {
      isCorrect = selectedAnswer === question.correctAnswer;
    }
    return {
      ...q,
      selectedAnswer,
      selectedAnswers,
      matchAnswers,
      blankAnswer,
      orderedItems,
      markedForReview: savedProgress.markedForReview?.[index] ?? false,
      reviewed: savedProgress.reviewedAnswers?.[index] ?? false,
      isCorrect,
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

function saveMistakeToNotebook(question: ExamQuestion, answer: string | number, certSlug: string) {
  const topic = getLearningTopicForQuestion({ ...question, certSlug });

  const mistake = {
    id: `${question.id}-${Date.now()}`,
    question: cleanUserQuestionText(question.question),
    selectedAnswer: answer,
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
    .filter((q) => {
      if (q.questionType === "multiple-response") {
        const answers = q.selectedAnswers ?? [];
        const correct = q.correctAnswers ?? [];
        return answers.length !== correct.length || !answers.every((a) => correct.includes(a));
      }
      return q.selectedAnswer !== undefined && q.selectedAnswer !== q.correctAnswer;
    })
    .forEach((q) => {
      saveMistakeToNotebook(q, q.selectedAnswer ?? (q.selectedAnswers?.[0] ?? 0), certSlug);
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

function saveWeakAreaStats(questions: ExamQuestion[], certSlug: string) {    const answered = questions.filter((q) => {
    if (q.questionType === "multiple-response") return (q.selectedAnswers?.length ?? 0) > 0;
    return q.selectedAnswer !== undefined;
  });
  if (!answered.length) return;

  try {
    const existing = window.localStorage.getItem(weakAreaStorageKey(certSlug));
    const stats = existing ? JSON.parse(existing) : {};
    answered.forEach((question) => {
      const topic = getLearningTopicForQuestion({ ...question, certSlug });
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

function saveAttemptHistory(
  certSlug: string,
  answeredCount: number,
  correctCount: number,
  finishedAt: string,
) {
  if (!answeredCount) return;

  try {
    const savedHistory = window.localStorage.getItem(attemptHistoryStorageKey);
    const history = savedHistory ? JSON.parse(savedHistory) : [];
    const previousAttempts = Array.isArray(history) ? history : [];
    const percentage = Math.round((correctCount / answeredCount) * 100);

    window.localStorage.setItem(
      attemptHistoryStorageKey,
      JSON.stringify(
        [
          {
            certSlug,
            answeredCount,
            correctCount,
            percentage,
            finishedAt,
          },
          ...previousAttempts,
        ].slice(0, 100),
      ),
    );
  } catch {
    // Insights are helpful, but must never block results submission.
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
      const topic = getLearningTopicForQuestion({ ...q, certSlug: result.certSlug });
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

function ExamContent() {
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
  const [showShortcutHelp, setShowShortcutHelp] = useState(false);

  // Derive cert-specific constants
  const totalQuestions = useMemo(() => getTotalQuestions(certSlug), [certSlug]);
  const freeTopicSlugsArr = useMemo(() => getFreeTopicSlugs(certSlug), [certSlug]);
  const domainOptions = useMemo(() => getDomainOptions(certSlug), [certSlug]);
  const currentProgressKey = useMemo(() => progressStorageKey(certSlug), [certSlug]);

  const currentQuestion = questions[currentQuestionIndex] ?? null;
  const activeTotalQuestions = isFreeTopicPractice ? freeTopicQuestionCount : totalQuestions;
  const questionNumber = currentQuestionIndex + 1;
  const selectedOption = currentQuestion?.selectedAnswer ?? null;
  const selectedMulti = currentQuestion?.selectedAnswers ?? [];
  const matchAnswersMap = currentQuestion?.matchAnswers ?? [];
  const blankAnswer = currentQuestion?.blankAnswer ?? "";
  const questionType = currentQuestion?.questionType ?? (currentQuestion ? "multiple-choice" : "multiple-choice");
  const hasReviewedCurrent = currentQuestion?.reviewed === true;
  const answeredCount = questions.filter((q) => {
    if (q.questionType === "multiple-response") return (q.selectedAnswers?.length ?? 0) > 0;
    if (q.questionType === "matching") return (q.matchAnswers?.length ?? 0) > 0;
    if (q.questionType === "fill-in-blank") return (q.blankAnswer?.length ?? 0) > 0;
    return q.selectedAnswer !== undefined;
  }).length;
  const markedCount = questions.filter((q) => q.markedForReview).length;
  const visibleDomainOptions = hasPaidPlan
    ? domainOptions
    : domainOptions.filter((option) => !option.paidOnly);
  const isCurrentCorrect = currentQuestion
    ? checkIfCorrect(currentQuestion)
    : false;
  const learningTopic = currentQuestion
    ? getLearningTopicForQuestion({ ...currentQuestion, certSlug })
    : null;
  const bufferedAhead = currentQuestion
    ? Math.max(0, questions.length - questionNumber)
    : questions.length;

  function getHasAnswer(q: ExamQuestion | null): boolean {
    if (!q) return false;
    if (q.questionType === "multiple-response") return (q.selectedAnswers?.length ?? 0) > 0;
    if (q.questionType === "matching") return (q.matchAnswers?.length ?? 0) > 0;
    if (q.questionType === "fill-in-blank") return (q.blankAnswer?.trim().length ?? 0) > 0;
    if (q.questionType === "hotspot") return (q.orderedItems?.length ?? 0) > 0;
    return q.selectedAnswer !== undefined;
  }

  function checkIfCorrect(q: ExamQuestion): boolean {
    if (q.questionType === "multiple-response") {
      const answers = q.selectedAnswers ?? [];
      const correct = q.correctAnswers ?? [];
      return answers.length === correct.length && answers.every((a) => correct.includes(a));
    }
    if (q.questionType === "matching") {
      const answers = q.matchAnswers ?? [];
      const items = q.matchItems ?? [];
      return answers.length === items.length && answers.every((m) => {
        const match = items.find((i) => i.left === m.left);
        return match?.right === m.right;
      });
    }
    if (q.questionType === "fill-in-blank") {
      return q.blankAnswer?.trim().toLowerCase() === q.options[q.correctAnswer].trim().toLowerCase();
    }
    return q.selectedAnswer === q.correctAnswer;
  }

  // Lock body scroll when help modal is open
  useEffect(() => {
    if (showShortcutHelp) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showShortcutHelp]);

  // Timer is low when less than 10% of total time or 10 minutes remaining
  const isTimeLow = mode === "exam" && timeLeft < Math.min(getTimeLimit(certSlug) * 0.1, 600);
  const isTimeCritical = mode === "exam" && timeLeft < 120;

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ignore if user is typing in an input/select
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement || e.target instanceof HTMLTextAreaElement) return;

      // 1-4 to select answer (only for single-select types)
      const singleSelectTypes = ["multiple-choice", "situational"];
      if (e.key >= "1" && e.key <= "4" && !showAnswer && currentQuestion && singleSelectTypes.includes(questionType)) {
        const idx = parseInt(e.key) - 1;
        if (idx < currentQuestion.options.length) {
          e.preventDefault();
          handleAnswer(idx);
        }
        return;
      }

      // Enter to review answer (practice mode)
      if (e.key === "Enter" && mode === "practice" && !showAnswer && currentQuestion) {
        const hasAnswer = getHasAnswer(currentQuestion);
        if (hasAnswer) {
          e.preventDefault();
          handleReviewAnswer();
        }
        return;
      }

      // N/n for Next
      if ((e.key === "n" || e.key === "N") && !e.metaKey && !e.ctrlKey) {
        const hasAnswer = getHasAnswer(currentQuestion);
        if (hasAnswer && !(mode === "practice" && !hasReviewedCurrent)) {
          e.preventDefault();
          handleNext();
        }
        return;
      }

      // B/b for Back
      if ((e.key === "b" || e.key === "B") && !e.metaKey && !e.ctrlKey) {
        if (questionNumber > 1) {
          e.preventDefault();
          handleBack();
        }
        return;
      }

      // M/m to toggle mark for review
      if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        toggleMarkedForReview();
        return;
      }

      // Escape to close answer
      if (e.key === "Escape" && showAnswer) {
        e.preventDefault();
        setShowAnswer(false);
        return;
      }

      // ? to toggle keyboard shortcut help
      if (e.key === "?" || e.key === "/") {
        e.preventDefault();
        setShowShortcutHelp((prev) => !prev);
        return;
      }

      // Escape to close help modal
      if (e.key === "Escape" && showShortcutHelp) {
        e.preventDefault();
        setShowShortcutHelp(false);
        return;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

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
    const selectedMultiAnswers: Record<number, number[]> = {};
    const matchAnswerStore: Record<number, { left: string; right: string }[]> = {};
    const blankAnswerStore: Record<number, string> = {};
    const orderedAnswersStore: Record<number, string[]> = {};
    const reviewedAnswers: Record<number, boolean> = {};
    const markedForReview: Record<number, boolean> = {};

    questions.forEach((q, i) => {
      if (q.questionType === "multiple-response" && q.selectedAnswers) {
        selectedMultiAnswers[i] = q.selectedAnswers;
      } else if (q.questionType === "matching" && q.matchAnswers) {
        matchAnswerStore[i] = q.matchAnswers;
      } else if (q.questionType === "fill-in-blank" && q.blankAnswer !== undefined) {
        blankAnswerStore[i] = q.blankAnswer;
      } else if (q.questionType === "hotspot" && q.orderedItems) {
        orderedAnswersStore[i] = q.orderedItems;
      } else if (q.selectedAnswer !== undefined) {
        selectedAnswers[i] = q.selectedAnswer;
      }
      if (q.reviewed) reviewedAnswers[i] = true;
      if (q.markedForReview) markedForReview[i] = true;
    });

    const progress: SavedProgress = {
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
      selectedMultiAnswers: Object.keys(selectedMultiAnswers).length ? selectedMultiAnswers : undefined,
      matchAnswerStore: Object.keys(matchAnswerStore).length ? matchAnswerStore : undefined,
      blankAnswerStore: Object.keys(blankAnswerStore).length ? blankAnswerStore : undefined,
      orderedAnswersStore: Object.keys(orderedAnswersStore).length ? orderedAnswersStore : undefined,
      reviewedAnswers,
      markedForReview,
      timeLeft,
      score,
    };

    window.localStorage.setItem(
      currentProgressKey,
      JSON.stringify(progress),
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

  const handleMultiResponse = (indices: number[]) => {
    setQuestions((prev) => {
      const next = prev.map((q, i) =>
        i === currentQuestionIndex
          ? {
              ...q,
              selectedAnswers: indices,
              reviewed: mode === "exam" ? q.reviewed : false,
              isCorrect:
                indices.length === q.correctAnswers?.length &&
                indices.every((a) => q.correctAnswers?.includes(a)),
            }
          : q,
      );
      questionsRef.current = next;
      return next;
    });
    setShowAnswer(false);
  };

  const handleMatching = (pairs: { left: string; right: string }[]) => {
    setQuestions((prev) => {
      const next = prev.map((q, i) =>
        i === currentQuestionIndex
          ? {
              ...q,
              matchAnswers: pairs,
              reviewed: mode === "exam" ? q.reviewed : false,
              isCorrect: pairs.length === q.matchItems?.length && pairs.every((m) => {
                const match = q.matchItems?.find((mi) => mi.left === m.left);
                return match?.right === m.right;
              }),
            }
          : q,
      );
      questionsRef.current = next;
      return next;
    });
    setShowAnswer(false);
  };

  const handleOrderChange = (items: string[]) => {
    setQuestions((prev) => {
      const next = prev.map((q, i) =>
        i === currentQuestionIndex
          ? {
              ...q,
              orderedItems: items,
              reviewed: mode === "exam" ? q.reviewed : false,
              isCorrect:
                items.length === (q.orderItems?.length ?? 0) &&
                items.every((item, idx) => item === q.orderItems?.[idx]),
            }
          : q,
      );
      questionsRef.current = next;
      return next;
    });
    setShowAnswer(false);
  };

  const handleFillBlank = (value: string) => {
    setQuestions((prev) => {
      const next = prev.map((q, i) =>
        i === currentQuestionIndex
          ? {
              ...q,
              blankAnswer: value,
              reviewed: mode === "exam" ? q.reviewed : false,
              isCorrect: value.trim().toLowerCase() === q.options[q.correctAnswer].trim().toLowerCase(),
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
    if (!currentQuestion) return;
    const hasAnswer = getHasAnswer(currentQuestion);
    if (!hasAnswer) return;
    setQuestions((prev) => {
      const next = prev.map((q, i) =>
        i === currentQuestionIndex ? { ...q, reviewed: true } : q,
      );
      questionsRef.current = next;
      return next;
    });
    if (!checkIfCorrect(currentQuestion)) {
      const wrongAnswer = questionType === "multiple-response"
        ? (selectedMulti[0] ?? 0)
        : questionType === "hotspot"
          ? (currentQuestion.orderedItems?.[0] ?? "")
          : (selectedOption ?? 0);
      saveMistakeToNotebook(currentQuestion, wrongAnswer, certSlug);
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
    if (!currentQuestion || !getHasAnswer(currentQuestion) || (mode === "practice" && !hasReviewedCurrent)) return;
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
    saveAttemptHistory(certSlug, answeredCount, score, finishedAt);
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
            const isAnswered = getHasAnswer(paletteQuestion);
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
            <span
              style={{
                color: isTimeCritical ? "var(--accent-red)" : isTimeLow ? "#d97706" : undefined,
                fontWeight: isTimeLow ? 900 : 700,
              }}
            >
              {mode === "exam" ? (
                <>
                  <span className="kbd-hint" style={{ marginRight: 6 }}>T</span>
                  Time: {formattedTime}
                </>
              ) : (
                "No time limit"
              )}
            </span>
            <span>Score: {score}</span>
            <span>Marked: {markedCount}</span>
          </div>
        </div>

        {/* Visual timer bar (exam mode only) */}
        {mode === "exam" && (
          <div
            className="exam-timer-track"
            aria-hidden="true"
          >
            <span
              style={{
                display: "block",
                height: "100%",
                width: `${(timeLeft / getTimeLimit(certSlug)) * 100}%`,
                background: isTimeCritical
                  ? "var(--accent-red)"
                  : isTimeLow
                    ? "#d97706"
                    : "var(--accent-green)",
                transition: "width 1s linear, background 0.3s ease",
                borderRadius: 999,
              }}
            />
          </div>
        )}

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
            disabled={!getHasAnswer(currentQuestion) || mode === "exam" || showAnswer}
            className="exam-button-red"
          >
            {mode === "exam" ? "Review After Submit" : "Review Answer"}
            {mode === "practice" && <span className="kbd-hint">Enter</span>}
          </button>
          <button
            type="button"
            onClick={toggleMarkedForReview}
            className="exam-button-secondary"
          >
            {currentQuestion?.markedForReview ? "Unmark Review" : "Mark For Review"}
            <span className="kbd-hint">M</span>
          </button>
          <button
            type="button"
            onClick={handleSubmitExam}
            className="exam-button-secondary"
          >
            Submit Exam
          </button>
          <button
            type="button"
            onClick={() => setShowShortcutHelp(true)}
            className="exam-help-btn"
            aria-label="Keyboard shortcuts"
          >
            ?
            <span className="kbd-hint">?</span>
          </button>
        </div>

        <div className="exam-content">
          <AnimatePresence mode="wait">
            {!currentQuestion && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="exam-center-state">
                  <div className="exam-spinner" />
                  <p>Preparing the next question...</p>
                  <p>The background buffer is catching up.</p>
                </div>
              </motion.div>
            )}

            {currentQuestion && (
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <div>
                  <div className="exam-question-meta">
                    <h1 className="exam-muted-title">
                      Question {questionNumber}
                      <span className="exam-type-badge">
                        {{
                          "multiple-choice": "Multiple Choice",
                          "multiple-response": "Select All",
                          matching: "Matching",
                          "fill-in-blank": "Fill in Blank",
                          hotspot: "Drag to Order",
                          situational: "Scenario",
                        }[questionType] || "Multiple Choice"}
                      </span>
                    </h1>
                    {showAnswer && getHasAnswer(currentQuestion) && (
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

                {/* Multiple Choice / Situational - radio buttons */}
                {["multiple-choice", "situational"].includes(questionType) && (
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
                        <motion.button
                          key={option}
                          type="button"
                          onClick={() => !showAnswer && handleAnswer(index)}
                          disabled={showAnswer}
                          className={`exam-option ${buttonStyle}`}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.25, delay: 0.05 * index, ease: "easeOut" }}
                          whileHover={!showAnswer ? { scale: 1.01 } : undefined}
                          whileTap={!showAnswer ? { scale: 0.98 } : undefined}
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
                        </motion.button>
                      );
                    })}
                  </div>
                )}

                {/* Multiple Response - checkboxes */}
                {questionType === "multiple-response" && (
                  <div className="exam-options">
                    {currentQuestion.options.map((option, index) => {
                      const isChecked = (currentQuestion.selectedAnswers ?? []).includes(index);
                      let buttonStyle = "";
                      if (isChecked) buttonStyle = "exam-option-selected";
                      if (showAnswer) {
                        const correctAnswers = currentQuestion.correctAnswers ?? [];
                        if (correctAnswers.includes(index)) {
                          buttonStyle = "exam-option-correct";
                        } else if (isChecked && !correctAnswers.includes(index)) {
                          buttonStyle = "exam-option-wrong";
                        }
                      }
                      return (
                        <motion.button
                          key={option}
                          type="button"
                          onClick={() => {
                            if (showAnswer) return;
                            const current = currentQuestion.selectedAnswers ?? [];
                            const next = current.includes(index)
                              ? current.filter((i: number) => i !== index)
                              : [...current, index];
                            handleMultiResponse(next);
                          }}
                          disabled={showAnswer}
                          className={`exam-option ${buttonStyle}`}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.25, delay: 0.05 * index, ease: "easeOut" }}
                        >
                          <div className="exam-option-inner">
                            <div className="exam-radio exam-radio-checkbox">
                              {isChecked && <span className="exam-check-mark">✓</span>}
                            </div>
                            <div className="exam-option-text">
                              <span className="exam-option-label">{String.fromCharCode(65 + index)}.</span>
                              {option}
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                    <p className="exam-multi-hint">Select all that apply. Toggle each option.</p>
                  </div>
                )}

                {/* Fill in the Blank */}
                {questionType === "fill-in-blank" && (
                  <div className="exam-blank-area">
                    <div className="exam-blank-input-wrap">
                      <span className="exam-blank-label">Answer:</span>
                      <input
                        type={currentQuestion.blankType === "number" ? "number" : "text"}
                        value={currentQuestion.blankAnswer ?? ""}
                        onChange={(e) => handleFillBlank(e.target.value)}
                        placeholder={currentQuestion.blankType === "number" ? "Enter a number..." : "Type your answer..."}
                        className="exam-blank-input"
                        disabled={showAnswer}
                        autoFocus
                      />
                    </div>
                    {showAnswer && (
                      <p className="exam-correct-answer-text">
                        Correct answer: {currentQuestion.options[currentQuestion.correctAnswer]}
                      </p>
                    )}
                  </div>
                )}

                {/* Hotspot / Drag to Order */}
                {questionType === "hotspot" && currentQuestion.orderItems && (
                  <div className="exam-hotspot-area">
                    <p className="exam-hotspot-hint">
                      Arrange the items in the correct order (click ▲/▼ to move):
                    </p>
                    <div className="exam-hotspot-list">
                      {(currentQuestion.orderedItems ?? currentQuestion.orderItems).map((item: string, index: number) => {
                        const items = currentQuestion.orderedItems ?? currentQuestion.orderItems ?? [];
                        const canMoveUp = index > 0 && !showAnswer;
                        const canMoveDown = index < items.length - 1 && !showAnswer;
                        return (
                          <div
                            key={`${item}-${index}`}
                            className="exam-hotspot-item"
                          >
                            <span className="exam-hotspot-number">{index + 1}</span>
                            <span className="exam-hotspot-text">{item}</span>
                            <div className="exam-hotspot-controls">
                              <button
                                type="button"
                                onClick={() => {
                                  if (!canMoveUp) return;
                                  const updated = [...items];
                                  [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
                                  handleOrderChange(updated);
                                }}
                                disabled={!canMoveUp}
                                className={`exam-hotspot-arrow ${canMoveUp ? "exam-hotspot-arrow-active" : ""}`}
                                aria-label="Move up"
                              >
                                ▲
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (!canMoveDown) return;
                                  const updated = [...items];
                                  [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
                                  handleOrderChange(updated);
                                }}
                                disabled={!canMoveDown}
                                className={`exam-hotspot-arrow ${canMoveDown ? "exam-hotspot-arrow-active" : ""}`}
                                aria-label="Move down"
                              >
                                ▼
                              </button>
                            </div>
                            <span className="exam-hotspot-grip">⠿</span>
                          </div>
                        );
                      })}
                    </div>
                    {showAnswer && (
                      <p className="exam-correct-answer-text">
                        Correct order: {(currentQuestion.orderItems ?? []).join(" → ")}
                      </p>
                    )}
                  </div>
                )}

                {/* Matching */}
                {questionType === "matching" && currentQuestion.matchItems && (
                  <div className="exam-match-area">
                    <div className="exam-match-grid">
                      <div className="exam-match-label">Item</div>
                      <div />
                      <div className="exam-match-label">Match</div>
                      {currentQuestion.matchItems.map((item, idx) => {
                        const currentPairs = currentQuestion.matchAnswers ?? [];
                        const selectedRight = currentPairs.find((p) => p.left === item.left)?.right ?? "";
                        const rightOptions = [...new Set(currentQuestion.matchItems!.map((i) => i.right))];
                        return (
                          <div key={idx} className="exam-match-row">
                            <span className="exam-match-item">
                              <span className="exam-match-number">{idx + 1}</span>
                              {item.left}
                            </span>
                            <span className="exam-match-arrow">⟷</span>
                            <select
                              value={selectedRight}
                              onChange={(e) => {
                                const newPair = { left: item.left, right: e.target.value };
                                const existing = currentPairs.filter((p) => p.left !== item.left);
                                handleMatching([...existing, newPair]);
                              }}
                              disabled={showAnswer}
                              className="exam-match-select"
                            >
                              <option value="" disabled>Select...</option>
                              {rightOptions.map((r) => (
                                <option key={r} value={r}>{r}</option>
                              ))}
                            </select>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {showAnswer && (
                  <motion.div
                    className="exam-explanation"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <div className="exam-explanation-header">
                      <p className="exam-explanation-title">Answer Explanation</p>
                      {["multiple-choice", "situational"].includes(questionType) && (
                        <span>Correct answer: {String.fromCharCode(65 + currentQuestion.correctAnswer)}</span>
                      )}
                    </div>
                    <p>{currentQuestion.explanation}</p>

                    {["multiple-choice", "situational"].includes(questionType) && (
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
                    )}

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
                  </motion.div>
                )}

                <div className="exam-footer">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={questionNumber === 1}
                    className="exam-button-red"
                  >
                    Back
                    <span className="kbd-hint">B</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!getHasAnswer(currentQuestion) || (mode === "practice" && !hasReviewedCurrent)}
                    className="exam-button-red"
                  >
                    Next
                    <span className="kbd-hint">N</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Keyboard Shortcut Help Modal */}
        <AnimatePresence>
          {showShortcutHelp && (
            <motion.div
              className="modal-overlay"
              role="dialog"
              aria-modal="true"
              aria-label="Keyboard shortcuts"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setShowShortcutHelp(false)}
            >
              <motion.div
                className="modal-content"
                role="document"
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 20 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h2>Keyboard Shortcuts</h2>
                  <button
                    type="button"
                    className="modal-close-btn"
                    onClick={() => setShowShortcutHelp(false)}
                    aria-label="Close shortcuts"
                  >
                    &times;
                  </button>
                </div>
                <div className="modal-shortcuts-grid">
                  <div className="modal-shortcut-row">
                    <span className="modal-shortcut-keys">
                      <kbd>1</kbd><kbd>2</kbd><kbd>3</kbd><kbd>4</kbd>
                    </span>
                    <span className="modal-shortcut-desc">Select answer option</span>
                  </div>
                  <div className="modal-shortcut-row">
                    <span className="modal-shortcut-keys">
                      <kbd>Enter</kbd>
                    </span>
                    <span className="modal-shortcut-desc">Review answer <span className="modal-shortcut-mode">(Practice mode)</span></span>
                  </div>
                  <div className="modal-shortcut-row">
                    <span className="modal-shortcut-keys">
                      <kbd>N</kbd>
                    </span>
                    <span className="modal-shortcut-desc">Next question</span>
                  </div>
                  <div className="modal-shortcut-row">
                    <span className="modal-shortcut-keys">
                      <kbd>B</kbd>
                    </span>
                    <span className="modal-shortcut-desc">Back to previous question</span>
                  </div>
                  <div className="modal-shortcut-row">
                    <span className="modal-shortcut-keys">
                      <kbd>M</kbd>
                    </span>
                    <span className="modal-shortcut-desc">Mark / unmark for review</span>
                  </div>
                  <div className="modal-shortcut-row">
                    <span className="modal-shortcut-keys">
                      <kbd>Esc</kbd>
                    </span>
                    <span className="modal-shortcut-desc">Close answer panel</span>
                  </div>
                  <div className="modal-shortcut-row">
                    <span className="modal-shortcut-keys">
                      <kbd>?</kbd>
                    </span>
                    <span className="modal-shortcut-desc">Toggle this help modal</span>
                  </div>
                </div>
                <p className="modal-shortcuts-note">
                  Shortcuts are disabled when typing in input fields.
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

export default function ExamPage() {
  return (
    <Suspense
      fallback={
        <main className="exam-page">
          <div className="exam-shell exam-center-state">
            <div className="exam-spinner" />
            <p>Loading simulator...</p>
          </div>
        </main>
      }
    >
      <ExamContent />
    </Suspense>
  );
}
