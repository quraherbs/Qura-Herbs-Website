import { NextResponse } from "next/server";
import { getArticleBySlug, CANONICAL_JOURNAL_ARTICLES } from "@/lib/journal";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const article = getArticleBySlug(slug) || CANONICAL_JOURNAL_ARTICLES[0];
  if (!article) {
    return NextResponse.json({ detail: "Blog not found" }, { status: 404 });
  }
  return NextResponse.json(article);
}
