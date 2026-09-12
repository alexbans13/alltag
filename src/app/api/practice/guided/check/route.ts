import { NextResponse } from "next/server";
import { getOwnedEntry } from "@/lib/entries/get-owned-entry";
import { checkGuidedAttempt } from "@/lib/llm/practice";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const entryId = body?.entryId;
  const sourceSentence = body?.sourceSentence;
  const userAttempt = body?.userAttempt;

  if (
    typeof entryId !== "string" ||
    typeof sourceSentence !== "string" ||
    typeof userAttempt !== "string" ||
    !userAttempt.trim()
  ) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const result = await getOwnedEntry(entryId);
  if ("error" in result) {
    return NextResponse.json(
      { error: result.error },
      { status: result.error === "unauthorized" ? 401 : 404 },
    );
  }

  try {
    const feedback = await checkGuidedAttempt({
      sourceSentence,
      userAttempt,
      targetLanguage: result.entry.target_language,
      level: result.entry.level,
    });
    return NextResponse.json(feedback);
  } catch {
    return NextResponse.json({ error: "generation_failed" }, { status: 502 });
  }
}
