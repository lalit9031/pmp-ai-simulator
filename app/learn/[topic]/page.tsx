import Link from "next/link";
import { notFound } from "next/navigation";
import { learningTopics } from "../../learningTopics";

export function generateStaticParams() {
  return Object.keys(learningTopics).map((topic) => ({ topic }));
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic: topicSlug } = await params;
  const topic = learningTopics[topicSlug];

  if (!topic) {
    notFound();
  }

  return (
    <main className="learn-page">
      <article className="learn-shell">
        <Link href="/learn" className="learn-back-link">
          Learning Hub
        </Link>

        <div className="learn-header">
          <p className="intro-eyebrow">{topic.domain}</p>
          <h1>{topic.title}</h1>
          <p>{topic.summary}</p>
        </div>

        <section className="learn-section">
          <h2>Core Summary</h2>
          <p>{topic.summary}</p>
        </section>

        <section className="learn-section">
          <h2>How A PMP PM Should Think</h2>
          <p>{topic.mindset}</p>
          <ol className="learn-step-list">
            {topic.howToThink.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <section className="learn-section">
          <h2>Key Ideas</h2>
          <ul>
            {topic.coreIdeas.map((idea) => (
              <li key={idea}>{idea}</li>
            ))}
          </ul>
        </section>

        <section className="learn-section">
          <h2>Focus Areas</h2>
          <ul>
            {topic.focusAreas.map((area) => (
              <li key={area}>{area}</li>
            ))}
          </ul>
        </section>

        <section className="learn-section">
          <h2>Example Situations</h2>
          <div className="learn-example-list">
            {topic.examples.map((example) => (
              <p key={example}>{example}</p>
            ))}
          </div>
        </section>

        <section className="learn-section learn-trap-box">
          <h2>Common Wrong-Answer Traps</h2>
          <ul>
            {topic.commonTraps.map((trap) => (
              <li key={trap}>{trap}</li>
            ))}
          </ul>
        </section>

        <section className="learn-section learn-practice-box">
          <h2>How To Use This In Questions</h2>
          <p>{topic.practicePrompt}</p>
          <p>
            This topic includes 150 fixed practice questions split across easy,
            medium, and hard difficulty levels.
          </p>
        </section>

        <section className="learn-section">
          <h2>Mini Practice Set</h2>
          <div className="learn-practice-list">
            {topic.practiceSet.map((question, questionIndex) => (
              <div key={question.prompt} className="learn-practice-item">
                <h3>
                  Question {questionIndex + 1}: {question.prompt}
                </h3>
                <ol type="A">
                  {question.options.map((option) => (
                    <li key={option}>{option}</li>
                  ))}
                </ol>
                <p>
                  <strong>
                    Best answer:{" "}
                    {String.fromCharCode(65 + question.correctAnswer)}
                  </strong>
                </p>
                <p>{question.explanation}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="learn-actions">
          <Link
            href={`/exam?free=1&topic=${topic.slug}`}
            className="intro-primary-action"
          >
            Practice {topic.domain} Questions
          </Link>
        </div>
      </article>
    </main>
  );
}
