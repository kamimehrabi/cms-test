"use client";

/**
 * Subscribes a widget to a Redux selector over the ContextBridge event channel.
 *
 * React is resolved from `window.React` at call time rather than statically
 * imported. See `useExternalSearchParams` for the full explanation — TL;DR:
 * widgets may render with a different React instance than the host, and using
 * the host's imported `useState/useEffect` triggers "Invalid hook call".
 */

// Reads the current value of `(type, key)` from the bridge's published
// snapshot on `window.__selectorData`. The bridge refreshes this object on
// every render, so it's always the freshest known value. Used as the
// `useState` initializer so additional subscribers to an already-hot
// `(type, key)` don't need their own broadcast to bootstrap.
const readSelectorSnapshot = (selectType: string, key?: string): any => {
    if (typeof window === "undefined") return null;
    const all = (window as any).__selectorData as
        | Record<string, unknown>
        | undefined;
    if (!all) return null;
    const root = all[selectType];
    if (key === undefined) {
        return root ?? null;
    }
    if (!root || typeof root !== "object") {
        return null;
    }
    return (root as Record<string, unknown>)[key] ?? null;
};

export const useExternalSelector = (
    eventName: string,
    selectType: string,
    key?: string
) => {
    const R = (window as any).React as typeof import("react");
    const { useState, useEffect } = R;

    const [value, setValue] = useState<any>(() =>
        readSelectorSnapshot(selectType, key)
    );

    useEffect(() => {
        const handler = (event: any) => {
            if (event.detail?.type !== selectType) {
                return;
            }

            // If key is provided, only accept payload for that key.
            if (key !== undefined && event.detail?.key !== key) {
                return;
            }

            // If no key is provided, ignore keyed responses to avoid cross-widget pollution.
            if (key === undefined && event.detail?.key !== undefined) {
                return;
            }

            if (event.detail?.type === selectType) {
                setValue(event.detail.payload);
            }
        };
        window.addEventListener(eventName, handler);

        return () => window.removeEventListener(eventName, handler);
    }, [eventName, selectType, key]);

    // Subscribe on mount / when the (type, key) target changes, and release
    // on unmount or before re-subscribing. The bridge refcounts subscriptions,
    // so the release event keeps it from leaking entries (and held payloads)
    // when widgets churn (infinite scroll, filters, etc.).
    useEffect(() => {
        window.dispatchEvent(
            new CustomEvent("useAppSelector", {
                bubbles: true,
                composed: true,
                detail: { type: selectType, key },
            })
        );

        return () => {
            window.dispatchEvent(
                new CustomEvent("useAppSelectorRelease", {
                    bubbles: true,
                    composed: true,
                    detail: { type: selectType, key },
                })
            );
        };
    }, [selectType, key]);

    return value;
};
