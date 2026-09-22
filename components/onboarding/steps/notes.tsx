"use client";

import { useEffect, useState, useTransition } from "react";

import { getNote, saveNote } from "@/lib/actions/daily";
import type { Note } from "@/types/database";

type NotesStepProps = {
  dayId: string;
  onNext: () => void;
  pending: boolean;
};

export function NotesStep({ dayId, onNext, pending }: NotesStepProps) {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, startSaving] = useTransition();

  useEffect(() => {
    let cancelled = false;

    async function loadNote() {
      try {
        const existing = await getNote(dayId);

        if (!cancelled) {
          setNote((existing as Note | null)?.content ?? "");
        }
      } catch (error) {
        console.error("Unable to load onboarding note:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadNote();

    return () => {
      cancelled = true;
    };
  }, [dayId]);

  function handleContinue() {
    if (saving || pending) {
      return;
    }

    startSaving(async () => {
      try {
        if (note.trim()) {
          await saveNote(dayId, note);
        }

        onNext();
      } catch (error) {
        console.error("Unable to save onboarding note:", error);
      }
    });
  }

  if (loading) {
    return (
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
          Your notes
        </p>

        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
          Anything else worth remembering?
        </h1>

        <p className="mt-4 text-sm leading-6 text-stone-500 dark:text-stone-400">
          Loading your note…
        </p>
      </section>
    );
  }

  return (
    <section>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
        Your notes
      </p>

      <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
        Anything else worth remembering?
      </h1>

      <p className="mt-4 text-sm leading-6 text-stone-500 dark:text-stone-400">
        Notes are for thoughts, context, reminders, or anything you want to
        capture while you work. This is optional.
      </p>

      <div className="mt-8 rounded-3xl border bg-white p-5 shadow-sm dark:bg-stone-900 sm:p-6">
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-black/10 bg-stone-50 text-[11px] font-bold text-stone-700 dark:border-white/10 dark:bg-stone-950 dark:text-stone-300">
              03
            </span>

            <h2 className="text-lg font-semibold">Notes</h2>
          </div>

          <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
            Capture context without turning everything into a task.
          </p>
        </div>

        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          disabled={saving || pending}
          maxLength={5000}
          placeholder="Meeting notes, ideas, reminders, progress…"
          className="min-h-[280px] w-full resize-y rounded-2xl border border-black/10 bg-stone-50 p-4 text-sm leading-7 text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-black/20 focus:bg-white focus:ring-2 focus:ring-black/5 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-stone-950 dark:text-white dark:placeholder:text-stone-600 dark:focus:border-white/20 dark:focus:bg-stone-950"
        />

        <p className="mt-2 text-right text-xs text-stone-400 dark:text-stone-500">
          {note.length}/5000
        </p>
      </div>

      <button
        type="button"
        onClick={handleContinue}
        disabled={saving || pending}
        className="mt-6 w-full rounded-xl border bg-stone-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-200"
      >
        {saving ? "Saving…" : "Continue"}
      </button>

      {!note.trim() && !saving && (
        <p className="mt-3 text-center text-[11px] text-stone-400">
          You can skip this and add notes later.
        </p>
      )}
    </section>
  );
}
