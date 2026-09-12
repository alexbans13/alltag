"use client";

import { useActionState } from "react";
import { CEFR_LEVELS } from "@/lib/levels";
import { updateLevelAction, type UpdateLevelState } from "@/app/(app)/settings/actions";

const initialState: UpdateLevelState = {};

export function LevelForm({
  languageCode,
  languageLabel,
  currentLevel,
}: {
  languageCode: string;
  languageLabel: string;
  currentLevel: string;
}) {
  const [state, formAction, pending] = useActionState(updateLevelAction, initialState);

  return (
    <form
      action={formAction}
      className="flex items-center justify-between gap-4 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <input type="hidden" name="language" value={languageCode} />
      <span className="text-sm font-medium">{languageLabel}</span>
      <div className="flex items-center gap-3">
        <select
          name="level"
          defaultValue={currentLevel}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
        >
          {CEFR_LEVELS.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {pending ? "Saving…" : "Save"}
        </button>
      </div>
      {state.saved ? (
        <span className="text-xs text-emerald-600 dark:text-emerald-400">Saved</span>
      ) : null}
      {state.error ? (
        <span className="text-xs text-red-600 dark:text-red-400">{state.error}</span>
      ) : null}
    </form>
  );
}
