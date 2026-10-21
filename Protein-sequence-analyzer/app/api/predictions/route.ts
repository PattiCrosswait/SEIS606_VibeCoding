import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as { sequence?: string };
  if (!body.sequence?.trim()) {
    return NextResponse.json({ status: "failed", predictions: [], message: "A normalized sequence is required." }, { status: 400 });
  }
  return NextResponse.json(
    {
      status: "unavailable",
      predictions: [],
      message: "Prediction providers are not configured yet. Core local analysis remains available.",
    },
    { status: 503 },
  );
}
