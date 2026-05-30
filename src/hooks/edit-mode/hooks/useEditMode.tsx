"use client"
import { useEffect } from "react";

export const useEditMode = (editMode: boolean) => {
 
    useEffect(() => {
        if (!editMode) return;

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
        };

        const handleClick = (e: MouseEvent) => {

            // Only intercept left clicks without modifier keys
            if (
                e.defaultPrevented ||
                e.button !== 0 ||
                e.metaKey ||
                e.ctrlKey ||
                e.shiftKey ||
                e.altKey
            ) {
                return;
            }
            let el = e.target as HTMLElement | null;
            while (el && el !== document.body) {
                if (el.tagName === "A" && (el as HTMLAnchorElement).href) {
                    e.preventDefault();
                    break;
                }
                el = el.parentElement;
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        document.addEventListener("click", handleClick, true);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            document.removeEventListener("click", handleClick, true);
        };
    }, [editMode]);
}