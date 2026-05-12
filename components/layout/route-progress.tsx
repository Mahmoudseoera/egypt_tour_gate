"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

function isModifiedClick(event: MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

function shouldStartProgress(anchor: HTMLAnchorElement) {
  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return false;
  if (anchor.target && anchor.target !== "_self") return false;

  const targetUrl = new URL(anchor.href, window.location.href);
  if (targetUrl.origin !== window.location.origin) return false;

  const current = `${window.location.pathname}${window.location.search}`;
  const target = `${targetUrl.pathname}${targetUrl.search}`;
  return target !== current;
}

export default function RouteProgress() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousPathnameRef = useRef(pathname);

  useEffect(() => {
    const start = () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      setVisible(true);
      setProgress(12);
    };

    const onClick = (event: MouseEvent) => {
      if (isModifiedClick(event) || event.defaultPrevented) return;
      const anchor = (event.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (anchor && shouldStartProgress(anchor)) start();
    };

    window.addEventListener("beforeunload", start);
    document.addEventListener("click", onClick, true);

    return () => {
      window.removeEventListener("beforeunload", start);
      document.removeEventListener("click", onClick, true);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!visible) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) return prev;
        const step = prev < 40 ? 10 : prev < 70 ? 5 : 2;
        return Math.min(92, prev + step);
      });
    }, 180);

    return () => clearInterval(timer);
  }, [visible]);

  useEffect(() => {
    if (previousPathnameRef.current === pathname) return;
    previousPathnameRef.current = pathname;

    hideTimerRef.current = setTimeout(() => {
      setProgress(100);
      hideTimerRef.current = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 250);
    }, 0);
  }, [pathname]);

  if (!visible) return null;

  return (
    <div className="fixed left-0 right-0 top-0 z-[10000] h-1 bg-transparent" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}>
      <div
        className="h-full rounded-r-full transition-[width] duration-200 ease-out"
        style={{
          width: `${progress}%`,
          background: "linear-gradient(90deg, var(--second-color) 0%, #3d3586 45%, var(--main-color) 100%)",
          boxShadow: "0 0 12px rgba(227,183,94,0.55)",
        }}
      />
    </div>
  );
}
