import { NextResponse } from "next/server";
import { searchUniProt } from "@/lib/protein/uniprot";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as { query?: string };
  if (!body.query?.trim()) {
    return NextResponse.json({ status: "no-results", matches: [] });
  }
  if (body.query.trim().length > 200) {
    return NextResponse.json({ status: "failed", matches: [], message: "Search queries must be 200 characters or fewer." }, { status: 400 });
  }
  try {
    const matches = await searchUniProt(body.query.trim());
    return NextResponse.json({ status: matches.length ? "matches" : "no-results", matches });
  } catch (error) {
    const message = error instanceof Error && error.name === "AbortError"
      ? "UniProt search timed out. Try again."
      : "UniProt search is temporarily unavailable. Try again.";
    return NextResponse.json({ status: "failed", matches: [], message }, { status: 502 });
  }
}
