import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Car } from "@/types/inventory";

interface InventoryState {
  initialCars: Car[];
  cars: Car[];
  soldCars: Car[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  resetInventory: boolean;
  filters: Record<string, string | string[]>;
  selectedCarCompare: string[];
}


const initialState: InventoryState = {
  initialCars: [],
  cars: [],
  soldCars: [],
  isLoading: false,
  error: null,
  lastFetched: null,
  resetInventory: false,
  filters: {},
  selectedCarCompare: [],
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    setInventoryLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setInventoryData: (state, action: PayloadAction<{ cars: Car[]; sold: Car[] }>) => {
      state.initialCars = action.payload.cars;
      state.cars = action.payload.cars;
      state.soldCars = action.payload.sold;
      state.isLoading = false;
      state.error = null;
      state.lastFetched = Date.now();
    },
    setCarsFilter: (state, action: PayloadAction<Car[]>) => {
      state.cars = action.payload;
    },
    setClearCarsFilter: (state) => {
      state.cars = state.initialCars;
    },
    setInventoryError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    resetInventory: (state) => {
      state.resetInventory = !state.resetInventory;
    },
    clearInventory: (state) => {
      state.cars = [];
      state.soldCars = [];
      state.error = null;
      state.lastFetched = null;
    },
    // Filter management actions
    setFilter: (state, action: PayloadAction<{ field: string; value: string | string[] }>) => {
      state.filters[action.payload.field] = action.payload.value;
      sessionStorage.setItem('filters', JSON.stringify(state.filters));
    },
    setFilters: (state, action: PayloadAction<Record<string, string | string[]>>) => {
      state.filters = action.payload;
      sessionStorage.setItem('filters', JSON.stringify(state.filters));
    },
    clearFilters: (state) => {
      state.filters = {};
      sessionStorage.removeItem('filters');
    },
    removeFilter: (state, action: PayloadAction<string>) => {
      delete state.filters[action.payload];
      sessionStorage.setItem('filters', JSON.stringify(state.filters));
    },
    addSelectedCarCompare: (state, action: PayloadAction<string>) => {
      state.selectedCarCompare = [...state.selectedCarCompare, action.payload];
    },
    removeSelectedCarCompare: (state, action: PayloadAction<string>) => {
      state.selectedCarCompare = state.selectedCarCompare.filter((car) => car !== action.payload);
    },
    clearSelectedCarCompare: (state) => {
      state.selectedCarCompare = [];
    },
  },
});

export const {
  setInventoryLoading,
  setInventoryData,
  setCarsFilter,
  setClearCarsFilter,
  setInventoryError,
  resetInventory,
  clearInventory,
  setFilter,
  setFilters,
  clearFilters,
  removeFilter,
  addSelectedCarCompare,
  removeSelectedCarCompare,
  clearSelectedCarCompare,
} = inventorySlice.actions;

export default inventorySlice.reducer;
