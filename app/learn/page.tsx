"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { learningTopics } from "../learningTopics";
import {
  certifications,
  getCertification,
  getLearningCertifications,
  getExamCertifications,
  type CertSlug,
} from "../certifications";

const planStorageKey = "pmp-simulator-plan-v1";

function isPaidPlanActive() {
  const plan = window.localStorage.getItem(planStorageKey);
  return plan === "founder" || plan === "annual" || plan === "global";
}

export default function LearnPage() {
  const searchParams = useSearchParams();
  const certParam = searchParams.get("cert") as CertSlug | null;
  const [hasPaidPlan, setHasPaidPlan] = useState(false);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setHasPaidPlan(isPaidPlanActive());
    }, 0);
    return () => window.clearTimeout(handle);
  }, []);

  // If a specific cert is selected, show only its topics
  const selectedCert = certParam ? getCertification(certParam) : null;

  const examCerts = getExamCertifications();
  const learningCerts = getLearningCertifications();

  // Get visible topics for a cert
  const getCertTopics = (slug: CertSlug) => {
    const cert = getCertification(slug);
    const slugs = hasPaidPlan ? cert.topicSlugs : cert.freeTopicSlugs;
    return slugs
      .map((s) => learningTopics[s])
      .filter(Boolean);
  };

  return (
    <main className="learn-page">
      <section className="learn-shell">
        <div className="learn-header">
          <p className="intro-eyebrow">Learning Hub</p>
          <h1>Study the logic behind your mistakes.</h1>
          <p>
            {hasPaidPlan
              ? "All topics unlocked across every certification. Study at your own pace."
              : "Free users get core topics per certification. Paid users unlock the complete library."}
          </p>
        </div>

        {/* Certification selection tabs */}
        <div className="cert-tabs">
          <Link
            href="/learn"
            className={`cert-tab${!certParam ? " cert-tab-active" : ""}`}
          >
            All Certifications
          </Link>
          {examCerts.map((c) => (
            <Link
              key={c.slug}
              href={`/learn?cert=${c.slug}`}
              className={`cert-tab${certParam === c.slug ? " cert-tab-active" : ""}`}
            >
              {c.icon} {c.shortName}
            </Link>
          ))}
          {learningCerts.map((c) => (
            <Link
              key={c.slug}
              href={`/learn?cert=${c.slug}`}
              className={`cert-tab${certParam === c.slug ? " cert-tab-active" : ""} cert-tab-learning`}
            >
              {c.icon} {c.shortName}
            </Link>
          ))}
        </div>

        {/* Selected cert info */}
        {selectedCert && (
          <div className="learn-cert-info">
            <span className="learn-cert-icon">{selectedCert.icon}</span>
            <div>
              <h2>{selectedCert.title}</h2>
              <p>{selectedCert.description}</p>
            </div>
          </div>
        )}

        {/* Exam certification topics */}
        {examCerts.map((cert) => {
          if (selectedCert && cert.slug !== selectedCert.slug) return null;
          const topics = getCertTopics(cert.slug as CertSlug);
          if (!topics.length) return null;

          return (
            <div key={cert.slug} className="learn-cert-section">
              <div className="learn-cert-heading">
                <span className="learn-cert-heading-icon">{cert.icon}</span>
                <div>
                  <h3>{cert.shortName} Topics</h3>
                  <p>{cert.description}</p>
                </div>
                <Link
                  href={`/exam?cert=${cert.slug}&plan=${hasPaidPlan ? "live" : "free"}&fresh=1`}
                  className="learn-start-btn"
                >
                  Start Practice
                </Link>
              </div>

              <div className="learn-grid">
                {topics.map((topic) => {
                  const isFree = hasPaidPlan || cert.freeTopicSlugs.includes(topic.slug);
                  return (
                    <Link
                      key={topic.slug}
                      href={isFree ? `/learn/${topic.slug}` : "/pricing"}
                      className={`learn-topic-card${!isFree ? " learn-topic-locked" : ""}`}
                    >
                      <div className="learn-topic-card-meta">
                        <span>{topic.domain}</span>
                        {!isFree && <strong>Paid</strong>}
                      </div>
                      <h2>{topic.title}</h2>
                      <p>{topic.summary}</p>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Learning-only certifications (Six Sigma) */}
        {learningCerts.map((cert) => {
          if (selectedCert && cert.slug !== selectedCert.slug) return null;
          const topics = getCertTopics(cert.slug as CertSlug);
          if (!topics.length) return null;

          return (
            <div key={cert.slug} className="learn-cert-section learn-cert-learning">
              <div className="learn-cert-heading">
                <span className="learn-cert-heading-icon">{cert.icon}</span>
                <div>
                  <h3>{cert.title}</h3>
                  <p>{cert.description}</p>
                </div>
                <span className="learn-badge-learning">Learning Only</span>
              </div>

              <div className="learn-grid">
                {topics.map((topic) => {
                  const isFree = hasPaidPlan || cert.freeTopicSlugs.includes(topic.slug);
                  return (
                    <Link
                      key={topic.slug}
                      href={isFree ? `/learn/${topic.slug}` : "/pricing"}
                      className={`learn-topic-card${!isFree ? " learn-topic-locked" : ""}`}
                    >
                      <div className="learn-topic-card-meta">
                        <span>{topic.domain}</span>
                        {!isFree && <strong>Paid</strong>}
                      </div>
                      <h2>{topic.title}</h2>
                      <p>{topic.summary}</p>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}

        {!hasPaidPlan && (
          <section className="learn-upgrade-band">
            <div>
              <p className="intro-eyebrow">Full Version</p>
              <h2>Unlock every certification and topic.</h2>
              <p>
                Free users get core topics per certification. Subscribe for all topics, domains,
                and the complete adaptive learning path across all certifications.
              </p>
            </div>
            <Link href="/pricing" className="intro-primary-action">
              View Paid Plan
            </Link>
          </section>
        )}
      </section>
    </main>
  );
}
