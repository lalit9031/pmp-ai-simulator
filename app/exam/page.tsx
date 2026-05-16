"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  buildFreeTopicQuestions,
  buildRandomFixedPracticeSet,
} from "../freeQuestionBank";
import { getLearningTopicForQuestion, learningTopics } from "../learningTopics";

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
type DomainFilter =
  | "Mixed"
  | "Agile"
  | "Risk"
  | "Stakeholder"
  | "Hybrid"
  | "AI Ethics"
  | "Sustainability"
  | "Business Environment";
type DifficultyFilter = "Mixed" | "Easy" | "Medium" | "Hard";
type FreeTopicSlug = string;
type PracticeAccess = "free" | "live";
type SavedProgress = {
  accessType?: PracticeAccess;
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
};

const totalQuestions = 185;
const freeTopicQuestionCount = 150;
const palettePageSize = 60;
const liveInitialBufferCount = 10;
const desiredBufferAhead = 25;
const storageKey = "pmp-simulator-progress-v1";
const resultsStorageKey = "pmp-simulator-latest-results-v1";
const mistakeNotebookStorageKey = "pmp-simulator-mistake-notebook-v1";
const planStorageKey = "pmp-simulator-plan-v1";
const starterQuestions: GeneratedQuestion[] = [
  {
    question:
      "A hybrid team is split between frequent backlog changes and fixed compliance deliverables. What should the project manager do first?",
    options: [
      "Escalate the conflict to the sponsor",
      "Facilitate alignment on delivery approach, constraints, and change handling",
      "Freeze all backlog changes until compliance work is complete",
      "Update the charter to require a predictive approach",
    ],
    correctAnswer: 1,
    explanation:
      "The project manager should first create shared understanding and agree on how change will be handled across the hybrid work.",
    source: "starter",
  },
  {
    question:
      "A vendor dependency may delay a critical sprint goal. The team is frustrated and the product owner wants an immediate workaround. What should the project manager do?",
    options: [
      "Ask the team to inspect options, risks, and tradeoffs with the product owner",
      "Tell the vendor to add resources at no cost",
      "Remove the affected story from the release plan",
      "Escalate the issue before discussing it with the team",
    ],
    correctAnswer: 0,
    explanation:
      "PMI mindset favors collaboration and informed decision-making before escalation or unilateral scope changes.",
    source: "starter",
  },
  {
    question:
      "A stakeholder keeps bypassing the product owner and assigning urgent work directly to developers. What should the project manager do first?",
    options: [
      "Ask developers to ignore the stakeholder",
      "Update the communications management plan and reinforce the intake process",
      "Escalate the behavior to the steering committee",
      "Add the new work to the sprint backlog immediately",
    ],
    correctAnswer: 1,
    explanation:
      "The project manager should protect the team and clarify governance while maintaining stakeholder engagement.",
    source: "starter",
  },
  {
    question:
      "During a retrospective, several team members say testing is always rushed near the end of each iteration. What is the best response?",
    options: [
      "Ask the quality team to test after the sprint ends",
      "Increase sprint length without team discussion",
      "Help the team identify root causes and define improvement actions",
      "Document the issue as accepted risk",
    ],
    correctAnswer: 2,
    explanation:
      "Retrospectives are used for continuous improvement owned by the team.",
    source: "starter",
  },
  {
    question:
      "A key stakeholder rejects a delivered increment because it does not match an assumption that was never documented. What should the project manager do?",
    options: [
      "Review acceptance criteria and facilitate agreement on the needed change",
      "Tell the stakeholder the increment must be accepted",
      "Replace the product owner",
      "Immediately rework the increment without impact analysis",
    ],
    correctAnswer: 0,
    explanation:
      "Clarify acceptance criteria and manage the change through the appropriate process.",
    source: "starter",
  },
  {
    question:
      "A team member is consistently quiet in planning sessions but later raises important risks privately. What should the project manager do?",
    options: [
      "Ask the member to send risks only by email",
      "Create safer facilitation methods that invite all voices during planning",
      "Remove the member from planning meetings",
      "Assign another person to speak for the member",
    ],
    correctAnswer: 1,
    explanation:
      "Servant leadership includes creating psychological safety and inclusive participation.",
    source: "starter",
  },
  {
    question:
      "The sponsor asks for a feature that will likely push the release past a regulatory deadline. What is the best next step?",
    options: [
      "Accept the request because it came from the sponsor",
      "Reject the request to protect the deadline",
      "Analyze impact with the team and product owner before deciding",
      "Move the regulatory work to a later release",
    ],
    correctAnswer: 2,
    explanation:
      "Change requests should be assessed for impact before approval or rejection.",
    source: "starter",
  },
  {
    question:
      "A predictive workstream reports green status, but agile teams say its outputs are not usable. What should the project manager do first?",
    options: [
      "Facilitate an integration review between the workstreams",
      "Tell agile teams to accept the outputs",
      "Change the predictive workstream to agile immediately",
      "Report the predictive workstream as red",
    ],
    correctAnswer: 0,
    explanation:
      "The project manager should expose integration issues and help teams align on usable outcomes.",
    source: "starter",
  },
  {
    question:
      "A customer requests daily status meetings because they do not trust the team's progress. What should the project manager do?",
    options: [
      "Decline the request without discussion",
      "Invite the customer to sprint reviews and agree on transparent reporting",
      "Ask the team to prepare detailed daily slide decks",
      "Escalate the trust issue to procurement",
    ],
    correctAnswer: 1,
    explanation:
      "Transparency and appropriate ceremonies can address trust without creating unnecessary overhead.",
    source: "starter",
  },
  {
    question:
      "A new compliance requirement appears halfway through the release. What should the project manager do first?",
    options: [
      "Stop all development until compliance confirms every detail",
      "Work with the product owner and team to assess impact and reprioritize",
      "Reject the requirement because planning is complete",
      "Add overtime to preserve all current scope",
    ],
    correctAnswer: 1,
    explanation:
      "Assess impact and reprioritize with the right stakeholders.",
    source: "starter",
  },
  {
    question:
      "Two senior engineers disagree publicly about the architecture. The debate is slowing the team. What should the project manager do?",
    options: [
      "Choose the option proposed by the more senior engineer",
      "Facilitate a decision based on agreed criteria and project constraints",
      "Ask both engineers to stop discussing architecture",
      "Escalate immediately to the sponsor",
    ],
    correctAnswer: 1,
    explanation:
      "Decision criteria help turn conflict into a transparent team decision.",
    source: "starter",
  },
  {
    question:
      "A team is missing sprint commitments because production support interrupts them daily. What should the project manager do?",
    options: [
      "Ask the team to work evenings",
      "Make interruptions visible and collaborate on capacity and support policy",
      "Extend every sprint by one week",
      "Remove support work from all reports",
    ],
    correctAnswer: 1,
    explanation:
      "Make impediments and capacity constraints visible, then adapt the process.",
    source: "starter",
  },
  {
    question:
      "A stakeholder claims they were not informed about a major decision, although meeting notes were sent. What should the project manager do first?",
    options: [
      "Resend all meeting notes",
      "Review communication needs and confirm the stakeholder engagement approach",
      "Remove the stakeholder from future decisions",
      "Ask the sponsor to defend the project team",
    ],
    correctAnswer: 1,
    explanation:
      "Communication effectiveness is measured by understanding, not just message delivery.",
    source: "starter",
  },
  {
    question:
      "The team identifies a risk that could affect a milestone in six weeks. What should the project manager do?",
    options: [
      "Wait until the risk occurs",
      "Record, analyze, assign ownership, and plan a response",
      "Escalate every risk to the sponsor",
      "Ask the team to avoid discussing negative outcomes",
    ],
    correctAnswer: 1,
    explanation:
      "Risks should be proactively analyzed and assigned response owners.",
    source: "starter",
  },
  {
    question:
      "A product owner is unavailable, causing delayed backlog decisions. What should the project manager do?",
    options: [
      "Make product decisions on behalf of the product owner",
      "Work with stakeholders to restore timely product ownership decisions",
      "Pause all development until the product owner returns",
      "Tell the team to choose whatever is easiest",
    ],
    correctAnswer: 1,
    explanation:
      "The project manager should remove impediments and ensure decision roles are working.",
    source: "starter",
  },
  {
    question:
      "A high-performing specialist is becoming a bottleneck because all critical reviews go through them. What should the project manager do?",
    options: [
      "Ask the specialist to work faster",
      "Help the team spread knowledge and adjust the review workflow",
      "Remove reviews from the definition of done",
      "Delay all work until the specialist is free",
    ],
    correctAnswer: 1,
    explanation:
      "Knowledge sharing and workflow improvement reduce bottlenecks sustainably.",
    source: "starter",
  },
  {
    question:
      "The team completed work that meets acceptance criteria, but a stakeholder wants a different solution. What should happen next?",
    options: [
      "Treat it as a change and evaluate value, impact, and priority",
      "Reject all feedback after acceptance criteria are met",
      "Ask the team to redo the work immediately",
      "Hide the feedback until the next phase",
    ],
    correctAnswer: 0,
    explanation:
      "New preferences after agreed criteria are handled through prioritization and change control.",
    source: "starter",
  },
  {
    question:
      "A distributed team has frequent misunderstandings across time zones. What should the project manager do first?",
    options: [
      "Require everyone to work the same hours",
      "Improve working agreements, communication channels, and handoff expectations",
      "Reduce meetings to zero",
      "Move all decisions to email only",
    ],
    correctAnswer: 1,
    explanation:
      "Working agreements and communication norms help distributed teams collaborate effectively.",
    source: "starter",
  },
  {
    question:
      "A release burndown shows the team is unlikely to finish all planned scope. What should the project manager do?",
    options: [
      "Ask the team to hide the forecast until the next review",
      "Collaborate with the product owner to inspect options and prioritize value",
      "Tell the team to skip quality checks",
      "Add all unfinished work to the next sprint automatically",
    ],
    correctAnswer: 1,
    explanation:
      "Forecasts should prompt transparent inspection and value-based decisions.",
    source: "starter",
  },
  {
    question:
      "A team member says a requested shortcut violates the definition of done. What should the project manager do?",
    options: [
      "Support the team in protecting agreed quality standards",
      "Approve the shortcut to save schedule",
      "Remove the team member from the task",
      "Ask quality assurance to check it after release",
    ],
    correctAnswer: 0,
    explanation:
      "The project manager should reinforce agreed quality practices and sustainable delivery.",
    source: "starter",
  },
  {
    question:
      "A stakeholder is highly influential but rarely attends reviews. Their late feedback causes rework. What should the project manager do?",
    options: [
      "Stop accepting feedback from the stakeholder",
      "Adjust the stakeholder engagement plan and secure timely participation",
      "Ask the team to predict the stakeholder's feedback",
      "Move reviews to the end of the project",
    ],
    correctAnswer: 1,
    explanation:
      "Engagement strategies should be adapted for influence, interest, and project impact.",
    source: "starter",
  },
  {
    question:
      "The team discovers an opportunity to automate a manual control, reducing long-term cost but adding short-term work. What should the project manager do?",
    options: [
      "Reject it because it was not in the original plan",
      "Assess benefits, risks, and priority with the product owner and stakeholders",
      "Approve it immediately because automation is always valuable",
      "Ask the team to do it without reporting the impact",
    ],
    correctAnswer: 1,
    explanation:
      "Opportunities should be evaluated and prioritized like other changes.",
    source: "starter",
  },
  {
    question:
      "A lessons learned item from a previous project is relevant, but the team has not reviewed it. What should the project manager do?",
    options: [
      "Share relevant lessons and discuss how they affect current planning",
      "Wait until project closure",
      "Assume the team already knows",
      "File the lessons in the repository only",
    ],
    correctAnswer: 0,
    explanation:
      "Lessons learned should be used throughout the project, not only at the end.",
    source: "starter",
  },
  {
    question:
      "The project is using agile delivery, but finance requires monthly forecast reporting. What should the project manager do?",
    options: [
      "Refuse monthly reporting because agile teams do not forecast",
      "Use agile information radiators and team data to provide appropriate forecasts",
      "Convert the whole project to waterfall",
      "Ask finance to wait until release completion",
    ],
    correctAnswer: 1,
    explanation:
      "Hybrid governance can satisfy organizational reporting needs while preserving agile delivery.",
    source: "starter",
  },
  {
    question:
      "A team member reports that a senior stakeholder is pressuring them to skip an approval step. What should the project manager do first?",
    options: [
      "Privately support the team member and address the governance concern with the stakeholder",
      "Tell the team member to follow the stakeholder's direction",
      "Cancel the approval process permanently",
      "Ignore the issue unless it becomes public",
    ],
    correctAnswer: 0,
    explanation:
      "The project manager should protect the team and uphold governance with respectful stakeholder engagement.",
    source: "starter",
  },
];

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

