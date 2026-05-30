"use client";

import { externalDispatch, type ExternalDispatchResult } from "@/utils/externalDispatch";

/**
 * Hook version of `externalDispatch`. Returns a stable callback for firing Redux
 * actions from components mounted outside the main React tree (e.g. web components).
 *
 * React is resolved from `window.React` at call time rather than statically
 * imported. See `useExternalSearchParams` for the full explanation.
 *
 * @example
 *   const dispatch = useExternalDispatch();
 *   dispatch("setFilter", { field: "make", value: "Mercedes-Benz" });
 */
export const useExternalDispatch = () => {
    const R = (window as any).React as typeof import("react");
    const { useCallback } = R;

    return useCallback(
        (type: string, payload?: unknown): Promise<ExternalDispatchResult> =>
            externalDispatch(type, payload),
        []
    );
};
