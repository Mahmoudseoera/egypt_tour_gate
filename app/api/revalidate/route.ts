import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

const DEFAULT_TAGS = [
  "home",
  "tours",
  "blogs",
  "blog-categories",
  "general",
  "settings",
  "contact",
  "tailor-made",
  "categories",
  "subcategories",
  "seo",
  "about",
  "translation",
];

function uniqueStrings(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((item): item is string => typeof item === "string" && item.trim().length > 0))];
}

function buildSlugTags(body: Record<string, unknown>) {
  const tags: string[] = [];

  for (const slug of uniqueStrings(body.categorySlugs)) tags.push(`category:${slug}`);
  for (const slug of uniqueStrings(body.subcategorySlugs)) tags.push(`subcategory:${slug}`);
  for (const slug of uniqueStrings(body.tourSlugs)) tags.push(`tour:${slug}`);
  for (const slug of uniqueStrings(body.blogCategorySlugs)) tags.push(`blog-category:${slug}`);
  for (const slug of uniqueStrings(body.blogSlugs)) tags.push(`blog:${slug}`);

  return tags;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const secret = body?.secret;
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const requestedTags = uniqueStrings(body?.tags);
  const tags = requestedTags.length ? requestedTags : DEFAULT_TAGS;
  const slugTags = buildSlugTags(body);
  const allTags = [...new Set([...tags, ...slugTags])];

  for (const tag of allTags) {
    revalidateTag(tag, "max");
  }

  const paths = uniqueStrings(body?.paths);
  for (const path of paths) {
    revalidatePath(path);
  }

  return NextResponse.json({ success: true, revalidated: { tags: allTags, paths } });
}
