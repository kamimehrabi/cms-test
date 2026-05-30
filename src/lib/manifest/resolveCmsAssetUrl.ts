/**
 * Turn an S3 key or absolute URL into a fetchable URL using `NEXT_PUBLIC_STORAGE_URL` origin
 * (same convention as `buildPageRegistryUrl`).
 */
export function resolveCmsAssetUrl(keyOrUrl: string): string {
    const trimmed = keyOrUrl.trim();
    if (!trimmed) {
        throw new Error("resolveCmsAssetUrl: empty key");
    }
    if (/^https?:\/\//i.test(trimmed)) {
        return trimmed;
    }
    const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL;
    if (!storageUrl) {
        throw new Error("Missing NEXT_PUBLIC_STORAGE_URL for asset URL resolution");
    }
    const base = storageUrl.replace(/\/+$/, "");
    const path = trimmed.replace(/^\/+/, "");
    return `${base}/${path}`;
}
