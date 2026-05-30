// ============================================
// INTERNAL TYPES (Used by all components)
// ============================================
// These types represent the stable contract for your frontend components.
// Components should ONLY use these types, never the API types below.
// All properties use camelCase and boolean conversions for better DX.

export interface Vehicle {
  id: string;
  cityFuel: string | null;
  vin: string | null;
  highwayFuel: string | null;
  make: string;
  model: string;
  year: number;
  trim: string;
  driveType: string | null;
  doors: number | null;
  bodyStyle: string | null;
  lowMSRP: number | null;
  highMSRP: number | null;
  engineCylinders: string | null;
  fuelType: string;
  horsepower: number | null;
  engineSize: string;
  engineType: string | null;
  fuelCapacity: string | null;
  carfaxLink: string | null;
  carfaxPDF: string | null;
  fuelUnit: string | null;
  passengers: number | null;
  standardFeatures: {
    [key: string]: string[];
  } | null;
  transmission?: {
    id: number | null;
    name: string;
  } | null;
  bodyStyleDetails?: {
    id: number | null;
    name: string;
  } | null;
  exteriorColor?: {
    id: number | null;
    name: string;
    code: string;
  } | null;
  interiorColor?: {
    id: number | null;
    name: string;
    code: string;
  } | null;
}

export interface VehicleSiteDetail {
  showMake: boolean;
  showDoors: boolean;
  showModel: boolean;
  showHighwayFuel: boolean;
  showOdometer: boolean;
  showStockNumber: boolean;
  showCityFuel: boolean;
  showFuelType: boolean;
  showPassengers: boolean;
  showDriveType: boolean;
  showYear: boolean;
  showVin: boolean;
  showCarfaxLink: boolean;
  showEngineSize: boolean;
  showEngineType: boolean;
  showTransmission: boolean;
  showBodyStyle: boolean;
  showOdometerType: boolean;
  callForPrice: boolean;
  showTitleStatus: boolean;
  showEngineCylinders: boolean;
  showExteriorColor: boolean;
  showInteriorColor: boolean;
}

interface CarTag {
  name: string;
}

export interface Car {
  id: string;
  odometer: number;
  odometerType: number;
  price: number;
  isSpecial: boolean; // Converted from 1/2 to true/false
  specialPrice: number;
  stockNumber: string;
  comment: string | null;
  status: number;
  isClassic: boolean;
  numberOfPrices: number;
  purchaseDate: string;
  purchasePrice: number;
  soldPrice: number;
  purchasePriceTax: number;
  siteDetails: VehicleSiteDetail;
  soldDate: string | null;
  isComingSoon: boolean | null;
  activationDate: string;
  periodPaymentAmount: number | null;
  isCertified: boolean;
  disclaimer: string | null;
  options: string[];
  warranty: string | null;
  thumbnailImage: string | null;
  disclosure: string | null;
  payment: string | null;
  odometerHours: number | null;
  youtubeLink: string | null;
  inService: boolean;
  inTransit: boolean;
  bedLength: string | null;
  isJDM: boolean;
  inLease: boolean;
  cashPrice: number | null;
  extraStatus: string | null;
  stockNumberCast: number;
  extraConfig: {
    additionalTrim?: string;
    maxSalesDiscount?: string;
  } | null;
  createdAt: string;
  dealershipId: number;
  conditionType: number;
  vehicleType: number | null;
  coverImage: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  vin: string | null;
  description: string;

  // Flattened vehicle properties (for easier filtering and access)
  cityFuel: string | null;
  highwayFuel: string | null;
  driveType: string | null;
  doors: number | null;
  bodyStyle: string | null;
  bodyType: string | null; // From bodyStyleDetails.name
  lowMSRP: number | null;
  highMSRP: number | null;
  engineCylinders: string | null;
  fuelType: string;
  horsepower: number | null;
  engineSize: string;
  engineType: string | null;
  fuelCapacity: string | null;
  carfaxLink: string | null;
  carfaxPDF: string | null;
  fuelUnit: string | null;
  passengers: number | null;
  standardFeatures: { [key: string]: string[] } | null;
  transmission: string | null; // From transmission.name
  transmissionId: number | null;
  exteriorColor: string | null; // From exteriorColor.name
  exteriorColorId: number | null;
  exteriorColorCode: string | null;
  interiorColor: string | null; // From interiorColor.name
  interiorColorId: number | null;
  interiorColorCode: string | null;

