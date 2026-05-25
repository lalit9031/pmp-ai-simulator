import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "../../lib/supabaseAdmin";

export type ProfileRecord = {
  id: string;
  name: string | null;
  email: string | null;
  plan: string;
  created_at: string;
  updated_at: string;
};

export async function GET() {
  try {
    const supabase = getSupabaseAdminClient();

    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase not configured", profiles: [], paidUsers: [] },
        { status: 503 },
      );
    }

    // Fetch all profiles
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, name, email, plan, created_at, updated_at")
      .order("created_at", { ascending: false })
      .limit(500);

    if (profilesError) {
      console.error("Failed to fetch profiles:", profilesError);
      return NextResponse.json(
        { error: "Failed to fetch profiles", profiles: [], paidUsers: [] },
        { status: 500 },
      );
    }

    const allProfiles = (profiles ?? []) as ProfileRecord[];

    // Filter paid users (any plan that is not "free")
    const paidUsers = allProfiles.filter(
      (p) => p.plan && p.plan !== "free",
    );

    return NextResponse.json({
      profiles: allProfiles,
      total: allProfiles.length,
      paidUsers,
      paidCount: paidUsers.length,
    });
  } catch (error) {
    console.error("Unexpected error fetching profiles:", error);
    return NextResponse.json(
      { error: "Unexpected error", profiles: [], paidUsers: [] },
      { status: 500 },
    );
  }
}
