import { NextResponse } from "next/server";
import { getOwnedEntry } from "@/lib/entries/get-owned-entry";
import { generateDirectTranslation } from "@/lib/llm/practice";
import { nextLevelUp } from "@/lib/levels";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const entryId = body?.entryId;
  const levelUp = Boolean(body?.levelUp);

  if (typeof entryId !== "string") {
    return NextResponse.json({ error: "entryId is required" }, { status: 400 });
  }

  const result = await getOwnedEntry(entryId);
  if ("error" in result) {
    return NextResponse.json(
      { error: result.error },
      { status: result.error === "unauthorized" ? 401 : 404 },
    );
  }

  const { entry } = result;
  const level = levelUp ? nextLevelUp(entry.level) : entry.level;

  try {
    const { translation } = await generateDirectTranslation({
      text: entry.text,
      targetLanguage: entry.target_language,
      level,
    });
    return NextResponse.json({ translation, level });
  } catch {
    return NextResponse.json({ error: "generation_failed" }, { status: 502 });
  }
}
