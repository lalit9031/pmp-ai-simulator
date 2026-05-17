"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "../lib/supabaseClient";

type Profile = {
  name: string | null;
  email: string | null;
  plan: string | null;
};

type ExamRow = {
  id: string;
  score: number;
  percentage: number;
  answered_count: number;
  correct_count: number;
  incorrect_count: number;
  created_at: string;
};

const userStorageKey = "pmp-simulator-user-v1";

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [exams, setExams] = useState<ExamRow[]>([]);
  const [status, setStatus] = useState("Loading your dashboard...");

  useEffect(() => {
    const loadDashboard = async () => {
      const supabase = getSupabaseBrowserClient();
      const localUser = window.localStorage.getItem(userStorageKey);

      if (!supabase) {
        setStatus("Connect Supabase to store users, exams, and analytics.");
        if (localUser) {
          const parsedUser = JSON.parse(localUser) as Profile;
          setProfile(parsedUser);
        }
        return;
      }

      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        setStatus("Sign in to see your saved backend profile and exam history.");
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("name,email,plan")
        .eq("id", userData.user.id)
        .single();

      const { data: examData } = await supabase
        .from("exams")
        .select(
          "id,score,percentage,answered_count,correct_count,incorrect_count,created_at",
        )
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      setProfile((profileData as Profile | null) ?? null);
      setExams((examData as ExamRow[] | null) ?? []);
      setStatus("");
    };

    void loadDashboard();
  }, []);

  return (
    <main className="coming-page">
      <section className="coming-shell dashboard-shell">
        <p className="intro-eyebrow">Analytics</p>
        <h1>{profile?.name ?? "Your PMP Dashboard"}</h1>
        <p>
          {profile?.email
            ? `${profile.email} · ${profile.plan ?? "free"} plan`
            : status}
        </p>

        {exams.length > 0 && (
          <div className="dashboard-history">
            {exams.map((exam) => (
              <div key={exam.id} className="dashboard-history-row">
                <span>{new Date(exam.created_at).toLocaleDateString()}</span>
                <strong>{exam.percentage}% readiness</strong>
                <span>
                  {exam.correct_count} correct · {exam.incorrect_count} wrong
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="intro-actions">
          <Link href="/exam?plan=free&fresh=1" className="intro-primary-action">
            Start Practice
          </Link>
          <Link href="/results" className="intro-secondary-action">
            Results
          </Link>
        </div>
      </section>
    </main>
  );
}
