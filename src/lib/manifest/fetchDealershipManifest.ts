import "server-only";

import { cache } from "react";
import type { DealershipManifest } from "@/types/dealershipManifest";

export function buildDealershipManifestUrl(): string {
    const override = process.env.NEXT_PUBLIC_DEALERSHIP_MANIFEST_URL?.trim();
    if (override) return override;

    const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL;
    const dealershipId = process.env.NEXT_PUBLIC_DEALERSHIP_ID;
    if (!storageUrl || !dealershipId) {
        throw new Error(
            "Missing NEXT_PUBLIC_STORAGE_URL or NEXT_PUBLIC_DEALERSHIP_ID (or set NEXT_PUBLIC_DEALERSHIP_MANIFEST_URL)"
        );
    }
    const base = storageUrl.replace(/\/+$/, "");
    return `${base}/cms/dealerships/${dealershipId}/manifest/manifest.json`;
}

async function fetchDealershipManifestUncached(): Promise<DealershipManifest | null> {
    const url = buildDealershipManifestUrl();
    try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) {
            console.warn(`[manifest] ${res.status} ${res.statusText} — ${url}`);
            return null;
        }
        const data = (await res.json()) as DealershipManifest;
        if (!data || typeof data !== "object" || typeof data.dealershipId !== "string") {
            return null;
        }
        return data;
    } catch (e) {
        console.warn("[manifest] fetch failed", e);
        return null;
    }
}

/** One manifest fetch per RSC pass (deduped across layout + pages). */
export const getDealershipManifest = cache(fetchDealershipManifestUncached);
