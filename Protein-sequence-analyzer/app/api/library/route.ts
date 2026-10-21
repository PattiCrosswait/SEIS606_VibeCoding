import { NextResponse } from "next/server";
import { analyzeSequence } from "@/lib/sequence/analyze";
import { deleteProtein, listSavedProteins, saveProtein } from "@/lib/protein/server-library";
import type { SavedProtein } from "@/lib/protein/types";

export async function GET() {
  try {
    return NextResponse.json({ proteins: await listSavedProteins() });
  } catch {
    return NextResponse.json({ message: "Database connection failed." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as SavedProtein | null;
  if (!body?.sequenceId || typeof body.sequence !== "string" || analyzeSequence(body.sequence).status !== "valid") {
    return NextResponse.json({ message: "A valid saved protein is required." }, { status: 400 });
  }
  try {
    return NextResponse.json({ protein: await saveProtein(body) }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Database connection failed." }, { status: 503 });
  }
}

export async function DELETE(request: Request) {
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ message: "A sequence id is required." }, { status: 400 });
  try {
    await deleteProtein(id);
    return NextResponse.json({ status: "deleted" });
  } catch {
    return NextResponse.json({ message: "Database connection failed." }, { status: 503 });
  }
}
