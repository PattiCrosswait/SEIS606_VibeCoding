import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      status: "unavailable",
      message: "External protein search is not configured yet.",
      matches: [],
    },
    { status: 503 },
  );
}
