import { loadPageBundleFromManifest } from "@/lib/widgetFetcher/loadPageBundle";
import { getDealershipManifest } from "@/lib/manifest/fetchDealershipManifest";
import CarsComponent from "@/components/CarsComponent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cars",
  description: "Cars page",
};

export default async function Cars() {
  const manifest = await getDealershipManifest();
  const bundle = await loadPageBundleFromManifest(manifest, "/cars", "cars");

  return (
    <CarsComponent
      scripts={bundle.scripts}
      container={bundle.container}
      containerTag={bundle.registry.container.customElementTag}
    />
  );
}
