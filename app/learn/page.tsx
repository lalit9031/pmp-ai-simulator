import Link from "next/link";
import { learningTopics } from "../learningTopics";

export default function LearnPage() {
  return (
    <main className="learn-page">
      <section className="learn-shell">
        <div className="learn-header">
          <p className="intro-eyebrow">Learning Hub</p>
          <h1>Study the PMP logic behind your mistakes.</h1>
          <p>
            Topic guides now include agile, risk, stakeholders, hybrid delivery,
            ethical AI, sustainability, ESG, value delivery, and business
            environment thinking. Each topic connects to 150 practice questions
            across easy, medium, and hard difficulty.
          </p>
        </div>

        <div className="learn-grid">
          {Object.values(learningTopics).map((topic) => (
            <Link
              key={topic.slug}
              href={`/learn/${topic.slug}`}
              className="learn-topic-card"
            >
              <span>{topic.domain}</span>
              <h2>{topic.title}</h2>
              <p>{topic.summary}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
