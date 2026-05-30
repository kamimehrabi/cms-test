/**
 * Widget-safe navigation adapter.
 *
 * Widgets mount into detached React roots (Shadow DOM / `createRoot`) and therefore
 * cannot use `next/navigation` hooks — those rely on the Next.js App Router context
 * which only lives in the host tree. Calling them from a widget throws
 * "invariant expected app router to be mounted".
 *
 * Instead, the host's `ContextBridge` listens for `widget-navigation` events and
 * drives the real Next.js router. This adapter is the widget-side counterpart:
 * fire-and-forget methods that mirror the shape of `next/navigation`'s `router`.
 */
export type NavigationAction =
    | "push"
    | "replace"
    | "back"
    | "forward"
    | "refresh";

const fire = (detail: { action: NavigationAction; route?: string }) => {
    window.dispatchEvent(
        new CustomEvent("widget-navigation", {
            bubbles: true,
            composed: true,
            detail,
        })
    );
};

export const Navigation = {
    push: (route: string) => fire({ action: "push", route }),
    replace: (route: string) => fire({ action: "replace", route }),
    back: () => fire({ action: "back" }),
    forward: () => fire({ action: "forward" }),
    refresh: () => fire({ action: "refresh" }),
    getPathname: (): string | null =>
        typeof window !== "undefined"
            ? ((window as any).__pathname as string | null) ?? null
            : null,
};
