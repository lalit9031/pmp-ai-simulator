import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "../../lib/supabaseAdmin";

export type SignupRecord = {
  id: number;
  user_id: string | null;
  email: string | null;
  plan: string;
  created_at: string;
  user_name?: string | null;
};

export async function GET() {
  try {
    const supabase = getSupabaseAdminClient();

    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase not configured", signups: [] },
        { status: 503 },
      );
    }

    const { data, error } = await supabase
      .from("paid_signups")
      .select("id, user_id, email, plan, created_at")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      console.error("Failed to fetch signup data:", error);
      return NextResponse.json(
        { error: "Failed to fetch signup data", signups: [] },
        { status: 500 },
      );
    }

    const signups = (data ?? []) as SignupRecord[];

    // Enrich with user names from profiles table
    const userIds = signups
      .map((s) => s.user_id)
      .filter((id): id is string => id !== null);

    let profileMap: Record<string, string | null> = {};

    if (userIds.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: profiles } = await (supabase as any)
        .from("profiles")
        .select("id, name")
        .in("id", userIds);

      if (profiles) {
        for (const p of profiles as Array<{ id: string; name: string | null }>) {
          profileMap[p.id] = p.name;
        }
      }
    }

    const enrichedSignups = signups.map((s) => ({
      ...s,
      user_name: s.user_id ? profileMap[s.user_id] ?? null : null,
    }));

    return NextResponse.json({
      signups: enrichedSignups,
      total: enrichedSignups.length,
    });
  } catch (error) {
    console.error("Unexpected error fetching signup data:", error);
    return NextResponse.json(
      { error: "Unexpected error", signups: [] },
      { status: 500 },
    );
  }
}
