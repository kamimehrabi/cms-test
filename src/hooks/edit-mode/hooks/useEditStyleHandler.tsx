import { useEffect } from "react";

export const useEditStyleHandler = (isDevelopment: boolean) => {
    useEffect(() => {
        if (!isDevelopment) return;

        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === "changeStyle") {
                const { id, key, value } = event.data;
                if (!id || !key) return;
                const targetElement = document.querySelector(`[data-cms="${id}"]`);
                if (targetElement && typeof value === "string") {
                    (targetElement as HTMLElement).style[key as any] = value;
                }
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [isDevelopment]);
};