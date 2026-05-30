import type { Metadata } from "next";
import { fetchScript } from "@/lib/widgetFetcher/widgetFetcher";

/** Dealership manifest + storage-backed scripts are loaded per request. */
export const dynamic = "force-dynamic";
import "./output.css";

import { getDealerData } from "@/services/dealership/dealerData";
import ClientWrapperLayout from "./ClientWrapperLayout";
import { fetchCarsData } from "@/lib/api/fetchInventory";
import { getDealershipManifest } from "@/lib/manifest/fetchDealershipManifest";
// // Metadata
// export const metadata: Metadata = {
//   title: "Rajab Motors",
//   description: "Welcome to Rajab Motors - Quality vehicles for you.",
//   keywords: ["Rajab Motors", "Cars", "Automotive", "Dealership", "Vehicles", "Web App"],
//   authors: [{ name: "Rajab Pour" }],
//   creator: "Rajab Partners",
//   applicationName: "Rajab Motors",
//   robots: { index: true, follow: true },
// };

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Parallelize data fetching for better performance
  const [FooterLayout, dealerData, manifest] = await Promise.all([
    fetchScript("http://localhost:5005/cms/dealerships/1/temp/dist-json/footer-container.gz"),
    getDealerData(),
    getDealershipManifest(),
  ]);

  const { cars: vehicles } = await fetchCarsData();
  
  const HeaderLayout = await fetchScript(process.env.NEXT_PUBLIC_STORAGE_URL + "/" + manifest?.layout.header.bundleUrlOrS3Key)


  return (
    <html lang="en" data-theme="blesseddestroyer">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        {/* Resource hints for external domains */}
        {/* <link rel="stylesheet" href="http://localhost:5005/cms/dealerships/1/global/output.css" /> */}
        <link rel="dns-prefetch" href="http://localhost:5005" />
        <link rel="preconnect" href="http://localhost:5005" crossOrigin="anonymous" />
      </head>
      <ClientWrapperLayout
        dealerData={dealerData}
        HeaderLayout={HeaderLayout}
        FooterLayout={FooterLayout}
        vehicles={vehicles}
        manifest={manifest}
      >
        {children}
      </ClientWrapperLayout>

    </html>
  );
}

