"use client";

import { useMemo, useState } from "react";
import type { QuestionType } from "../certifications";

type QuestionOption = {
  id: string;
  text: string;
};

type MatchPair = {
  left: string;
  right: string;
};

type QuestionCardProps = {
  question?: string;
  options?: QuestionOption[];
  questionType?: QuestionType;
  questionNumber?: number;
  totalQuestions?: number;
  onAnswerSelect?: (value: string | string[] | MatchPair[] | number) => void;
  /** For matching questions: items to match */
  matchItems?: { left: string; right: string }[];
  /** For fill-in-blank: expected answer type */
  blankType?: "number" | "text";
  /** For drag-to-order: ordered items */
  orderItems?: string[];
  /** For multiple-response: which options are correct (for scoring) */
  correctAnswers?: number[];
};

const defaultOptions: QuestionOption[] = [
  { id: "A", text: "Meet with the team to identify the blocker, review the sprint goal, and agree on the next best action." },
  { id: "B", text: "Escalate the issue to the project sponsor and request additional resources immediately." },
  { id: "C", text: "Update the risk register and wait until the next steering committee meeting." },
  { id: "D", text: "Ask the product owner to remove the delayed work from scope without further discussion." },
];

type MatchAnswer = { left: string; right: string };

function letterLabel(index: number): string {
  return String.fromCharCode(65 + index);
}

