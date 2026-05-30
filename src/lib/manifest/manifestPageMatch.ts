import type { ManifestPageEntry } from "@/types/dealershipManifest";

export function normalizePathname(pathname: string): string {
    if (!pathname || pathname === "/") return "/";
    const trimmed = pathname.replace(/\/+$/, "");
    return trimmed || "/";
}

/**
 * Match Next pathname (e.g. `/`, `/cars`) to a manifest `pages[]` row.
 */
export function findManifestPageForPathname(
    pages: ManifestPageEntry[] | undefined,
    pathname: string
): ManifestPageEntry | undefined {
    if (!pages?.length) return undefined;
    const np = normalizePathname(pathname);

    const byRoute = pages.find((p) => {
        if (p.routePath == null || !String(p.routePath).trim()) return false;
        return normalizePathname(String(p.routePath)) === np;
    });
    if (byRoute) return byRoute;

    const slugPath = (slug: string) => {
        const s = slug.trim();
        if (!s) return "/";
        if (s === "home" || s === "index") return "/";
        return normalizePathname(`/${s}`);
    };

    return pages.find((p) => slugPath(p.slug) === np);
}
