"use client";

import { useMemo, useState } from "react";

type QuestionOption = {
  id: string;
  text: string;
};

type QuestionCardProps = {
  question?: string;
  options?: QuestionOption[];
  questionNumber?: number;
  totalQuestions?: number;
  onAnswerSelect?: (option: QuestionOption) => void;
};

const defaultOptions: QuestionOption[] = [
  {
    id: "A",
    text: "Meet with the team to identify the blocker, review the sprint goal, and agree on the next best action.",
  },
  {
    id: "B",
    text: "Escalate the issue to the project sponsor and request additional resources immediately.",
  },
  {
    id: "C",
    text: "Update the risk register and wait until the next steering committee meeting to discuss the impact.",
  },
  {
    id: "D",
    text: "Ask the product owner to remove the delayed work from scope without further team discussion.",
  },
];

export default function QuestionCard({
  question = "A project team is working in an agile environment and has discovered a dependency that may delay delivery of a high-priority feature. What should the project manager do first?",
  options = defaultOptions,
  questionNumber = 1,
  totalQuestions = 185,
  onAnswerSelect,
}: QuestionCardProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const progress = useMemo(() => {
    if (!totalQuestions) {
      return 0;
    }

    return Math.min(100, Math.max(0, (questionNumber / totalQuestions) * 100));
  }, [questionNumber, totalQuestions]);

  function handleSelect(option: QuestionOption) {
    setSelectedOptionId(option.id);
    onAnswerSelect?.(option);
  }

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
          PMP Practice
        </span>
      </div>

      <h2 className="text-balance text-xl font-semibold leading-8 text-slate-950 sm:text-2xl">
        {question}
      </h2>

      <div className="mt-7 grid gap-3 sm:gap-4">
        {options.slice(0, 4).map((option) => {
          const isSelected = selectedOptionId === option.id;

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
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-bold transition-colors ${
                  isSelected
                    ? "border-teal-600 bg-teal-600 text-white"
                    : "border-slate-300 bg-slate-50 text-slate-600 group-hover:border-teal-300 group-hover:text-teal-700"
                }`}
              >
                {option.id}
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
      </div>

      <div className="mt-7 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          {selectedOptionId
            ? `Selected answer: ${selectedOptionId}`
            : "Choose the best answer to continue."}
        </p>

        <button
          type="button"
          disabled={!selectedOptionId}
          className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
        >
          Review Answer
        </button>
      </div>
    </section>
  );
}
