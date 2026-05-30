"use client";

import { useEffect, useState } from "react";
import { useEditMode } from "./useEditMode";

// Types
interface MessageEvent {
    data: {
        type: string;
        enabled?: boolean;
    };
}

// Constants
const MESSAGE_TYPES = {
    SET_EDIT_MODE: 'SET_EDIT_MODE'
} as const;

/**
 * Custom hook to handle edit mode state and message events
 * @returns The current edit mode state
 */
export const useEditModeHandler = () => {
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        const handleEditModeMessage = (event: MessageEvent) => {
            console.log(event, "editmode")
            if (event.data.type === MESSAGE_TYPES.SET_EDIT_MODE) {
                setEditMode(event.data.enabled ?? false);
                window.__editMode = event.data.enabled ?? false
            }
        };

        window.addEventListener('message', handleEditModeMessage);
        return () => window.removeEventListener('message', handleEditModeMessage);
    }, []);

    useEditMode(editMode);


    return editMode;
}; 