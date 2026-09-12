import { NextResponse } from "next/server";
import { getOwnedEntry } from "@/lib/entries/get-owned-entry";
import { splitIntoSentences } from "@/lib/llm/practice";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const entryId = body?.entryId;

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

  try {
    const { sentences } = await splitIntoSentences({ text: result.entry.text });
    return NextResponse.json({ sentences });
  } catch {
    return NextResponse.json({ error: "generation_failed" }, { status: 502 });
  }
}
