import "server-only";

import type { InjectableScript } from "@/hooks/useScript";
import { fetchScript } from "./widgetFetcher";
import type {
    DealershipManifest,
    ManifestHubPageComponentEntry,
    ManifestPageEntry,
} from "@/types/dealershipManifest";
import { findManifestPageForPathname } from "@/lib/manifest/manifestPageMatch";
import { resolveCmsAssetUrl } from "@/lib/manifest/resolveCmsAssetUrl";

/**
 * CMS page-registry loader.
 *
 * Every CMS-driven page in this app follows the same shape:
 *   1. Fetch a JSON `registry.json` describing the page.
 *   2. Resolve the gzipped `container` script.
 *   3. Resolve, in parallel, every gzipped `components[].script`.
 *   4. Hand the decompressed sources to a client component that injects
 *      them via `useScriptInject` / `useScriptInjectAll`.
 *
 * `loadPageBundle` collapses that flow into a single call so each
 * `app/<page>/page.tsx` becomes a thin Server Component that only knows
 * its own registry URL.
 */

/** A CMS reference to a JSON document (component data, defaults, ...). */
export interface JsonRef {
    url: string;
    version?: string;
    encoding?: "json" | string;
}

/** A CMS reference to a library defaults document. */
export interface LibraryDefaultsRef {
    url: string;
    version?: string;
}

/** Page-level container (e.g. `home-container`, `inventory-main-container`). */
export interface PageRegistryContainer {
    placementId: string;
    /** Absolute URL to the gzipped container script. */
    script: string;
    /** Custom element tag the container script defines (e.g. `home-container`). */
    customElementTag: string;
    jsonRef?: JsonRef;
    libraryDefaultsRef?: LibraryDefaultsRef;
}

/** Single component placement inside a page registry. */
export interface PageRegistryComponent {
    placementId: string;
    /** Absolute URL to the gzipped component script. */
    script: string;
    customElementTag: string;
    /** Render order. Lower values come first; missing values fall back to array index. */
    order?: number;
    jsonRef?: JsonRef;
    libraryDefaultsRef?: LibraryDefaultsRef;
}

/** Top-level page registry document. */
export interface PageRegistry {
    dealershipId: string;
    pageId: string;
    route: string;
    layoutVersion?: string;
    baseDefaultsVersion?: string;
    container: PageRegistryContainer;
    components: PageRegistryComponent[];
}

/** Result of {@link loadPageBundle}. */
export interface PageBundle {
    /** The parsed registry document (untouched). */
    registry: PageRegistry;
    /** Decompressed container script source. */
    container: string;
    /**
     * Decompressed component scripts in render order, ready to feed into
     * `useScriptInjectAll`. Each `id` is the component's `placementId`.
     */
    scripts: InjectableScript[];
}

/** Options accepted by {@link loadPageBundle} / {@link fetchPageRegistry}. */
export interface LoadPageBundleOptions {
    /**
     * Forwarded to the `fetch` call that loads the registry JSON. Use this
     * to opt into Next.js caching (e.g. `{ next: { revalidate: 60, tags: [...] } }`).
     * Script bundles are fetched by `fetchScript` and follow its own cache
     * policy.
     */
    registryInit?: RequestInit;
}

/**
 * Build the standard CMS page-registry URL from environment config.
 */
export function buildPageRegistryUrl(pageRegistry: string): string {
    const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL;
    const dealershipId = process.env.NEXT_PUBLIC_DEALERSHIP_ID;

    if (!storageUrl || !dealershipId) {
        throw new Error(
            "Missing NEXT_PUBLIC_STORAGE_URL or NEXT_PUBLIC_DEALERSHIP_ID for page registry loading"
        );
    }

    return `${storageUrl}/cms/dealerships/${dealershipId}/pages/${pageRegistry}/registry.json`;
}

/**
 * Fetch and parse a page `registry.json`. Throws if the response is not
 * 2xx so callers don't have to repeat the error-handling boilerplate.
 */
export async function fetchPageRegistry(
    pageRegistry: string,
    init?: RequestInit
): Promise<PageRegistry> {
    const url = buildPageRegistryUrl(pageRegistry);
    const res = await fetch(url, init);
    if (!res.ok) {
        throw new Error(
            `Failed to fetch page registry at ${url}: ${res.status} ${res.statusText}`
        );
    }
    return (await res.json()) as PageRegistry;
}

