import { NextResponse } from "next/server";
import { localPredictionResponse } from "@/lib/predictions/providers/local";
import { searchEbiAnnotations } from "@/lib/predictions/providers/ebi-search";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as { sequence?: string };
  if (!body.sequence?.trim()) {
    return NextResponse.json({ status: "failed", predictions: [], message: "A normalized sequence is required." }, { status: 400 });
  }
  const local = localPredictionResponse(body.sequence.trim());
  try {
    const specialist = await searchEbiAnnotations(body.sequence.trim());
    return NextResponse.json({
      status: "available",
      predictions: [...local.predictions, specialist],
      message: "Local heuristics were supplemented with EMBL-EBI Search results.",
    });
  } catch {
    return NextResponse.json({
      ...local,
      message: "Specialist EMBL-EBI Search was unavailable; local heuristic predictions are shown.",
    });
  }
}
