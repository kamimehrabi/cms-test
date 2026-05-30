import { loadPageBundleFromManifest } from "@/lib/widgetFetcher/loadPageBundle";
import { getDealershipManifest } from "@/lib/manifest/fetchDealershipManifest";
import HomeComponent from "@/components/HomeComponent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Home page",
};

export default async function Home() {
  const manifest = await getDealershipManifest();
  const bundle = await loadPageBundleFromManifest(manifest, "/", "home");

  return (
    <HomeComponent
      scripts={bundle.scripts}
      container={bundle.container}
      containerTag={bundle.registry.container.customElementTag}
    />
  );
}
