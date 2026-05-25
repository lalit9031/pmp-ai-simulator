import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "../../lib/supabaseAdmin";

export async function GET() {
  try {
    const supabase = getSupabaseAdminClient();

    if (!supabase) {
      // Fall back to a basic response if Supabase isn't configured
      return NextResponse.json({ count: 0, source: "fallback" });
    }

    const { count, error } = await supabase
      .from("paid_signups")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Failed to fetch paid signup count:", error);
      return NextResponse.json({ count: 0, source: "error" });
    }

    return NextResponse.json({ count: count ?? 0, source: "database" });
  } catch (error) {
    console.error("Unexpected error fetching signup count:", error);
    return NextResponse.json({ count: 0, source: "error" });
  }
}
