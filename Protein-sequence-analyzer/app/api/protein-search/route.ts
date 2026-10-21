import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as { query?: string };
  if (!body.query?.trim()) {
    return NextResponse.json({ status: "no-results", matches: [] });
  }
  return NextResponse.json(
    {
      status: "unavailable",
      message: "External protein search is not configured yet.",
      matches: [],
    },
    { status: 503 },
  );
}