export default function QuestionCard({
  question = "A project team is working in an agile environment and has discovered a dependency that may delay delivery of a high-priority feature. What should the project manager do first?",
  options = defaultOptions,
  questionType = "multiple-choice",
  questionNumber = 1,
  totalQuestions = 185,
  onAnswerSelect,
  matchItems,
  blankType = "text",
  orderItems,
}: QuestionCardProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [selectedMultiple, setSelectedMultiple] = useState<string[]>([]);
  const [matchAnswers, setMatchAnswers] = useState<Map<string, string>>(new Map());
  const [blankAnswer, setBlankAnswer] = useState("");
  const [draggedOrder, setDraggedOrder] = useState<string[]>(orderItems ?? []);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const progress = useMemo(() => {
    if (!totalQuestions) return 0;
    return Math.min(100, Math.max(0, (questionNumber / totalQuestions) * 100));
  }, [questionNumber, totalQuestions]);

  function handleSelect(option: QuestionOption) {
    if (questionType === "multiple-response") {
      const next = selectedMultiple.includes(option.id)
        ? selectedMultiple.filter((id) => id !== option.id)
        : [...selectedMultiple, option.id];
      setSelectedMultiple(next);
      onAnswerSelect?.(next);
    } else {
      setSelectedOptionId(option.id);
      onAnswerSelect?.(option.id);
    }
  }

  function handleMatchChange(left: string, right: string) {
    const next = new Map(matchAnswers);
    next.set(left, right);
    setMatchAnswers(next);
    onAnswerSelect?.(Array.from(next.entries()).map(([l, r]) => ({ left: l, right: r })));
  }

  function handleBlankChange(value: string) {
    setBlankAnswer(value);
    onAnswerSelect?.(value);
  }

  function handleDragStart(index: number) {
    setDragIndex(index);
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const next = [...draggedOrder];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(index, 0, moved);
    setDraggedOrder(next);
    setDragIndex(index);
    onAnswerSelect?.(next);
  }

  function handleDragEnd() {
    setDragIndex(null);
  }

  const isMultipleResponse = questionType === "multiple-response";
  const isMatching = questionType === "matching";
  const isFillInBlank = questionType === "fill-in-blank";
  const isHotspot = questionType === "hotspot";

  const typeLabel = {
    "multiple-choice": "Multiple Choice",
    "multiple-response": "Select All That Apply",
    matching: "Matching",
    "fill-in-blank": "Fill in the Blank",
    hotspot: "Drag to Order",
    situational: "Scenario",
  }[questionType];

  return (
    <section className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70 sm:p-7 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Question {questionNumber} of {totalQuestions}
          </p>
          <div className="mt-2 h-2 w-40 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-teal-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <span className="w-fit rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-700">
          {typeLabel}
        </span>
      </div>

      <h2 className="text-balance text-xl font-semibold leading-8 text-slate-950 sm:text-2xl">
        {question}
      </h2>

      {/* Multiple Choice / Multiple Response */}
      {!isMatching && !isFillInBlank && !isHotspot && (
        <div className="mt-7 grid gap-3 sm:gap-4">
          {options.slice(0, 4).map((option) => {
            const isSelected = isMultipleResponse
              ? selectedMultiple.includes(option.id)
              : selectedOptionId === option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelect(option)}
                aria-pressed={isSelected}
                className={`group flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:p-5 ${
                  isSelected
                    ? "border-teal-600 bg-teal-50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-teal-300 hover:bg-slate-50"
                }`}
              >
                {/* Radio (circle) for single-select, Square for multi-select */}
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-bold transition-colors ${
                    isMultipleResponse ? "rounded-md" : "rounded-full"
                  } ${
                    isSelected
                      ? "border-teal-600 bg-teal-600 text-white"
                      : "border-slate-300 bg-slate-50 text-slate-600 group-hover:border-teal-300 group-hover:text-teal-700"
                  }`}
                >
                  {isSelected && isMultipleResponse ? "✓" : option.id}
                </span>

                <span
                  className={`pt-1 text-base leading-7 ${
                    isSelected ? "font-medium text-slate-950" : "text-slate-700"
                  }`}
                >
                  {option.text}
                </span>
              </button>
            );
          })}
          {isMultipleResponse && (
            <p className="mt-2 text-sm text-slate-500 italic">
              Select all that apply. Toggle each option to select or deselect.
            </p>
          )}
        </div>
      )}

      {/* Matching: two columns */}
      {isMatching && matchItems && (
        <div className="mt-7">
          <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
            <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Items</div>
            <div />
            <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Match</div>
          </div>
          {matchItems.map((item, idx) => {
            const selectedRight = matchAnswers.get(item.left) || "";
            const rightOptions = [...new Set(matchItems.map((i) => i.right))];
            return (
              <div key={idx} className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center py-3 border-b border-slate-100 last:border-b-0">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                    {idx + 1}
                  </span>
                  <span className="text-sm text-slate-800 font-medium">{item.left}</span>
                </div>
                <span className="text-slate-300">⟷</span>
                <select
                  value={selectedRight}
                  onChange={(e) => handleMatchChange(item.left, e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
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
      )}

      {/* Fill in the Blank */}
      {isFillInBlank && (
        <div className="mt-7">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-200 transition-all">
            <span className="text-sm font-bold text-slate-400">Answer:</span>
            <input
              type={blankType === "number" ? "number" : "text"}
              value={blankAnswer}
              onChange={(e) => handleBlankChange(e.target.value)}
              placeholder={blankType === "number" ? "Enter a number (e.g., 1.5)" : "Type your answer..."}
              className="flex-1 border-0 bg-transparent text-base font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none"
              autoFocus
            />
          </div>
          <p className="mt-3 text-sm text-slate-500 italic">
            Type the exact answer based on the scenario.
          </p>
        </div>
      )}

      {/* Hotspot / Drag to Order */}
      {isHotspot && draggedOrder.length > 0 && (
        <div className="mt-7">
          <p className="mb-4 text-sm font-medium text-slate-500">
            Drag the items into the correct order:
          </p>
          <div className="grid gap-2">
            {draggedOrder.map((item, index) => (
              <div
                key={`${item}-${index}`}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`flex items-center gap-3 rounded-xl border-2 p-4 cursor-grab active:cursor-grabbing transition-all ${
                  dragIndex === index
                    ? "border-teal-500 bg-teal-50 shadow-md scale-[1.02]"
                    : "border-slate-200 bg-white hover:border-teal-300 hover:bg-slate-50"
                }`}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500">
                  {index + 1}
                </span>
                <span className="flex-1 text-sm font-medium text-slate-700">{item}</span>
                <span className="text-slate-300 text-lg">⠿</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-slate-500 italic">
            Drag items to reorder them into the correct sequence.
          </p>
        </div>
      )}

      <div className="mt-7 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          {isFillInBlank
            ? blankAnswer
              ? `Your answer: ${blankAnswer}`
              : "Type your answer to continue."
            : isMatching
              ? matchAnswers.size > 0
                ? `${matchAnswers.size} of ${matchItems?.length ?? 0} matched`
                : "Match each item to continue."
              : isHotspot
                ? "Drag items into the correct order."
                : isMultipleResponse
                  ? selectedMultiple.length > 0
                    ? `Selected ${selectedMultiple.length} option${selectedMultiple.length > 1 ? "s" : ""}`
                    : "Select all that apply to continue."
                  : selectedOptionId
                    ? `Selected answer: ${selectedOptionId}`
                    : "Choose the best answer to continue."}
        </p>

        <button
          type="button"
          disabled={
            isMultipleResponse
              ? selectedMultiple.length === 0
              : isMatching
                ? matchAnswers.size < (matchItems?.length ?? 0)
                : isFillInBlank
                  ? !blankAnswer.trim()
                  : isHotspot
                    ? false
                    : !selectedOptionId
          }
          className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
        >
          Review Answer
        </button>
      </div>
    </section>
  );
}
