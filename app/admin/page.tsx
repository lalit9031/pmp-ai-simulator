"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FaShieldAlt } from "react-icons/fa";
import type { SignupRecord } from "../api/signup-data/route";
import type { ProfileRecord } from "../api/profiles/route";
import { isAdminEmail } from "../lib/admin";

const userStorageKey = "pmp-simulator-user-v1";

type AdminTab = "users" | "paid-signups" | "paid-users";

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
  const [activeTab, setActiveTab] = useState<AdminTab>("users");
  const [profiles, setProfiles] = useState<ProfileRecord[]>([]);
  const [paidUsers, setPaidUsers] = useState<ProfileRecord[]>([]);
  const [signups, setSignups] = useState<SignupRecord[]>([]);
  const [totalProfiles, setTotalProfiles] = useState(0);
  const [paidCount, setPaidCount] = useState(0);
  const [totalSignups, setTotalSignups] = useState(0);
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
      // Fetch profiles and signups in parallel
      const [profilesRes, signupsRes] = await Promise.all([
        fetch("/api/profiles"),
        fetch("/api/signup-data"),
      ]);

      const profilesData = await profilesRes.json();
      const signupsData = await signupsRes.json();

      if (!profilesRes.ok) {
        setError(profilesData.error ?? "Failed to load profiles");
        return;
      }

      setProfiles(profilesData.profiles as ProfileRecord[]);
      setPaidUsers(profilesData.paidUsers as ProfileRecord[]);
      setTotalProfiles(profilesData.total ?? 0);
      setPaidCount(profilesData.paidCount ?? 0);

      if (signupsRes.ok) {
        setSignups(signupsData.signups as SignupRecord[]);
        setTotalSignups(signupsData.total ?? 0);
      }
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

  const renderTabContent = () => {
    switch (activeTab) {
      case "users":
        return renderUsersTab();
      case "paid-users":
        return renderPaidUsersTab();
      case "paid-signups":
        return renderPaidSignupsTab();
    }
  };

  const renderUsersTab = () => {
    if (loading) return <p className="admin-loading">Loading user data...</p>;
    if (error) return renderError();
    if (profiles.length === 0) return <p className="admin-empty">No users have signed up yet.</p>;

    return (
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Name</th>
              <th>Email</th>
              <th>Plan</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile, index) => (
              <tr key={profile.id}>
                <td className="admin-cell-muted">{index + 1}</td>
                <td>
                  {new Date(profile.created_at).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td>{profile.name || "\u2014"}</td>
                <td>{profile.email || "\u2014"}</td>
                <td>
                  <span className={`admin-badge ${planBadgeClass(profile.plan)}`}>
                    {profile.plan}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderPaidUsersTab = () => {
    if (loading) return <p className="admin-loading">Loading paid user data...</p>;
    if (error) return renderError();
    if (paidUsers.length === 0) return <p className="admin-empty">No paid users yet.</p>;

    return (
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Name</th>
              <th>Email</th>
              <th>Plan</th>
            </tr>
          </thead>
          <tbody>
            {paidUsers.map((profile, index) => (
              <tr key={profile.id}>
                <td className="admin-cell-muted">{index + 1}</td>
                <td>
                  {new Date(profile.created_at).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td>{profile.name || "\u2014"}</td>
                <td>{profile.email || "\u2014"}</td>
                <td>
                  <span className={`admin-badge ${planBadgeClass(profile.plan)}`}>
                    {profile.plan}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderPaidSignupsTab = () => {
    if (loading) return <p className="admin-loading">Loading signup data...</p>;
    if (error) return renderError();
    if (signups.length === 0) return <p className="admin-empty">No paid signups recorded yet.</p>;

    return (
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
                  <span className={`admin-badge ${planBadgeClass(signup.plan)}`}>
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
    );
  };

  const renderError = () => (
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
  );

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
          <h1>Admin Dashboard</h1>
          <p>
            View all users, paid users, and paid signup records.
          </p>
        </div>

        {/* Summary cards */}
        {!loading && !error && (
          <div className="admin-summary-grid">
            <div className="admin-summary-card">
              <p className="admin-summary-label">Total Users</p>
              <div className="admin-summary-value">{totalProfiles}</div>
            </div>
            <div className="admin-summary-card">
              <p className="admin-summary-label">Paid Users</p>
              <div className="admin-summary-value">{paidCount}</div>
            </div>
            <div className="admin-summary-card">
              <p className="admin-summary-label">Founder Signups</p>
              <div className="admin-summary-value">{founderCount}</div>
            </div>
            <div className="admin-summary-card">
              <p className="admin-summary-label">Seats Left</p>
              <div className="admin-summary-value">{seatsLeft}</div>
            </div>
          </div>
        )}

        {/* Tab navigation */}
        <div className="admin-tabs">
          <button
            type="button"
            className={`admin-tab ${activeTab === "users" ? "admin-tab-active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            All Users ({totalProfiles})
          </button>
          <button
            type="button"
            className={`admin-tab ${activeTab === "paid-users" ? "admin-tab-active" : ""}`}
            onClick={() => setActiveTab("paid-users")}
          >
            Paid Users ({paidCount})
          </button>
          <button
            type="button"
            className={`admin-tab ${activeTab === "paid-signups" ? "admin-tab-active" : ""}`}
            onClick={() => setActiveTab("paid-signups")}
          >
            Paid Signups ({totalSignups})
          </button>
        </div>

        {/* Tab content */}
        {renderTabContent()}
      </section>
    </main>
  );
}
