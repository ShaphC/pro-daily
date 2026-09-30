import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);

  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;

  if (!tokenHash || type !== "recovery") {
    return NextResponse.redirect(
      new URL(
        `/reset-password?error=${encodeURIComponent(
          "Invalid password reset link.",
        )}`,
        url.origin,
      ),
    );
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.verifyOtp({
    type: "recovery",
    token_hash: tokenHash,
  });

  if (error) {
    console.error("Unable to verify password recovery token:", error);

    return NextResponse.redirect(
      new URL(
        `/reset-password?error=${encodeURIComponent(
          "This password reset link is invalid or has expired. Please request a new one.",
        )}`,
        url.origin,
      ),
    );
  }

  return NextResponse.redirect(new URL("/update-password", url.origin));
}
