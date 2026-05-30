/**
 * Inventory Data Mapper
 *
 * This file contains mapper functions that transform API responses into internal types.
 * If the backend changes field names or structure, update ONLY this file.
 * Your components will continue to work without any changes.
 *
 * Example: If backend changes "stock_NO" to "stockNumber":
 * 1. Update APICar type in inventory.ts
 * 2. Update the mapper below: stockNumber: apiCar.stockNumber
 * 3. Components remain unchanged! They still use car.stockNumber
 */

import type {
  APIVehicle,
  APICar,
  APIInventoryResponse,
  Vehicle,
  Car,
  VehicleSiteDetail,
} from "../../types/inventory";

/**
 * Maps API Vehicle response to internal Vehicle type with improved naming
 */
export function mapVehicle(apiVehicle: APIVehicle): Vehicle {
  return {
    id: apiVehicle.id,
    cityFuel: apiVehicle.city_fuel,
    vin: apiVehicle.vin_number,
    highwayFuel: apiVehicle.hwy_fuel,
    make: apiVehicle.make,
    model: apiVehicle.model,
    year: apiVehicle.model_year,
    trim: apiVehicle.trim,
    driveType: apiVehicle.drive_type,
    doors: apiVehicle.doors,
    bodyStyle: apiVehicle.body_style,
    lowMSRP: apiVehicle.low_msrp,
    highMSRP: apiVehicle.high_msrp,
    engineCylinders: apiVehicle.engine_cylinders,
    fuelType: apiVehicle.fuel_type,
    horsepower: apiVehicle.horse_power,
    engineSize: apiVehicle.engine_size,
    engineType: apiVehicle.engine_type,
    fuelCapacity: apiVehicle.fuel_capacity,
    carfaxLink: apiVehicle.carfax_link,
    carfaxPDF: apiVehicle.carfax_pdf,
    fuelUnit: apiVehicle.fuel_unit,
    passengers: apiVehicle.passenger,
    standardFeatures: apiVehicle.standard,
    transmission: apiVehicle.Transmission,
    bodyStyleDetails: apiVehicle.BodyStyle,
    exteriorColor: apiVehicle.exterior_color,
    interiorColor: apiVehicle.interior_color,
  };
}

/**
 * Maps API VehicleSiteDetail to internal VehicleSiteDetail with improved naming
 */
function mapVehicleSiteDetail(apiDetail: any): VehicleSiteDetail {
  return {
    showMake: apiDetail.make,
    showDoors: apiDetail.doors,
    showModel: apiDetail.model,
    showHighwayFuel: apiDetail.hwy_fuel,
    showOdometer: apiDetail.odometer,
    showStockNumber: apiDetail.stock_NO,
    showCityFuel: apiDetail.city_fuel,
    showFuelType: apiDetail.fuel_type,
    showPassengers: apiDetail.passenger,
    showDriveType: apiDetail.drive_type,
    showYear: apiDetail.model_year,
    showVin: apiDetail.vin_number,
    showCarfaxLink: apiDetail.carfax_link,
    showEngineSize: apiDetail.engine_size,
    showEngineType: apiDetail.engine_type,
    showTransmission: apiDetail.transmission,
    showBodyStyle: apiDetail.frk_bodyStyle,
    showOdometerType: apiDetail.odometer_type,
    callForPrice: apiDetail.call_for_price,
    showTitleStatus: apiDetail.frk_titleStatus,
    showEngineCylinders: apiDetail.engine_cylinders,
    showExteriorColor: apiDetail.frk_exterior_color,
    showInteriorColor: apiDetail.frk_interior_color,
  };
}

/**
 * Maps API Car response to internal Car type with improved naming and type conversions
 */
