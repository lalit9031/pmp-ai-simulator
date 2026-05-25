"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaSignOutAlt, FaUser } from "react-icons/fa";
import { getSupabaseBrowserClient } from "../lib/supabaseClient";

const userStorageKey = "pmp-simulator-user-v1";

type SiteUser = {
  name?: string;
  email?: string;
};

export default function SiteNav() {
  const router = useRouter();
  const [user, setUser] = useState<SiteUser | null>(null);

  useEffect(() => {
    const raw = window.localStorage.getItem(userStorageKey);
    if (raw) {
      try {
        setUser(JSON.parse(raw) as SiteUser);
      } catch {
        /* ignore parse errors */
      }
    }
  }, []);

  const handleLogout = async () => {
    window.localStorage.removeItem(userStorageKey);
    window.localStorage.removeItem("pmp-simulator-plan-v1");

    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      await supabase.auth.signOut();
    }

    router.push("/");
  };

  const displayName = user?.name || user?.email?.split("@")[0] || null;

  return (
    <nav className="intro-nav site-nav" aria-label="Primary navigation">
      <Link href="/" className="intro-brand">
        PMP Simulator
      </Link>
      <div className="intro-nav-links">
        <Link href="/exam">Exam</Link>
        <Link href="/results">Results</Link>
        <Link href="/learn">Learn</Link>
        <Link href="/pricing">Pricing</Link>
        <Link href="/dashboard">Dashboard</Link>
        {displayName ? (
          <div className="site-user-menu">
            <span className="site-user-name">
              <FaUser aria-hidden="true" />
              <span>{displayName}</span>
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="site-logout-btn"
            >
              <FaSignOutAlt aria-hidden="true" />
              Logout
            </button>
          </div>
        ) : (
          <Link href="/login" className="intro-nav-action">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
