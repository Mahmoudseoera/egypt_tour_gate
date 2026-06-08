export type ApiMediaAsset = {
  image: string;
  title: string;
  alt: string;
};

export type ApiMediaSet = {
  image?: ApiMediaAsset;
  cover?: ApiMediaAsset;
};

type RawMediaAsset = string | {
  image?: unknown;
  url?: unknown;
  image_url?: unknown;
  title?: unknown;
  alt?: unknown;
} | null | undefined;

type RawMediaSet = RawMediaAsset | {
  image?: RawMediaAsset;
  cover?: RawMediaAsset;
  title?: unknown;
  alt?: unknown;
  url?: unknown;
  image_url?: unknown;
} | null | undefined;

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export function normalizeMediaAsset(raw?: unknown): ApiMediaAsset | undefined {
  if (!raw) return undefined;

  if (typeof raw === "string") {
    return { image: raw, title: "", alt: "" };
  }

  if (typeof raw !== "object") return undefined;

  const media = raw as Record<string, unknown>;
  const image = asString(media.image) || asString(media.url) || asString(media.image_url);
  const title = asString(media.title);
  const alt = asString(media.alt) || title;

  if (!image && !title && !alt) return undefined;
  return { image, title, alt };
}

export function normalizeMediaSet(raw?: unknown): ApiMediaSet | undefined {
  if (!raw) return undefined;

  if (typeof raw === "string") {
    return { image: normalizeMediaAsset(raw) };
  }

  if (typeof raw !== "object") return undefined;

  const media = raw as Record<string, unknown>;
  const image = normalizeMediaAsset(media.image) ?? normalizeMediaAsset(raw);
  const cover = normalizeMediaAsset(media.cover);

  if (!image && !cover) return undefined;
  return { image, cover };
}

export function getMediaImage(raw?: unknown): string {
  return normalizeMediaSet(raw)?.image?.image ?? "";
}

export function getMediaCover(raw?: unknown): ApiMediaAsset | undefined {
  const media = normalizeMediaSet(raw);
  return media?.cover ?? media?.image;
}
