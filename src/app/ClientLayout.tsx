"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setDealerData } from "@/store/slices/dealerDataSlice";
import { useLayoutEffect, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useEditModeHandler } from "@/hooks/edit-mode/hooks/useEditModeHandler";
import { useElementSelection } from "@/hooks/edit-mode/hooks/useElementSelection";
import { useEditStyleHandler } from "@/hooks/edit-mode/hooks/useEditStyleHandler";
import { setPageData } from "@/store/slices/pageDataSlice";
import { setComponentData } from "@/store/slices/componentDataSlice";
import { setInventoryData } from "@/store/slices/inventorySlice";
import { setDealershipManifest } from "@/store/slices/dealershipManifestSlice";
import { setWebsiteConfig } from "@/store/slices/websiteConfigSlice";
import type { DealershipManifest } from "@/types/dealershipManifest";
import { findManifestPageForPathname } from "@/lib/manifest/manifestPageMatch";
import { resolveCmsAssetUrl } from "@/lib/manifest/resolveCmsAssetUrl";

const IS_DEVELOPMENT = process.env.NODE_ENV === "development";

const ClientLayout = ({
    dealerData,
    vehicles,
    manifest,
}: {
    dealerData: any;
    vehicles: any;
    manifest: DealershipManifest | null;
}) => {
    const dispatch = useAppDispatch();
    const pathname = usePathname();
    const reduxManifest = useAppSelector((state) => state.dealershipManifest.manifest);
    const { pageData } = useAppSelector((state) => state.pageData);

    useEditModeHandler();
    useElementSelection(IS_DEVELOPMENT);
    useEditStyleHandler(IS_DEVELOPMENT);

    /** Hydrate Redux once from the server-fetched manifest (single network fetch per document). */
    useLayoutEffect(() => {
        dispatch(setDealershipManifest(manifest));
    }, [manifest, dispatch]);

    const effectiveManifest = reduxManifest ?? manifest;

    useEffect(() => {
        if (vehicles) {
            dispatch(setInventoryData({ cars: vehicles, sold: [] }));
        }
    }, [vehicles, dispatch]);

    /** Fetch per-placement props JSON from `manifest.pages[]` (replaces per-page `registry.json` jsonRefs). */
    useEffect(() => {
        const m = effectiveManifest;
        if (!m?.pages?.length) return;
        const page = findManifestPageForPathname(m.pages, pathname);
        if (!page?.components?.length) return;

        const ordered = [...page.components].sort(
            (a, b) =>
                (a.order ?? 0) - (b.order ?? 0) ||
                String(a.placementId).localeCompare(String(b.placementId))
        );

        const fetches = ordered.map(async (c) => {
            if (!c.propsUrlOrS3Key) return;
            try {
                const url = resolveCmsAssetUrl(c.propsUrlOrS3Key);
                const res = await fetch(url);
                const data = await res.json();
                const dataKey = c.componentDataId?.trim() || c.placementId;
                dispatch(setComponentData({ placementId: dataKey, data }));
            } catch (err) {
                console.error("Error fetching placement props:", c.propsUrlOrS3Key, err);
            }
        });
        void Promise.all(fetches);
    }, [effectiveManifest, pathname, dispatch]);

    /** Legacy path: no `manifest.pages` — keep site-pages-registry + per-page registry.json for props. */
    useEffect(() => {
        const m = effectiveManifest;
        if (m?.pages && m.pages.length > 0) return;

        const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL;
        const dealershipId = process.env.NEXT_PUBLIC_DEALERSHIP_ID;
        if (!storageUrl || !dealershipId) return;

        const fetchDealerData = async () => {
            const res = await fetch(`${storageUrl}/cms/dealerships/${dealershipId}/config/site-pages-registry.json`);
            const data = await res.json();
            dispatch(setWebsiteConfig(data));
        };
        void fetchDealerData();
    }, [effectiveManifest, dispatch]);

    const { websiteConfig } = useAppSelector((state) => state.websiteConfig);

    useEffect(() => {
        const m = effectiveManifest;
        if (m?.pages && m.pages.length > 0) return;
        if (!Array.isArray(websiteConfig.pages)) return;

        websiteConfig.pages.forEach(async (page: any) => {
            if (page.route === pathname && page.registryRef?.url) {
                const res = await fetch(page.registryRef.url);
                const data = await res.json();
                dispatch(setPageData({ pageId: page.pageId, data }));
            }
        });
    }, [websiteConfig, pathname, dispatch, effectiveManifest]);

    useEffect(() => {
        const m = effectiveManifest;
        if (m?.pages && m.pages.length > 0) return;
        if (Object.keys(pageData).length === 0) return;
        if (!Array.isArray(websiteConfig.pages)) return;

        websiteConfig.pages.forEach((page: any) => {
            if (page.route !== pathname) return;
            const components = pageData[page.pageId]?.components;
            if (!Array.isArray(components)) return;
            components.forEach(async (component: any) => {
                if (component.jsonRef?.url) {
                    try {
                        const res = await fetch(component.jsonRef.url);
                        const data = await res.json();
                        dispatch(setComponentData({ placementId: component.placementId, data }));
                    } catch (err) {
                        console.error("Error fetching:", component.jsonRef.url, err);
                    }
                }
            });
        });
    }, [pageData, websiteConfig, pathname, dispatch, effectiveManifest]);

    useEffect(() => {
        if (dealerData) {
            dispatch(setDealerData(dealerData));
        }
    }, [dealerData, dispatch]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

export default ClientLayout;