export function mapCar(apiCar: APICar): Car {
  const vehicle = mapVehicle(apiCar.Vehicle);

  return {
    id: apiCar.id,
    description: apiCar.description,
    odometer: apiCar.odometer,
    odometerType: apiCar.odometer_type,
    price: apiCar.sell_price,
    isSpecial: apiCar.is_it_special === 1, // Convert: 1 = true (special), 2 = false
    specialPrice: apiCar.special_price,
    stockNumber: apiCar.stock_NO,
    comment: apiCar.comment,
    status: apiCar.vehicle_status,
    isClassic: Boolean(apiCar.is_classic),
    numberOfPrices: apiCar["NO of prices"],
    purchaseDate: apiCar["Purchase Date"],
    purchasePrice: apiCar["Purchase Price"],
    soldPrice: apiCar["Sold Price"],
    purchasePriceTax: apiCar["Purchase Price Tax"],
    siteDetails: mapVehicleSiteDetail(apiCar.vehicle_site_detail),
    soldDate: apiCar.sold_date,
    isComingSoon: apiCar.is_coming_soon,
    activationDate: apiCar.actify_date,
    periodPaymentAmount: apiCar.period_payment_amount,
    isCertified: Boolean(apiCar.is_certified),
    disclaimer: apiCar.disclaimer,
    options: apiCar.more_option,
    warranty: apiCar.warranty,
    thumbnailImage: apiCar.thumbnail_cover_image,
    disclosure: apiCar.disclosure,
    payment: apiCar.payment,
    odometerHours: apiCar.odometer_hour,
    youtubeLink: apiCar.youtube_link,
    inService: Boolean(apiCar.in_service),
    inTransit: Boolean(apiCar.in_transit),
    bedLength: apiCar.bed_length,
    isJDM: Boolean(apiCar.is_jdm),
    inLease: Boolean(apiCar.in_lease),
    cashPrice: apiCar.cash_price,
    extraStatus: apiCar.extra_status,
    stockNumberCast: apiCar.stock_no_cast,
    extraConfig: apiCar.extra_config
      ? {
        additionalTrim: apiCar.extra_config.additional_trim,
        maxSalesDiscount: apiCar.extra_config.max_sales_discount,
      }
      : null,
    createdAt: apiCar.createdAt,
    dealershipId: apiCar.frk_dealership_id,
    conditionType: apiCar.frk_inventory_condition_type,
    vehicleType: apiCar.vehicleType,
    coverImage: apiCar.cover_image,

    // Flatten basic vehicle properties
    year: vehicle.year,
    make: vehicle.make,
    model: vehicle.model,
    trim: vehicle.trim,
    vin: vehicle.vin,

    // Flatten all other vehicle properties for easier access
    cityFuel: vehicle.cityFuel,
    highwayFuel: vehicle.highwayFuel,
    driveType: vehicle.driveType,
    doors: vehicle.doors,
    bodyStyle: vehicle.bodyStyle,
    bodyType: vehicle.bodyStyleDetails?.name || null,
    lowMSRP: vehicle.lowMSRP,
    highMSRP: vehicle.highMSRP,
    engineCylinders: vehicle.engineCylinders,
    fuelType: vehicle.fuelType,
    horsepower: vehicle.horsepower,
    engineSize: vehicle.engineSize,
    engineType: vehicle.engineType,
    fuelCapacity: vehicle.fuelCapacity,
    carfaxLink: vehicle.carfaxLink,
    carfaxPDF: vehicle.carfaxPDF,
    fuelUnit: vehicle.fuelUnit,
    passengers: vehicle.passengers,
    standardFeatures: vehicle.standardFeatures,
    transmission: vehicle.transmission?.name || null,
    transmissionId: vehicle.transmission?.id || null,
    exteriorColor: vehicle.exteriorColor?.name || null,
    exteriorColorId: vehicle.exteriorColor?.id || null,
    exteriorColorCode: vehicle.exteriorColor?.code || null,
    interiorColor: vehicle.interiorColor?.name || null,
    interiorColorId: vehicle.interiorColor?.id || null,
    interiorColorCode: vehicle.interiorColor?.code || null,

    // Keep vehicle object for backward compatibility
    vehicle: vehicle,

    titleStatus: apiCar.TitleStatus,
    media:
      apiCar.MidVDSMedia && Array.isArray(apiCar.MidVDSMedia)
        ? apiCar.MidVDSMedia.map((item) => ({
          order: item.order,
          src: item.media_src,
          thumbnail: item.thumbnail_src,
        }))
        : [],
    tags: apiCar.tags || null,
    instockDate: apiCar.instock_date,
    videoType: apiCar.video_type_to_use,
  };
}

/**
 * Maps API Inventory Response to internal types
 */
export function mapInventoryResponse(apiResponse: APIInventoryResponse): {
  cars: Car[];
  sold: Car[];
} {
  const carsData = apiResponse.cars || {};
  const soldData = apiResponse.sold || {};

  // Combine all cars from different categories and map them
  const cars = [
    ...(carsData.current || []),
    ...(carsData.sold || []),
    ...(carsData.comingsoon || []),
    ...(carsData.pending || []),
  ].map(mapCar);

  // Combine all sold cars and map them
  const sold = [...(soldData.current || [])].map(mapCar);

  return {
    cars,
    sold,
  };
}