function buildQuestionsFromSavedProgress(savedProgress: SavedProgress) {
  if (savedProgress.questions?.length) {
    return savedProgress.questions.map(toExamQuestion);
  }

  const baseQuestions = savedProgress.questionBank?.length
    ? savedProgress.questionBank
    : starterQuestions;

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

function saveMistakeToNotebook(question: ExamQuestion, selectedAnswer: number) {
  const topic = getLearningTopicForQuestion(question);
  const mistake = {
    id: `${question.id}-${Date.now()}`,
    question: question.question,
    selectedAnswer,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
    domain: topic.domain,
    topic: topic.title,
    learningPath: `/learn/${topic.slug}`,
    savedAt: new Date().toISOString(),
  };

  try {
    const existingMistakes = window.localStorage.getItem(
      mistakeNotebookStorageKey,
    );
    const mistakes = existingMistakes ? JSON.parse(existingMistakes) : [];

    window.localStorage.setItem(
      mistakeNotebookStorageKey,
      JSON.stringify([mistake, ...mistakes].slice(0, 100)),
    );
  } catch {
    // Learning recommendations should never block answer review.
  }
}

function loadSavedProgress(): SavedProgress | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const savedProgress = window.localStorage.getItem(storageKey);
    return savedProgress ? (JSON.parse(savedProgress) as SavedProgress) : null;
  } catch {
    return null;
  }
}

