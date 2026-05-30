/**
 * Read persisted filters from sessionStorage.
 *
 * This is intentionally not a Redux selector — it reads from `sessionStorage`,
 * not from `state`, and returns a fresh object every call. Keeping it here
 * prevents the ContextBridge from treating it as a selector and spamming
 * "selector returned a different result" warnings.
 */
export function getFiltersFromSessionStorage(): Record<string, string | string[]> {
    if (typeof window === "undefined") return {};

    const stored = sessionStorage.getItem("filters");
    if (!stored) return {};

    try {
        return JSON.parse(stored) as Record<string, string | string[]>;
    } catch {
        return {};
    }
}
