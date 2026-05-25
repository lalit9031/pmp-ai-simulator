"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { FaCheckCircle, FaRocket, FaBookOpen } from "react-icons/fa";

const planStorageKey = "pmp-simulator-plan-v1";

function SuccessInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") ?? "annual";
  const [countdown, setCountdown] = useState(5);

  const planLabel =
    plan === "founder"
      ? "Founder"
      : plan === "annual"
        ? "Annual"
        : "Global";

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/exam?plan=live&fresh=1");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <main className="coming-page">
      <section className="coming-shell payment-success-shell">
        <div className="payment-success-icon-wrap">
          <FaCheckCircle className="payment-success-icon" />
        </div>

        <p className="intro-eyebrow">Payment Confirmed</p>
        <h1>You&rsquo;re all set!</h1>

        <p>
          Your <strong>{planLabel} Plan</strong> is now active. You have
          full access to live AI-generated PMP questions, all learning
          topics, and the complete exam simulation for one year.
        </p>

        <div className="payment-success-actions">
          <Link
            href={`/exam?plan=live&fresh=1`}
            className="intro-primary-action"
          >
            <FaRocket aria-hidden="true" />
            Start your exam
          </Link>
          <Link href="/learn" className="intro-secondary-action">
            <FaBookOpen aria-hidden="true" />
            Explore learning topics
          </Link>
        </div>

        <p className="payment-success-redirect">
          Auto-redirecting to exam in {countdown}s...
        </p>
      </section>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="coming-page">
          <section className="coming-shell">
            <div className="exam-spinner" />
            <p>Loading...</p>
          </section>
        </main>
      }
    >
      <SuccessInner />
    </Suspense>
  );
}
