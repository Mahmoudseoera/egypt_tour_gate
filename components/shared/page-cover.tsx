import Image from "next/image";
import type { ApiMediaAsset } from "@/lib/api/media";

type PageCoverProps = {
  cover?: ApiMediaAsset;
  title: string;
  subtitle?: string;
  label?: string;
  heightClassName?: string;
};

export default function PageCover({
  cover,
  title,
  subtitle,
  label,
  heightClassName = "h-[360px] md:h-[440px]",
}: PageCoverProps) {
  const coverSrc = cover?.image?.trim();

  return (
    <section className={`relative w-full overflow-hidden ${heightClassName} ${coverSrc ? "" : "bg-gradient-to-br from-[var(--second-color)] via-[#3d3586] to-[var(--second-color)]"}`}>
      {coverSrc && (
        <Image
          src={coverSrc}
          alt={cover?.alt || title}
          title={cover?.title || title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          unoptimized={coverSrc.startsWith("http://127.0.0.1") || coverSrc.startsWith("http://localhost")}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/20" />
      <div className="absolute inset-0 flex items-end">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 pb-12 text-white">
          {label && (
            <p className="mb-3 inline-flex rounded-full bg-[var(--main-color)] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[var(--second-color)]">
              {label}
            </p>
          )}
          <h1 className="max-w-5xl text-4xl font-extrabold capitalize leading-tight md:text-5xl lg:text-6xl">
            {title}
          </h1>
          {subtitle && <p className="mt-4 max-w-3xl text-lg font-medium text-white/85 md:text-xl">{subtitle}</p>}
        </div>
      </div>
    </section>
  );
}
