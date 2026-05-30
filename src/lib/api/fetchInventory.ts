import type { APIInventoryResponse, Car } from "@/types/inventory";
import { mapInventoryResponse } from "./inventoryMapper";
import slugGenerator from "@/utils/slugGenerator";

const currentDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
const BaseAPI = process.env.NEXT_PUBLIC_API_BASE_URL;
const BaseAPIAdvance = process.env.NEXT_PUBLIC_API_BASE_URL_AWS;

export const serverSideCar: Car[] = [];

/**
 * Fetches car inventory data from the API and maps it to internal types.
 * If the backend changes field names or structure, only update the mapper.
 * Components using this function will NOT need any changes.
 */
export const fetchCarsData = async (): Promise<{
  cars: Car[];
  sold: Car[];
}> => {
  // console.log("Fetching cars data from API...");

  try {
    const response = await fetch(
      `http://localhost:5005/cms/dealerships/1/data/cars.json`,
      // `https://hillz-cms-files.s3.ca-central-1.amazonaws.com/cms/dealerships/1/data/cars.json`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: {
          tags: ["cars"],
        },
      }
    );


    if (!response.ok) {
      throw new Error(`Cars fetch failed: ${response.status}`);
    }

    // Get raw API response
    const apiData: APIInventoryResponse = await response.json();

    // Map API response to internal types using the mapper
    // If backend changes, only the mapper needs to be updated
    const mappedData = mapInventoryResponse(apiData);

    serverSideCar.push(...mappedData.cars as Car[]);

    return mappedData;
  } catch (error) {
    console.error("Error fetching cars data:", error);
    throw error;
  }
};
