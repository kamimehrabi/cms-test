"use client";

/**
 * Reactive pathname read for widgets — safe drop-in replacement for
 * `next/navigation`'s `usePathname` from inside a detached React root.
 *
 * See `useExternalSearchParams` for why React is resolved from `window.React`
 * instead of being statically imported.
 */
export function useExternalPathname(): string | null {
    const R = (window as any).React as typeof import("react");
    const { useState, useEffect } = R;

    const [pathname, setPathname] = useState<string | null>(
        () => ((window as any).__pathname as string | null) ?? null
    );

    useEffect(() => {
        const handler = (event: Event) => {
            const customEvent = event as CustomEvent<{ pathname: string }>;
            setPathname(customEvent.detail?.pathname ?? null);
        };
        window.addEventListener("pathnameChange", handler);
        return () => window.removeEventListener("pathnameChange", handler);
    }, []);

    return pathname;
}
