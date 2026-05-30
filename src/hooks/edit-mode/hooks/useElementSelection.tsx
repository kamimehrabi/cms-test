"use client";

import { useEffect, useState } from "react";

// Types
interface MessageEvent {
    data: {
        type: string;
        id?: string;
    };
}

// Constants
const MESSAGE_TYPES = {
    CLICK: 'click',
    CLEAR: 'clear',
    PREVIOUS: 'previous',
    NEXT: 'next'
} as const;

const SELECTION_STYLES = {
    BOX_SHADOW: '0 0 0 1px red',
    Z_INDEX: '9999',
    POSITION: 'relative'
} as const;

/**
 * Custom hook to handle element selection in development mode
 * @param header - Header data to determine if selection should be enabled
 * @param isDevelopment - Whether the app is running in development mode
 */
export const useElementSelection = (
    isDevelopment: boolean
) => {
    useEffect(() => {
        if (!isDevelopment) return;

        /**
         * Clears all element selections by removing visual indicators
         */
        const clearElementSelection = () => {
            document.querySelectorAll('[data-cms]').forEach((element) => {
                const el = element as HTMLElement;
                el.style.boxShadow = '';
                el.style.position = '';
                el.style.zIndex = '';
            });
        };

        /**
         * Selects an element by adding visual indicators
         * @param id - The data-cms attribute value to select
         */
        const selectElement = (id: string) => {
            clearElementSelection();

            const targetElement = document.querySelector(`[data-cms="${id}"]`) as HTMLElement;

            if (!targetElement) {
                console.warn(`Element with data-cms="${id}" not found`);
                return;
            }

            // Add visual selection indicator
            targetElement.style.boxShadow = SELECTION_STYLES.BOX_SHADOW;

            // Ensure element is positioned for outline visibility
            const computedStyle = getComputedStyle(targetElement);
            if (computedStyle.position === 'static' || !targetElement.style.position) {
                targetElement.style.position = SELECTION_STYLES.POSITION;
            }

            targetElement.style.zIndex = SELECTION_STYLES.Z_INDEX;
        };

        const selectPreviousElement = (id: string) => {
            const targetElement = document.querySelector(`[data-cms="${id}"]`) as HTMLElement;
            const previousElement = targetElement.previousElementSibling as HTMLElement;
            if (previousElement) {
            } else {
                console.log("No previous element");
            }
        };

        const selectNextElement = (id: string) => {
            const targetElement = document.querySelector(`[data-cms="${id}"]`) as HTMLElement;
            const nextElement = targetElement.nextElementSibling as HTMLElement;
            if (nextElement) {
            } else {
                console.log("No next element");
            }
        };

        /**
         * Handles incoming messages for element selection
         * @param event - The message event
         */
        const handleMessage = (event: MessageEvent) => {
            switch (event.data.type) {
                case MESSAGE_TYPES.CLICK:
                    if (event.data.id) {
                        selectElement(event.data.id);
                    }
                    break;
                case MESSAGE_TYPES.CLEAR:
                    clearElementSelection();
                    break;
                case MESSAGE_TYPES.PREVIOUS:
                    if (event.data.id) {
                        selectPreviousElement(event.data.id);
                    }
                    break;
                case MESSAGE_TYPES.NEXT:
                    if (event.data.id) {
                        selectNextElement(event.data.id);
                    }
                    break;
                default:
                    // Ignore unknown message types
                    break;
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [isDevelopment]);
}; 