  // Keep full vehicle object for backward compatibility (can be removed later)
  vehicle: Vehicle;
  titleStatus: any | null;
  media:
  | {
    order: number;
    src: string;
    thumbnail: string;
  }[];
  tags: CarTag[] | null;
  instockDate: string | null;
  videoType: number | null;
}

// ============================================
// API RESPONSE TYPES (From Backend)
// ============================================
// These types represent the actual API response structure.
// If the backend changes field names, update these types and the mapper below.

export interface APIVehicleSiteDetail {
  make: boolean;
  doors: boolean;
  model: boolean;
  hwy_fuel: boolean;
  odometer: boolean;
  stock_NO: boolean;
  city_fuel: boolean;
  fuel_type: boolean;
  passenger: boolean;
  drive_type: boolean;
  model_year: boolean;
  vin_number: boolean;
  carfax_link: boolean;
  engine_size: boolean;
  engine_type: boolean;
  transmission: boolean;
  frk_bodyStyle: boolean;
  odometer_type: boolean;
  call_for_price: boolean;
  frk_titleStatus: boolean;
  engine_cylinders: boolean;
  frk_exterior_color: boolean;
  frk_interior_color: boolean;
}

export interface APIVehicle {
  id: string;
  city_fuel: string | null;
  vin_number: string | null;
  hwy_fuel: string | null;
  make: string;
  model: string;
  model_year: number;
  trim: string;
  drive_type: string | null;
  doors: number | null;
  body_style: string | null;
  low_msrp: number | null;
  high_msrp: number | null;
  engine_cylinders: string | null;
  fuel_type: string;
  horse_power: number | null;
  engine_size: string;
  engine_type: string | null;
  fuel_capacity: string | null;
  carfax_link: string | null;
  carfax_pdf: string | null;
  fuel_unit: string | null;
  passenger: number | null;
  standard: {
    [key: string]: string[];
  } | null;
  Transmission?: {
    id: number | null;
    name: string;
  } | null;
  BodyStyle?: {
    id: number | null;
    name: string;
  } | null;
  exterior_color?: {
    id: number | null;
    name: string;
    code: string;
  } | null;
  interior_color?: {
    id: number | null;
    name: string;
    code: string;
  } | null;
}

export interface APICar {
  id: string;
  odometer: number;
  odometer_type: number;
  sell_price: number;
  is_it_special: number;
  special_price: number;
  stock_NO: string;
  comment: string | null;
  vehicle_status: number;
  is_classic: number;
  description: string;
  "NO of prices": number;
  "Purchase Date": string;
  "Purchase Price": number;
  "Sold Price": number;
  "Purchase Price Tax": number;
  vehicle_site_detail: APIVehicleSiteDetail;
  sold_date: string | null;
  is_coming_soon: boolean | null;
  actify_date: string;
  period_payment_amount: number | null;
  is_certified: number;
  disclaimer: string | null;
  more_option: string[];
  warranty: string | null;
  thumbnail_cover_image: string | null;
  disclosure: string | null;
  payment: string | null;
  odometer_hour: number | null;
  youtube_link: string | null;
  in_service: number;
  in_transit: number;
  bed_length: string | null;
  is_jdm: number;
  in_lease: number;
  cash_price: number | null;
  extra_status: string | null;
  stock_no_cast: number;
  extra_config: {
    additional_trim?: string;
    max_sales_discount?: string;
  } | null;
  createdAt: string;
  frk_dealership_id: number;
  frk_inventory_condition_type: number;
  vehicleType: number | null;
  cover_image: string;
  year: number;
  make: string;
  model: string;
  Vehicle: APIVehicle;
  TitleStatus: any | null;
  MidVDSMedia: {
    order: number;
    media_src: string;
    thumbnail_src: string;
  }[];
  tags: any[];
  instock_date: string | null;
  video_type_to_use: number | null;
}

export interface APIInventoryResponse {
  cars: {
    current?: APICar[];
    sold?: APICar[];
    comingsoon?: APICar[];
    pending?: APICar[];
  };
  sold: {
    current?: APICar[];
  };
}
