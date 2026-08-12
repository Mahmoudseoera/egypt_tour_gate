export default function LocaleLoading() {
  return (
    <main aria-label="Loading page" aria-busy="true">
      <div className="fixed left-0 right-0 top-0 z-[10000] h-1 overflow-hidden bg-transparent" role="progressbar">
        <div className="h-full w-1/3 animate-[route-progress_1s_ease-in-out_infinite] rounded-r-full bg-gradient-to-r from-[var(--second-color)] via-[#3d3586] to-[var(--main-color)] shadow-[0_0_12px_rgba(227,183,94,0.55)]" />
      </div>
      <section className="hero-loading-skeleton">
        <div className="hero-loading-skeleton__content">
          <span className="hero-loading-skeleton__eyebrow skeleton-shimmer" />
          <span className="hero-loading-skeleton__title skeleton-shimmer" />
          <span className="hero-loading-skeleton__title hero-loading-skeleton__title--short skeleton-shimmer" />
          <span className="hero-loading-skeleton__text skeleton-shimmer" />
          <span className="hero-loading-skeleton__text hero-loading-skeleton__text--short skeleton-shimmer" />
          <div className="hero-loading-skeleton__buttons">
            <span className="skeleton-shimmer" />
            <span className="skeleton-shimmer" />
          </div>
        </div>
        <div className="hero-loading-skeleton__visual skeleton-shimmer" />
      </section>
    </main>
  );
}
