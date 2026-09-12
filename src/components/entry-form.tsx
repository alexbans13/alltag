"use client";

import { useActionState } from "react";
import { CEFR_LEVELS } from "@/lib/levels";
import { LANGUAGES } from "@/lib/languages";
import { createEntryAction, type CreateEntryState } from "@/app/(app)/entries/actions";

const initialState: CreateEntryState = {};

export function EntryForm({
  defaultLanguage,
  defaultLevel,
}: {
  defaultLanguage: string;
  defaultLevel: string;
}) {
  const [state, formAction, pending] = useActionState(createEntryAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="target_language" className="text-sm font-medium">
            Target language
          </label>
          <select
            id="target_language"
            name="target_language"
            defaultValue={defaultLanguage}
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          >
            {LANGUAGES.map((language) => (
              <option key={language.code} value={language.code}>
                {language.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="level" className="text-sm font-medium">
            Your level
          </label>
          <select
            id="level"
            name="level"
            defaultValue={defaultLevel}
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          >
            {CEFR_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="text" className="text-sm font-medium">
          What happened today?
        </label>
        <textarea
          id="text"
          name="text"
          required
          rows={12}
          placeholder="Write in your native language…"
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm leading-relaxed dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      {state.error ? (
        <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {pending ? "Saving…" : "Save entry"}
      </button>
    </form>
  );
}