/**
 * Load a CMS-driven page bundle.
 *
 * Pass either a page registry key (e.g. `"home"`) or an already-parsed
 * registry object (handy when the caller wants to read it first).
 *
 * Components are sorted by `order` when present; entries without an
 * `order` retain their relative position in the source array. This keeps
 * the output stable regardless of how the CMS happened to serialise the
 * list.
 *
 * @example
 * // app/page.tsx (Home)
 * const { container, scripts } = await loadPageBundle("home");
 * return <HomeComponent scripts={scripts} container={container} />;
 */
/**
 * Build a legacy {@link PageRegistry} shape from `manifest.pages[]` hub placements.
 * First ordered hub entry becomes the page **container**; remaining entries are **child** scripts.
 */
export function buildPageRegistryFromManifestPage(
    manifest: DealershipManifest,
    page: ManifestPageEntry
): PageRegistry {
    const toComponent = (c: ManifestHubPageComponentEntry): PageRegistryComponent => ({
        placementId: c.placementId,
        script: resolveCmsAssetUrl(c.bundleUrlOrS3Key),
        customElementTag: c.tagName,
        order: c.order,
        ...(c.propsUrlOrS3Key ? { jsonRef: { url: resolveCmsAssetUrl(c.propsUrlOrS3Key) } } : {}),
    });

    const route =
        page.routePath && String(page.routePath).trim()
            ? String(page.routePath).trim()
            : page.slug === "home" || page.slug === "index"
              ? "/"
              : `/${page.slug}`;

    if (page.container) {
        const c = page.container;
        const orderedComponents = [...page.components].sort(
            (a, b) =>
                (a.order ?? 0) - (b.order ?? 0) ||
                String(a.placementId).localeCompare(String(b.placementId))
        );
        return {
            dealershipId: manifest.dealershipId,
            pageId: page.pageId,
            route,
            container: {
                placementId: c.placementId,
                script: resolveCmsAssetUrl(c.bundleUrlOrS3Key),
                customElementTag: c.tagName,
                ...(c.propsUrlOrS3Key ? { jsonRef: { url: resolveCmsAssetUrl(c.propsUrlOrS3Key) } } : {}),
            },
            components: orderedComponents.map(toComponent),
        };
    }

    // Legacy: no explicit container — treat first sorted component as the container
    const ordered = [...page.components].sort(
        (a, b) =>
            (a.order ?? 0) - (b.order ?? 0) ||
            String(a.placementId).localeCompare(String(b.placementId))
    );
    if (ordered.length === 0) {
        throw new Error(`Manifest page ${page.pageId} has no hub components`);
    }
    const [first, ...rest] = ordered;

    return {
        dealershipId: manifest.dealershipId,
        pageId: page.pageId,
        route,
        container: {
            placementId: first.placementId,
            script: resolveCmsAssetUrl(first.bundleUrlOrS3Key),
            customElementTag: first.tagName,
            ...(first.propsUrlOrS3Key ? { jsonRef: { url: resolveCmsAssetUrl(first.propsUrlOrS3Key) } } : {}),
        },
        components: rest.map(toComponent),
    };
}

/**
 * Prefer `manifest.pages[]` for the given Next pathname; otherwise load legacy `registry.json`
 * via `fallbackRegistryKey` (e.g. `"home"`).
 */
export async function loadPageBundleFromManifest(
    manifest: DealershipManifest | null,
    pathname: string,
    fallbackRegistryKey: string,
    options: LoadPageBundleOptions = {}
): Promise<PageBundle> {
    const page =
        manifest?.pages && manifest.pages.length > 0
            ? findManifestPageForPathname(manifest.pages, pathname)
            : undefined;
    if (page?.container || page?.components?.length) {
        const registry = buildPageRegistryFromManifestPage(manifest!, page);
        return loadPageBundle(registry, options);
    }
    return loadPageBundle(fallbackRegistryKey, options);
}

export async function loadPageBundle(
    source: string | PageRegistry,
    options: LoadPageBundleOptions = {}
): Promise<PageBundle> {
    const registry =
        typeof source === "string"
            ? await fetchPageRegistry(source, options.registryInit)
            : source;

    const ordered = [...registry.components]
        .map((component, index) => ({ component, index }))
        .sort(
            (a, b) =>
                (a.component.order ?? a.index) - (b.component.order ?? b.index)
        )
        .map(({ component }) => component);

    const [container, ...componentCodes] = await Promise.all([
        fetchScript(registry.container.script),
        ...ordered.map((component) => fetchScript(component.script)),
    ]);

    const scripts: InjectableScript[] = ordered.map((component, i) => ({
        id: component.placementId,
        code: componentCodes[i],
    }));

    return { registry, container, scripts };
}
