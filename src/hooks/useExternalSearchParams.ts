"use client";

import * as HostReact from "react";

/**
 * Reactive search-params read for widgets — safe drop-in replacement for
 * `next/navigation`'s `useSearchParams` from inside a detached React root.
 *
 * Rules of use:
 * - Must be called inside a React component's render (just like any hook).
 * - If the caller is a *widget* with its own React runtime, that widget must
 *   externalize React to `window.React` so there is a single React instance
 *   at runtime. Two React copies = "Invalid hook call" no matter what we do.
 *
 * We prefer `window.React` (so widget-bundled React wins when present),
 * and fall back to the host's React otherwise.
 */
export function useExternalSearchParams(): URLSearchParams {
    const R =
        (typeof window !== "undefined" && (window as any).React) || HostReact;
    const { useState, useEffect, useMemo } = R as typeof HostReact;

    const [search, setSearch] = useState<string>(() =>
        typeof window !== "undefined"
            ? ((window as any).__searchParams as string | undefined) ??
            window.location.search.replace(/^\?/, "")
            : ""
    );

    useEffect(() => {
        const handler = (event: Event) => {
            const customEvent = event as CustomEvent<{ search: string }>;
            setSearch(customEvent.detail?.search ?? "");
        };
        window.addEventListener("searchParamsChange", handler);
        return () => window.removeEventListener("searchParamsChange", handler);
    }, []);

    // Memoize on the search string so callers can safely depend on the
    // returned URLSearchParams in `useEffect` / `useMemo` dep arrays without
    // triggering on every render. A fresh `new URLSearchParams(search)` per
    // render is referentially unequal to its previous self even when the URL
    // hasn't changed, which previously caused dependent effects (e.g.
    // widget-side filter pipelines) to dispatch on every render and put the
    // store into a runaway update loop.
    return useMemo(() => new URLSearchParams(search), [search]);
}
