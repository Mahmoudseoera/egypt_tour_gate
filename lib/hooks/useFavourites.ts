// lib/hooks/useFavourites.ts
// useSyncExternalStore requires getSnapshot() to return the SAME reference
// when the data has not changed. We keep a module-level cache for this.

"use client";

import { useCallback, useSyncExternalStore } from "react";

// ── Persisted shape ────────────────────────────────────────────────────────────

export interface FavouriteTour {
  id: number;
  title: string;
  slug: string;
  categorySlug: string;
  subcategorySlug?: string;
  image?: string;
  price: number;
  duration: string;
  location: string;
  description?: string;
}

const STORAGE_KEY = "etg_favourites";

// ── Module-level snapshot cache ────────────────────────────────────────────────
// useSyncExternalStore calls getSnapshot() on every render to check whether
// the store has changed. If getSnapshot() returns a new array reference every
// time (even with identical contents), React thinks the store changed every
// render → infinite loop.
//
// Solution: keep one cached array. Only replace it (new reference) when the
// raw JSON string in localStorage actually differs from the last read.

let cachedJSON = "";
let cachedSnapshot: FavouriteTour[] = [];

function getSnapshot(): FavouriteTour[] {
  let raw = "";
  try {
    raw = localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    raw = "";
  }

  // Return same reference if nothing changed → no re-render
  if (raw === cachedJSON) return cachedSnapshot;

  cachedJSON = raw;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      cachedSnapshot = parsed.filter(
        (item): item is FavouriteTour =>
          item !== null &&
          typeof item === "object" &&
          typeof (item as FavouriteTour).id === "number" &&
          typeof (item as FavouriteTour).slug === "string"
      );
    } else {
      cachedSnapshot = [];
    }
  } catch {
    cachedSnapshot = [];
  }

  return cachedSnapshot;
}

// SSR: stable empty array, never changes
const EMPTY: FavouriteTour[] = [];
function getServerSnapshot(): FavouriteTour[] {
  return EMPTY;
}

// ── Subscriber list ────────────────────────────────────────────────────────────
// We manage our own listener set so same-tab writes can notify all subscribers
// without relying on the native "storage" event (which only fires in OTHER tabs).

const listeners = new Set<() => void>();

function subscribe(callback: () => void): () => void {
  listeners.add(callback);

  // Also sync from other tabs/windows via the native storage event
  const onStorageEvent = (e: StorageEvent) => {
    if (e.key === null || e.key === STORAGE_KEY) callback();
  };
  window.addEventListener("storage", onStorageEvent);

  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorageEvent);
  };
}

function notifyAll(): void {
  listeners.forEach((cb) => cb());
}

// ── localStorage write helper ──────────────────────────────────────────────────

function writeStorage(tours: FavouriteTour[]): void {
  try {
    const json = JSON.stringify(tours);
    localStorage.setItem(STORAGE_KEY, json);
    // Bust the cache immediately so the next getSnapshot() call sees the change
    cachedJSON = json;
    cachedSnapshot = tours;
  } catch {
    // localStorage full or disabled — fail silently
  }
  notifyAll();
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useFavourites() {
  const favourites = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const isFavourite = useCallback(
    (id: number) => favourites.some((t) => t.id === id),
    [favourites]
  );

  const toggle = useCallback((tour: FavouriteTour) => {
    const current = getSnapshot();
    const exists = current.some((t) => t.id === tour.id);
    writeStorage(
      exists ? current.filter((t) => t.id !== tour.id) : [...current, tour]
    );
  }, []);

  const remove = useCallback((id: number) => {
    writeStorage(getSnapshot().filter((t) => t.id !== id));
  }, []);

  const clear = useCallback(() => {
    writeStorage([]);
  }, []);

  return { favourites, isFavourite, toggle, remove, clear };
}
