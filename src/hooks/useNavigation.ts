/**
 * @deprecated Widget-driven router navigation is now owned by `ContextBridge`
 * via the `widget-navigation` event. This hook is kept only to avoid breaking
 * existing imports and is a no-op.
 *
 * - Widgets should use `window.Navigation` (push/replace/back/forward/refresh).
 * - Widgets should use `window.useExternalPathname()` to read the current path.
 * - Host code should use `next/navigation` directly.
 */
export const useNavigation = () => {
    // no-op: ContextBridge handles `widget-navigation` for the entire app.
};
