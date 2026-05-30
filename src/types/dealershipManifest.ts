/** Subset of dealership `manifest.json` consumed by the host (aligned with CMS_Backend `Manifest` types). */

export interface HubManifestComponentEntry {
    tagName: string;
    domainKey: string;
    familyKey: string;
    variantKey: string;
    version: string;
    bundleUrlOrS3Key: string;
    componentDataId?: string | null;
}

export interface ManifestHubPageComponentEntry extends HubManifestComponentEntry {
    placementId: string;
    order: number;
    propsUrlOrS3Key: string | null;
}

export interface ManifestPageEntry {
    pageId: string;
    routePath: string | null;
    slug: string;
    isSystem: boolean;
    container?: ManifestHubPageComponentEntry;
    components: ManifestHubPageComponentEntry[];
}


export interface DealershipManifest {
    id?: string;
    dealershipId: string;
    files?: string[];
    timestamp?: string;
    version?: string;
    pages?: ManifestPageEntry[];
    layout: any;
    hubComponents?: HubManifestComponentEntry[];
    componentsV2?: Record<string, unknown> & { hubComponents?: HubManifestComponentEntry[] };
}
