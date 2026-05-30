"use client";
import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { selectorRegistry } from "@/store/selectors";
import { actionRegistry } from "@/store/actions";
import { store } from "@/store/store";

/**
 * SelectorBridge exposes Redux selector values to external scripts via DOM events.
 *
 * Selector contract:
 * - Request: dispatch `useAppSelector` with `detail: { type: "<selectorKey>", key?: "<itemKey>" }`
 * - Response: listens and dispatches `getSelectorData` with `detail: { type, key?, payload }`
 * - Release: dispatch `useAppSelectorRelease` with `detail: { type, key? }` to drop a
 *   subscription when its widget unmounts. The bridge holds a refcount per
 *   `(type, key)`, so callers must dispatch one release per matching subscribe.
 *   Missing release events are tolerated (the entry simply leaks until reload).
 *
 * Dispatch contract:
 * - Request: dispatch `dispatchAction` with `detail: { type: "<actionKey>", payload?, requestId? }`
 * - Response: dispatches `dispatchActionResult` with `detail: { type, requestId?, ok, error? }`
 *
 * Race-condition handling (selectors):
 * - If requested selector data is not ready yet (null/undefined/empty object),
 *   request type is queued.
 * - On subsequent renders, queued requests are flushed as soon as data becomes ready.
 */
