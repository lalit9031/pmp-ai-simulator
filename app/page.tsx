"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaArrowRight,
  FaBookOpen,
  FaChartLine,
  FaClock,
  FaRegFileAlt,
} from "react-icons/fa";
import {
  certifications,
  getExamCertifications,
  getLearningCertifications,
  type CertSlug,
} from "./certifications";
import {
  FadeIn,
  SlideUp,
  StaggerContainer,
  StaggerItem,
  ScaleOnHover,
} from "./components/Animations";

const userStorageKey = "pmp-simulator-user-v1";
const planStorageKey = "pmp-simulator-plan-v1";

function isPaidPlan(plan: string | null) {
  return plan === "founder" || plan === "annual" || plan === "global";
}

export default function IntroPage() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [hasPaidPlan, setHasPaidPlan] = useState(false);

  useEffect(() => {
    const loadHandle = window.setTimeout(() => {
      const user = window.localStorage.getItem(userStorageKey);
      const plan = window.localStorage.getItem(planStorageKey);
      setIsSignedIn(Boolean(user));
      setHasPaidPlan(isPaidPlan(plan));
    }, 0);
    return () => window.clearTimeout(loadHandle);
  }, []);

  const examCerts = getExamCertifications();
  const learningCerts = getLearningCertifications();
  const allCerts = [...examCerts, ...learningCerts];

  const startExamHref = isSignedIn
    ? hasPaidPlan
      ? "/exam?cert=pmp&plan=live&fresh=1"
      : "/exam?cert=pmp&plan=free&fresh=1"
    : "/login?next=%2Fexam%3Fcert%3Dpmp%26plan%3Dfree%26fresh%3D1";

  return (
    <main className="intro-page">
      <section className="intro-hero">
        <FadeIn>
        <div className="intro-copy">
          <p className="intro-eyebrow">Multi-Certification Practice Environment</p>
          <h1>Exam Simulator</h1>
          <p className="intro-lede">
            Prepare for PMP, PMI-ACP, CAPM, CSM, PSM I, or study Six Sigma.
            Practice with AI-powered questions, track your progress, and upgrade
            when you are ready for the full version.
          </p>
          <div className="intro-actions">
            <ScaleOnHover>
            <Link href={startExamHref} className="intro-primary-action">
              Start PMP Exam
              <FaArrowRight aria-hidden="true" />
            </Link>
            </ScaleOnHover>
            <ScaleOnHover>
            <Link href="/pricing" className="intro-secondary-action">
              View Plans
            </Link>
            </ScaleOnHover>
          </div>
        </div>
        </FadeIn>

        <SlideUp delay={0.15}>
        <div className="intro-panel" aria-label="Available certifications preview">
          <div className="intro-panel-header">
            <span>Available Certs</span>
            <strong>{allCerts.length}</strong>
          </div>
          <div className="intro-cert-preview-grid">
            {allCerts.map((cert) => (
              <Link
                key={cert.slug}
                href={`/exam?cert=${cert.slug}&plan=free&fresh=1`}
                className="intro-cert-badge"
                style={{ borderLeftColor: cert.color }}
                title={cert.title}
              >
                <span>{cert.icon}</span>
                <strong>{cert.shortName}</strong>
              </Link>
            ))}
          </div>
          <div className="intro-panel-footer">
            <span>{examCerts.length} exam certifications</span>
            <span>{learningCerts.length} learning-only</span>
          </div>
        </div>
        </SlideUp>
      </section>

      {/* Certification cards */}
      <section className="intro-certs" aria-label="Certifications">
        <FadeIn>
        <div className="intro-certs-header">
          <p className="intro-eyebrow">Certifications</p>
          <h2>Choose your certification path</h2>
          <p>
            Each certification includes domain-specific questions, timed exam
            simulations, and personalized learning recommendations.
          </p>
        </div>
        </FadeIn>

        <StaggerContainer className="intro-certs-grid">
          {allCerts.map((cert) => (
            <StaggerItem key={cert.slug}>
            <Link
              href={`/exam?cert=${cert.slug}&plan=free&fresh=1`}
              className="intro-cert-card"
              style={{ borderTopColor: cert.color }}
            >
              <div className="intro-cert-card-top">
                <span className="intro-cert-card-icon">{cert.icon}</span>
                <span className={`intro-cert-card-type ${cert.type === "learning" ? "intro-cert-type-learning" : ""}`}>
                  {cert.type === "exam" ? "Exam" : "Learning"}
                </span>
              </div>
              <h3>{cert.title}</h3>
              <p>{cert.description}</p>
              <div className="intro-cert-card-meta">
                {cert.type === "exam" && (
                  <>
                    <span>{cert.totalQuestions} questions</span>
                    <span>{cert.timeLimitMinutes} min</span>
                  </>
                )}
              </div>
              <div className="intro-cert-card-action">
                <span>
                  {cert.type === "exam" ? "Start Practice" : "Start Learning"}
                </span>
                <FaArrowRight aria-hidden="true" />
              </div>
            </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      <StaggerContainer className="intro-routes" aria-label="Application routes">
        <StaggerItem>
        <Link href="/results" className="intro-route-card">
          <div className="intro-route-icon">
            <FaClock aria-hidden="true" />
          </div>
          <div>
            <div className="intro-route-heading">
              <h2>Results</h2>
              <span>Ready</span>
            </div>
            <p>Review score, domain performance, and answer history.</p>
          </div>
        </Link>
        </StaggerItem>
        <StaggerItem>
        <Link href="/learn" className="intro-route-card">
          <div className="intro-route-icon">
            <FaBookOpen aria-hidden="true" />
          </div>
          <div>
            <div className="intro-route-heading">
              <h2>Learning Hub</h2>
              <span>Ready</span>
            </div>
            <p>Study targeted topics after missed questions.</p>
          </div>
        </Link>
        </StaggerItem>
        <StaggerItem>
        <Link href="/dashboard" className="intro-route-card">
          <div className="intro-route-icon">
            <FaChartLine aria-hidden="true" />
          </div>
          <div>
            <div className="intro-route-heading">
              <h2>Analytics</h2>
              <span>Later</span>
            </div>
            <p>Track readiness trends and focus areas over time.</p>
          </div>
        </Link>
        </StaggerItem>
      </StaggerContainer>

      {isSignedIn && !hasPaidPlan && (
        <FadeIn>
        <section className="intro-benefits" aria-label="Paid plan benefits">
          <SlideUp>
          <div className="intro-benefits-header">
            <p className="intro-eyebrow">Unlock Full Access</p>
            <h2>Why go paid?</h2>
            <p>
              Get the complete exam experience with AI-powered questions,
              all certifications, unlimited topics, and detailed analytics.
            </p>
          </div>
          </SlideUp>
          <StaggerContainer className="intro-benefits-grid">
            <StaggerItem>
            <div className="intro-benefit-card intro-benefit-featured">
              <span className="intro-benefit-icon">🤖</span>
              <h3>AI-Powered Questions</h3>
              <p>
                Unlimited AI-generated questions covering all certifications,
                updated with latest trends including ESG and business value.
              </p>
            </div>
            </StaggerItem>
            <StaggerItem>
            <div className="intro-benefit-card">
              <span className="intro-benefit-icon">📚</span>
              <h3>All Certifications</h3>
              <p>
                Full access to PMP, PMI-ACP, CAPM, CSM, PSM I, and Six Sigma.
                Not just 4 topics — unlock everything.
              </p>
            </div>
            </StaggerItem>
            <StaggerItem>
            <div className="intro-benefit-card">
              <span className="intro-benefit-icon">📊</span>
              <h3>Advanced Analytics</h3>
              <p>
                Track certification-wise performance, identify weak areas, and
                get personalized learning recommendations.
              </p>
            </div>
            </StaggerItem>
            <StaggerItem>
            <div className="intro-benefit-card">
              <span className="intro-benefit-icon">🏆</span>
              <h3>Live Exam Simulator</h3>
              <p>
                Timed exam simulations for each certification with real-style
                questions, just like the actual certification tests.
              </p>
            </div>
            </StaggerItem>
          </StaggerContainer>
          <div className="intro-benefits-actions">
            <Link href="/pricing" className="intro-primary-action">
              View Plans &amp; Pricing
            </Link>
            <Link href="/exam?cert=pmp&plan=free&fresh=1" className="intro-secondary-action">
              Continue Free
            </Link>
          </div>
        </section>
        </FadeIn>
      )}
    </main>
  );
}
