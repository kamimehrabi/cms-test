import "server-only";

const SITE_REGISTRY_URL =
  "http://localhost:5005/cms/dealerships/1/config/site-pages-registry.json";

export const CMS_SITE_REGISTRY_TAG = "cms:site-registry";

type SiteRegistryResponse = {
  pages?: Array<{
    pageId: string;
    route: string;
    registryRef?: {
      url?: string;
    };
  }>;
};

export async function getCachedSiteRegistry(): Promise<SiteRegistryResponse> {
  const response = await fetch(SITE_REGISTRY_URL, {
    next: {
      // Fallback freshness; webhook-based on-demand revalidation should be primary.
      revalidate: 60 * 60,
      tags: [CMS_SITE_REGISTRY_TAG],
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch site pages registry: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}
