"use client";

import { useEffect, useState } from "react";

type CountdownTimerProps = {
  initialMinutes?: number;
};

function formatTime(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

export default function CountdownTimer({
  initialMinutes = 240,
}: CountdownTimerProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(
    () => initialMinutes * 60,
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRemainingSeconds((seconds) => Math.max(0, seconds - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const isRunningLow = remainingSeconds <= 15 * 60;

  return (
    <section className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70 sm:w-auto sm:min-w-72">
      <div className="flex items-center justify-between gap-6">
        <div>
          <p className="text-sm font-medium text-slate-500">Exam Time Left</p>
          <p
            className={`mt-2 font-mono text-3xl font-semibold tracking-normal sm:text-4xl ${
              isRunningLow ? "text-red-600" : "text-slate-950"
            }`}
          >
            {formatTime(remainingSeconds)}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full border text-sm font-bold ${
            isRunningLow
              ? "border-red-200 bg-red-50 text-red-600"
              : "border-teal-100 bg-teal-50 text-teal-700"
          }`}
          aria-hidden="true"
        >
          ExamPro
        </div>
      </div>
    </section>
  );
}
