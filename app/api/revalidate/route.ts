import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const secret = body?.secret;
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const tags: string[] = Array.isArray(body?.tags) && body.tags.length
    ? body.tags
    : ["home", "tours", "blogs", "general", "settings", "contact", "tailor-made", "categories", "subcategories"];

  for (const tag of tags) {
    revalidateTag(tag, "max");
  }

  return NextResponse.json({ success: true, revalidated: tags });
}