"use client";

import { HTMLAttributes, useLayoutEffect, useRef } from "react";

interface CustomElementProps extends HTMLAttributes<HTMLElement> {
    element: string;
}

/**
 * Mounts a custom tag (e.g. `<inventory-main-component />`) into `document.body`
 * exactly once, without duplicating if one already exists.
 *
 * Why `useLayoutEffect` instead of mutating during render:
 * Widgets attached to these custom tags create their own React root (via
 * `createRoot`) inside `connectedCallback` and tear it down inside
 * `disconnectedCallback`. React 19 treats a synchronous `root.unmount()`
 * that happens while any React tree is still rendering as a hard warning
 * ("Attempted to synchronously unmount a root while React was already rendering").
 *
 * Appending the custom element *during render* meant the widget's
 * `connectedCallback` (and any subsequent disconnect-reconnect) could be
 * interleaved with the host's render/commit phase. Moving the append into
 * `useLayoutEffect` guarantees the host has finished committing before the
 * widget mounts/unmounts, which is what React 19 expects.
 */
const CustomElement = ({ element }: CustomElementProps) => {
    const elRef = useRef<HTMLElement | null>(null);

    useLayoutEffect(() => {
        const existing = document.getElementsByTagName(element)[0] as HTMLElement | undefined;
        if (existing) {
            elRef.current = existing;
        } else {
            const node = document.createElement(element);
            const footerContainer = document.querySelector("footer-container");
            if (footerContainer) {
                document.body.insertBefore(node, footerContainer);
            } else {
                document.body.appendChild(node);
            }
            elRef.current = node;
        }

        // Clear the ref if the element ever leaves the DOM, so a future
        // remount adopts or recreates it correctly.
        const observer = new MutationObserver(() => {
            if (elRef.current && !document.body.contains(elRef.current)) {
                elRef.current = null;
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            observer.disconnect();
            // Intentionally do NOT remove the DOM node here — widgets own
            // their own lifecycle inside that element and removing it would
            // force their React root to unmount synchronously during the host's
            // commit phase, which is exactly the race we're trying to avoid.
            elRef.current = null;
        };
    }, [element]);

    return null;
};

export default CustomElement;
