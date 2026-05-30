// import React from 'react'
// import { fetchCarsData } from '@/src/libs/api/fetchInventory'
// import slugGenerator from '@/utils/slugGenerator'

import CarsDetailComponent from "@/components/CarsDetailComponent";
import { fetchScript } from "@/lib/widgetFetcher/widgetFetcher";

// export async function generateStaticParams() {
//   try {
//     const { cars } = await fetchCarsData();

//     return cars.map((car) => ({
//       slug: slugGenerator(car),
//     }));
//   } catch (error) {
//     console.error('Error generating static params:', error);
//     return [];
//   }
// }

const CarsDetailPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const carsScript = await fetchScript(process.env.NEXT_PUBLIC_STORAGE_URL + "/" + "Hub/Components/Cars/CarDetail/starter/1.0.0/bundle.js.gz")
  return <>
  <CarsDetailComponent scripts={carsScript} />
  </>;
};

export default CarsDetailPage;