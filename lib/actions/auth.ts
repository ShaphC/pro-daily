"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { startAppTrialIfNeeded } from "@/lib/services/billing";
import { getPostAuthPath } from "@/lib/services/onboarding";

export async function signIn(formData: FormData) {
  const supabase = await createClient();

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const timezone = String(formData.get("timezone") ?? "UTC");

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  if (data.user) {
    const { error: settingsError } = await supabase
      .from("pro_user_settings")
      .upsert(
        {
          user_id: data.user.id,
          timezone,
        },
        {
          onConflict: "user_id",
        },
      );

    if (settingsError) {
      console.error("Unable to save user settings:", settingsError);
    }

    revalidatePath("/", "layout");

    const destination = await getPostAuthPath(data.user.id);

    redirect(destination);
  }

  redirect("/login");
}

export async function signUp(formData: FormData) {
  const supabase = await createClient();

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const timezone = String(formData.get("timezone") ?? "UTC");
  const origin = String(formData.get("origin") ?? "");

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  if (data.user && data.session) {
    const { error: settingsError } = await supabase
      .from("pro_user_settings")
      .upsert(
        {
          user_id: data.user.id,
          timezone,
        },
        {
          onConflict: "user_id",
        },
      );

    if (settingsError) {
      console.error("Unable to save user settings:", settingsError);
    }

    await startAppTrialIfNeeded(data.user.id);

    revalidatePath("/", "layout");

    const destination = await getPostAuthPath(data.user.id);

    redirect(destination);
  }

  redirect(
    "/login?message=Check%20your%20email%20to%20confirm%20your%20account.",
  );
}

export async function requestPasswordReset(formData: FormData) {
  const supabase = await createClient();

  const email = String(formData.get("email") ?? "");
  const origin = String(formData.get("origin") ?? "");

  if (!email) {
    redirect(
      `/reset-password?error=${encodeURIComponent(
        "Please enter your email address.",
      )}`,
    );
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/update-password`,
  });

  if (error) {
    redirect(`/reset-password?error=${encodeURIComponent(error.message)}`);
  }

  redirect(
    "/login?message=Password%20reset%20email%20sent.%20Check%20your%20inbox.",
  );
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();

  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (password.length < 8) {
    redirect(
      `/update-password?error=${encodeURIComponent(
        "Password must be at least 8 characters.",
      )}`,
    );
  }

  if (password !== confirmPassword) {
    redirect(
      `/update-password?error=${encodeURIComponent("Passwords do not match.")}`,
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/login?error=${encodeURIComponent(
        "Your password reset session has expired. Please request a new link.",
      )}`,
    );
  }

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    redirect(`/update-password?error=${encodeURIComponent(error.message)}`);
  }

  await supabase.auth.signOut();

  revalidatePath("/", "layout");

  redirect(
    "/login?message=Password%20updated.%20You%20can%20now%20log%20in%20with%20your%20new%20password.",
  );
}

export async function changePassword(formData: FormData) {
  const supabase = await createClient();

  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (password.length < 8) {
    redirect(
      `/settings?error=${encodeURIComponent(
        "Password must be at least 8 characters.",
      )}`,
    );
  }

  if (password !== confirmPassword) {
    redirect(
      `/settings?error=${encodeURIComponent("Passwords do not match.")}`,
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    redirect(`/settings?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");

  redirect("/settings?message=Password%20updated%20successfully.");
}

export async function signOut() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  revalidatePath("/", "layout");

  redirect("/login");
}
