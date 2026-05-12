export default function LocaleLoading() {
  return (
    <div className="fixed left-0 right-0 top-0 z-[10000] h-1 overflow-hidden bg-transparent" role="progressbar" aria-label="Loading page">
      <div className="h-full w-1/3 animate-[route-progress_1s_ease-in-out_infinite] rounded-r-full bg-gradient-to-r from-[var(--second-color)] via-[#3d3586] to-[var(--main-color)] shadow-[0_0_12px_rgba(227,183,94,0.55)]" />
    </div>
  );
}
