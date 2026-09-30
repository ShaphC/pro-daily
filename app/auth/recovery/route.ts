import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent(
          "Invalid or expired password reset link.",
        )}`,
        url.origin,
      ),
    );
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Unable to exchange password recovery code:", error);

    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error.message)}`, url.origin),
    );
  }

  return NextResponse.redirect(new URL("/update-password", url.origin));
}
