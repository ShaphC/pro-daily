import { NextResponse } from "next/server";

import { getPostAuthPath } from "@/lib/services/onboarding";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const requestedNext = url.searchParams.get("next");

  if (!code) {
    return NextResponse.redirect(new URL("/login", url.origin));
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Unable to exchange auth code:", error);

    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error.message)}`, url.origin),
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", url.origin));
  }

  if (requestedNext) {
    return NextResponse.redirect(new URL(requestedNext, url.origin));
  }

  const destination = await getPostAuthPath(user.id);

  return NextResponse.redirect(new URL(destination, url.origin));
}
