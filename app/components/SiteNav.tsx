"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaSignOutAlt, FaUser, FaBars, FaTimes, FaMoon, FaSun } from "react-icons/fa";
import { getSupabaseBrowserClient } from "../lib/supabaseClient";
import { useTheme } from "../lib/ThemeProvider";
import { isAdminEmail } from "../lib/admin";

const userStorageKey = "pmp-simulator-user-v1";

type SiteUser = {
  name?: string;
  email?: string;
};

export default function SiteNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<SiteUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

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

  const closeMenu = () => setMenuOpen(false);

  // Close menu on route change (e.g. browser back button)
  useEffect(() => {
    closeMenu();
  }, [pathname]);

  const handleLogout = async () => {
    setUser(null);
    window.localStorage.removeItem(userStorageKey);
    window.localStorage.removeItem("pmp-simulator-plan-v1");

    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      await supabase.auth.signOut();
    }

    closeMenu();
    router.push("/");
  };

  const isAdmin = isAdminEmail(user?.email);
  const displayName = user?.name || user?.email?.split("@")[0] || null;

  // Generate initials for avatar
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.email
      ? user.email[0].toUpperCase()
      : null;

  // Deterministic color from name
  const avatarColor = user?.name || user?.email
    ? getAvatarColor(user?.name || user?.email || "")
    : "#64748b";

  return (
    <nav className="intro-nav site-nav" aria-label="Primary navigation">
      <Link href="/" className="intro-brand" onClick={closeMenu}>
        PMP Simulator
      </Link>

      {/* Hamburger toggle — visible on mobile */}
      <button
        type="button"
        className="site-hamburger"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Desktop nav links */}
      <div className="intro-nav-links site-desktop-links">
        <Link href="/">Home</Link>
        <Link href="/exam">Exam</Link>
        <Link href="/results">Results</Link>
        <Link href="/learn">Learn</Link>
        <Link href="/pricing">Pricing</Link>
        <Link href="/dashboard">Dashboard</Link>
        {isAdmin && <Link href="/admin">Admin</Link>}
        <button
          type="button"
          onClick={toggleTheme}
          className="site-theme-btn"
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? <FaMoon aria-hidden="true" /> : <FaSun aria-hidden="true" />}
        </button>
        {displayName ? (
          <div className="site-user-menu">
            <span className="site-user-name">
              {initials ? (
                <span
                  className="site-avatar"
                  style={{ backgroundColor: avatarColor }}
                >
                  {initials}
                </span>
              ) : (
                <FaUser aria-hidden="true" />
              )}
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
          <Link href="/login" className="intro-nav-action" onClick={closeMenu}>
            Login
          </Link>
        )}
      </div>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className="site-mobile-overlay"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile slide-down menu */}
      <div className={`site-mobile-menu${menuOpen ? " site-mobile-menu-open" : ""}`}>
        <div className="site-mobile-links">
          <div className="site-mobile-theme-row">
            <span className="site-mobile-theme-label">
              {theme === "light" ? "Light Mode" : "Dark Mode"}
            </span>
            <button
              type="button"
              onClick={() => {
                toggleTheme();
                closeMenu();
              }}
              className="site-mobile-theme-toggle"
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? <FaMoon /> : <FaSun />}
            </button>
          </div>
          <div className="site-mobile-divider" />
          <Link href="/" className="site-mobile-link" onClick={closeMenu}>
            Home
          </Link>
          <Link href="/exam" className="site-mobile-link" onClick={closeMenu}>
            Exam
          </Link>
          <Link href="/results" className="site-mobile-link" onClick={closeMenu}>
            Results
          </Link>
          <Link href="/learn" className="site-mobile-link" onClick={closeMenu}>
            Learn
          </Link>
          <Link href="/pricing" className="site-mobile-link" onClick={closeMenu}>
            Pricing
          </Link>
          <Link href="/dashboard" className="site-mobile-link" onClick={closeMenu}>
            Dashboard
          </Link>
          {isAdmin && (
            <Link href="/admin" className="site-mobile-link" onClick={closeMenu}>
              Admin
            </Link>
          )}
          <div className="site-mobile-divider" />
          {displayName ? (
            <div className="site-mobile-user-section">
              <span className="site-mobile-user-name">
                {initials ? (
                  <span
                    className="site-avatar site-avatar-sm"
                    style={{ backgroundColor: avatarColor }}
                  >
                    {initials}
                  </span>
                ) : (
                  <FaUser aria-hidden="true" />
                )}
                <span>{displayName}</span>
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="site-mobile-logout-btn"
              >
                <FaSignOutAlt aria-hidden="true" />
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="site-mobile-link site-mobile-login-link"
              onClick={closeMenu}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

// Deterministic avatar background color based on name
const AVATAR_COLORS = [
  "#2563eb",
  "#7c3aed",
  "#db2777",
  "#dc2626",
  "#ea580c",
  "#ca8a04",
  "#16a34a",
  "#0891b2",
  "#4f46e5",
  "#9333ea",
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}
