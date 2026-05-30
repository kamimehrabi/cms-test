"use client";

import { useCallback } from "react";

// Types
interface ClickTarget {
    tagName: string;
    className: string;
    dataCms?: string;
    id: string;
    textContent?: string;
    innerHTML?: string;
    computedStyle: string;
}

// Constants
const MESSAGE_TYPES = {
    CLICK: 'click'
} as const;

/**
 * Custom hook to handle body click events in development mode
 * @param isDevelopment - Whether the app is running in development mode
 * @returns Click handler function or undefined if not in development mode
 */
export const useClickHandler = (isDevelopment: boolean) => {
    const handleBodyClick = useCallback((event: React.MouseEvent) => {
        if (!isDevelopment) return;

        const target = event.target as Element;
        const computedStyle = getComputedStyle(target);

        // NOTE: target.className is an SVGAnimatedString (not a string) for SVG
        // elements, and dataset/id only exist on HTMLElement/SVGElement. Reading
        // through getAttribute keeps everything as plain strings so that the
        // payload can be structured-cloned by postMessage.
        const clickTarget: ClickTarget = {
            tagName: target.tagName,
            className: target.getAttribute('class') ?? '',
            dataCms: target.getAttribute('data-cms') ?? undefined,
            id: target.id,
            textContent: target.textContent ?? undefined,
            innerHTML: target.innerHTML ?? undefined,
            computedStyle: JSON.stringify(computedStyle),
        };


        // Send click information to parent window
        window.parent.postMessage({
            type: MESSAGE_TYPES.CLICK,
            target: clickTarget,
        }, "*");
    }, [isDevelopment]);

    return isDevelopment ? handleBodyClick : undefined;
}; 