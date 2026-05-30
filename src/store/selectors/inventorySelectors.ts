import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import slugGenerator from "@/utils/slugGenerator";

// Base selectors
export const selectInventoryState = (state: RootState) => state.inventory;

// Memoized selectors
export const selectInitialCars = createSelector(
  [selectInventoryState],
  (inventory) => inventory.initialCars
);

export const selectAllCars = createSelector(
  [selectInventoryState],
  (inventory) => inventory.cars
);

export const selectSoldCars = createSelector(
  [selectInventoryState],
  (inventory) => inventory.soldCars
);

export const selectInventoryLoading = createSelector(
  [selectInventoryState],
  (inventory) => inventory.isLoading
);

export const selectInventoryError = createSelector(
  [selectInventoryState],
  (inventory) => inventory.error
);

export const selectInventoryLastFetched = createSelector(
  [selectInventoryState],
  (inventory) => inventory.lastFetched
);

// Computed selectors
export const selectCarsCount = createSelector(
  [selectAllCars],
  (cars) => cars.length
);

export const selectSpecialCars = createSelector([selectAllCars], (cars) =>
  cars.filter((car) => car.isSpecial)
);

export const selectCertifiedCars = createSelector([selectAllCars], (cars) =>
  cars.filter((car) => car.isCertified)
);

// Map-shaped selectors so the ContextBridge can do key-based lookups:
//   useExternalSelector("getSelectorData", "selectCarsById", carId)

export const selectCarsById = createSelector([selectAllCars], (cars) =>
  Object.fromEntries(cars.map((car) => [car.id, car]))
);

export const selectCarsByMake = createSelector([selectAllCars], (cars) => {
  const byMake: Record<string, typeof cars> = {};
  for (const car of cars) {
    const make = car.vehicle.make;
    (byMake[make] ??= []).push(car);
  }
  return byMake;
});

export const selectCarsBySlug = createSelector([selectAllCars], (cars) =>
  Object.fromEntries(cars.map((car) => [slugGenerator(car), car]))
);

// Filter state
export const selectFilters = createSelector(
  [selectInventoryState],
  (inventory) => inventory.filters
);

export const selectSelectedCarCompare = createSelector(
  [selectInventoryState],
  (inventory) => inventory.selectedCarCompare
);

// Host-only factory: two numeric params don't fit the bridge's single-key lookup,
// so this stays for host-side `useAppSelector(makeSelectCarsByPriceRange(min, max))`.
// The `make` prefix excludes it from the registry (which filters for `select*`).
export const makeSelectCarsByPriceRange = (min: number, max: number) =>
  createSelector([selectAllCars], (cars) =>
    cars.filter((car) => car.price >= min && car.price <= max)
  );