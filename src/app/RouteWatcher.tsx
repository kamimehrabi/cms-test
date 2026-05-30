// app/RouteWatcher.tsx
"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { routeMap, routePrefixMap } from "./routes-map";
import { getRegisteredTag } from "./route-element-registry";

export default function RouteWatcher() {
    const pathname = usePathname();
    const prevPathRef = useRef<string | null>(null);

    useEffect(() => {
        const prev = prevPathRef.current;
        if (prev && prev !== pathname) {
            const resolveTag = (path: string) =>
                getRegisteredTag(path) ??
                routeMap[path] ??
                routePrefixMap.find(([prefix]) => path.startsWith(prefix))?.[1];

            const prevTag = resolveTag(prev);
            const currentTag = resolveTag(pathname);

            // Skip removal when both routes share the same element (e.g. slug → slug).
            // The existing element is reused by the incoming page; removing it would
            // wipe the new page's mounted widget.
            if (prevTag && prevTag !== currentTag) {
                const el = document.querySelector(prevTag);
                if (el) {
                    requestAnimationFrame(() => {
                        el.remove();
                    });
                }
            }
        }

        // به‌روزرسانی مسیر قبلی
        prevPathRef.current = pathname;
    }, [pathname]);

    return null;
}
