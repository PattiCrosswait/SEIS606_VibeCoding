import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      status: "unavailable",
      message: "Prediction providers are not configured yet. Core local analysis remains available.",
    },
    { status: 503 },
  );
}
