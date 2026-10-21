import { NextResponse } from "next/server";
import { localPredictionResponse } from "@/lib/predictions/providers/local";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as { sequence?: string };
  if (!body.sequence?.trim()) {
    return NextResponse.json({ status: "failed", predictions: [], message: "A normalized sequence is required." }, { status: 400 });
  }
  return NextResponse.json(localPredictionResponse(body.sequence.trim()));
}
