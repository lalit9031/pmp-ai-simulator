"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FaShieldAlt } from "react-icons/fa";
import type { SignupRecord } from "../api/signup-data/route";
import { isAdminEmail } from "../lib/admin";

const userStorageKey = "pmp-simulator-user-v1";

function planBadgeClass(plan: string): string {
  switch (plan) {
    case "founder":
      return "admin-badge-founder";
    case "annual":
      return "admin-badge-annual";
    case "global":
      return "admin-badge-global";
    default:
      return "admin-badge-other";
  }
}

export default function AdminPage() {
  const router = useRouter();
  const [signups, setSignups] = useState<SignupRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  // Check admin authorization
  useEffect(() => {
    const raw = window.localStorage.getItem(userStorageKey);
    if (!raw) {
      setAuthorized(false);
      return;
    }
    try {
      const parsed = JSON.parse(raw) as { email?: string };
      if (isAdminEmail(parsed.email)) {
        setAuthorized(true);
      } else {
        setAuthorized(false);
      }
    } catch {
      setAuthorized(false);
    }
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/signup-data");
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Failed to load signup data");
        return;
      }

      setSignups(data.signups as SignupRecord[]);
      setTotal(data.total ?? 0);
    } catch {
      setError("Network error — could not reach the server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  // Unauthorized state — not logged in as admin
  if (authorized === false) {
    return (
      <main className="coming-page">
        <section className="coming-shell">
          <FaShieldAlt
            style={{
              fontSize: 48,
              color: "var(--muted-text)",
              marginBottom: 16,
            }}
            aria-hidden="true"
          />
          <p className="intro-eyebrow">Restricted</p>
          <h1>Admin access only</h1>
          <p>
            You must be signed in as an admin user to view this page.
          </p>
          <div className="intro-actions">
            <Link href="/login?next=/admin" className="intro-primary-action">
              Sign in
            </Link>
            <Link href="/dashboard" className="intro-secondary-action">
              Go to Dashboard
            </Link>
          </div>
        </section>
      </main>
    );
  }

  // Still checking authorization
  if (authorized === null) {
    return (
      <main className="coming-page">
        <section className="coming-shell">
          <div className="exam-spinner" />
          <p>Checking authorization...</p>
        </section>
      </main>
    );
  }

  const founderCount = signups.filter(
    (s) => s.plan === "founder" || s.plan === "global",
  ).length;
  const annualCount = signups.filter((s) => s.plan === "annual").length;
  const seatsLeft = Math.max(0, 100 - founderCount);

  return (
    <main className="pricing-page">
      <section className="pricing-shell">
        <div className="pricing-nav">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="learn-back-link"
          >
            &larr; Dashboard
          </button>
        </div>

        <div className="pricing-header">
          <p className="intro-eyebrow">Admin</p>
          <h1>Paid Signup Records</h1>
          <p>
            View all paid signups submitted through the pricing page.
            {!loading && (
              <span>
                {" "}
                <strong>{seatsLeft}</strong> founder{" "}
                {seatsLeft === 1 ? "seat" : "seats"} remaining.
              </span>
            )}
          </p>
        </div>

        {/* Summary cards */}
        {!loading && !error && (
          <div className="admin-summary-grid">
            <div className="admin-summary-card">
              <p className="admin-summary-label">Total Signups</p>
              <div className="admin-summary-value">{total}</div>
            </div>
            <div className="admin-summary-card">
              <p className="admin-summary-label">Founder (first 100)</p>
              <div className="admin-summary-value">{founderCount}</div>
            </div>
            <div className="admin-summary-card">
              <p className="admin-summary-label">Annual</p>
              <div className="admin-summary-value">{annualCount}</div>
            </div>
            <div className="admin-summary-card">
              <p className="admin-summary-label">Seats Left</p>
              <div className="admin-summary-value">{seatsLeft}</div>
            </div>
          </div>
        )}

        {loading && <p className="admin-loading">Loading signup data...</p>}

        {error && (
          <div className="admin-error">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => void fetchData()}
              className="intro-secondary-action"
              style={{ marginTop: "12px" }}
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && signups.length === 0 && (
          <p className="admin-empty">No paid signups recorded yet.</p>
        )}

        {!loading && !error && signups.length > 0 && (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Email</th>
                  <th>Plan</th>
                  <th>User ID</th>
                </tr>
              </thead>
              <tbody>
                {signups.map((signup, index) => (
                  <tr key={signup.id}>
                    <td className="admin-cell-muted">{index + 1}</td>
                    <td>
                      {new Date(signup.created_at).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td>{signup.email || "\u2014"}</td>
                    <td>
                      <span
                        className={`admin-badge ${planBadgeClass(signup.plan)}`}
                      >
                        {signup.plan}
                      </span>
                    </td>
                    <td className="admin-cell-muted admin-monospace">
                      {signup.user_id || "\u2014"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