function loadPaidPlan() {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const plan = window.localStorage.getItem(planStorageKey);
    return plan === "founder" || plan === "annual";
  } catch {
    return false;
  }
}

export default function ExamPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<ExamQuestion[]>(
    () => starterQuestions.map(toExamQuestion),
  );
  const questionsRef = useRef(questions);
  const isPrefetchingRef = useRef(false);
  const [hasLoadedProgress, setHasLoadedProgress] = useState(false);
  const [mode, setMode] = useState<ExamMode>("practice");
  const [domain, setDomain] = useState<DomainFilter>("Mixed");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("Mixed");
  const [freeTopicSlug, setFreeTopicSlug] = useState<FreeTopicSlug | null>(null);
  const [isFreeTopicPractice, setIsFreeTopicPractice] = useState(false);
  const [hasPaidPlan, setHasPaidPlan] = useState(false);
  const [accessType, setAccessType] = useState<PracticeAccess>("free");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [paletteSegment, setPaletteSegment] = useState(0);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(240 * 60);
  const [prefetchError, setPrefetchError] = useState("");

  const currentQuestion = questions[currentQuestionIndex] ?? null;
  const activeTotalQuestions = isFreeTopicPractice
    ? freeTopicQuestionCount
    : totalQuestions;
  const questionNumber = currentQuestionIndex + 1;
  const selectedOption = currentQuestion?.selectedAnswer ?? null;
  const hasReviewedCurrent = currentQuestion?.reviewed === true;
  const answeredCount = questions.filter(
    (question) => question.selectedAnswer !== undefined,
  ).length;
  const markedCount = questions.filter((question) => question.markedForReview)
    .length;
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
    () =>
      questions.reduce((total, question) => {
        return question.isCorrect ? total + 1 : total;
      }, 0),
    [questions],
  );

  const appendQuestion = useCallback((question: GeneratedQuestion) => {
    setQuestions((previous) => {
      if (previous.length >= activeTotalQuestions) {
        return previous;
      }

      const next = [
        ...previous,
        {
          ...toExamQuestion(question, previous.length),
          id: `generated-${Date.now()}-${previous.length + 1}`,
        },
      ];
      questionsRef.current = next;
      return next;
    });
  }, [activeTotalQuestions]);

  const fetchGeneratedQuestion = useCallback(async () => {
    const params = new URLSearchParams();

    if (domain !== "Mixed") {
      params.set("domain", domain);
    }

    if (difficulty !== "Mixed") {
      params.set("difficulty", difficulty);
    }

    const response = await fetch(`/api/generate-question?${params.toString()}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch question");
    }

    return (await response.json()) as GeneratedQuestion;
  }, [difficulty, domain]);

  const ensureQuestionBank = useCallback(
    async (targetCount: number) => {
      if (isPrefetchingRef.current) {
        return;
      }

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
        setPrefetchError(
          "AI question generation paused. The local starter bank is still ready.",
        );
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
      const params = new URLSearchParams(window.location.search);
      const requestedTopic = params.get("topic") as FreeTopicSlug | null;
      const requestedFreeMode = params.get("free") === "1";
      const requestedPlan = params.get("plan");
      const forceFreshSession = params.get("fresh") === "1";
      const isSupportedTopic =
        requestedTopic !== null && requestedTopic in learningTopics;

      const userHasPaidPlan = loadPaidPlan();
      const nextAccessType: PracticeAccess =
        requestedPlan === "free" || !userHasPaidPlan ? "free" : "live";

      setHasPaidPlan(userHasPaidPlan);
      setAccessType(nextAccessType);

      if (requestedFreeMode && requestedTopic && isSupportedTopic) {
        const freeQuestions = buildFreeTopicQuestions(requestedTopic).map(
          toExamQuestion,
        );

        setQuestions(freeQuestions);
        questionsRef.current = freeQuestions;
        setMode("practice");
        setDomain(freeQuestions[0].domain as DomainFilter);
        setDifficulty("Mixed");
        setFreeTopicSlug(requestedTopic);
        setIsFreeTopicPractice(true);
        setAccessType("free");
        setCurrentQuestionIndex(0);
        setPaletteSegment(0);
        setShowAnswer(false);
        setTimeLeft(240 * 60);
        setHasLoadedProgress(true);
        return;
      }

      const savedProgress = loadSavedProgress();
      const canUseSavedProgress =
        savedProgress?.accessType === nextAccessType && !forceFreshSession;

      if (canUseSavedProgress && savedProgress) {
        const savedQuestionIndex = Math.max(
          0,
          (savedProgress.questionNumber ?? 1) - 1,
        );
        const savedQuestions = buildQuestionsFromSavedProgress(savedProgress);

        setQuestions(savedQuestions);
        questionsRef.current = savedQuestions;
        setMode(savedProgress.mode ?? "practice");
        setDomain(savedProgress.domain ?? "Mixed");
        setDifficulty(savedProgress.difficulty ?? "Mixed");
        setCurrentQuestionIndex(savedQuestionIndex);
        setPaletteSegment(Math.floor(savedQuestionIndex / palettePageSize));
        setShowAnswer(savedQuestions[savedQuestionIndex]?.reviewed ?? false);
        setTimeLeft(savedProgress.timeLeft ?? 240 * 60);
      } else if (nextAccessType === "free") {
        const fixedQuestions = buildRandomFixedPracticeSet(totalQuestions).map(
          toExamQuestion,
        );

        setQuestions(fixedQuestions);
        questionsRef.current = fixedQuestions;
        setMode("practice");
      } else {
        setQuestions([]);
        questionsRef.current = [];
        setMode("practice");
        setDomain("Mixed");
        setDifficulty("Mixed");
        setCurrentQuestionIndex(0);
        setPaletteSegment(0);
        setShowAnswer(false);
        setTimeLeft(240 * 60);
      }

      setHasLoadedProgress(true);
    }, 0);

    return () => window.clearTimeout(loadHandle);
  }, []);

  useEffect(() => {
    if (isFreeTopicPractice || accessType !== "live" || !hasPaidPlan) {
      return;
    }

    const targetCount = Math.min(
      activeTotalQuestions,
      Math.max(liveInitialBufferCount, questionNumber + desiredBufferAhead),
    );
    const prefetchHandle = window.setTimeout(() => {
      void ensureQuestionBank(targetCount);
    }, 0);

    return () => window.clearTimeout(prefetchHandle);
  }, [
    activeTotalQuestions,
    accessType,
    answeredCount,
    hasPaidPlan,
    ensureQuestionBank,
    isFreeTopicPractice,
    questionNumber,
  ]);

  useEffect(() => {
    if (mode === "practice") {
      return;
    }

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

  useEffect(() => {
    if (!hasLoadedProgress || isFreeTopicPractice) {
      return;
    }

    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        accessType,
        mode,
        domain,
        difficulty,
        questions,
        questionNumber,
        timeLeft,
      }),
    );
  }, [
    accessType,
    difficulty,
    domain,
    hasLoadedProgress,
    isFreeTopicPractice,
    mode,
    questions,
    questionNumber,
    timeLeft,
  ]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(hours).padStart(2, "0")}:${String(
    minutes,
  ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const handleAnswer = (index: number) => {
    setQuestions((previous) => {
      const next = previous.map((question, mapIndex) =>
        mapIndex === currentQuestionIndex
          ? {
              ...question,
              selectedAnswer: index,
              reviewed: mode === "exam" ? question.reviewed : false,
              isCorrect: index === question.correctAnswer,
            }
          : question,
      );

      questionsRef.current = next;
      return next;
    });
    setShowAnswer(false);
  };

  const handleReviewAnswer = () => {
    if (selectedOption === null) {
      return;
    }

    setQuestions((previous) => {
      const next = previous.map((question, mapIndex) =>
        mapIndex === currentQuestionIndex
          ? { ...question, reviewed: true }
          : question,
      );

      questionsRef.current = next;
      return next;
    });

    if (currentQuestion && selectedOption !== currentQuestion.correctAnswer) {
      saveMistakeToNotebook(currentQuestion, selectedOption);
    }

    setShowAnswer(true);
  };

  const toggleMarkedForReview = () => {
    setQuestions((previous) => {
      const next = previous.map((question, mapIndex) =>
        mapIndex === currentQuestionIndex
          ? { ...question, markedForReview: !question.markedForReview }
          : question,
      );

      questionsRef.current = next;
      return next;
    });
  };

  const handleNext = () => {
    if (
      !currentQuestion ||
      selectedOption === null ||
      (mode === "practice" && !hasReviewedCurrent)
    ) {
      return;
    }

    if (questionNumber >= activeTotalQuestions) {
      handleSubmitExam();
      return;
    }

    const nextQuestionNumber = questionNumber + 1;
    const nextQuestionIndex = nextQuestionNumber - 1;
    setCurrentQuestionIndex(nextQuestionIndex);
    setPaletteSegment(Math.floor((nextQuestionNumber - 1) / palettePageSize));
    setShowAnswer(questions[nextQuestionIndex]?.reviewed === true);
  };

  const handleBack = () => {
    const nextQuestionIndex = Math.max(0, currentQuestionIndex - 1);
    setCurrentQuestionIndex(nextQuestionIndex);
    setPaletteSegment(Math.floor(nextQuestionIndex / palettePageSize));
    setShowAnswer(questions[nextQuestionIndex]?.reviewed === true);
  };

  const handleQuestionJump = (index: number) => {
    setCurrentQuestionIndex(index);
    setPaletteSegment(Math.floor(index / palettePageSize));
    setShowAnswer(questions[index]?.reviewed === true);
  };

  const handleSubmitExam = () => {
    const finishedAt = new Date().toISOString();

    window.localStorage.setItem(
      resultsStorageKey,
      JSON.stringify({
        mode,
        domain,
        difficulty,
        freeTopicSlug,
        isFreeTopicPractice,
        questions,
        score,
        answeredCount,
        availableQuestions: questions.length,
        totalQuestions: activeTotalQuestions,
        timeLeft,
        finishedAt,
      }),
    );

    router.push("/results");
  };

  const paletteStart = paletteSegment * palettePageSize + 1;
  const visibleQuestionNumbers = Array.from(
    {
      length: Math.min(
        palettePageSize,
        activeTotalQuestions - paletteStart + 1,
      ),
    },
    (_, index) => paletteStart + index,
  );
  const paletteSegmentCount = Math.ceil(activeTotalQuestions / palettePageSize);
  const progressPercent = (questionNumber / activeTotalQuestions) * 100;

  return (
    <main className="exam-page">
      <div className="exam-shell">
        <div className="exam-breadcrumb">
          Simulator &gt; PMP Simulated Tests &gt; PMP Exam Simulator Part 1
        </div>

        <div className="exam-overview">
          <div>
            <p className="exam-overview-label">Question</p>
            <strong>
              {questionNumber} of {activeTotalQuestions}
            </strong>
          </div>
          <div>
            <p className="exam-overview-label">Answered</p>
            <strong>{answeredCount}</strong>
          </div>
          <div>
            <p className="exam-overview-label">
              {isFreeTopicPractice
                ? "Free Topic"
                : accessType === "live"
                  ? "AI Buffer"
                  : "Fixed Bank"}
            </p>
            <strong>
              {questions.length}/{activeTotalQuestions}
            </strong>
          </div>
          <div>
            <p className="exam-overview-label">Ready Ahead</p>
            <strong>{bufferedAhead}</strong>
          </div>
        </div>

        <div
          className="exam-mode-bar"
          aria-label="Simulator mode and question filters"
        >
          {isFreeTopicPractice ? (
            <div className="exam-locked-topic">
              Free {domain} Practice questions · 150 questions by difficulty
            </div>
          ) : (
            <div className="exam-mode-group" role="group" aria-label="Mode">
              <button
                type="button"
                onClick={() => setMode("practice")}
                className={mode === "practice" ? "exam-mode-active" : ""}
              >
                Learning Practice
              </button>
              <button
                type="button"
                onClick={() => setMode("exam")}
                className={mode === "exam" ? "exam-mode-active" : ""}
              >
                Final Exam
              </button>
            </div>
          )}

          {!isFreeTopicPractice && !hasPaidPlan && (
            <Link href="/pricing" className="exam-upgrade-link">
              Unlock live AI PMP test
            </Link>
          )}

          {!isFreeTopicPractice && (
            <>
              <label>
                Domain
                <select
                  value={domain}
                  onChange={(event) =>
                    setDomain(event.target.value as DomainFilter)
                  }
                >
                  {[
                    "Mixed",
                    "Agile",
                    "Risk",
                    "Stakeholder",
                    "Hybrid",
                    "AI Ethics",
                    "Sustainability",
                    "Business Environment",
                  ].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                </select>
              </label>

              <label>
                Difficulty
                <select
                  value={difficulty}
                  onChange={(event) =>
                    setDifficulty(event.target.value as DifficultyFilter)
                  }
                >
                  {["Mixed", "Easy", "Medium", "Hard"].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
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
          {Array.from({ length: paletteSegmentCount }, (_, segment) => segment).map((segment) => {
            const start = segment * palettePageSize + 1;
            const end = Math.min(
              activeTotalQuestions,
              start + palettePageSize - 1,
            );

            return (
              <button
                key={segment}
                type="button"
                onClick={() => setPaletteSegment(segment)}
                className={
                  paletteSegment === segment ? "exam-segment-active" : ""
                }
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
            <span className="exam-status-chip exam-status-chip-current" />
            Current
          </div>
          <div className="exam-status-item">
            <span className="exam-status-chip" />
            Unanswered
          </div>
          <div className="exam-status-item">
            <span className="exam-status-chip exam-status-chip-pending" />
            {isFreeTopicPractice
              ? "Locked Topic"
              : accessType === "live"
                ? "AI Generating"
                : "Fixed Bank"}
          </div>
          <div className="exam-status-item">
            <span className="exam-status-chip exam-status-chip-answered" />
            Answered
          </div>
          <div className="exam-status-item">
            <span className="exam-status-chip exam-status-chip-review" />
            Marked
          </div>
          <div className="exam-metrics">
            <span>
              {mode === "exam" ? `Time Left: ${formattedTime}` : "No time limit"}
            </span>
            <span>Score: {score}</span>
            <span>Marked: {markedCount}</span>
          </div>
        </div>

        {prefetchError && <div className="exam-prefetch-note">{prefetchError}</div>}

        {!isFreeTopicPractice && !hasPaidPlan && (
          <div className="exam-plan-note">
            You are using random questions from the fixed 1000-question practice
            bank. Paid users unlock live PMP practice tests with fresh AI project
            management questions and expanded learning topics.
          </div>
        )}

        {!isFreeTopicPractice && accessType === "live" && hasPaidPlan && (
          <div className="exam-live-note">
            Live PMP Practice is active. Questions are generated in the
            background with OpenAI and refreshed for this session.
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
            {currentQuestion?.markedForReview
              ? "Unmark Review"
              : "Mark For Review"}
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
                  <h1 className="exam-muted-title">
                    Question {questionNumber}
                    {currentQuestion.source && (
                      <span> (Source: {currentQuestion.source})</span>
                    )}
                  </h1>
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

                <h2 className="exam-question">{currentQuestion.question}</h2>
              </div>

              <div className="exam-options">
                {currentQuestion.options.map((option, index) => {
                  let buttonStyle = "";

                  if (selectedOption === index) {
                    buttonStyle = "exam-option-selected";
                  }

                  if (showAnswer) {
                    if (index === currentQuestion.correctAnswer) {
                      buttonStyle = "exam-option-correct";
                    } else if (
                      index === selectedOption &&
                      index !== currentQuestion.correctAnswer
                    ) {
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
                          {selectedOption === index && (
                            <div className="exam-radio-dot" />
                          )}
                        </div>

                        <div className="exam-option-text">
                          <span className="exam-option-label">
                            {String.fromCharCode(65 + index)}.
                          </span>

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
                    <span>
                      Correct answer:{" "}
                      {String.fromCharCode(65 + currentQuestion.correctAnswer)}
                    </span>
                  </div>
                  <p>{currentQuestion.explanation}</p>

                  <div className="exam-explanation-grid">
                    <div>
                      <p className="exam-explanation-subtitle">
                        Elimination Logic
                      </p>
                      <ul>
                        {currentQuestion.options.map((option, index) => (
                          <li key={option}>
                            <strong>{String.fromCharCode(65 + index)}.</strong>{" "}
                            {currentQuestion.whyOthersWrong?.[index] ??
                              getFallbackWhyWrong(currentQuestion, index)}
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
                        <p className="exam-explanation-subtitle">
                          Recommended Study
                        </p>
                        <h3>{learningTopic.title}</h3>
                        <p>{learningTopic.summary}</p>
                      </div>
                      <Link
                        href={`/learn/${learningTopic.slug}`}
                        className="exam-learn-link"
                      >
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
                  disabled={
                    selectedOption === null ||
                    (mode === "practice" && !hasReviewedCurrent)
                  }
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
