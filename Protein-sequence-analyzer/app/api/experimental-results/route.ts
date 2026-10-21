import { NextResponse } from "next/server";
import { saveExperimentalObservations } from "@/lib/db/experimental";
import { analyzeSequence } from "@/lib/sequence/analyze";
import { parseExperimentalResults } from "@/lib/predictions/experimental";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { sequence?: string; observations?: unknown } | null;
  if (!body?.sequence || analyzeSequence(body.sequence).status !== "valid" || !Array.isArray(body.observations)) {
    return NextResponse.json({ message: "A valid sequence and experimental observations are required." }, { status: 400 });
  }
  try {
    const observations = parseExperimentalResults(JSON.stringify(body.observations), "results.json");
    await saveExperimentalObservations(analyzeSequence(body.sequence).normalizedSequence, observations);
    return NextResponse.json({ status: "saved", count: observations.length }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Database connection failed." }, { status: 503 });
  }
}
