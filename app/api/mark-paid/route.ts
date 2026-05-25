import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "../../lib/supabaseAdmin";

const VALID_PLANS = ["founder", "annual", "global"] as const;
type ValidPlan = (typeof VALID_PLANS)[number];

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
    const { userId, email, plan } = body as {
      userId?: string | null;
      email?: string | null;
      plan?: string;
    };

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Missing userId" },
        { status: 400 },
      );
    }

    if (!plan || !VALID_PLANS.includes(plan as ValidPlan)) {
      return NextResponse.json(
        { success: false, error: `Invalid plan. Must be one of: ${VALID_PLANS.join(", ")}` },
        { status: 400 },
      );
    }

    // Update the profile plan
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: profileError } = await (supabase as any)
      .from("profiles")
      .update({ plan, updated_at: new Date().toISOString() })
      .eq("id", userId);

    if (profileError) {
      console.error("Failed to update profile plan:", profileError);
      return NextResponse.json(
        { success: false, error: "Failed to update profile" },
        { status: 500 },
      );
    }

    // Record a paid signup entry (non-blocking if it fails)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: signupError } = await (supabase as any)
      .from("paid_signups")
      .insert({
        user_id: userId,
        email: email || null,
        plan,
      });

    if (signupError) {
      console.error("Failed to record paid signup:", signupError);
      // Non-blocking — profile is already updated
    }

    return NextResponse.json({ success: true, plan });
  } catch (error) {
    console.error("Unexpected error marking user as paid:", error);
    return NextResponse.json(
      { success: false, error: "Unexpected error" },
      { status: 500 },
    );
  }
}
