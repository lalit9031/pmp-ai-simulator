import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="coming-page">
      <section className="coming-shell">
        <p className="intro-eyebrow">Analytics</p>
        <h1>Dashboard is coming later.</h1>
        <p>
          This page is reserved for readiness trends, weak-area analysis, and
          practice history once those metrics are available.
        </p>
        <Link href="/" className="intro-primary-action">
          Back to Intro
        </Link>
      </section>
    </main>
  );
}