export default function SelectorBridge() {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Store the most recent selector data for each type
    const selectorDataRef = useRef<Record<string, any>>({});
    // Tracks pending requests requested before data is ready.
    const pendingRequestsRef = useRef<Set<string>>(new Set());
    // Active subscriptions. A request for (type, key) is treated as a
    // standing subscription so the bridge can push updates when the store
    // changes instead of only responding once.
    // Stored as a refcount so multiple widgets sharing the same (type, key)
    // are tracked independently and a single release doesn't unsubscribe
    // siblings still depending on the entry.
    const subscriptionsRef = useRef<Map<string, number>>(new Map());
    // Last payload pushed for each (type, key) so we can skip no-op broadcasts.
    const lastBroadcastRef = useRef<Record<string, unknown>>({});

    const isSelectorDataReady = (data: unknown) => {
        if (data === undefined || data === null) {
            return false;
        }

        // Redux slices usually initialize with {}, so treat that as "not loaded yet".
        if (typeof data === "object" && !Array.isArray(data) && Object.keys(data as Record<string, unknown>).length === 0) {
            return false;
        }

        return true;
    };

    const toPendingRequestId = (type: string, key?: string) => `${type}::${key ?? ""}`;
    const fromPendingRequestId = (requestId: string) => {
        const [type, ...keyParts] = requestId.split("::");
        const key = keyParts.join("::");
        return { type, key: key || undefined };
    };

    const getPayloadForRequest = (type: string, key?: string) => {
        const rootPayload = selectorDataRef.current[type as keyof typeof selectorRegistry];
        if (key === undefined) {
            return rootPayload;
        }
        if (!rootPayload || typeof rootPayload !== "object") {
            return undefined;
        }
        return (rootPayload as Record<string, unknown>)[key];
    };

    const dispatchSelectorData = (type: string, payload: unknown, key?: string) => {
        console.log('dispatchSelectorData', type, payload, key);
        window.dispatchEvent(
            new CustomEvent("getSelectorData", {
                bubbles: true,
                composed: true,
                detail: { type, key, payload },
            })
        );
    };

    // Build an object containing all selector data, updating on state changes
    const selectorValues: Record<string, any> = {};
    for (const key in selectorRegistry) {
        // This invokes useAppSelector for every selector at render
        // It's a slight cost, but necessary because we cannot call hooks conditionally
        selectorValues[key] = useAppSelector(selectorRegistry[key as keyof typeof selectorRegistry]);
    }

    // Keep the ref in sync
    selectorDataRef.current = selectorValues;

    // Publish the current snapshot on the window so newly-mounted widgets
    // can read the live value synchronously in `useState`'s initializer
    // (see `useExternalSelector`). This lets the bridge skip the on-subscribe
    // broadcast when the value is unchanged from the last broadcast — a new
    // subscriber doesn't need its own dispatch to bootstrap.
    if (typeof window !== "undefined") {
        (window as any).__selectorData = selectorValues;
    }

    useEffect(() => {
        // Handles incoming external selector requests.
        const handleEvent = (event: Event) => {
            const customEvent = event as CustomEvent<{ type?: string; key?: string }>;
            const type = customEvent.detail?.type;
            const key = customEvent.detail?.key;
            if (!type) {
                return;
            }
            if (!(type in selectorRegistry)) {
                console.warn(`[SelectorBridge] Unknown selector: ${type}`);
                return;
            }

            // Register/refcount this subscription so we keep pushing updates
            // until every consumer has released it.
            const subId = toPendingRequestId(type, key);
            const previousCount = subscriptionsRef.current.get(subId) ?? 0;
            subscriptionsRef.current.set(subId, previousCount + 1);

            const data = getPayloadForRequest(type, key);
            if (!isSelectorDataReady(data)) {
                // Data is not ready yet; keep request and retry on next renders.
                pendingRequestsRef.current.add(subId);
                return;
            }

            // Skip the broadcast if we've already pushed this exact value —
            // newly-mounted subscribers read the current snapshot directly
            // from `window.__selectorData` in their `useState` initializer,
            // so they don't need a personal dispatch to bootstrap. Without
            // this check, every additional subscriber to a hot `(type, key)`
            // (e.g. each car card on `selectSelectedCarCompare`) would fan
            // out one window event per mount, hitting every other listener.
            if (lastBroadcastRef.current[subId] === data) {
                return;
            }

            lastBroadcastRef.current[subId] = data;
            dispatchSelectorData(type, data, key);
        };

        // Drops one reference to a subscription. When the refcount hits zero
        // we forget the entry entirely so the broadcast loop stops iterating
        // over it and `lastBroadcastRef` releases its payload reference.
        const handleRelease = (event: Event) => {
            const customEvent = event as CustomEvent<{ type?: string; key?: string }>;
            const type = customEvent.detail?.type;
            const key = customEvent.detail?.key;
            if (!type) {
                return;
            }

            const subId = toPendingRequestId(type, key);
            const current = subscriptionsRef.current.get(subId);
            if (current === undefined) {
                return;
            }

            if (current <= 1) {
                subscriptionsRef.current.delete(subId);
                pendingRequestsRef.current.delete(subId);
                delete lastBroadcastRef.current[subId];
            } else {
                subscriptionsRef.current.set(subId, current - 1);
            }
        };

        window.addEventListener("useAppSelector", handleEvent);
        window.addEventListener("useAppSelectorRelease", handleRelease);
        return () => {
            window.removeEventListener("useAppSelector", handleEvent);
            window.removeEventListener("useAppSelectorRelease", handleRelease);
        };
    }, []);

    useEffect(() => {
        // Flush queued requests and push updates to all live subscriptions
        // whose underlying selector value has changed since the last broadcast.
        // Runs on every render, so it fires whenever any tracked selector
        // returns a new value (Redux `createSelector` memoizes, so reference
        // equality is enough to detect real changes).
        for (const subId of subscriptionsRef.current.keys()) {
            const { type, key } = fromPendingRequestId(subId);
            const data = getPayloadForRequest(type, key);
            if (!isSelectorDataReady(data)) {
                continue;
            }

            if (lastBroadcastRef.current[subId] === data) {
                continue;
            }

            lastBroadcastRef.current[subId] = data;
            dispatchSelectorData(type, data, key);
            pendingRequestsRef.current.delete(subId);
        }
    });

    useEffect(() => {
        // Handles incoming external dispatch requests.
        const handleDispatch = (event: Event) => {
            const customEvent = event as CustomEvent<{
                type?: string;
                payload?: unknown;
                requestId?: string;
            }>;
            const { type, payload, requestId } = customEvent.detail ?? {};

            const ack = (ok: boolean, error?: string) => {
                window.dispatchEvent(
                    new CustomEvent("dispatchActionResult", {
                        bubbles: true,
                        composed: true,
                        detail: { type, requestId, ok, error },
                    })
                );
            };

            if (!type) {
                ack(false, "Missing action type");
                return;
            }

            const actionCreator = actionRegistry[type];
            if (!actionCreator) {
                console.warn(`[DispatchBridge] Unknown action: ${type}`);
                ack(false, `Unknown action: ${type}`);
                return;
            }

            try {
                store.dispatch(actionCreator(payload));
                ack(true);
            } catch (err) {
                console.error(`[DispatchBridge] Error dispatching ${type}:`, err);
                ack(false, err instanceof Error ? err.message : String(err));
            }
        };

        window.addEventListener("dispatchAction", handleDispatch);
        return () => window.removeEventListener("dispatchAction", handleDispatch);
    }, []);

    // Navigation bridge: broadcast pathname changes to widgets.
    useEffect(() => {
        (window as any).__pathname = pathname;
        window.dispatchEvent(
            new CustomEvent("pathnameChange", {
                bubbles: true,
                composed: true,
                detail: { pathname },
            })
        );
    }, [pathname]);

    // Navigation bridge: broadcast search-params changes to widgets.
    // We send the raw query string; widgets reconstruct `URLSearchParams` themselves.
    const searchString = searchParams.toString();
    useEffect(() => {
        (window as any).__searchParams = searchString;
        window.dispatchEvent(
            new CustomEvent("searchParamsChange", {
                bubbles: true,
                composed: true,
                detail: { search: searchString },
            })
        );
    }, [searchString]);

    // Navigation bridge: handle router actions triggered by widgets.
    // Event contract: detail: { action?: "push" | "replace" | "back" | "forward" | "refresh"; route?: string }
    // Default action is "push" for backwards compatibility with <NextLink />.
    useEffect(() => {
        const handleNavigation = (event: Event) => {
            const customEvent = event as CustomEvent<{
                action?: "push" | "replace" | "back" | "forward" | "refresh";
                route?: string;
            }>;
            const action = customEvent.detail?.action ?? "push";
            const route = customEvent.detail?.route;

            switch (action) {
                case "push":
                    if (route) router.push(route);
                    break;
                case "replace":
                    if (route) router.replace(route);
                    break;
                case "back":
                    router.back();
                    break;
                case "forward":
                    router.forward();
                    break;
                case "refresh":
                    router.refresh();
                    break;
                default:
                    console.warn(`[NavigationBridge] Unknown action: ${action}`);
            }
        };

        window.addEventListener("widget-navigation", handleNavigation);
        return () => window.removeEventListener("widget-navigation", handleNavigation);
    }, [router]);

    return null;
}
