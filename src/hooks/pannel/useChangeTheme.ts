"use client";

import { useEffect } from "react";

const MESSAGE_TYPES = {
    CHANGE_THEME: 'changeTheme'
} as const;

const changeTheme = (theme: string) => {
    const htmlElement = document.getElementsByTagName('html')[0];

    return htmlElement.setAttribute('data-theme', theme);
}

const sendMessage = (theme: string) => {
    if (typeof window !== 'undefined') {
        window.parent.postMessage({
            type: MESSAGE_TYPES.CHANGE_THEME,
            theme
        }, "*");
    }
};

export const useChangeTheme = () => {
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === MESSAGE_TYPES.CHANGE_THEME) {
                changeTheme(event.data.theme);
                sendMessage(event.data.theme);
            }
        };

        window.addEventListener('message', handleMessage);
    }, []);
}