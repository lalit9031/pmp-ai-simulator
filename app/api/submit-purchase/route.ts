import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "../../lib/supabaseAdmin";

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseAdminClient();

    if (!supabase) {
      return NextResponse.json(
        { success: false, error: "Supabase not configured" },
        { status: 503 },
      );
    }

    const body = await request.json();
    const { plan, userId, email } = body as {
      plan?: string;
      userId?: string | null;
      email?: string | null;
    };

    if (!plan) {
      return NextResponse.json(
        { success: false, error: "Missing plan" },
        { status: 400 },
      );
    }

    // Record the paid signup
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: insertError } = await (supabase as any)
      .from("paid_signups")
      .insert({
        user_id: userId || null,
        email: email || null,
        plan,
      });

    if (insertError) {
      console.error("Failed to record paid signup:", insertError);
      return NextResponse.json(
        { success: false, error: "Failed to record signup" },
        { status: 500 },
      );
    }

    // If user is authenticated with Supabase, also update their profile plan
    if (userId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: profileError } = await (supabase as any)
        .from("profiles")
        .update({ plan, updated_at: new Date().toISOString() })
        .eq("id", userId);

      if (profileError) {
        console.error("Failed to update profile plan:", profileError);
        // Non-blocking — the signup is already recorded
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unexpected error submitting purchase:", error);
    return NextResponse.json(
      { success: false, error: "Unexpected error" },
      { status: 500 },
    );
  }
}
