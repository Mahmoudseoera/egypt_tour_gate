import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import {
  CACHE_TAGS,
  ALL_STATIC_TAGS,
  categoryTag,
  subcategoryTag,
  tourTag,
  blogCategoryTag,
  blogPostTag,
  pageTag,
  translationTag,
} from "@/lib/cache/tags";

type RevalidateBody = {
  secret?: string;
  /** Explicit tags — takes priority if provided */
  tags?: string[];
  /** Semantic dashboard event, e.g. "tour", "category", "blog-post" */
  type?: string;
  /** slug/id of the specific record that changed (tour slug, category slug, etc.) */
  slug?: string;
  locale?: string;
};

function resolveTagsByType(type: string, slug?: string, locale?: string): string[] {
  switch (type) {
    case "general":
    case "menu":
    case "header":
    case "footer":
      return [CACHE_TAGS.general, CACHE_TAGS.header, CACHE_TAGS.footer, CACHE_TAGS.categories];
    case "settings":
      return [CACHE_TAGS.settings];
    case "homepage":
    case "home":
      return [CACHE_TAGS.homepage];
    case "categories":
      return [CACHE_TAGS.categories, CACHE_TAGS.general];
    case "category":
      return slug ? [categoryTag(slug), CACHE_TAGS.categories] : [CACHE_TAGS.categories];
    case "subcategory":
      return slug ? [subcategoryTag(slug), CACHE_TAGS.tours] : [CACHE_TAGS.tours];
    case "tour":
      return slug ? [tourTag(slug), CACHE_TAGS.tours] : [CACHE_TAGS.tours];
    case "tours":
      return [CACHE_TAGS.tours];
    case "blog-category":
      return slug ? [blogCategoryTag(slug), CACHE_TAGS.blog] : [CACHE_TAGS.blog];
    case "blog-post":
      return slug ? [blogPostTag(slug), CACHE_TAGS.blog] : [CACHE_TAGS.blog];
    case "blog":
      return [CACHE_TAGS.blog];
    case "contact":
      return [CACHE_TAGS.contact];
    case "about":
      return [CACHE_TAGS.about, CACHE_TAGS.pages];
    case "page":
      return slug ? [pageTag(slug), CACHE_TAGS.pages] : [CACHE_TAGS.pages];
    case "pages":
      return [CACHE_TAGS.pages];
    case "seo":
      return [CACHE_TAGS.seo];
    case "translation":
      return locale ? [CACHE_TAGS.translation, translationTag(locale)] : [CACHE_TAGS.translation];
    case "all":
      return ALL_STATIC_TAGS;
    default:
      return [];
  }
}

export async function POST(req: NextRequest) {
  const body: RevalidateBody = await req.json().catch(() => ({}));

  if (!process.env.REVALIDATE_SECRET || body?.secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  let tags: string[];

  if (Array.isArray(body.tags) && body.tags.length > 0) {
    // Caller (dashboard) knows exactly which tags — most efficient path.
    tags = body.tags;
  } else if (body.type) {
    tags = resolveTagsByType(body.type, body.slug, body.locale);
    if (tags.length === 0) {
      return NextResponse.json(
        { success: false, message: `Unknown revalidation type: "${body.type}"` },
        { status: 400 }
      );
    }
  } else {
    // No specifics given — full purge, kept only as a safety-net fallback
    // (e.g. manual "clear all cache" button), never called automatically.
    tags = ALL_STATIC_TAGS;
  }

  const uniqueTags = Array.from(new Set(tags));
  for (const tag of uniqueTags) {
    revalidateTag(tag, "default");
  }

  return NextResponse.json({ success: true, revalidated: uniqueTags });
}