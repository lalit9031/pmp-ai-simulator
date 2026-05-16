import Link from "next/link";
import {
  FaArrowRight,
  FaBookOpen,
  FaChartLine,
  FaClock,
  FaRegFileAlt,
} from "react-icons/fa";

const routeCards = [
  {
    title: "PMP Simulator",
    href: "/exam",
    status: "Ready",
    description: "Start a timed 185-question PMP-style exam session.",
    icon: FaRegFileAlt,
  },
  {
    title: "Final Results",
    href: "/results",
    status: "Ready",
    description: "Review score, domain performance, and answer history.",
    icon: FaClock,
  },
  {
    title: "Learning Hub",
    href: "/learn",
    status: "Ready",
    description: "Study targeted PMP topics after missed questions.",
    icon: FaBookOpen,
  },
  {
    title: "Analytics",
    href: "/dashboard",
    status: "Later",
    description: "Track readiness trends and focus areas over time.",
    icon: FaChartLine,
  },
];

export default function IntroPage() {
  return (
    <main className="intro-page">
      <nav className="intro-nav" aria-label="Primary navigation">
        <Link href="/" className="intro-brand">
          PMP Simulator
        </Link>
        <div className="intro-nav-links">
          <Link href="/exam">Exam</Link>
          <Link href="/results">Results</Link>
          <Link href="/learn">Learn</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/login" className="intro-nav-action">
            Login
          </Link>
        </div>
      </nav>

      <section className="intro-hero">
        <div className="intro-copy">
          <p className="intro-eyebrow">PMI-style practice environment</p>
          <h1>PMP Simulator</h1>
          <p className="intro-lede">
            Practice from a fixed 1000-question bank, study weak topics, and
            unlock live AI-generated PMP scenarios with the paid plan.
          </p>
          <div className="intro-actions">
            <Link href="/exam" className="intro-primary-action">
              Start Exam
              <FaArrowRight aria-hidden="true" />
            </Link>
            <Link href="/pricing" className="intro-secondary-action">
              View Plans
            </Link>
          </div>
        </div>

        <div className="intro-panel" aria-label="Exam setup preview">
          <div className="intro-panel-header">
            <span>Exam Session</span>
            <strong>240:00</strong>
          </div>
          <div className="intro-progress-grid" aria-hidden="true">
            {Array.from({ length: 36 }, (_, index) => (
              <span
                key={index}
                className={index < 6 ? "intro-progress-active" : ""}
              />
            ))}
          </div>
          <div className="intro-panel-footer">
            <span>185 questions</span>
            <span>AI, ESG, value focus</span>
          </div>
        </div>
      </section>

      <section className="intro-offer" aria-label="Practice plans">
        <div>
          <span>Free practice</span>
          <strong>1000 fixed questions</strong>
          <p>
            Learning topics include 150-question sets with easy, medium, and
            hard difficulty. Practice mode draws random questions from the fixed
            bank.
          </p>
        </div>
        <div>
          <span>Paid live test</span>
          <strong>AI PMP questions</strong>
          <p>
            Paid users get fresh project management questions, AI-assisted topic
            expansion, ethical AI, sustainability, ESG, and value delivery
            coverage.
          </p>
        </div>
        <div>
          <span>Founder price</span>
          <strong>Rs. 199 first 100 users</strong>
          <p>After the first 100 paid users, annual access becomes Rs. 399.</p>
        </div>
      </section>

      <section className="intro-routes" aria-label="Application routes">
        {routeCards.map((card) => {
          const Icon = card.icon;

          return (
            <Link key={card.href} href={card.href} className="intro-route-card">
              <div className="intro-route-icon">
                <Icon aria-hidden="true" />
              </div>
              <div>
                <div className="intro-route-heading">
                  <h2>{card.title}</h2>
                  <span>{card.status}</span>
                </div>
                <p>{card.description}</p>
              </div>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
