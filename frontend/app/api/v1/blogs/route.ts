import { NextResponse } from "next/server";
import { CANONICAL_JOURNAL_ARTICLES } from "@/lib/journal";

export async function GET() {
  return NextResponse.json(CANONICAL_JOURNAL_ARTICLES);
}
